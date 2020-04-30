let app = getApp();
import {
  deleteMessage
} from '../../../common/case'
import {
  getUserDetail1
} from '../../../common/rtc';
import {
  IMGURL
} from '../../../common/constVal'
const myaudio = wx.createInnerAudioContext()
Component({
  data: {
    direction: 'left',
    voiceHeightArray: [],
    isShowVoiceStart: true,
    isShowSend: false,
    isFunction: false,
    showTime: '',
    deleteId: '', //判断是否出现已删除的id
    withdrawName: '',
    voiceText: '',
    imgUrl: IMGURL
  },
  properties: {
    message: {
      type: Object,
      value: {},
      observer(newVal, oldVal, changePath) {
        console.log('改变触发事件')
        let id = newVal.loginId
        console.log(id)
        if (id == app.globalData.loginInfo.result.id) {
          this.setData({
            withdrawName: '您'
          })
        } else {
          getUserDetail1({
            adminId: id,
            caseId: app.globalData.caseId
          }).then(res => {
            this.setData({
              withdrawName: res.result.name
            })
          })
        }
      }
    }
  },
  methods: {
    getDirection(id) {
      if (id == app.globalData.loginInfo.result.id) {
        this.setData({
          direction: 'right',
        })
        console.log(this.data.direction)
      }
      this.setData({
        isShowSend: true
      })
    },
    previewImage: function (e) {
      var current = e.target.dataset.src;
      wx.previewImage({
        current: current, // 当前显示图片的http链接  
        urls: this.data.imglist // 需要预览的图片http链接列表  
      })
    },
    // 播放语音
    voicePlay(e) {
      console.log(e)
      let path = e.target.dataset.src
      myaudio.src = `https://cstj.olcourt.cn/${path}`;
      myaudio.autoplay = true;
      wx.showLoading({
        title: '正在播放语音'
      })
      this.setData({
        isShowVoiceStart: false
      })
      myaudio.onEnded(() => {
        setTimeout(() => {
          wx.hideLoading()
        }, 100);
        this.setData({
          isShowVoiceStart: true
        })
      })
    },
    // 下载文件
    getFile(e) {
      let src = e.target.dataset.src
      console.log(e.target.dataset.src)
      wx.downloadFile({
        url: `https://cstj.olcourt.cn/${src}`,
        success: res => {
          console.log('成功')
        }
      })
    },
    getVoiceHeightArray() {
      let array = []
      let length = this.properties.message.voiceTime > 30 ? 30 : this.properties.message.voiceTime
      for (let i = 0; i < length; i++) {
        let num = Math.floor(Math.random() * 20) + 5
        array.push(num)
      }
      this.setData({
        voiceHeightArray: array
      })
    },
    // 点击显示删除 撤回功能
    longTap(e) {
      this.setData({
        showTime: e.target.dataset.time
      })
    },
    // 隐藏删除撤回功能
    hideFun() {
      this.setData({
        showTime: '2222'
      })
    },
    // 删除记录
    delMessage(e) {
      let messageid = e.currentTarget.dataset.id
      this.setData({
        deleteId: messageid
      })
      setTimeout(() => {
        deleteMessage({
          messageid
        }).then(res => {})
      }, 60000)
    },
    // 测回
    withdraw(e) {
      let messageid = e.currentTarget.dataset.id
      let time = e.currentTarget.dataset.time
      let nowTime = new Date().getTime()
      setTimeout(() => {
        deleteMessage({
          messageid
        }).then(res => {})
      }, 60000)
      if ((nowTime - time) > 1000 * 120) {
        wx.showToast({
          title: '超过2分钟不能撤回',
          icon: 'none'
        })
        this.setData({
          showTime: '22222'
        })
        return
      }
      this.triggerEvent('withdraw', messageid)
    },
    // 转文本
    translateText(e) {
      console.log(this.properties.message)
      console.log(e)
      let text = e.currentTarget.dataset.content
      if (!text) {
        wx.showToast({
          title: '转文本失败',
          icon: 'none'
        })
      }
      this.setData({
        voiceText: text,
        showTime: '22222'
      })
    }
  },
  /*组件生命周期*/
  lifetimes: {
    created() {
      console.log("在组件实例刚刚被创建时执行")
      console.log(this.properties.message)
    },
    attached() {
      console.log("在组件实例进入页面节点树时执行")
      console.log(this.properties.message)
    },
    ready() {
      this.getVoiceHeightArray()
      console.log("在组件在视图层布局完成后执行")
      this.getDirection(this.properties.message.loginId)
    },
    moved() {
      console.log("在组件实例被移动到节点树另一个位置时执行")
    },
    detached() {
      console.log("在组件实例被从页面节点树移除时执行")
    },
    error() {
      console.log("每当组件方法抛出错误时执行")
    },
    /*组件所在页面的生命周期 */
    pageLifetimes: {
      show: function () {
        // 页面被展示
        console.log("页面被展示")
      },
      hide: function () {
        // 页面被隐藏
        console.log("页面被隐藏")
      },
      resize: function (size) {
        // 页面尺寸变化
        console.log("页面尺寸变化")
      }
    }
  }
})
