const app = getApp();
const {
  $Toast
} = require('../../../dist/base/index');
import {
  IMGURL
} from '../../../common/constVal'
Page({
  data: {
    startPlay: false,
    userId: wx.getStorageSync('userId') || '',
    roomName: '',
    roomToken: '',
    current: 2, //当前步骤，从 0 开始计数
    phoneNumer: '', //当前输入的手机号
    savePhoneNumber: "", //最终提交的手机号
    code: "",
    codeStr: '获取验证码',
    navbarData: {
      title: '完成',
      height: app.globalData.height * 6 + 10
    },
    infos: "",
    imgUrl: IMGURL
  },
  onLoad() {
    if (!app.globalData.flag) {
      // wx.redirectTo({
      //   url: `/pages/index/index`,
      // })
    }
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: '#2D8CF0',
      animation: {
        duration: 400,
        timingFunc: 'easeInOut'
      }
    })
    let inf = app.globalData.name + "[" + app.globalData.id_number.replace(/(.{3}).*(.{3})/, "$1**********$2") + "]";
    this.setData({
      infos: inf,
    })
    wx.setNavigationBarTitle({
      title: '完成'
    })
  },
  changeIdNumber(e) {
    this.setData({
      phoneNumer: e.detail.detail.value
    })
  },
  changeCode(e) {
    this.setData({
      code: e.detail.detail.value
    })
  },
  getCode() {
    if (!(/^1[34578]\d{9}$/.test(this.data.phoneNumer))) {
      $Toast({
        content: '手机号有误',
        type: 'warning'
      });
      return false;
    }
    if (this.data.codeStr != "获取验证码") {
      return false;
    }
    this.setData({
      codeStr: '获取中..',
    })
    var that = this;
    wx.request({
      url: 'https://dq.hlcourt.gov.cn/api/court/wxRegister/sendSms.jhtml',
      data: {
        username: this.data.phoneNumer,
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        if (res.data.state == 100) {
          that.setData({
            codeStr: 60,
            savePhoneNumber: that.data.phoneNumer,
          })
          that.intervalTime = setInterval(function () {
            let t = that.data.codeStr - 1;
            that.setData({
              codeStr: t,
            })
            if (t == 0) {
              clearInterval(that.intervalTime)
              that.setData({
                codeStr: "获取验证码",
              })
            }
          }, 1000)
        } else {
          this.setData({
            codeStr: '获取验证码',
          })
        }
      }
    })
    console.log(this.data.phoneNumer)
  },
  handleClick() {
    if (this.data.code == '') {
      $Toast({
        content: '验证码不能为空',
        type: 'warning'
      });
      return false;
    }
    wx.request({
      url: 'https://dq.hlcourt.gov.cn/api/court/wxRegister/faceVerification.jhtml',
      data: {
        name: app.globalData.name,
        idCard: app.globalData.id_number,
        phone: this.data.savePhoneNumber,
        code: this.data.code,
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        if (res.data.state == 100) {
          $Toast({
            content: '实名成功,即将进入微信授权！',
            type: 'success'
          });
          app.globalData.flag = false;
          console.log(app.globalData.userInfo)
          if (app.globalData.userInfo) {
            console.log(11115)
            app.globalData.userInfo.certification = true;
          }
          setTimeout(function () {
            wx.redirectTo({
              url: '/pages/wxAuthorize/wxAuthorize',
            })
          }, 2000)


        } else {
          $Toast({
            content: res.data.message,
            type: 'warning'
          });
        }
      }
    })
    console.log(this.data.code)

  },
  bindGetUserInfo(res) {
    console.log(res);
    const app = getApp();
    if (res.detail.userInfo) {
      console.log("点击了同意授权");
      app.nowUserName = res.detail.userInfo.nickName;
      console.log(app.nowUserName);
      // wx.login({
      //   success: function (res) {
      //     console.log(res);
      //   }
      // })
      wx.navigateTo({
        url: `/pages/face/face`,
      })

    } else {
      console.log("点击了拒绝授权");
    }
  },
})
