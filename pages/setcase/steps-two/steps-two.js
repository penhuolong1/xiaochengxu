// caseId = 67e0dcf2186011e9b39a00163e0af9c6 & roomType=1
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
    peopleType: [{
        'name': '申请人',
        'check': false
      },
      {
        'name': '申请代理人',
        'check': false
      },
    ],
    backPage: '', //返回的页面
    imgUrl: IMGURL
  },
  onShow() {

  },
  onLoad: function (options) {
    this.setData({
      backPage: options.page
    })
    // 无调解机构 -- 返回上一页
    if (!app.globalData.setcaseInfo.courtId) {
      this.back();
    }
  },
  //回退
  back() {
    wx.redirectTo({
      url: '/pages/setcase/steps-one/steps-one',
    })
  },
  // 改变选中
  changeCheck(e) {
    let check = 'peopleType[' + e.currentTarget.dataset.index + '].check'
    this.setData({
      [check]: !this.data.peopleType[e.currentTarget.dataset.index].check
    })
    app.globalData.setcaseInfo.identity = this.data.peopleType[e.currentTarget.dataset.index].check ? this.data.peopleType[e.currentTarget.dataset.index].name : '';
    this.data.peopleType.map((item, index) => {
      if (e.currentTarget.dataset.index != index) {
        let changeCheck = 'peopleType[' + index + '].check'
        this.setData({
          [changeCheck]: false
        })
      }
    })
  },
  // 下一步
  nextStep() {
    if (app.globalData.setcaseInfo.identity) {
      wx.redirectTo({
        url: '/pages/setcase/steps-three/steps-three?page=steps-two',
      })
    } else {
      wx.showToast({
        icon: "none",
        title: '请选择申请人身份'
      })
    }
  }
})
