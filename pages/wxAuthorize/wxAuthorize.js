// pages/wxAuthorize/wxAuthorize.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    web_src: "",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: '#40A9FF',
      animation: {
        duration: 400,
        timingFunc: 'easeInOut'
      }
    })
    wx.setNavigationBarTitle({
      title: '微信授权校验'
    })
    this.setData({
      web_src: encodeURI("https://dq.hlcourt.gov.cn/api/main/getWXCode.jhtml?state=xcx&name=" + app.globalData.name + "&idCard=" + app.globalData.id_number),
    })
    // app.globalData.userInfo.certification = true;
    
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