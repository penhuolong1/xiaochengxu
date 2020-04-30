// pages/alarm/alarm.js
import {
  getQueryString
} from '../../common/utils';
import {
  sendLinkedInfo
} from '../../common/alarm';
import {
  IMGURL
} from '../../common/constVal'
import {
  getWXRoutineOpenId,
  WXLogin,
  getinfo
} from '../../common/login';
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    images: {},
    images2: {},
    addressName: "",
    isAuthor: false,
    isLoagin: false,
    imgUrl: IMGURL
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    // console.log("index 生命周期 onload" + JSON.stringify(options))
    //在此函数中获取扫描普通链接二维码参数
    let q = decodeURIComponent(options.q)
    if (q) {
      console.log("index 生命周期 onload 参数 area=" + getQueryString(q, 'addr'))
    }
    // 判断是否授权过
    wx.getSetting({
      success(res) {
        if (!res.authSetting["scope.userInfo"]) {
          that.setData({
            isAuthor: false
          })
        } else {
          that.setData({
            isAuthor: true
          })
        }
      }
    })
    if (app.globalData.userInfo == null) {
      this.setData({
        addressName: getQueryString(q, 'addr'),
        isLoagin: false,
      })
    } else {
      this.setData({
        addressName: getQueryString(q, 'addr'),
        isLoagin: true,
      })
    }
  },
  /**
   * 一键报警或者登陆
   */
  getInRoom() {
    if (app.globalData.userInfo == null) {
      this.getOpenId();
    } else {
      let str = '溯源调解员'
      // let str = '仓山调解员'
      sendLinkedInfo(str).then(res => {
        app.roomToken = res.result
        wx.navigateTo({
          url: `/pages/alarmRoom/alarmRoom`,
        })
      })
    }
  },
  // 授权登录框
  bindGetUserInfo: function (e) {
    console.log(e.detail.userInfo)
    if (e.detail.userInfo) {
      //用户按了允许授权按钮
      this.setData({
        isAuthor: true
      })
      this.getOpenId();
    } else {
      //用户按了拒绝按钮
    }
  },
  // 获取openid
  getOpenId() {
    let that = this;
    wx.login({
      success: function (result) {
        if (result.code) {
          getWXRoutineOpenId(result.code, 'weixincode').then(res => {
            app.globalData.sessionId = res.sessionId; //用于请求头部
            that.login();
          })
        } else {
          console.log('登录失败！' + result.message)
        }
      }
    });
  },
  // openId登录
  login() {
    WXLogin().then(res => {
      this.getinfo();
    })
  },
  // 获取当前登录用户的信息
  getinfo() {
    console.log(1111)
    getinfo().then(res => {
      if (res.state == 100) {
        app.globalData.userInfo = res.result;
        if (res.result.certification) {
          wx.showToast({
            title: '登陆成功',
            icon: 'success',
            duration: 2000
          })
          this.setData({
            isLoagin: true
          })
          // setTimeout(() => {
          //   wx.redirectTo({
          //     url: '/pages/index/index'
          //   })
          // }, 500);
        } else {
          wx.getUserInfo({
            success: function (result) {
              app.globalData.userInfo.name = result.userInfo.nickName
              app.globalData.isLogin = true
              // console.log(result)
            }
          })
          // this.setData({
          //   isAttestModal: true
          // });
        }
      }

    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
