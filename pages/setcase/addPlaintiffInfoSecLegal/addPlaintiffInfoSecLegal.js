// pages/setcase/addPlaintiffInfoSecLegal/addPlaintiffInfoSecLegal.js
import { getOnlineLitigantInfo, getLitigantInfolitigant, saveWXOnlineLitigantLegal, updateWXOnlineLitigantLegal } from '../../../common/setcase';
const app = getApp();
let setcaseInfo = app.globalData.setcaseInfo;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    litigantName: "",
    legalManName: "",
    identityCard: "",
    nativePlace: "",
    address: "",
    linkman: "",
    legalManPhone:"",
    frontImage:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    wx.setNavigationBarTitle({
      title: '填写原告(法人)信息(第二步)'
    })
    that.setData({
      frontImage: app.globalData.legalImg
    })
    if (app.globalData.nowLitigantId == ""){
      
    }else{
      getLitigantInfolitigant(app.globalData.nowLitigantId).then(res => {
        that.setData({
          litigantName: res.onlineLitigant.litigantName,
          legalManName: res.onlineLitigant.legalManName,
          identityCard: res.onlineLitigant.identityCard,
          nativePlace: res.onlineLitigant.nativePlace,
          address: res.onlineLitigant.address,
          // linkman: res.onlineLitigant.linkman,
          legalManPhone: res.onlineLitigant.legalManPhone,
        })
      })
    }
  },
  nextStep() {
    let that = this;
    console.log(this.data.litigantName)
    console.log(this.data.legalManName)
    console.log(this.data.identityCard)
    console.log(this.data.nativePlace)
    console.log(this.data.address)
    console.log(this.data.linkman)
    console.log(this.data.legalManPhone)
    if (this.data.litigantName == '') {
      wx.showToast({
        icon: "none",
        title: '公司名称不能为空！'
      })
    } else if (this.data.legalManName == '') {
      wx.showToast({
        icon: "none",
        title: '法定代表人不能为空！'
      })
    } else if (this.data.identityCard == '') {
      wx.showToast({
        icon: "none",
        title: '信用代码不能为空！'
      })
    } else if (this.data.nativePlace == '') {
      wx.showToast({
        icon: "none",
        title: '注册地址不能为空！'
      })
    } else if (this.data.address == '') {
      wx.showToast({
        icon: "none",
        title: '经营地址不能为空！'
      })
    }  else if (this.data.legalManPhone == '') {
      wx.showToast({
        icon: "none",
        title: '法人联系方式不能为空！'
      })
    }else{
      let data = {
        onlineLawCaseId: setcaseInfo.id, //案件id
        litigationStatusId: 1, //当事人诉讼地位（原告、被告、第三人 ： 1.2.3）
        litigantType: 1, //当事人身份类型（自然人：0，法人：1）
        identityType: 1, //证件类型（身份证：0，营业执照：1）

        legalManName: that.data.legalManName,
        legalManPhone: that.data.legalManPhone,
        nativePlace: that.data.nativePlace,
        address: that.data.address,
        litigantName: that.data.litigantName,
        identityCard: that.data.identityCard,
        frontImage: that.data.frontImage,
      }
      if (app.globalData.nowLitigantId == ""){
        saveWXOnlineLitigantLegal(data).then(res => {
          wx.navigateTo({
            url: '/pages/setcase/addPlaintiffInfoThr/addPlaintiffInfoThr',
          })
        })
      }else{
        data.onlineLitigantId = app.globalData.nowLitigantId;
        updateWXOnlineLitigantLegal(data).then(res => {
          wx.navigateTo({
            url: '/pages/setcase/addPlaintiffInfoThr/addPlaintiffInfoThr',
          })
        })
      }
      
    }
  },
  getlitigantName(e) {
    this.setData({
      litigantName: e.detail.detail.value
    })
  },
  getlegalManName(e) {
    this.setData({
      legalManName: e.detail.detail.value
    })
  },
  getidentityCard(e) {
    this.setData({
      identityCard: e.detail.detail.value
    })
  },
  getnativePlace(e) {
    this.setData({
      nativePlace: e.detail.detail.value
    })
  },
  getaddress(e) {
    this.setData({
      address: e.detail.detail.value
    })
  },
  getlinkman(e) {
    this.setData({
      linkman: e.detail.detail.value
    })
  },
  getlegalManPhone(e) {
    this.setData({
      legalManPhone: e.detail.detail.value
    })
  },
  upStep() {
    wx.navigateBack({ changed: true, })
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