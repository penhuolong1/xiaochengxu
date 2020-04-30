// pages/setcase/one/one.js
import {
  getMediater
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
    topSeachBarBox: false, // 头部的搜索框显示隐藏
    operation: "", //链接传过来的操作
    pageNumber: 1, // 后端返回的的页码
    pageNum: 1, // 前端访问的页码
    pageSize: 15, // 单页返回的数据量
    // 机构数组
    contentType: [
      // {'name':'石狮市人民法院','check': false},
      // {'name':'石狮市调解机构1','check': true},
      // {'name':'石狮市调解机构2','check': false},
    ],
    tip: '暂无数据',
    isLoading: false, // 是否显示加载
    isLogin: app.globalData.isLogin,
    imgUrl: IMGURL
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      operation: options.operation ? options.operation : ''
    })
    if (app.globalData.userInfo) {
      this.getMediater();
    } else {
      this.back()
    }
  },
  //回退
  back() {
    // wx.redirectTo({
    //   url: '/pages/setcase/'+app.globalData.backPage+'/'+app.globalData.backPage,
    // })
    wx.navigateBack({
      delta: 1
    })
  },
  // 获取调解机构
  getMediater() {
    let that = this;
    getMediater(this.data.pageNum, this.data.pageSize).then(res => {
      if (res.state == 100) {
        that.setData({
          isLoading: false,
          tip: '',
          contentType: that.data.contentType.concat(res.content), // 拼接数组
          pageNumber: res.pageNumber
        })
        if (that.data.operation == 'edit') {
          that.data.contentType.map((item, index) => {
            if (item.id == app.globalData.setcaseInfo.courtId) {
              let changeCheck = 'contentType[' + index + '].check'
              that.setData({
                [changeCheck]: true
              })
            }
          })
        }
      }
    })
  },
  // 下拉加载更多
  loadingData() {
    var that = this;
    // 页数+1
    if (that.data.pageNum < that.data.pageNumber) {
      this.setData({
        pageNum: that.data.pageNum + 1
      })
      this.getMediater();
    }
  },
  // 改变选中
  changeCheck(e) {
    let check = 'contentType[' + e.currentTarget.dataset.index + '].check'
    this.setData({
      [check]: !this.data.contentType[e.currentTarget.dataset.index].check
    })
    app.globalData.setcaseInfo.courtId = this.data.contentType[e.currentTarget.dataset.index].check ? this.data.contentType[e.currentTarget.dataset.index].id : '';
    app.globalData.setcaseInfo.courtName = this.data.contentType[e.currentTarget.dataset.index].check ? this.data.contentType[e.currentTarget.dataset.index].name : '';
    this.data.contentType.map((item, index) => {
      if (e.currentTarget.dataset.index != index) {
        let changeCheck = 'contentType[' + index + '].check'
        this.setData({
          [changeCheck]: false
        })
      }
    })
  },
  nextStep() {
    if (app.globalData.setcaseInfo.courtId) {
      if (this.data.operation == 'edit') {
        wx.navigateBack({
          delta: 1
        })
      } else {
        wx.redirectTo({
          url: '/pages/setcase/steps-two/steps-two?page=steps-one',
        })
      }
    } else {
      wx.showToast({
        icon: "none",
        title: '请选择调解机构'
      })
    }
  },
})
