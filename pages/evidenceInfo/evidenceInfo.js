import {
  detailsEvidence
} from '../../common/case';
import {
  IMGURL
} from '../../common/constVal'
const app = getApp();
let setcaseInfo = app.globalData.setcaseInfo;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    http1: "",
    caseId: "", // 案件id
    evidenceAry: [],
    imgUrl: IMGURL
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      http1: app.globalData.http1
    })
    if (options.caseId) {
      this.setData({
        caseId: options.caseId
      })
      this.detailsEvidence();
    } else {
      wx.navigateBack({
        delta: 1
      })
    }
  },
  // 证据详情
  detailsEvidence() {
    let that = this;
    detailsEvidence(this.data.caseId, '申请人').then(res => {
      if (res.state == 100) {
        that.setData({
          evidenceAry: res.evidences
        })
      }
    })
  },
  //图片点击事件
  imgYu(event) {
    console.log(event)
    var src = event.currentTarget.dataset.src; //获取data-src
    var imgList = event.currentTarget.dataset.list.map(obj => {
      return this.data.http1 + obj.url
    }); //获取data-list
    //图片预览
    wx.previewImage({
      current: src, // 当前显示图片的http链接
      urls: imgList // 需要预览的图片http链接列表
    })
  },
})
