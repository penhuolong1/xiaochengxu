// pages/mycase/index/index.js
import { getlawcaselist } from '../../common/mycase';
import { selectCase } from '../../common/case';
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    process:'',
    pageNumber: 1,// 后端返回的的总页码
    pageNum: 1,// 前端访问的页码
    pageSize: 15, // 单页返回的数据量
    isLoading: false,  //是否加载中
    caseList: [],  //案件列表
    tip: '暂无数据',
    total: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.selectCase();
  },
  //进入一个案件
  enterCase(e) {
    // let datas = e.currentTarget.dataset.dt;
    // console.log(datas)
    // app.globalData.nowMyCaseId = datas.id;
    wx.navigateTo({
      url: '/pages/caseList/caseInfo/caseInfo',
    })
  },
  // 各角色人员查询案件，支持模糊搜索
  selectCase() {
    let that = this;
    let data = {
      pageNumber: this.data.pageNum, 
      pageSize: this.data.pageSize,
      process: this.data.process
    }
    selectCase(data).then(res => {
      if(res.state == 100){
        that.setData({
          caseList: that.data.caseList.concat(res.result.content), // 拼接数组
          pageNumber: res.result.totalPages,
          // total: res.result.totalPages,
          isLoading: false,
        })
        if (that.data.pageNum==1&&that.data.caseList.length == 0){
          that.setData({
            tip: '暂无数据',
            isLoading: false,
          })
        }
      }
    })
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  loadingData: function () {
    var that = this;
    // 页数+1
    this.setData({
      pageNum: that.data.pageNum + 1,
    })
    if (this.data.pageNum > this.data.pageNumber) {
      return false;
    }
    // 显示加载图标
    this.setData({
      isLoading: true,
      tip: "加载中",
    })
    this.selectCase();
  },
  entryCase(e) {
    wx.navigateTo({
      url: '/pages/caseList/caseInfo/caseInfo?caseId='+e.currentTarget.dataset.id,
    })
  }
})