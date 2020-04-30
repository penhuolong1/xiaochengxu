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
    if (app.globalData.nowEvidenceId != "") {
      wx.setNavigationBarTitle({
        title: '编辑证据'
      })
      this.setData({
        // web_src: "https://dq.hlcourt.gov.cn/mobile/editEvidenceWeap?evidenceId=" + app.globalData.nowEvidenceId + "&sessionId=" + app.globalData.userInfo.sessionId + "&lowCaseId=" + app.globalData.nowMyCaseId,
        web_src: "https://court1.ptnetwork001.com/mobile/editEvidenceWeap?evidenceId=" + app.globalData.nowEvidenceId + "&sessionId=" + app.globalData.userInfo.sessionId + "&lowCaseId=" + app.globalData.nowMyCaseId,
      })
    } else {
      wx.setNavigationBarTitle({
        title: '添加证据'
      })
      this.setData({
        web_src: "https://court1.ptnetwork001.com/mobile/addEvidence"
        // web_src: "https://dq.hlcourt.gov.cn/mobile/addEvidence"
      })
    }

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