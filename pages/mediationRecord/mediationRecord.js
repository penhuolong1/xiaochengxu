// pages/mediationRecord/mediationRecord.js
const app = getApp();
import {
  downRecord
} from '../../common/case'
import {
  SERVICEURL,
  IMGURL
} from '../../common/constVal'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    statusBarHeight: app.globalData.statusBarHeight,
    downUrl: null,
    imgUrl: IMGURL
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // app.globalData.caseId
    downRecord({
      roomId: app.globalData.caseId
    }).then(res => {
      if (res.state == 100) {
        this.setData({
          downUrl: res.url
        })
      } else {
        wx.showToast({
          title: '生成笔录失败',
          icon: 'none'
        })
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

  },
  back() {
    wx.navigateBack({ //返回
      delta: 1
    })
  },
  // 下载笔录
  downMessage() {
    wx.showLoading({
      title: '正在打开...',
      mask: true
    })
    wx.downloadFile({
      url: `${SERVICEURL}/${this.data.downUrl}`,
      success: res => {
        console.log('下载成功')
        console.log(res)
        // 打开文件
        wx.openDocument({
          filePath: res.tempFilePath,
          success: function (res) {
            wx.hideLoading()
            console.log('打开文档成功')
          },
        });
      },
      fail: res => {
        wx.hideLoading()
        console.log('下载失败')
      }
    })
  }
})
