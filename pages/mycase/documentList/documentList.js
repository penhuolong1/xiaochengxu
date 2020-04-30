// pages/mycase/index/index.js
import {
  wxLitigantSendDiplomsList
} from '../../../common/mycase';
const app = getApp();
import {
  IMGURL
} from '../../../common/constVal'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    current: 'tab1',
    isLoading: false, //是否加载中
    caseList: [], //案件列表
    tip: '暂无数据',
    showLoad: false,
    page: 1,
    searchNo: "",
    isPic: false,
    picSrc: "",
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
    console.log(888888)
    wx.setNavigationBarTitle({
      title: '文书列表'
    })
    this.getList();
  },
  //打开文件  
  openFile(e) {
    let datas = e.currentTarget.dataset.dt;
    console.log(datas)
    let aryss = datas.path.split(".");
    let xar = aryss[aryss.length - 2].split("/");
    let types = aryss[aryss.length - 1];
    if (datas.path == "") {
      wx.showToast({
        icon: "none",
        title: '文件路径为空'
      })
    } else {
      // let urls = 'https://dq.hlcourt.gov.cn/' + datas.path;
      let urls = 'https://court1.ptnetwork001.com/' + datas.path;
      switch (types) {
        case 'pdf':
        case 'PDF':
        case 'xlsx':
        case 'XLSX':
        case 'xls':
        case 'XLS':
        case 'docx':
        case 'DOCX':
        case 'doc':
        case 'DOC':
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
          break;
        case 'jpg':
        case 'JPG':
        case 'png':
        case 'PNG':
        case 'jpeg':
        case 'GIF':
        case 'gif':
          this.setData({
            isPic: true,
            picSrc: urls,
          })
          break;
      }
    }
  },
  getList(caseNo, pageNumber) {
    let that = this;
    console.log(1111)
    that.setData({
      isLoading: true,
      tip: '加载中'
    })
    wxLitigantSendDiplomsList(app.globalData.nowMyCaseId, 15, this.data.page).then(res => {
      console.log(res.result)
      if (res.result) {
        that.setData({
          isLoading: false,
          tip: res.result.length < 10 ? "暂无数据" : "加载更多",
        })
        let caseList = that.data.caseList;
        res.result.map(item => {
          let data = {
            name: item.name,
            id: item.id,
            path: item.path,
          }
          caseList.push(data);
        })
        console.log(caseList)
        that.setData({
          caseList: caseList,
          tip: "暂无数据"
        })
      } else {
        that.setData({
          isLoading: false,
          tip: "暂无数据"
        })
      }
    }).catch(err => {
      that.setData({
        isLoading: false,
      })
    })
  },
  searchCaseNo() {
    this.setData({
      page: 1,
      caseList: [],
    })
    this.getList(this.data.searchNo)
  },
  getNo(e) {
    this.setData({
      searchNo: e.detail.value,
    })
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  loadingData: function () {
    var that = this;
    // 页数+1
    this.setData({
      page: that.data.page + 1,
    })
    // if (this.data.page > this.data.total){
    //   return false;
    // }
    // 显示加载图标
    this.setData({
      isLoading: true,
      tip: "加载中",
      showLoad: false,
    })

    this.getList(this.data.searchNo);
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
