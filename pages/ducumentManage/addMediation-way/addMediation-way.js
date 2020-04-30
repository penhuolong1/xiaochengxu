import {
  getProtocolDetail,
  saveProtocolInfo
} from '../../../common/document';
import {
  IMGURL
} from '../../../common/constVal'
var app = getApp();
Page({
  data: {
    statusBarHeight: app.globalData.statusBarHeight, // 头部的自定义的高度
    startPlay: false,
    fact: "", //事实
    tip: '暂无数据',
    method: '',
    total: "",
    imgUrl: IMGURL
  },
  onShow() {

  },
  //下一步
  nextStep() {
    if (this.data.method == '') {
      wx.showToast({
        title: '请填写达成协议',
        icon: 'none',
      })
    } else {
      let data = {
        caseId: app.globalData.caseId,
        fact: null,
        agreement: null,
        method: this.data.method,
        total: this.data.total
      }
      saveProtocolInfo(data).then(res => {
        wx.showToast({
          title: '保存成功',
          icon: 'success',
        })
        setTimeout(function () {
          wx.navigateBack({
            delta: 1
          })
        }, 2000)
      })
    }
  },
  //获取列表
  getList() {
    let that = this;
    getProtocolDetail(app.globalData.caseId).then(res => {
      that.setData({
        method: res.method,
        total: res.total,
      })
    })
  },
  bindTextAreaBlur(e) {
    this.setData({
      method: e.detail.value,
    })
  },
  bindTextAreaBlur2(e) {
    this.setData({
      total: e.detail.value,
    })
  },
  //回退
  back() {
    wx.navigateBack({
      delta: 1
    })
  },
  onLoad: function (options) {
    this.getList();
  },
  onLaunch: function () {
    this.setData({
      isLogin: app.globalData.isLogin
    })
  },
})
