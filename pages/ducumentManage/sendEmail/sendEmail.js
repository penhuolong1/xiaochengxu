import {
  getProtocolInfo,
  saveProtocolInfo,
  getLitigantInfo,
  sendEmail
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
    resultContent: '',
    caseNo: "",
    litigantList: [],
    dipid: "", //文书id
    dipName: "",
    imgUrl: IMGURL
  },
  onShow() {

  },
  //下一步
  nextStep() {
    let litigants = [];
    let flag = 0;
    this.data.litigantList.map(item => {
      if (item.email && item.email != "") {
        if (!(/^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/.test(item.email))) {
          flag = 1;
        }
        let dt = {
          litigantId: item.id,
          email: item.email
        }
        litigants.push(dt);
      }
    })
    if (flag === 1) {
      wx.showToast({
        title: '邮箱输入有误',
        duration: 1500,
        icon: 'none'
      });
      return false;
    }
    sendEmail(app.globalData.caseId, this.data.dipid, litigants).then(res => {

      if (res.success == 1) {

        wx.showToast({
          title: '发送成功',
          icon: 'success',
        })
        setTimeout(function () {
          wx.navigateBack({
            delta: 1
          })
        }, 2000)
      } else {
        wx.showToast({
          title: res.message,
          duration: 2500,
          icon: 'none'
        });
      }


    })
  },
  //获取列表
  getList() {
    let that = this;
    getLitigantInfo(app.globalData.caseId).then(res => {
      let arr = [];
      arr = res.litigants;
      that.setData({
        litigantList: arr,
      })
    })
  },
  bindTextAreaBlur(e) {
    console.log(e)
    this.data.litigantList.map(item => {
      if (item.id == e.currentTarget.dataset.id) {
        item.email = e.detail.value;
      }
    })
    this.setData({
      litigantList: this.data.litigantList,
    })
    console.log(this.data.litigantList)

  },
  //回退
  back() {
    wx.navigateBack({
      delta: 1
    })
  },
  onLoad: function (options) {
    console.log(options.did)
    this.getList();
    this.setData({
      caseNo: app.globalData.caseNo,
      dipName: options.dip,
      dipid: options.did,
    })
  },
  onLaunch: function () {
    this.setData({
      isLogin: app.globalData.isLogin
    })
  },
})
