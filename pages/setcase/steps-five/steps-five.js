// pages/setcase/three/three.js
import {
  saveLawCaseInfo,
  updateLawCaseInfo
} from '../../../common/setcase';
const app = getApp();
import {
  IMGURL
} from '../../../common/constVal'
let setcaseInfo = app.globalData.setcaseInfo;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    statusBarHeight: app.globalData.statusBarHeight, // 头部的自定义的高度
    reason: "",
    operation: "", //链接传过来的操作
    imgUrl: IMGURL
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (JSON.stringify(options) !== "{}") {
      this.setData({
        operation: options.operation
      })
    }
    this.setData({
      reason: app.globalData.setcaseInfo.reason
    })
  },
  //回退
  back() {
    wx.navigateBack({
      delta: 1
    })
  },
  nextStep() {
    if (this.data.reason == "") {
      wx.showToast({
        icon: "none",
        title: '请填写事实与理由'
      })
    } else {
      app.globalData.setcaseInfo.reason = this.data.reason;
      if (this.data.operation == 'edit') {
        wx.navigateBack({
          delta: 1
        })
      } else {
        console.log('事实与理由下一步')
        wx.navigateTo({
          url: '/pages/setcase/steps-six/steps-six',
        })
      }
    }
  },
  getreasonContent(e) {
    this.setData({
      reason: e.detail.value,
    })
  },
})
