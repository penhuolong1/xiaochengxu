// pages/setcase/addPlaintiffInfo/addPlaintiffInfo.js
import {
  registerUpload,
  registerAdmin
} from '../../../common/register';
import {
  IMGURL
} from '../../../common/constVal'
const app = getApp();
let setcaseInfo = app.globalData.setcaseInfo;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    array2: [{
        id: 1,
        text: '自然人'
      },
      {
        id: 2,
        text: '法人'
      },
    ],
    fileType: 1, //当事人类型
    photoUrl1: `${IMGURL}/itentity1.png`,
    photoUrl2: `${IMGURL}/itentity2.png`,
    photoUrl3: `${IMGURL}/itentity3.png`,

    name: "",
    idCard: "",
    password: "",
    password2: "",
    email: "",
    trueAddress: "",
    idCardUrl: "",
    holdIdCardUrl: "",
    imgUrl: IMGURL
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    wx.setNavigationBarTitle({
      title: '自然人注册'
    })
  },
  nextStep() {
    let that = this;
    if (this.check()) {
      let data = {
        name: this.data.name,
        idCard: this.data.idCard,
        phone: app.globalData.setPhone,
        password: this.data.password,
        email: this.data.email,
        trueAddress: this.data.trueAddress,
        idCardUrl: this.data.idCardUrl,
        holdIdCardUrl: this.data.holdIdCardUrl,
        litigantType: 0
      }
      console.log(data)
      registerAdmin(data).then(res => {
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
    } else {

    }
  },
  check() {
    if (this.data.name == '') {
      wx.showToast({
        icon: "none",
        title: '姓名不能为空！'
      })
      return false;
    }
    if (this.data.idCard == '') {
      wx.showToast({
        icon: "none",
        title: '身份证号码不能为空！'
      })
      return false;
    }
    if (this.data.password == '') {
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
    if (this.data.password != this.data.password2) {
      wx.showToast({
        icon: "none",
        title: '密码不一致！'
      })
      return false;
    }
    if (this.data.email == '') {
      wx.showToast({
        icon: "none",
        title: '邮箱不能为空！'
      })
      return false;
    }
    if (this.data.trueAddress == '') {
      wx.showToast({
        icon: "none",
        title: '地址不能为空！'
      })
      return false;
    }
    if (this.data.idCardUrl == '' || this.data.holdIdCardUrl == '') {
      wx.showToast({
        icon: "none",
        title: '前上传相应图片！'
      })
      return false;
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
                idCardUrl: res.url
              })
            } else if (name == 'legal') {
              app.globalData.legalImg = res.frontImage;
              that.setData({
                photoUrl3: tempFilePaths[0],
                holdIdCardUrl: res.url
              })
            }

          })
        } else if (name == 'opposite') {
          registerUpload(tempFilePaths[0]).then(res => {
            console.log(111)
            wx.showToast({
              title: res.message,
              icon: 'success',
              duration: 1500
            })
            if (name == 'opposite') {
              that.setData({
                photoUrl2: tempFilePaths[0],
                holdIdCardUrl: res.url
              })
            }

          })
        }

      }
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
  getname(e) {
    this.setData({
      name: e.detail.detail.value
    })
  },
  getidCard(e) {
    this.setData({
      idCard: e.detail.detail.value
    })
  },
  getpassword(e) {
    this.setData({
      password: e.detail.detail.value
    })
  },
  getpassword2(e) {
    this.setData({
      password2: e.detail.detail.value
    })
  },
  getemail(e) {
    this.setData({
      email: e.detail.detail.value
    })
  },
  gettrueAddress(e) {
    this.setData({
      trueAddress: e.detail.detail.value
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
