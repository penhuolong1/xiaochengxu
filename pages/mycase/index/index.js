// pages/mycase/index/index.js
import { selectCase } from '../../../common/case';
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pageNumber: 1,// 后端返回的的页码
    pageNum: 1,// 前端访问的页码
    pageSize: 15, // 单页返回的数据量
    caseList:[],// 案件列表
    caseType: 1, // 1已审核 0表示待审核
    current: 'tab1',
    isLoading: false,  //是否加载中
    tip: '暂无数据',
    showLoad: false,
    page:1,
    total: 0,
    searchNo:"",
    regiterTimeSort:"desc",
    process: 90 // 案件类型
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.selectCase();
  },
  // 查询草稿箱是否有案件  有则去草稿箱 无则调解须知
  selectCase() {
    if(this.data.caseType == 1) {
      this.setData({
        process: 90
      })
    }else {
      this.setData({
        process: 1
      })
    }
    let that = this;
    let data = {
      pageNumber: this.data.pageNum, 
      pageSize: this.data.pageSize,
      process: this.data.process
    }
    selectCase(data).then(res => {
      if(res.state == 100){
        this.setData({
          caseList: this.data.caseList.concat(res.result.content),
          pageNumber: res.result.totalPages,
          isLoading: false,
          // total: res.result.totalPages,
        })
      }
    })
  },
  // 下拉加载更多
  loadingData() {
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
  //进入一个案件
  entryCase(e){
    // wx.navigateTo({
    //   url: '/pages/mycase/caseInfo/caseInfo?viewCase='+e.currentTarget.dataset.id,
    // })
    wx.navigateTo({
      url: '/pages/caseList/caseInfo/caseInfo?caseId=' + e.currentTarget.dataset.id + '&type=view',
          })
  },
  handleChange({ detail }) {
    if(this.data.caseType == 0) {
      this.setData({
        caseType: 1,
        caseList: [],
        pageNum:1,
      })
      this.selectCase()
    }else if(this.data.caseType == 1) {
      this.setData({
        caseType: 0,
        caseList: [],
        pageNum: 1,
      })
      this.selectCase()
    }
    // this.setData({
    //   current: detail.key,
    //   caseList:[],
    //   page:1
    // });
    // this.getList()
  },
})