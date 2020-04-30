// pages/setcase/Lawyer/Lawyer.js
import {
  uploadFrontImage,
  uploadBackImage
} from '../../../common/setcase';
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
    statusBarHeight: app.globalData.statusBarHeight, // 头部的自定义的高度
    litigantId: "", // 已经添加成功的当事人id
    litigantName: "", // 已经添加成功的当事人名字
    photoUrl3: `${IMGURL}/itentity1.png`,
    litigantType: '律师',
    litigantTypeAry: [{
        id: 1,
        text: "律师"
      },
      {
        id: 2,
        text: "法律工作者"
      },
      {
        id: 3,
        text: "单位工作人员"
      },
      {
        id: 4,
        text: "近亲属"
      },
      {
        id: 5,
        text: "公民"
      },
    ],
    card: '中华人民共和国居民身份证', // 中华人民共和国居民身份证
    photoUrl1: `${IMGURL}/card1.png`,
    photoUrl2: `${IMGURL}/card2.png`,
    uploadCard1: "",
    uploadCard2: "",
    uploadCard3: "",
    imgUrl: IMGURL
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(app.globalData.setcaseInfo.litigant)
    this.setData({
      litigantId: app.globalData.setcaseInfo.litigant.id,
      litigantName: app.globalData.setcaseInfo.litigant.name
    })
  },
  //回退
  back() {
    wx.navigateBack({
      delta: 1
    })
  },
  // 选择框改变
  bindPickerChangeAn(e) {
    console.log(e)
    if (e.currentTarget.dataset.type == '代理人身份') {
      this.setData({
        litigantType: this.data.litigantTypeAry[e.detail.value].text
      })
      // if(this.data.litigantType == '律师') {
      //   this.setData({
      //     card: "律师执业证"
      //   })
      // }else {
      //   this.setData({
      //     card: "中华人民共和国居民身份证"
      //   })
      // }
    }
  },
  nextStep() {
    if (this.data.uploadCard1 == "" || this.data.uploadCard2 == "") {
      wx.showToast({
        title: '证件照片不能为空',
        icon: 'none',
        duration: 1500
      })
    } else {
      this.data.litigantTypeAry.map(item => {
        if (item.text == this.data.litigantType) {
          app.globalData.setcaseInfo.lawyer.agentType = item.id; //代理人类型 1.律师 ，2.法律工作者，3.单位工作人员，4.近亲属，5.公民
        }
      })
      app.globalData.setcaseInfo.lawyer.frontImage = this.data.uploadCard1
      app.globalData.setcaseInfo.lawyer.backImage = this.data.uploadCard2
      wx.navigateTo({
        url: '/pages/setcase/LawyerInfo/LawyerInfo',
      })
    }
  },
  //上传照片
  uploadImg(e) {
    let that = this;
    let name = e.currentTarget.dataset.vb;
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        console.log(res)
        // tempFilePath可以作为img标签的src属性显示图片
        const tempFilePaths = res.tempFilePaths
        console.log(tempFilePaths[0])
        if (name == 'front') {
          uploadFrontImage(tempFilePaths[0]).then(res => {
            wx.showToast({
              title: res.message,
              icon: 'success',
              duration: 1500
            })
            that.setData({
              photoUrl1: tempFilePaths[0],
              uploadCard1: res.url
            })
          })
        } else if (name == 'opposite') {
          uploadFrontImage(tempFilePaths[0]).then(res => {
            wx.showToast({
              title: res.message,
              icon: 'success',
              duration: 1500
            })
            that.setData({
              photoUrl2: tempFilePaths[0],
              uploadCard2: res.url
            })
          })
        }
      }
    })
  },
})
