// pages/setcase/addPlaintiffInfo/addPlaintiffInfo.js
import {
  uploadFrontImage,
  selectLitigant
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
    litigantId: "", //链接带过来的当事人id
    operation: '', //链接带过来的操作，有litigantId无operation表示修改，有litigantId有operation表示查看（view）
    selectNames: "自然人",
    identityCard: "23",
    isDefendAnt: '', //判断是申请人还是被申请人 被申请人为1 其他为申请人
    litigantType: [{
        id: 0,
        text: '自然人'
      },
      {
        id: 1,
        text: '法人'
      },
    ],
    // 证件类型
    cardType: "中华人民共和国居民身份证",
    fileTypeName: "自然人",
    fileType: 1, //当事人类型

    photoUrl1: `${IMGURL}/card1.png`,
    photoUrl2: `${IMGURL}/card2.png`,
    photoUrl3: "",
    uploadCard1: "",
    uploadCard2: "",
    uploadCard3: "",
    isReView: 0, //0为当事人进来 1为仅仅查看
    imgUrl: IMGURL
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (JSON.stringify(options) !== "{}") {
      this.setData({
        litigantId: options.litigantId ? options.litigantId : '',
        isReView: options.isReView ? options.isReView : 0,
        isDefendAnt: options.isDefendAnt ? options.isDefendAnt : ''
      })
      if (this.data.litigantId !== '') {
        this.setData({
          operation: options.operation ? options.operation : ''
        })
        this.selectLitigant(this.data.litigantId)
      }
    }
  },
  //回退
  back() {
    wx.navigateBack({
      delta: 1
    })
  },
  // 查看当事人的详情
  selectLitigant(id) {
    selectLitigant(id).then(res => {
      if (res.state == 100) {
        let info = res.litigant
        if (info.identityType == 1) {
          this.setData({
            selectNames: '自然人',
            cardType: "中华人民共和国居民身份证",
            photoUrl1: info.backImage ? app.globalData.http1 + info.backImage : `${IMGURL}/card1.png`,
            photoUrl2: info.frontImage ? app.globalData.http1 + info.frontImage : `${IMGURL}/card2.png`,
            uploadCard1: info.backImage ? info.backImage : '',
            uploadCard2: info.frontImage ? info.frontImage : '',
          })
          app.globalData.setcaseInfo.litigant.frontImage = this.data.uploadCard1;
          app.globalData.setcaseInfo.litigant.backImage = this.data.uploadCard2;
        } else if (info.identityType == 2) {
          this.setData({
            selectNames: '法人',
            cardType: "中华人民共和国营业执照",
            uploadCard3: info.companyImage ? info.companyImage : '',
            photoUrl3: info.companyImage ? app.globalData.http1 + info.companyImage : '',
          })
          app.globalData.setcaseInfo.litigant.frontImage = this.data.uploadCard3;
        }
      }
    })
  },
  // 选择框改变
  bindPickerChangeAn(e) {
    if (e.currentTarget.dataset.type == '当事人身份类型') {
      this.setData({
        selectNames: this.data.litigantType[e.detail.value].text
      })
      if (this.data.selectNames == '自然人') {
        this.setData({
          cardType: "中华人民共和国居民身份证"
        })
      } else if (this.data.selectNames == '法人') {
        this.setData({
          cardType: "中华人民共和国营业执照"
        })
      }
    }
  },
  // 下一步
  nextStep() {
    if (this.data.selectNames == '自然人') {
      app.globalData.setcaseInfo.roleType = 0;
      if (this.data.uploadCard1 == "" || this.data.uploadCard2 == "") {
        wx.showToast({
          title: '证件照片不能为空',
          icon: 'none',
          duration: 1500
        })
      } else {
        app.globalData.setcaseInfo.litigant.frontImage = this.data.uploadCard1;
        app.globalData.setcaseInfo.litigant.backImage = this.data.uploadCard2;
        if (this.data.litigantId) {
          wx.navigateTo({
            url: '/pages/setcase/addPlaintiffinfoSec/addPlaintiffinfoSec?litigantId=' + this.data.litigantId,
          })
        } else {
          wx.navigateTo({
            url: '/pages/setcase/addPlaintiffinfoSec/addPlaintiffinfoSec',
          })
        }
      }
    } else {
      app.globalData.setcaseInfo.roleType = 1;
      if (this.data.uploadCard3 == "") {
        wx.showToast({
          title: '证件照片不能为空',
          icon: 'none',
          duration: 1500
        })
      } else {
        app.globalData.setcaseInfo.litigant.frontImage = this.data.uploadCard3;
        if (this.data.litigantId) {
          wx.navigateTo({
            url: '/pages/setcase/addPlaintiffinfoSec/addPlaintiffinfoSec?litigantId=' + this.data.litigantId,
          })
        } else {
          wx.navigateTo({
            url: '/pages/setcase/addPlaintiffinfoSec/addPlaintiffinfoSec',
          })
        }
      }
    }
  },
  // 下一页
  nextPage() {
    if (this.data.isDefendAnt == 1) {
      wx.navigateTo({
        url: '/pages/setcase/addPlaintiffinfoSec/addPlaintiffinfoSec?litigantId=' + this.data.litigantId + "&operation=" + this.data.operation + "&isDefendAnt=1",
      })
    } else {
      wx.navigateTo({
        url: '/pages/setcase/addPlaintiffinfoSec/addPlaintiffinfoSec?litigantId=' + this.data.litigantId + "&operation=" + this.data.operation,
      })
    }
  },
  //上传照片
  uploadImg(e) {
    let that = this;
    let name = e.currentTarget.dataset.vb;
    if (this.data.isReView == 1) {
      let url = '';
      if (name == 'front') {
        url = this.data.photoUrl1;
      } else if (name == 'opposite') {
        url = this.data.photoUrl2;
      } else {
        url = this.data.photoUrl3;
      }
      wx.previewImage({
        current: url, // 当前显示图片的http链接
        urls: [url] // 需要预览的图片http链接列表
      })
      return false;
    }
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
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
        } else if (name == 'legal') {
          uploadFrontImage(tempFilePaths[0]).then(res => {
            wx.showToast({
              title: res.message,
              icon: 'success',
              duration: 1500
            })
            that.setData({
              photoUrl3: tempFilePaths[0],
              uploadCard3: res.url
            })
          })
        }
      }
    })
  }
})
