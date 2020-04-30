// pages/witness/evidenceList/evidenceList.js
import {
  getEviByCaseId,
  checkEvi,
  delEvidence
} from '../../../common/mycase';
var util = require('../../../common/utils.js')
import {
  IMGURL
} from '../../../common/constVal'
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    current: 'tab1',
    evidenceInfo: {},
    visible1: false,
    fileList: [],
    evidenceList: [],
    isPic: false,
    picSrc: "",
    iself: 1,
    cancelText: false,
    imgUrl: IMGURL
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: '#40A9FF',
      animation: {
        duration: 400,
        timingFunc: 'easeInOut'
      }
    })
    wx.setNavigationBarTitle({
      title: '我的证据列表'
    })
    this.getEvidence();
  },
  getEvidence() {
    getEviByCaseId(app.globalData.nowMyCaseId, this.data.iself).then(res => {
      this.setData({
        evidenceList: res.result
      })
    })
  },
  addEvidence() {
    app.globalData.nowEvidenceId = "";
    wx.navigateTo({
      url: "/pages/witness/addEvidence/addEvidence",
    })
  },
  editEvidence(e) {
    let datas = e.currentTarget.dataset.dt;
    app.globalData.nowEvidenceId = datas.evidenceId
    wx.navigateTo({
      url: "/pages/witness/addEvidence/addEvidence",
    })
  },
  submits(e) {
    let datas = e.currentTarget.dataset.dt;
    let that = this;
    wx.showModal({
      title: '确定删除该证据吗？',
      content: '',
      success(res) {
        if (res.confirm) {
          checkEvi(app.globalData.nowMyCaseId, datas.evidenceId).then(res => {
            if (res.state == 100) {
              wx.showToast({
                icon: "success",
                title: '提交成功'
              })
              setTimeout(() => {
                that.getEvidence();
              }, 1500)
            } else {
              wx.showToast({
                icon: "none",
                title: res.message
              })
            }
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
    return false;
    wx.chooseMessageFile({
      count: 10,
      type: 'file',
      success(res) {
        // tempFilePath可以作为img标签的src属性显示图片
        const tempFilePaths = res.tempFilePaths
      }
    })
  },
  deleEvidence(e) {
    let datas = e.currentTarget.dataset.dt;
    let that = this;
    wx.showModal({
      title: '确定删除该证据吗？',
      content: '',
      success(res) {
        if (res.confirm) {
          delEvidence(app.globalData.nowMyCaseId, datas.evidenceId).then(res => {
            if (res.state == 100) {
              wx.showToast({
                icon: "success",
                title: '删除成功'
              })
              setTimeout(() => {
                that.getEvidence();
              }, 1500)
            } else {
              wx.showToast({
                icon: "none",
                title: res.message
              })
            }
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  openModal(e) {
    let datas = e.currentTarget.dataset.dt;
    console.log(datas)
    if (!datas || datas.length == 0) {
      wx.showToast({
        icon: "none",
        title: '暂无附件'
      })
    } else {

      this.setData({
        visible1: true,
        fileList: datas
      })
    }
  },
  openFile(e) {
    let datas = e.currentTarget.dataset.dt;
    console.log(datas)
    let types = datas.fileType;
    if (datas.fileAddr == "") {
      wx.showToast({
        icon: "none",
        title: '文件路径为空'
      })
    } else {
      // let urls = 'https://dq.hlcourt.gov.cn/' + datas.addr;
      let urls = 'https://court1.ptnetwork001.com/' + datas.fileAddr;
      if (types == 'pdf' || types == 'docx' || types == 'doc' || types == 'exel') {
        wx.showLoading({
          title: '打开中… '
        })
        wx.downloadFile({
          url: urls,
          success: function (res) {
            var filePath = res.tempFilePath
            wx.openDocument({
              filePath: filePath,
              success: function (res) {
                wx.hideLoading()
                console.log('打开文档成功')
              },
              fail: function (e) {
                wx.hideLoading();
                wx.showToast({
                  icon: "none",
                  title: '网络错误'
                })
              }
            })
          }
        })
      } else if (types == 'png' || types == 'jpg' || types == 'gif') {
        this.setData({
          isPic: true,
          picSrc: urls,
        })
      }
    }
  },
  toggleClosePic() {
    this.setData({
      isPic: false,
      picSrc: "",
    })
  },
  handleClose1() {
    this.setData({
      visible1: false,
    })
  },
  handleChange({
    detail
  }) {
    this.setData({
      current: detail.key,
    });
    if (detail.key == 'tab1') {
      this.setData({
        iself: 1,
      });
    } else {
      this.setData({
        iself: 2,
      });
    }
    this.getEvidence();
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
    this.getEvidence();
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
