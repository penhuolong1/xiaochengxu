import {
  selectCase,
  deleteCase
} from '../../../common/case';
import {
  addCase
} from '../../../common/setcase';
import {
  IMGURL
} from '../../../common/constVal'
var app = getApp();
Page({
  data: {
    statusBarHeight: app.globalData.statusBarHeight, // 头部的自定义的高度
    topSeachBarBox: false, // 头部的搜索框显示隐藏
    pageNumber: 1, // 后端返回的的页码
    pageNum: 1, // 前端访问的页码
    pageSize: 8, // 单页返回的数据量
    caseList: [], // 案件列表
    imgUrl: IMGURL
  },
  onShow() {
    this.setData({
      pageNum: 1,
      caseList: []
    })
    this.selectCase();
  },
  onLoad: function (options) {

  },
  onLaunch: function () {

  },
  // 顶部的搜索按钮
  searchBar() {
    this.setData({
      topSeachBarBox: true
    });
  },
  //回退
  back() {
    wx.redirectTo({
      url: "/pages/index/index",
    })
  },
  selectCase() {
    let that = this;
    let data = {
      pageNumber: this.data.pageNum,
      pageSize: this.data.pageSize,
      process: 0
    }
    selectCase(data).then(res => {
      if (res.state == 100) {
        that.setData({
          caseList: that.data.caseList.concat(res.result.content), // 拼接数组
          pageNumber: res.result.totalPages
        })
      }
    })
  },
  // 下拉加载更多
  loadingData() {
    var that = this;
    // 页数+1
    if (that.data.pageNum < that.data.pageNumber) {
      this.setData({
        pageNum: that.data.pageNum + 1,
      })
      this.selectCase();
    }
  },
  // 改变选中
  changeCheck(e) {
    let check = 'caseList[' + e.currentTarget.dataset.index + '].check'
    this.setData({
      [check]: !this.data.caseList[e.currentTarget.dataset.index].check
    })
    app.globalData.setcaseInfo.lawCaseId = this.data.caseList[e.currentTarget.dataset.index].check ? this.data.caseList[e.currentTarget.dataset.index].lawCaseId : '';
    this.data.caseList.map((item, index) => {
      if (e.currentTarget.dataset.index != index) {
        let changeCheck = 'caseList[' + index + '].check'
        this.setData({
          [changeCheck]: false
        })
      }
    })
    console.log(app.globalData.setcaseInfo.lawCaseId)
  },
  addCase() {
    addCase().then(res => {
      if (res.state == 100) {
        app.globalData.setcaseInfo.lawCaseId = res.lawCaseId;
        app.globalData.backPage = 'drafts'
        wx.navigateTo({
          url: '/pages/setcase/steps-one/steps-one',
        })
      }
    })
  },
  // 删除案件
  del(e) {
    let caseId = e.currentTarget.dataset.case;
    let that = this;
    wx.showModal({
      title: "案件操作",
      content: "确定要删除该案件？",
      showCancel: true, //是否显示取消按钮
      cancelText: "否", //默认是“取消”
      cancelColor: "#424E5E", //取消文字的颜色
      confirmText: "是", //默认是“确定”
      confirmColor: "#4285F4", //确定文字的颜色
      success: function (res) {
        if (res.cancel) {
          //点击取消,默认隐藏弹框
        } else {
          //点击确定
          that.deleteCase(caseId);
        }
      },
      fail: function (res) {}, //接口调用失败的回调函数
      complete: function (res) {} //接口调用结束的回调函数（调用成功、失败都会执行）
    });
  },
  // 删除案件
  deleteCase(caseId) {
    let that = this;
    deleteCase(caseId).then(res => {
      if (res.state == 100) {
        wx.showToast({
          icon: "none",
          title: res.message
        })
        that.setData({
          pageNum: 1,
          caseList: []
        })
        that.selectCase();
      }
    })
  },
  // 下一步
  nextStep() {
    if (app.globalData.setcaseInfo.lawCaseId) {
      wx.navigateTo({
        url: '/pages/setcase/steps-preview/steps-preview?operation=edit',
      })
    } else {
      wx.showToast({
        icon: "none",
        title: '请选择案件'
      })
    }

  },

})
