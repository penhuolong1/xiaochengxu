// pages/setcase/four/four.js
import {
  detailsCase
} from '../../../common/case';
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
    topSeachBarBox: false, // 头部的搜索框显示隐藏
    caseInfo: {}, //案件详情
    applicantObj: [], //申请人
    lawyerName: "", //代理人名字
    thirdPeoObj: {}, //第三人
    defendantObj: [], //被申请人
    backDate: {},
    litigantInfoArr: [],
    lawyerInfoArr: [],
    actions2: [{
      name: '删除',
      color: '#ed3f14'
    }],
    actions: [{
      name: '删除',
      color: '#fff',
      fontsize: '20',
      width: 100,
      background: '#ed3f14',
      visible2: false,
    }, ],
    nowDelObj: {},
    setCaseName: app.globalData.setcaseInfo.identity,
    delTips: '确定吗？',
    backPage: '', //返回的页面
    imgUrl: IMGURL
  },
  onShow() {
    this.detailsCase(app.globalData.setcaseInfo.lawCaseId);
    // this.detailsCase('de485ff1daae4d25be79dea68adb75df')
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      backPage: options.page
    })
  },
  // 顶部的搜索按钮
  searchBar() {
    this.setData({
      topSeachBarBox: true
    });
  },
  //回退
  back() {
    wx.redirectTo({
      url: '/pages/setcase/steps-two/steps-two',
    })
  },
  // 案件详情
  detailsCase(caseId) {
    detailsCase(caseId).then(res => {
      if (res.state == 100) {
        this.setData({
          caseInfo: res.lawCase
        })
        if (this.data.caseInfo.litigants.length > 0) {
          let ary1 = [] // 申请人
          let ary2 = [] // 被申请人
          this.data.caseInfo.litigants.map(item => {
            if (item.litigationStatus.name == "申请人") {
              ary1.push(item)
              app.globalData.setcaseInfo.litigant.id = (JSON.stringify(this.data.applicantObj) !== "{}") ? this.data.applicantObj.id : ''
              app.globalData.setcaseInfo.litigant.name = (JSON.stringify(this.data.applicantObj) !== "{}") ? this.data.applicantObj.litigantName : ''
              console.log(this.data.applicantObj)
            } else if (item.litigationStatus.name == "第三人") {
              this.setData({
                thirdPeoObj: item
              })
            } else if (item.litigationStatus.name == "被申请人") {
              ary2.push(item)
            }
          })
          this.setData({
            applicantObj: ary1,
            defendantObj: ary2
          })
          console.log(this.data.applicantObj)
        }

      }
    })
  },
  // 去添加当事人
  addType(e) {
    let addType = e.currentTarget.dataset.type;
    if (addType == '申请人') {
      let addPlaintiffInfoId = JSON.stringify(this.data.applicantObj) !== "{}" ? this.data.applicantObj.id : ''
      wx.navigateTo({
        url: `/pages/add-applicant/add-applicant?type=4`, // type为诉讼地位 4为申请人
      })
    } else if (addType == '代理人') {
      console.log(app.globalData.setcaseInfo.litigantId)
      if (JSON.stringify(this.data.applicantObj) !== "{}") {
        wx.navigateTo({
          url: '/pages/setcase/Lawyer/Lawyer',
        })
      } else {
        wx.showToast({
          icon: "none",
          title: '请先添加申请人'
        })
      }
    } else if (addType == '被申请人') {
      let DefendantId = JSON.stringify(this.data.defendantObj) !== "{}" ? this.data.defendantObj.id : ''
      wx.navigateTo({
        url: `/pages/add-applicant/add-applicant?type=5`, // type为诉讼地位 4为被申请人
      })
    } else if (addType == '第三人') {
      let thirdId = JSON.stringify(this.data.thirdPeoObj) !== "{}" ? this.data.thirdPeoObj.id : ''
      wx.navigateTo({
        url: '/pages/setcase/thirdPeo/thirdPeo?litigantId=' + thirdId,
      })
    }
  },
  nextStep() {
    if (this.data.applicantObj && this.data.applicantObj.length > 0) {
      wx.navigateTo({
        url: '/pages/setcase/steps-four/steps-four',
      })
    } else {
      wx.showToast({
        icon: "none",
        title: '请先添加当事人'
      })
      return false;
    }

    // completeLitigant(setcaseInfo.id).then(res => {
    //   wx.navigateTo({
    //     url: '/pages/setcase/EvidenceMaterial/EvidenceMaterial',
    //   })
    // })
  },
  turnApplicantDetail(e) {
    let id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `/pages/add-applicant/add-applicant?litigantId=${id}`,
    })
  }
})
