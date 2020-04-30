// pages/setcase/addPlaintiffInfo/addPlaintiffInfo.js
import {
  litigationFeeCalculation
} from '../../common/mycase';
const app = getApp();
import {
  IMGURL
} from '../../common/constVal'
let setcaseInfo = app.globalData.setcaseInfo;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    array2: [{
        id: 1,
        text: '财产案件'
      },
      {
        id: 2,
        text: '普通非财产案件'
      },
      {
        id: 3,
        text: '离婚案件'
      },
      {
        id: 4,
        text: '人格权案件'
      },
      {
        id: 5,
        text: '知识产权案件'
      },
      {
        id: 6,
        text: '劳动争议案件'
      },
      {
        id: 7,
        text: '行政案件'
      },
      {
        id: 8,
        text: '商标、专利、海事行政案件'
      },
      {
        id: 9,
        text: '管辖权异议不成立案件'
      },
    ],
    fileType: 1, //案件类型
    fileTypeName: "财产案件",
    isSel: true,
    nowText: "中华人民共和国居民身份证",
    photoUrl1: `${IMGURL}/itentity1.png`,
    photoUrl2: `${IMGURL}/itentity2.png`,
    photoUrl3: `${IMGURL}/itentity3.png`,
    basicCost: "",
    applyStandard: "",
    total: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    wx.setNavigationBarTitle({
      title: '诉讼费计算'
    })
  },
  changeType(e) {
    console.log(e)
    this.setData({
      isSel: !this.data.isSel
    })
    if (!this.data.isSel) {
      this.setData({
        applyStandard: ''
      })
    }
  },
  nextStep() {
    let that = this;
    if (this.data.isSel) {
      if (this.data.applyStandard == "") {
        wx.showToast({
          icon: "none",
          title: '请填写标的金额！'
        })
        return false;
      }
    }
    litigationFeeCalculation(this.data.fileType, this.data.basicCost, this.data.applyStandard).then(res => {
      console.log(res)
      let tr = ""
      let str = res.data.toString()
      if (str.indexOf(".") == -1) {
        tr = str + ".00"
      } else {
        tr = str
      }
      this.setData({
        total: tr
      })

    })
  },
  goRule() {
    wx.navigateTo({
      url: '/pages/costsRule/costsRule',
    })
  },
  getbasicCost(e) {
    this.setData({
      basicCost: e.detail.detail.value
    })
  },
  getapplyStandard(e) {
    this.setData({
      applyStandard: e.detail.detail.value
    })
  },
  upStep() {
    this.setData({
      basicCost: "",
      applyStandard: "",
      total: "",
      fileType: 1, //案件类型
      fileTypeName: "财产案件",
    })
  },
  bindPickerChangeFile(e) {
    let index = e.detail.value;
    this.setData({
      fileType: this.data.array2[index].id,
      fileTypeName: this.data.array2[index].text,
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
