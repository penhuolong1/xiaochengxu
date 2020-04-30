// pages/setcase/one/one.js
import { userLogin } from '../../../common/setcase';
const app = getApp();
let setcaseInfo = app.globalData.setcaseInfo;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isSel: false,
    isLaywer:false,
    LawyerState:1,
    identity: "自然人"
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '注册-身份选择'
    })
  },
  nextStep() {
    app.globalData.identity = this.data.identity;
    if (this.data.identity == "代理人"){
      this.setData({
        isLaywer:true,
      })
    } else if (this.data.identity == "法人/非法人"){
      wx.navigateTo({
        url: "/pages/register/legalperson/legalperson"
      })
    }else{
      // wx.navigateTo({
      //   url: '/pages/register/litigant/litigant',
      // })
      wx.navigateTo({
        url:"/pages/register/phone/phone"
      })
    } 
  },
  nextSteplawyer(){
    app.globalData.LawyerState = this.data.LawyerState;
    wx.navigateTo({
      url: "/pages/register/phone/phone"
    })
  },
  upStep(){
    this.setData({
      isLaywer: false,
    })
  },
  changeState(e){
    console.log(e.detail.value)
    this.setData({
      LawyerState: e.detail.value
    })
  },
  changeType(e) {
    this.setData({
      isSel: !this.data.isSel,
      identity: e.detail.value
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