import {
  detailsCase
} from '../../../common/case';
import {
  intoRoom
} from '../../../common/rtc';
import {
  IMGURL
} from '../../../common/constVal'
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    detailOpen1: false, // 请求事项详情
    detailOpen2: false, // 事实与理由
    detailOpen3: false, // 当事人
    caseInfo: {},
    applicantObj: {}, //申请人
    defendantObj: {}, //被申请人
    eviData: '', //证据信息
    type: null,
    imgUrl: IMGURL
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.detailsCase(options.caseId)
    this.setData({
      type: options.type
    })
  },
  // 案件详情
  detailsCase(caseId) {
    detailsCase(caseId).then(res => {
      console.log('--案件详情信息---')
      console.log(res)
      if (res.state == 100) {
        this.setData({
          caseInfo: res.lawCase
        })
        let applicantObj = []
        let defendantObj = []
        let eviAry = []
        this.data.caseInfo.litigants.map(item => {
          if (item.evidences && item.evidences.length > 0) {
            item.evidences.forEach( item1 => {
              eviAry.push(item1)
            })
          }
          if (item.litigationStatus.name == "申请人") {
            applicantObj.push(item)
          } else if (item.litigationStatus.name == "被申请人") {
            defendantObj.push(item)
          }
        })
        this.setData({
          applicantObj: applicantObj
        })
        this.setData({
          defendantObj: defendantObj,
          eviData: eviAry
        })
      }
    })
  },
  // 详情展示
  openDetail(e) {
    if (e.currentTarget.dataset.text == '请求事项') {
      this.setData({
        detailOpen1: !this.data.detailOpen1
      })
    } else if (e.currentTarget.dataset.text == '事实与理由') {
      this.setData({
        detailOpen2: !this.data.detailOpen2
      })
    } else if (e.currentTarget.dataset.text == '当事人') {
      this.setData({
        detailOpen3: !this.data.detailOpen3
      })
    }
  },
  // /**
  //  * 进入房间
  //  */
  entryRoom(e) {
    if (this.data.caseInfo.process == 5) {
      app.globalData.caseNo = this.data.caseInfo.sqCaseNo;
      app.globalData.caseId = this.data.caseInfo.id;
      intoRoom(this.data.caseInfo.id).then(res => {
        if (res.state == 100) {
          app.roomToken = res.result
          wx.navigateTo({
            url: `/pages/rtcRoom/rtcRoom`,
          })
        } else {
          wx.showToast({
            title: '网络错误',
            icon: 'none',
            duration: 2000
          })
          return;
        }
      })
    } else {
      return false;
    }
  },
  backPage() {
    wx.navigateBack({
      delta: 1
    })
  },
  viewMore(e) {
    let type = e.currentTarget.dataset.type;
    if (type == '申请人') {
      let addPlaintiffInfoId = JSON.stringify(this.data.applicantObj) !== "{}" ? this.data.applicantObj.id : ''
      wx.navigateTo({
        url: '/pages/setcase/addPlaintiffInfo/addPlaintiffInfo?litigantId=' + addPlaintiffInfoId + "&operation=view&isReView=1",
      })
    } else if (type == '被申请人') {
      let DefendantId = JSON.stringify(this.data.defendantObj) !== "{}" ? this.data.defendantObj.id : '' + "&operation='view'"
      if (DefendantId) {
        wx.navigateTo({
          url: '/pages/setcase/Defendant/Defendant?litigantId=' + DefendantId + "&operation=view&isReView=1",
        })
      } else {
        wx.showToast({
          icon: "none",
          title: '无被申请人'
        })
      }
    } else if (type == '证据列表') {
      if (this.data.eviData.length > 0) {
        wx.navigateTo({
          url: `/pages/setcase/steps-six/steps-six?caseId=${this.data.caseInfo.id}&isShowDetail=1`,
        })
      } else {
        wx.showToast({
          icon: "none",
          title: '没有相关证据'
        })
      }
    }
  },
  // 查看当事人详情
  viewMoreInfo(e) {
    let type = e.currentTarget.dataset.type;
    let id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/add-applicant/add-applicant?litigantId=' + id + "&isEdit=1",
    })
    // if (type == '申请人') {
    //   wx.navigateTo({
    //     url: '/pages/setcase/addPlaintiffInfo/addPlaintiffInfo?litigantId=' + id + "&operation=view&isReView=1",
    //   })
    // } else if (type == '被申请人') {
    //   wx.navigateTo({
    //     url: '/pages/setcase/addPlaintiffInfo/addPlaintiffInfo?litigantId=' + id + "&operation=view&isReView=1&isDefendAnt=1",
    //   })
    // }
  }
})
