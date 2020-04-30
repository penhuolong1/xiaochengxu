// pages/message/message.js
const app = getApp();
import {
  IMGURL
} from '../../common/constVal'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    systemMsgShow: false, // 系统消息的显示隐藏
    imgUrl: IMGURL
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '消息'
    })
  },
  onShow() {
    this.setData({
      topSeachBarBox: false
    });
  },
  // 顶部的搜索按钮
  searchBar() {
    console.log('text')
    this.setData({
      topSeachBarBox: true
    });
  },
  goHome() {
    wx.navigateTo({
      url: '/pages/index/index',
    })
  },
  // 点击某条消息
  msgOpen(e) {
    console.log(e.currentTarget.dataset.text)
    if (e.currentTarget.dataset.text == '系统消息') {
      this.setData({
        systemMsgShow: !this.data.systemMsgShow
      });
    } else {
      wx.redirectTo({
        url: "/pages/index/index",
      })
    }
  },
  // tab跳转页面
  changeTabUrl(e) {
    if (e.currentTarget.dataset.text == '首页') {
      wx.redirectTo({
        url: "/pages/index/index",
      })
    } else if (e.currentTarget.dataset.text == '我的') {
      wx.navigateTo({
        url: "/pages/user/user",
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
