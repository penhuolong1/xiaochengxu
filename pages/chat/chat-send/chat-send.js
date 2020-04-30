const recorderManager = wx.getRecorderManager()
import {
  intoRoom
} from '../../../common/rtc';
import {
  uploadVoice,
  uploadFile
} from "../../../common/case.js"
import {
  uploadFrontImage
} from "../../../common/setcase.js"
import {IMGURL} from '../../../common/constVal'
const plugin = requirePlugin("WechatSI")
// 获取**全局唯一**的语音识别管理器**recordRecoManager**
const manager = plugin.getRecordRecognitionManager()
var app = getApp();

var drawInterval = false;
Component({
  data: {
    value: '',
    isVoice: false,
    uploadImgArray: [],
    sendCharImgArray: [],
    isShowUploadImg: false,
    statusBarHeight: app.globalData.statusBarHeight,
    isShowFile: false,
    fileUrlArray: [],
    imgUrl: IMGURL
  },
  properties: {},
  lifetimes: {
    ready() {
      this.initRecord()
    }
  },
  methods: {
    chatSend() {
      if (!this.data.value) {
        wx.showToast({
          title: '请输入内容',
          icon: 'none',
          duration: 2000
        })
        return
      }
      this.triggerEvent('chatSend', this.data.value)
      this.setData({
        value: ''
      })
    },
    inputSend(e) {
      this.setData({
        value: e.detail.value
      })
    },
    entryRoom() {
      intoRoom(app.globalData.caseId).then(res => {
        if (res.state == 100) {
          app.roomToken = res.result
          wx.navigateTo({
            url: `/pages/rtcRoom/rtcRoom`,
          })
        } else {
          wx.showToast({
            title: '网络错误',
            icon: 'none',
            duration: 2000
          })
          return;
        }
      })
    },
    startRecord() {
      wx.showToast({
        title: '正在录音',
        icon: 'loading',
        duration: 60000
      })
      //开始录音
      manager.start()
      this.recordTime = 0
      this.timeDate = setInterval(() => {
        this.recordTime++
      }, 1000)
    },
    endRecord() {
      manager.stop()
      clearInterval(this.timeDate)
      console.log('录音时长=' + this.recordTime)
      // recorderManager.stop();
      // recorderManager.onStop((res) => {
      //   this.tempFilePath = res.tempFilePath;
      //   console.log('停止录音', res.tempFilePath)
      //   clearInterval(this.timeDate)
      //   const {
      //     tempFilePath
      //   } = res
      // })
    },
    uploadVoice1() {
      wx.showToast({
        title: '提交',
        icon: 'none',
        duration: 2000
      })
      uploadVoice(this.tempFilePath).then(res => {
        if (res.state == 100) {
          let data = {
            src: res.data,
            time: this.recordTime,
            voiceText: this.voiceText
          }
          this.triggerEvent('chatSendVoice', data)
        }
      })
    },
    // 显示录音部分
    showVoice() {
      this.setData({
        isVoice: !this.data.isVoice
      })
    },
    hideVoice() {
      this.setData({
        isVoice: false
      })
    },
    // 上传图片 文件
    uploadImg() {
      wx.chooseImage({
        count: 1,
        sizeType: ['original', 'compressed'],
        sourceType: ['album'],
        success: res => {
          const tempFilePaths = res.tempFilePaths
          console.log(tempFilePaths[0])
          uploadFrontImage(tempFilePaths[0]).then(res => {
            wx.showToast({
              title: res.message,
              icon: 'none',
              duration: 1500
            })
            this.setData({
              isShowUploadImg: true
            })
            let imgArray = this.data.uploadImgArray
            let sendImgUrl = this.data.sendCharImgArray
            sendImgUrl.push(res.url)
            this.setData({
              sendCharImgArray: sendImgUrl
            })
            let obj = {
              showImg: tempFilePaths[0],
              uploadImg: res.url
            }
            imgArray.push(obj)
            this.setData({
              uploadImgArray: imgArray
            })
          })
        }
      })
    },
    // 拍照上传
    uploadImg1() {
      wx.chooseImage({
        count: 1,
        sizeType: ['original', 'compressed'],
        sourceType: ['camera'],
        success: res => {
          const tempFilePaths = res.tempFilePaths
          console.log(tempFilePaths[0])
          uploadFrontImage(tempFilePaths[0]).then(res => {
            wx.showToast({
              title: res.message,
              icon: 'none',
              duration: 1500
            })
            this.setData({
              isShowUploadImg: true
            })
            let imgArray = this.data.uploadImgArray
            let sendImgUrl = this.data.sendCharImgArray
            sendImgUrl.push(res.url)
            this.setData({
              sendCharImgArray: sendImgUrl
            })
            let obj = {
              showImg: tempFilePaths[0],
              uploadImg: res.url
            }
            imgArray.push(obj)
            this.setData({
              uploadImgArray: imgArray
            })
          })
        }
      })
    },
    checkboxChange(e) {
      console.log('checkbox发生change事件，携带value值为：', e.detail.value)
      this.setData({
        sendCharImgArray: e.detail.value
      })

    },
    // 聊天记录发送图片
    chatSendImg() {
      this.setData({
        isShowUploadImg: false
      })
      this.triggerEvent('chatSendImg', this.data.sendCharImgArray)
    },
    // 上传文件
    uploadFileWX() {
      // uploadFile
      let chatFile = app.globalData.chatFile
      wx.chooseMessageFile({
        count: 1,
        type: 'file',
        success: res => {
          const tempFilePaths = res.tempFiles
          uploadFile(tempFilePaths[0].path).then(res1 => {
            console.log(tempFilePaths[0])
            let obj = {
              name: tempFilePaths[0].name,
              url: res1.data.picture_server_path,
              checked: true
            }
            let array = this.data.fileUrlArray
            array.push(obj)
            this.setData({
              fileUrlArray: array
            })
            this.showOrHideFile(true)
            this.triggerEvent('isShowFile')
          })
        }
      })
    },
    showOrHideFile(val) {
      this.setData({
        isShowFile: val
      })
    },
    selectFile(e) {
      let num = e.target.dataset.index
      console.log(e)
      if (this.data.fileUrlArray && this.data.fileUrlArray.length > 0) {
        let array = this.data.fileUrlArray
        array[num].checked = false
        this.setData({
          fileUrlArray: array
        })
      }
    },
    submitFile() {
      this.triggerEvent('chatSendFile', this.data.fileUrlArray)
    },
    // 跳转到笔录下载页面
    getRecord() {
      wx.navigateTo({
        url: '/pages/mediationRecord/mediationRecord'
      })
    },
    /**
     * 初始化语音识别回调
     * 绑定语音播放开始事件
     */
    initRecord: function () {
      //有新的识别内容返回，则会调用此事件
      manager.onRecognize = (res) => {
        this.voiceText = res.result
        console.log('语音识别')
        console.log(res)
      }

      // 识别结束事件
      manager.onStop = (res) => {
        wx.showToast({
          title: '录音结束',
          icon: 'none',
          duration: 2000
        })
        console.log('识别结束事件')
        this.tempFilePath = res.tempFilePath;
      }

      // 识别错误事件
      manager.onError = (res) => {
        console.log('识别错误事件')
        console.log(res)
      }

      // 语音播放开始事件
      wx.onBackgroundAudioPlay(res => {

        console.log('语音播放开始事件')
        console.log(res)
      })
    }
  }
})
