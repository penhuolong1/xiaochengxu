import {
  IMGURL
} from '../../common/constVal'
var app = getApp();
Page({
  data: {
    imgUrl: IMGURL,
    caseType: 1,
    statusBarHeight: app.globalData.statusBarHeight, // 头部的自定义的高度
    litigantId: '',
    caseId: app.globalData.setcaseInfo.lawCaseId,
    // caseId: '',
    intoPageTime: new Date().getTime(), // 进入页面时间
    type: 4, //4是申请人 5是被申请人
    isEdit: true
  },
  onLoad(option) {
    this.setData({
      caseId:app.globalData.setcaseInfo.lawCaseId
    })
    if (option.litigantId) {
      this.setData({
        litigantId: option.litigantId
      })
    }
    if (option.type) {
      this.setData({
        type: option.type
      })
    }
    if (option.isEdit) {
      this.setData({
        isEdit: false
      })
    }
  },
  onShow() {
    this.setData({
      intoPageTime: new Date().getTime()
    })
  },
  handleChange(e) {
    console.log(e)
    let type = e.currentTarget.dataset.type
    if (this.data.caseType == 1 && !this.data.litigantId) {
      wx.showToast({
        title: '请先添加当事人',
        icon: 'none'
      })
      return
    }
    this.setData({
      caseType: type
    })
  },
  back() {
    wx.navigateBack({
      delta: 1
    })
  },
  // 添加代理人
  addAgent() {
    if (!this.data.litigantId) {
      wx.showToast({
        title: '请先添加当事人',
        icon: 'none'
      })
      return
    }
    this.setData({
      caseType: 0
    })
  },
  addAddLitigantSuccess(e) {
    console.log(e)
    this.setData({
      litigantId: e.detail
    })
  }
})
