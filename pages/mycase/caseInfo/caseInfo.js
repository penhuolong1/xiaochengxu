import { detailsCase } from '../../../common/case';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    caseInfo: {}, //案件信息
    applicantObj: "", //当事人
    defendantObj: "",//被申请人
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.detailsCase(options.viewCase)
  },
  // 案件详情
  detailsCase(caseId) {
    detailsCase(caseId).then(res => {
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
      }
    })
  },
  nextStep() {
    wx.navigateBack({
      delta: 1
    })
  },
  viewMore(e) {
    let type = e.currentTarget.dataset.type;
    if(type == '申请人') {
      let addPlaintiffInfoId = JSON.stringify(this.data.applicantObj) !== "{}"?this.data.applicantObj.id:''
      console.log(addPlaintiffInfoId)
      wx.navigateTo({
        url: '/pages/setcase/addPlaintiffInfo/addPlaintiffInfo?litigantId='+addPlaintiffInfoId,
      })
    }else if(type == '被申请人'){
      let DefendantId = JSON.stringify(this.data.defendantObj) !== "{}"?this.data.defendantObj.id:''
      wx.navigateTo({
        url: '/pages/setcase/Defendant/Defendant?litigantId='+DefendantId,
      })
    }else if(type == '证据列表') {
      if(this.data.applicantObj.evidences.length>0) {
        wx.navigateTo({
          url: "/pages/evidenceInfo/evidenceInfo?caseId="+this.data.caseInfo.id,
        })
      }
    }
  }
})