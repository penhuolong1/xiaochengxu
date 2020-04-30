// pages/mycase/sendAdress/sendAdress.js
import { wxSaveChoiceSendInfo } from '../../../common/mycase';
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    sendAddress:"",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(app.globalData.nowMyCaseId)
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: '#40A9FF',
      animation: {
        duration: 400,
        timingFunc: 'easeInOut'
      }
    })
    wx.setNavigationBarTitle({
      title: '送达地址确认'
    })
  },
  submitAdress(){
    wxSaveChoiceSendInfo(app.globalData.nowMyCaseId, this.data.sendAddress).then(res => {
      wx.showToast({
        icon: "none",
        title: '提交成功'
      })
      setTimeout(() => {
        wx.redirectTo({
          url: '/pages/mycase/caseInfo/caseInfo',
        })
      },1500)
      
    })
  },
  getAddress(e){
    this.setData({
      sendAddress: e.detail.value,
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