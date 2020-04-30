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
    photoUrl1: "",
    photoUrl2: `${IMGURL}/pic.png`,
    photoUrl3: "",

    name: "",
    idCard: "",
    password: "",
    password2: "",
    email: "",
    trueAddress: "",
    legalManName: "",
    legalManPhone: "",
    legalManId: "",
    laborContractUrl: "",
    powerAttorneyUrl: "",
    imgUrl: IMGURL
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    wx.setNavigationBarTitle({
      title: '注册-法人/非法人'
    })
    if (app.globalData.nowLitigantId != "") {
      getLitigantInfolitigant(app.globalData.nowLitigantId).then(res => {
        that.setData({
          fileType: res.onlineLitigant.litigantType == 0 ? 1 : 2,
          fileTypeName: res.onlineLitigant.litigantType == 0 ? '自然人' : '法人',
          nowText: res.onlineLitigant.litigantType == 0 ? '中华人民共和国居民身份证' : '中华人民共和国营业执照',
        })
        if (res.onlineLitigant.litigantType == 0) {
          that.setData({
            photoUrl1: "https://dq.hlcourt.gov.cn" + res.onlineLitigant.frontImage,
            photoUrl2: "https://dq.hlcourt.gov.cn" + res.onlineLitigant.backImage,
          })
        } else {
          app.globalData.legalImg = res.onlineLitigant.frontImage;
          that.setData({
            photoUrl3: "https://dq.hlcourt.gov.cn" + res.onlineLitigant.frontImage,
          })
        }
      })
    }

  },
  nextStep() {
    let that = this;
    if (this.check()) {
      console.log(5555)
      let data = {
        name: this.data.name,
        idCard: this.data.idCard,
        password: this.data.password,
        email: this.data.email,
        trueAddress: this.data.trueAddress,
        legalManName: this.data.legalManName,
        legalManPhone: this.data.legalManPhone,
        legalManId: this.data.legalManId,
        laborContractUrl: this.data.laborContractUrl,
        powerAttorneyUrl: this.data.powerAttorneyUrl,
        litigantType: 1
      }
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
      console.log(99999)
    }


  },
  check() {
    if (this.data.name == '') {
      wx.showToast({
        icon: "none",
        title: '公司名称不能为空！'
      })
      return false;
    }
    if (this.data.idCard == '') {
      wx.showToast({
        icon: "none",
        title: '统一信用代码不能为空！'
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
    if (this.data.legalManName == '') {
      wx.showToast({
        icon: "none",
        title: '法定代表人/负责人不能为空！'
      })
      return false;
    }
    if (this.data.laborContractUrl == '' || this.data.powerAttorneyUrl == '') {
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
                laborContractUrl: res.url
              })
            } else if (name == 'legal') {
              app.globalData.legalImg = res.frontImage;
              that.setData({
                photoUrl3: tempFilePaths[0],
                powerAttorneyUrl: res.url,
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
                photoUrl3: tempFilePaths[0],
                powerAttorneyUrl: res.url,
              })
            }

          })
        }

      }
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
  getlegalManName(e) {
    this.setData({
      legalManName: e.detail.detail.value
    })
  },
  getlegalManPhone(e) {
    this.setData({
      legalManPhone: e.detail.detail.value
    })
  },
  getlegalManId(e) {
    this.setData({
      legalManId: e.detail.detail.value
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
