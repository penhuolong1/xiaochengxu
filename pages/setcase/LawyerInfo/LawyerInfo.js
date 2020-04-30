// pages/setcase/LawyerInfo/LawyerInfo.js
import {
  addLawyer,
  uploadWXFrontImage
} from '../../../common/setcase';
const app = getApp();
import {
  IMGURL
} from '../../../common/constVal'
let setcaseInfo = app.globalData.setcaseInfo;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    statusBarHeight: app.globalData.statusBarHeight, // 头部的自定义的高度
    agentType: null, //代理人类型 1.律师 ，2.法律工作者，3.单位工作人员，4.近亲属，5.公民
    name: "", //代理人名字
    agentIdentiCard: "", // 身份证号
    nation: "", //民族
    lawerNum: "", // 律师证件号
    address: "", //地址
    sex: '',
    sexAry: [{
        type: 0,
        text: '男'
      },
      {
        type: 1,
        text: '女'
      },
    ],
    imgUrl: IMGURL
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(app.globalData.setcaseInfo.lawyer.photo1)
    console.log(app.globalData.setcaseInfo.litigant)
    // 无申请人返回上一页
    if (app.globalData.setcaseInfo.litigant.id == "") {
      wx.navigateBack({
        delta: 1
      })
    }
    this.setData({
      agentType: app.globalData.setcaseInfo.lawyer.agentType
    })
    this.uploadWXFrontImage();
  },
  //回退
  back() {
    wx.navigateBack({
      delta: 1
    })
  },
  // 身份证照片识别
  uploadWXFrontImage() {
    uploadWXFrontImage(app.globalData.setcaseInfo.lawyer.frontImage, 'shenfenzheng').then(res => {
      if (res.state == 100) {
        let imgInfo = res.json.info; //身份证上识别出来的数据
        this.setData({
          name: imgInfo.name ? imgInfo.name : '',
          sex: imgInfo.sex ? imgInfo.sex : '',
          nation: imgInfo.nation ? imgInfo.nation : '',
          address: imgInfo.address ? imgInfo.address : '',
          agentIdentiCard: imgInfo.number ? imgInfo.number : '',
        })
      }
    })
  },
  // 保存
  nextStep() {
    if (this.data.name == "") {
      wx.showToast({
        title: '请输入您的姓名',
        icon: 'none',
        duration: 1500
      })
    } else if (this.data.agentIdentiCard == "") {
      wx.showToast({
        title: '请输入您的身份证号',
        icon: 'none',
        duration: 1500
      })
    } else if (this.data.agentType == 1 && this.data.lawerNum == "") {
      wx.showToast({
        title: '请输入您的律师证件号',
        icon: 'none',
        duration: 1500
      })
    } else {
      let obj = {
        litigantId: app.globalData.setcaseInfo.litigant.id,
        name: this.data.name,
        nation: this.data.nation,
        sex: this.data.sex ? (this.data.sex == "男" ? 0 : 1) : "",
        agentType: this.data.agentType,
        agentIdentiCard: this.data.agentIdentiCard,
        frontImage: app.globalData.setcaseInfo.lawyer.frontImage,
        backImage: app.globalData.setcaseInfo.lawyer.backImage,
        address: this.data.address,
        lawerNum: this.data.lawerNum
      }
      this.addLawyer(obj);
    }
  },
  // 添加代理人
  addLawyer(obj) {
    addLawyer(obj).then(res => {
      if (res.state == 100) {
        wx.navigateBack({
          delta: 2
        })
      }
    })
  },
  // 获取名字
  getname(e) {
    this.setData({
      name: e.detail.detail.value
    })
  },
  // 获取身份证号
  getagentIdentiCard(e) {
    this.setData({
      agentIdentiCard: e.detail.detail.value
    })
  },
  // 获取性别
  bindPickerChangeAn(e) {
    this.setData({
      sex: this.data.sexAry[e.detail.value].text
    })
  },
  // 获取民族
  getnation(e) {
    this.setData({
      nation: e.detail.detail.value
    })
  },
  // 获取律师证件号
  getlawerNum(e) {
    this.setData({
      lawerNum: e.detail.detail.value
    })
  },
  // 获取联系地址
  getaddress(e) {
    this.setData({
      address: e.detail.detail.value
    })
  },
})
