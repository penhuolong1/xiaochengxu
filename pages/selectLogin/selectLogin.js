const app = getApp();
import {
  getWXRoutineOpenId,
  WXLogin,
  getinfo,
  getAdminId
} from '../../common/login';
import {
  userInfo
} from '../../common/case';
import {
  IMGURL
} from '../../common/constVal'
Page({
  data: {
    isAuthor: false, //用户是否授过权
    isAttestModal: false, //去认证页面的模态框
    imgUrl: IMGURL
  },
  onShow() {
    this.setData({
      isAttestModal: false
    })
  },
  onLoad() {
    let that = this;
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
  },
  // 选择登录类型
  selectRole(e) {
    if (e.currentTarget.dataset.text == '案管人员') {
      wx.navigateTo({
        url: "/pages/login/login",
      })
    } else {
      app.globalData.roleType = 0;
      if (this.data.isAuthor) {
        this.getOpenId();
      }
    }
  },
  // 授权登录框
  bindGetUserInfo: function (e) {
    console.log(e.detail.userInfo)
    debugger
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
      this.getinfo()
    })
  },
  // 获取当前登录用户的信息
  getinfo() {
    console.log(1111)
    getinfo().then(res => {
      if (res.state == 100) {
        app.globalData.userInfo = res.result;
        userInfo().then(res => {
          app.globalData.loginInfo = res
        })
        if (res.result.certification) {
          setTimeout(() => {
            wx.redirectTo({
              url: '/pages/index/index'
            })
          }, 500);
        } else {
          wx.getUserInfo({
            success: function (result) {
              app.globalData.userInfo.name = result.userInfo.nickName
              app.globalData.isLogin = true
              // console.log(result)
            }
          })
          this.setData({
            isAttestModal: true
          });
        }
      }

    })
  },
  // 认证模态框的方法
  certification(e) {
    if (e.currentTarget.dataset.text == 'yes') {
      wx.navigateTo({
        url: `/pages/one/one`,
      })
    } else if (e.currentTarget.dataset.text == 'no') {
      wx.redirectTo({
        url: '/pages/index/index'
      })
    }
  }
})
