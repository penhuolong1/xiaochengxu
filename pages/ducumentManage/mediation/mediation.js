import {
  getProtocolInfo,
  sendSignProcess,
  endSignProcess,
  getSign
} from '../../../common/document';
import {
  IMGURL
} from '../../../common/constVal'
var app = getApp();
Page({
  data: {
    statusBarHeight: app.globalData.statusBarHeight, // 头部的自定义的高度
    startPlay: false,
    litigantPlainList: [], //申请人列表
    litigantDeList: [], //被申请人列表
    fact: "", //事实
    agreement: "", //达成协议
    signList: [], //签名图片列表
    tip: '暂无数据',
    userId: wx.getStorageSync('userId') || '',
    roomName: '',
    roomToken: '',
    page: 1,
    isSign: false,
    total: 1,
    isLogin: app.globalData.isLogin,
    process: 2,
    applyDate: "",
    method: "",
    total: "",
    brief: "",
    imgUrl: IMGURL
  },
  onShow() {
    this.getList();
    this.getSign();
  },
  //下一步
  nextStep() {
    sendSignProcess(app.globalData.caseId).then(res => {
      this.setData({
        process: 1
      })
    })
  },
  getInSign() {
    wx.navigateTo({
      url: `/pages/handWriting/handWriting`,
    })
  },
  nextStep2() {
    endSignProcess(app.globalData.caseId).then(res => {
      this.setData({
        process: 2
      })
    })
  },
  //获取列表
  getList() {
    let that = this;
    getProtocolInfo(app.globalData.caseId).then(res => {
      console.log(res)
      let arr1 = [];
      let arr2 = [];
      let arr3 = [];
      if (res.state == 100) {
        arr1 = res.litigants.filter(item => item.litigationStatus.name == '申请人');
        arr2 = res.litigants.filter(item => item.litigationStatus.name == '被申请人');
        res.sign.map(item => {
          item = app.globalData.http1 + item;
          arr3.push(item)
        })
        let date = new Date(res.applyDate);
        let y = date.getFullYear();
        //获取月份  
        let m = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
        let d = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
        that.setData({
          litigantPlainList: arr1,
          litigantDeList: arr2,
          fact: res.fact,
          agreement: res.agreement,
          signList: arr3,
          process: res.process,
          applyDate: y + "年" + m + "月" + d + "日",
          brief: res.brief,
          method: res.method,
          total: res.total
        })
      }
    })
  },
  // 编辑
  edit() {
    wx.navigateTo({
      url: `/pages/ducumentManage/addMediation-index/addMediation-index`,
    })
  },
  getNo(e) {
    console.log(e)
    this.setData({
      searchNo: e.detail.value,
    })
  },
  // 顶部的搜索按钮
  searchBar() {
    this.setData({
      topSeachBarBox: true
    });
  },
  handleTap() {
    this.setData({
      topSeachBarBox: false
    });
  },
  getSign() {
    getSign(app.globalData.caseId).then(res => {
      if (res.mySign != null) {
        this.setData({
          isSign: true,
        })
      } else {
        this.setData({
          isSign: false,
        })
      }
    })
  },
  //回退
  back() {
    wx.navigateBack({
      delta: 1
    })
  },
  onLoad: function (options) {

  },
  onLaunch: function () {
    this.setData({
      isLogin: app.globalData.isLogin
    })
  },
})
