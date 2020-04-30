// pages/mycase/evidenceInfo/evidenceInfo.js
import {
  getEvidenceReverts
} from '../../../common/mycase';
import {
  IMGURL
} from '../../../common/constVal'
var util = require('../../../common/utils.js')
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    evidenceInfo: {},
    reverList: [], //质证信息
    visible1: false,
    fileList: [],
    isPic: false,
    picSrc: "",
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
      title: '证据信息'
    })
    this.getInfo();
  },
  getInfo() {
    getEvidenceReverts(app.globalData.nowEvidenceId).then(res => {
      let data = {
        name: res.qtwEvidence.name,
        prove: res.qtwEvidence.prove,
        where: res.qtwEvidence.source,
        proveTime: util.formatDate(new Date(res.qtwEvidence.createDate), 'yyyy-MM-dd'),
        fileAddr: res.qtwEvidence.filePaths,
      }
      let arr = [];
      if (res.reverts) {
        res.reverts.map(item => {
          let data2 = {
            dsrName: item.dsrName,
            dsrStatus: item.dsrStatus,
            time: item.time,
            zhen: item.result.substr(0, 1),
            he: item.result.substr(1, 1),
            guan: item.result.substr(2, 1),
            content: item.content,
            content2: item.content2,
          }
          arr.push(data2);
        })
      }
      this.setData({
        evidenceInfo: data,
        reverList: arr, //质证信息
      })
    })
  },
  openFile(e) {
    let datas = e.currentTarget.dataset.dt;
    console.log(datas)
    let types = datas.name.split('.')[1];
    if (datas.addr == "") {
      wx.showToast({
        icon: "none",
        title: '文件路径为空'
      })
    } else {
      // let urls = 'https://dq.hlcourt.gov.cn/' + datas.addr;
      let urls = 'https://court1.ptnetwork001.com/' + datas.addr;
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
                wx.hideLoading();
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
  openModal(e) {
    let datas = e.currentTarget.dataset.dt;
    if (datas.length == 0) {
      wx.showToast({
        icon: "none",
        title: '暂无附件'
      })
    } else {
      console.log(datas)
      this.setData({
        visible1: true,
        fileList: datas
      })
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
