import {
  detailsCase
} from '../../../common/case';
import {
  submitCase
} from '../../../common/setcase';
import {
  IMGURL
} from '../../../common/constVal'
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    statusBarHeight: app.globalData.statusBarHeight, // 头部的自定义的高度
    operation: "", // 上个页面是否传操作方式过来
    isNewOpen: true, //判断当前页面是新打开还是从其他页面返回  
    subObj: {
      lawCaseId: '',
      // courtId: '',
      reason: '',
      mediateRequest: '',
      applyStandard: '',
    }, // 提交时候的信息
    courtName: '', //调解机构的名字显示
    caseInfo: {}, //案件详细信息
    applicantObj: {}, //申请人
    thirdPeoObj: {}, //第三人
    defendantObj: {}, //被申请人
    lawyerName: "", // 申请代理人
    imgUrl: IMGURL
  },
  onShow() {
    this.detailsCase();
  },
  onLoad(options) {
    if (options.operation) {
      this.setData({
        operation: options.operation
      })
    }
  },
  //回退
  back() {
    wx.navigateBack({
      delta: 1
    })
  },
  // 案件详情
  detailsCase() {
    let that = this;
    detailsCase(app.globalData.setcaseInfo.lawCaseId).then(res => {
    //  detailsCase('ce8fd44595824e238aad57f7db9a5857').then(res => {
      if (res.state == 100) {
        that.setData({
          caseInfo: res.lawCase
        })
        let applicantAry = []
        let defendantAry = []
        this.data.caseInfo.litigants.map(item => {
          if (item.litigationStatus.name == "申请人") {
            applicantAry.push(item)
          } else if (item.litigationStatus.name == "第三人") {
            this.setData({
              thirdPeoObj: item
            })
          } else if (item.litigationStatus.name == "被申请人") {
            defendantAry.push(item)
          }
        })
        this.setData({
          applicantObj: applicantAry,
          defendantObj: defendantAry
        })
        console.log(this.data.applicantObj)
        console.log(this.data.defendantObj)
        let name1 = 'subObj.lawCaseId';
        let name2 = 'subObj.courtId'; //添加时候的选择的机构
        let name3 = 'subObj.reason';
        let name4 = 'subObj.mediateRequest';
        let name5 = 'subObj.applyStandard';
        // 是编辑还是立案过来的页面
        if (this.data.operation == 'edit') {
          this.setData({
            [name1]: this.data.caseInfo.id,
          })
        } else {
          this.setData({
            [name1]: app.globalData.setcaseInfo.lawCaseId,
          })
        }
        // 是否是新开的页面 true是，false是从其他页面返回
        if (this.data.isNewOpen && this.data.operation == "edit") {
          this.setData({
            [name2]: this.data.caseInfo.court ? this.data.caseInfo.court.id : '',
            [name3]: this.data.caseInfo.reason ? this.data.caseInfo.reason : '',
            [name4]: this.data.caseInfo.mediateRequest ? this.data.caseInfo.mediateRequest : '',
            [name5]: this.data.caseInfo.applyStandard ? this.data.caseInfo.applyStandard : '',
            courtName: this.data.caseInfo.court ? this.data.caseInfo.court.name : '',
          })
          app.globalData.setcaseInfo.lawCaseId = this.data.caseInfo.id;
          app.globalData.setcaseInfo.courtId = this.data.subObj.courtId;
          app.globalData.setcaseInfo.reason = this.data.subObj.reason;
          app.globalData.setcaseInfo.mediateRequest = this.data.subObj.mediateRequest;
          app.globalData.setcaseInfo.applyStandard = this.data.subObj.applyStandard;
          app.globalData.setcaseInfo.courtName = this.data.courtName;
        } else if ((this.data.isNewOpen && this.data.operation == "add") || (!this.data.isNewOpen)) {
          this.setData({
            [name2]: app.globalData.setcaseInfo.courtId,
            [name3]: app.globalData.setcaseInfo.reason,
            [name4]: app.globalData.setcaseInfo.mediateRequest,
            [name5]: app.globalData.setcaseInfo.applyStandard,
            courtName: app.globalData.setcaseInfo.courtName,
          })
        }

      }
    })
  },
  nextStep() {
    //点击确定
    let name = 'subObj.isOverApplication';
    this.setData({
      [name]: 1
    })
    this.submitCase(this.data.subObj)
  },
  // 提交到暂存列表
  draftsBtn() {
    let name = 'subObj.isOverApplication';
    this.setData({
      [name]: 0
    })
    this.submitCase(this.data.subObj)
    // 数据初始化
    app.globalData.setcaseInfo.litigant.id = ''
    app.globalData.setcaseInfo.litigant.name = ''
  },
  // 提交审核
  submitCase(obj) {
    console.log(obj)
    if (obj.courtId == "") {
      wx.showToast({
        icon: "none",
        title: '请选择调解机构'
      })
    } else if (obj.mediateRequest == "") {
      wx.showToast({
        icon: "none",
        title: '请填写诉讼请求'
      })
    }  else if (obj.reason == "") {
      wx.showToast({
        icon: "none",
        title: '请填写事实与理由'
      })
    } else {
      submitCase(obj).then(res => {
        if (res.state == 100) {
          // 数据初始化
          app.globalData.setcaseInfo.lawCaseId = '';
          app.globalData.setcaseInfo.courtId = '';
          app.globalData.setcaseInfo.reason = '';
          app.globalData.setcaseInfo.mediateRequest = '';
          app.globalData.setcaseInfo.applyStandard = '';
          app.globalData.setcaseInfo.litigantId = '';
          wx.reLaunch({
            url: '/pages/index/index'
          })
        }
      })
    }
  },
  // 跳转到当事人页面
  toLitigntPage(e) {
    let id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `/pages/add-applicant/add-applicant?litigantId=${id}`,
    })
  },
  // 添加申请人
  addApplicant(e) {
    wx.navigateTo({
      url: `/pages/add-applicant/add-applicant?type=4`, // type为诉讼地位 4为申请人
    })
  },
  // 添加被申请人
  addDefendant(e) {
    wx.navigateTo({
      url: `/pages/add-applicant/add-applicant?type=5`, // type为诉讼地位 4为申请人
    })
  },
  // 修改信息
  edit(e) {
    let editType = e.currentTarget.dataset.type;
    if (editType == '申请人') {
      let addPlaintiffInfoId = JSON.stringify(this.data.applicantObj) !== "{}" ? this.data.applicantObj.id : ''
      this.setData({
        isNewOpen: false
      })
      if (addPlaintiffInfoId) {
        wx.navigateTo({
          url: '/pages/setcase/addPlaintiffInfo/addPlaintiffInfo?litigantId=' + addPlaintiffInfoId,
        })
      } else {
        wx.navigateTo({
          url: '/pages/setcase/addPlaintiffInfo/addPlaintiffInfo',
        })
      }
    } else if (editType == '申请代理人') {
      this.setData({
        isNewOpen: false
      })
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
    } else if (editType == '被申请人') {
      let DefendantId = JSON.stringify(this.data.defendantObj) !== "{}" ? this.data.defendantObj.id : ''
      this.setData({
        isNewOpen: false
      })
      if (DefendantId) {
        wx.navigateTo({
          url: '/pages/setcase/Defendant/Defendant?litigantId=' + DefendantId,
        })
      } else {
        wx.navigateTo({
          url: '/pages/setcase/Defendant/Defendant',
        })
      }
    } else if (editType == '第三人') {
      let thirdId = JSON.stringify(this.data.thirdPeoObj) !== "{}" ? this.data.thirdPeoObj.id : ''
      this.setData({
        isNewOpen: false
      })
      if (thirdId) {
        wx.navigateTo({
          url: '/pages/setcase/thirdPeo/thirdPeo?litigantId=' + thirdId,
        })
      } else {
        wx.navigateTo({
          url: '/pages/setcase/thirdPeo/thirdPeo',
        })
      }
    } else if (editType == '调解机构') {
      let courtId = JSON.stringify(this.data.thirdPeoObj) !== "{}" ? this.data.thirdPeoObj.id : ''
      this.setData({
        isNewOpen: false
      })
      app.globalData.backPage = 'steps-preview'
      if (courtId) {
        wx.navigateTo({
          url: '/pages/setcase/steps-one/steps-one?operation=edit&courtId=' + courtId,
        })
      } else {
        wx.navigateTo({
          url: '/pages/setcase/steps-one/steps-one?operation=edit',
        })
      }
    } else if (editType == '诉讼请求') {
      this.setData({
        isNewOpen: false
      })
      wx.navigateTo({
        url: '/pages/setcase/steps-four/steps-four?operation=edit',
      })
    } else if (editType == '事实与理由') {
      this.setData({
        isNewOpen: false
      })
      wx.navigateTo({
        url: '/pages/setcase/steps-four/steps-four?operation=edit',
      })
    } else if (editType == '证据材料') {
      wx.navigateTo({
        url: "/pages/setcase/steps-six/steps-six",
      })
    }
  }
})
