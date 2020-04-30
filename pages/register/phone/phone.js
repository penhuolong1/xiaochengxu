// pages/setcase/one/one.js
import { phoneCode, registerPhone } from '../../../common/register.js';
const app = getApp();
let setcaseInfo = app.globalData.setcaseInfo;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    codeStr:"获取验证码",
    phone:"",
    phoneCode:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '注册-手机验证'
    })
  },
  nextStep() {
    if (this.data.phone == ""){
      wx.showToast({
        icon: "none",
        title: '手机号有误！'
      })
      return false;
    }
    if (this.data.phoneCode == "") {
      wx.showToast({
        icon: "none",
        title: '验证码不能为空！'
      })
      return false;
    }
    registerPhone(this.data.phone, this.data.phoneCode).then(res => {
      app.globalData.setPhone = this.data.phone;
      if (app.globalData.identity == "代理人") {
        wx.navigateTo({
          url: '/pages/register/lawyer/lawyer',
        })
      } else if (app.globalData.identity == "自然人") {
        wx.navigateTo({
          url: '/pages/register/litigant/litigant',
        })
      }
    })
    
    
  },
  getphoneNumer(e) {
    this.setData({
      phone: e.detail.detail.value
    })
  },
  getphoneCode(e) {
    this.setData({
      phoneCode: e.detail.detail.value
    })
  },
  sendCode(){
    console.log(66666)
    if (!(/^1[34578]\d{9}$/.test(this.data.phone))) {
      wx.showToast({
        icon: "none",
        title: '手机号有误'
      })
      return false;
    }
    if (this.data.codeStr != "获取验证码") {
      return false;
    }
    // this.setData({
    //   codeStr: '获取中..',
    // })

    let that = this;
    
    phoneCode(this.data.phone).then(res => {
      this.setData({
        codeStr: 60,
      })
      this.intervalTime = setInterval(function () {
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