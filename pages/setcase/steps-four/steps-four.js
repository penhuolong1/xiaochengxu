const app = getApp();
let setcaseInfo = app.globalData.setcaseInfo;
import {
  IMGURL
} from '../../../common/constVal'
Page({
  /**
   * 页面的初始数据
   */
  data: {
    statusBarHeight: app.globalData.statusBarHeight, // 头部的自定义的高度
    topSeachBarBox: false, // 头部的搜索框显示隐藏
    operation: "", //链接传过来的操作
    mediateRequest: "", // 诉讼请求
    reason: '', //事实与理由
    applyStandard: "", //标的
    imgUrl: IMGURL,
    isAboutProperty: '是',
    aboutPropertyAry: [{
        type: 0,
        text: '是'
      },
      {
        type: 1,
        text: '否'
      },
    ],
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
      mediateRequest: app.globalData.setcaseInfo.mediateRequest,
      applyStandard: app.globalData.setcaseInfo.applyStandard
    })
  },
  //回退
  back() {
    wx.navigateBack({
      delta: 1
    })
  },
  // 选择是否涉及财产
  changeisAboutProperty(e) {
    if (e.detail.value == 1){
      this.setData({
        isAboutProperty: '否'
      })
    } else {
      this.setData({
        isAboutProperty: '是'
      })
    }
  },
  /**
   * 下一步
   */
  nextStep() {
    app.globalData.setcaseInfo.mediateRequest = this.data.mediateRequest;
    app.globalData.setcaseInfo.applyStandard = this.data.applyStandard;
    app.globalData.setcaseInfo.reason = this.data.reason;
    app.globalData.setcaseInfo.isAboutProperty = this.data.isAboutProperty;
    if (this.data.operation == 'edit') {
      wx.navigateBack({
        delta: 1
      })
    } else {
      wx.navigateTo({
        url: '/pages/setcase/steps-six/steps-six',
      })
    }
  },
  bindTextAreaBlur(e) {
    this.setData({
      mediateRequest: e.detail.value,
    })

  },
  getstandarMoney(e) {
    this.setData({
      applyStandard: e.detail.value,
    })
  },
  getMediateRequest(e) {
    this.setData({
      mediateRequest: e.detail.value,
    })
  },
  getReason(e) {
    this.setData({
      reason: e.detail.value,
    })
  },
  getApplyStandard(e) {
    this.setData({
      applyStandard: e.detail.value
    })
  }
})
