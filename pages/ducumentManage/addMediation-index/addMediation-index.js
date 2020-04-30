import {
  createProtocol
} from '../../../common/document';
import {
  IMGURL
} from '../../../common/constVal'

// caseId = 67e0dcf2186011e9b39a00163e0af9c6 & roomType=1
var app = getApp();
Page({
  data: {
    statusBarHeight: app.globalData.statusBarHeight, // 头部的自定义的高度
    topSeachBarBox: false, // 头部的搜索框显示隐藏
    startPlay: false,
    isLoading: false, //是否加载中
    caseList: [], //案件列表
    tip: '暂无数据',
    userId: wx.getStorageSync('userId') || '',
    roomName: '',
    roomToken: '',
    page: 1,
    total: 1,
    imgUrl: IMGURL
  },
  onShow() {
    this.setData({
      userId: wx.getStorageSync('userId')
    })
  },
  //下一步
  nextStep() {
    createProtocol(app.globalData.caseId).then(res => {
      wx.showToast({
        title: '生成成功！',
        icon: 'success',
      })
    })
  },
  selInPage(e) {
    if (e.currentTarget.dataset.type == 'litigant') {
      wx.navigateTo({
        url: `/pages/ducumentManage/addMediation-litigant/addMediation-litigant`,
      })
    } else if (e.currentTarget.dataset.type == 'fact') {
      wx.navigateTo({
        url: `/pages/ducumentManage/addMediation-fact/addMediation-fact`,
      })
    } else if (e.currentTarget.dataset.type == 'result') {
      wx.navigateTo({
        url: `/pages/ducumentManage/addMediation-result/addMediation-result`,
      })
    } else if (e.currentTarget.dataset.type == 'way') {
      wx.navigateTo({
        url: `/pages/ducumentManage/addMediation-way/addMediation-way`,
      })
    }
  },
  /**
   * 选择案件
   */
  selectCase(e) {
    let datas = e.currentTarget.dataset.dt;

    this.data.caseList.map(item => {
      if (item.lawCaseId == datas.lawCaseId) {
        item.selected = true;
      } else {
        item.selected = false;
      }
    })
    this.setData({
      caseList: this.data.caseList
    })
  },
  //获取列表
  getList(caseNo) {
    let that = this;
  },
  // 顶部的搜索按钮
  searchBar() {
    this.setData({
      topSeachBarBox: true
    });
  },
  // 选中标题
  handleChange() {
    if (this.data.caseType == 0) {
      this.setData({
        caseType: 1,
        page: 1,
      })
      // this.getList();
    } else if (this.data.caseType == 1) {
      this.setData({
        caseType: 0,
        page: 1,
      })
      // this.getList();
    }
  },
  handleTap() {
    this.setData({
      topSeachBarBox: false
    });
  },
  //回退
  back() {
    wx.navigateBack({
      delta: 1
    })
  },
  onLoad: function (options) {
    // this.getList();
  },
  onLaunch: function () {
    this.setData({
      isLogin: app.globalData.isLogin
    })
  },
})
