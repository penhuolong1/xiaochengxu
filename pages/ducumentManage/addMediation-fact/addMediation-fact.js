import {
  saveProtocolInfo,
  getProtocolDetail
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
    factContent: "",
    applyDate: "",
    brief: "",
    imgUrl: IMGURL
  },
  onShow() {

  },
  //下一步
  nextStep() {
    if (this.data.factContent == '') {
      wx.showToast({
        title: '请填写事实',
        icon: 'none',
      })
    } else {
      let data = {
        caseId: app.globalData.caseId,
        fact: this.data.factContent,
        agreement: null
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
      let date = new Date(res.applyDate);
      let y = date.getFullYear();
      //获取月份  
      let m = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
      let d = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
      that.setData({
        factContent: res.fact,
        applyDate: y + "年" + m + "月" + d + "日",
        brief: res.brief
      })
    })
  },

  //回退
  back() {
    wx.navigateBack({
      delta: 1
    })
  },
  bindTextAreaBlur(e) {
    this.setData({
      factContent: e.detail.value,
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
