// pages/setcase/addPlaintiffInfo/addPlaintiffInfo.js
import {
  registerUpload,
  registerLawyer
} from '../../../common/register';
import {
  IMGURL
} from '../../../common/constVal'
const md5 = require('../../../common/md5.js');
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    photoUrl1: "",
    photoUrl2: `${IMGURL}/itentity2.png`,
    photoUrl3: `${IMGURL}/itentity3.png`,

    lawyerName: "",
    lawyerIdCard: "",
    lawyerPassword: "",
    lawyerPassword2: "",
    lawyerEmail: "",
    lawerNum: "",
    lawFirm: "",
    lawerCardUrl: "",
    imgUrl: IMGURL
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    wx.setNavigationBarTitle({
      title: '注册-代理人'
    })
  },
  nextStep() {
    let that = this;
    if (this.check()) {
      let data = {
        agentType: app.globalData.LawyerState,
        lawyerName: this.data.lawyerName,
        lawyerIdCard: this.data.lawyerIdCard,
        lawyerPassword: md5.hexMD5(this.data.lawyerPassword),
        lawyerEmail: this.data.lawyerEmail,

      }
      if (app.globalData.LawyerState == 1) {
        data.lawerNum = this.data.lawerNum;
        data.lawFirm = this.data.lawFirm;
        data.lawerCardUrl = this.data.lawerCardUrl;
      }
      console.log(data)
      registerLawyer(data).then(res => {
        wx.showToast({
          title: res.message,
          icon: 'success',
          duration: 1500
        })
        setTimeout(() => {
          wx.navigateBack({
            delta: 99,
            changed: true,
          })
        }, 1500)
      })
    }
  },
  check() {
    if (this.data.lawyerName == '') {
      wx.showToast({
        icon: "none",
        title: '姓名不能为空！'
      })
      return false;
    }
    if (this.data.lawyerIdCard == '') {
      wx.showToast({
        icon: "none",
        title: '身份证号码不能为空！'
      })
      return false;
    }
    if (this.data.lawyerPassword == '') {
      wx.showToast({
        icon: "none",
        title: '密码不能为空！'
      })
      return false;
    }
    if (this.data.lawyerPassword.length < 6) {
      wx.showToast({
        icon: "none",
        title: '密码长度不能低于6位数！'
      })
      return false;
    }
    if (this.data.lawyerPassword != this.data.lawyerPassword2) {
      wx.showToast({
        icon: "none",
        title: '密码不一致！'
      })
      return false;
    }
    if (this.data.lawyerEmail == '') {
      wx.showToast({
        icon: "none",
        title: '邮箱不能为空！'
      })
      return false;
    }
    if (app.globalData.LawyerState == 1) {
      if (this.data.lawerNum == '') {
        wx.showToast({
          icon: "none",
          title: '律师证件号不能为空！'
        })
        return false;
      }
      if (this.data.lawFirm == '') {
        wx.showToast({
          icon: "none",
          title: '律师事务所不能为空！'
        })
        return false;
      }
      if (this.data.lawerCardUrl == '') {
        wx.showToast({
          icon: "none",
          title: '请上传正确的律师证件照！'
        })
        return false;
      }
    }
    return true;
  },
  //上传照片
  uploadImg(e) {
    console.log(e.target.dataset.vb)
    let that = this;
    let name = e.target.dataset.vb;
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        console.log(res)
        // tempFilePath可以作为img标签的src属性显示图片
        const tempFilePaths = res.tempFilePaths
        console.log(tempFilePaths[0])
        if (name == 'front' || name == 'legal') {
          registerUpload(tempFilePaths[0]).then(res => {
            console.log(111)
            wx.showToast({
              title: res.message,
              icon: 'success',
              duration: 1500
            })
            if (name == 'front') {
              that.setData({
                photoUrl1: tempFilePaths[0],
                lawerCardUrl: res.url
              })
            } else if (name == 'legal') {
              app.globalData.legalImg = res.frontImage;
              that.setData({
                photoUrl3: tempFilePaths[0],
                lawerCardUrl: res.url
              })
            }

          })
        }
      }
    })
  },
  getlawyerName(e) {
    this.setData({
      lawyerName: e.detail.detail.value
    })
  },
  getlawyerIdCard(e) {
    this.setData({
      lawyerIdCard: e.detail.detail.value
    })
  },
  getlawyerPassword(e) {
    this.setData({
      lawyerPassword: e.detail.detail.value
    })
  },
  getlawyerPassword2(e) {
    this.setData({
      lawyerPassword2: e.detail.detail.value
    })
  },
  getlawyerEmail(e) {
    this.setData({
      lawyerEmail: e.detail.detail.value
    })
  },
  getlawerNum(e) {
    this.setData({
      lawerNum: e.detail.detail.value
    })
  },
  getlawFirm(e) {
    this.setData({
      lawFirm: e.detail.detail.value
    })
  },
  bindPickerChangeFile(e) {
    let index = e.detail.value;
    this.setData({
      fileType: this.data.array2[index].id,
      fileTypeName: this.data.array2[index].text,
      nowText: this.data.array2[index].text == '自然人' ? "中华人民共和国居民身份证" : "中华人民共和国营业执照",
    })
  },
  upStep() {
    wx.navigateBack({
      changed: true,
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
