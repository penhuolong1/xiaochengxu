import { detailsCase,acceptCase } from '../../../common/case';
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    buttonText: null, 
    caseInfo: null ,//案件详情
    caseNo: "", //登字号
    sqCaseNo: "", // 调解号
    applicantObj: "", //当事人名字
    defendantObj: "",//被申请人名字
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      buttonText: options.type=="审核" ? options.type : '返回'
    })
    if(!app.globalData.acceptCaseObj.caseId) {
      wx.navigateBack({
        delta: 1
      })
    }else {
      this.detailsCase();
    }
  },
  // 案件详情
  detailsCase() {
    detailsCase(app.globalData.acceptCaseObj.caseId).then(res => {
      if(res.state == 100){
        this.setData({
          caseInfo: res.lawCase
        })
        this.data.caseInfo.litigants.map(item => {
          if (item.litigationStatus.name == "申请人"){
            this.setData({
              applicantObj: item
            })
          }else if(item.litigationStatus.name == "被申请人") {
            this.setData({
              defendantObj: item
            })
          }
        })
        console.log(this.data.caseInfo)
      }
    })
  },
  // 返回上一页
  nextStep() {
    wx.navigateBack({
      delta: 1
    })
  },
  // 证据列表查看
  // enterEvidenceInfo() {
  //   wx.navigateTo({
  //     url: "/pages/evidenceInfo/evidenceInfo",
  //   })
  // },
  viewMore(e) {
    let type = e.currentTarget.dataset.type;
    if(type == '申请人') {
      let addPlaintiffInfoId = JSON.stringify(this.data.applicantObj) !== "{}"?this.data.applicantObj.id:''
      wx.navigateTo({
        url: '/pages/setcase/addPlaintiffInfo/addPlaintiffInfo?litigantId='+addPlaintiffInfoId+"&operation=view",
      })
    }else if(type == '被申请人'){
      let DefendantId = JSON.stringify(this.data.defendantObj) !== "{}"?this.data.defendantObj.id:''+"&operation='view'"
      if(DefendantId) {
        wx.navigateTo({
          url: '/pages/setcase/Defendant/Defendant?litigantId='+DefendantId+"&operation=view",
        })
      }else {
        wx.showToast({
          icon: "none",
          title: '无被申请人'
        })
      }
    }else if(type == '证据列表') {
      if(this.data.applicantObj.evidences.length>0) {
        wx.navigateTo({
          url: "/pages/evidenceInfo/evidenceInfo?caseId="+app.globalData.acceptCaseObj.caseId,
        })
      }
    }
  }
})