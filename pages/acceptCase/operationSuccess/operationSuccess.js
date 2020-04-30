var app = getApp();
import { detailsCase } from '../../../common/case';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    title: null,
    caseInfo: {},
    pageBack: null, // 返回的页数--用于成功之后
    courtId: '' //调解机构id
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      title: options.title? options.title:'操作',
      pageBack: options.pageBack?options.pageBack:'',
      courtId: options.courtId?options.courtId:''
    })
    this.detailsCase();
  },
  // 案件详情
  detailsCase() {
    detailsCase(app.globalData.acceptCaseObj.caseId).then(res => {
      if(res.state == 100){
        this.setData({
          caseInfo: res.lawCase
        })
      }
    })
  },
  // 继续分发
  nextStep1() {
    wx.navigateTo({
      url: '/pages/acceptCase/operation/operation?title=调解员&pageBack=4&courtId='+this.data.courtId
    })
  },
  // 继续分发
  nextStep2() {
    wx.navigateBack({
      delta: 2
    })
  },
  nextStep3() {
    let that = this;
    if(that.data.pageBack) {
      wx.navigateBack({
        delta: 4
      })
    }else {
      wx.navigateBack({
        delta: 2
      })
    }
    
  },
})