import {
  IMGURL
} from '../../common/constVal'
var app = getApp();
Page({
  data: {
    imgUrl: IMGURL,
    caseType: 1,
    litigantId: '',
    lawyerId: '',
    statusBarHeight: app.globalData.statusBarHeight, // 头部的自定义的高度
    isEdit: true
  },
  onLoad(option) {
    if (option.litigantId) {
      this.setData({
        litigantId: option.litigantId
      })
    }
    if (option.lawyerId) {
      this.setData({
        lawyerId: option.lawyerId
      })
    }
    if (option.isEdit) {
      this.setData({
        isEdit: false
      })
    }
  },
  handleChange(e) {
    console.log(e)
    let type = e.currentTarget.dataset.type
    this.setData({
      caseType: type
    })
  },
  back() {
    wx.navigateBack({
      delta: 1
    })
  }
})
