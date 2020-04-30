import {
  getProtocolByCaseId
} from '../../../common/document';
import {
  IMGURL
} from '../../../common/constVal'

// caseId = 67e0dcf2186011e9b39a00163e0af9c6 & roomType=1
var app = getApp();
Page({
  data: {
    statusBarHeight: app.globalData.statusBarHeight, // 头部的自定义的高度
    topSeachBarBox: false, // 头部的搜索框显示隐藏
    caseType: 1, // 1表示已有文书选择 0表示添加文书
    startPlay: false,
    isLoading: false, //是否加载中
    caseList: [{
      sqCaseNo: "调解协议",
      selected: true,
    }], //案件列表
    tip: '暂无数据',
    roomName: '',
    roomToken: '',
    page: 1,
    total: 1,
    searchNo: '',
    showLoad: false,
    isLogin: app.globalData.isLogin,
    ducumentList: [],
    imgUrl: IMGURL
  },
  onShow() {

  },
  //下一步
  nextStep() {
    if (this.data.caseType === 1) {

      let flag = 0;
      this.data.ducumentList.map(item => {
        if (item.selected) {
          flag = 1;
        }
      })
      if (flag === 1) {
        wx.navigateTo({
          url: `/pages/ducumentManage/mediation/mediation`,
        })
      } else {
        wx.showToast({
          title: '请选择文书',
          icon: 'none',
        })
      }
    } else {
      wx.navigateTo({
        url: `/pages/ducumentManage/addMediation-index/addMediation-index`,
      })
    }


  },
  /**
   * 选择案件
   */
  selectCase(e) {
    let datas = e.currentTarget.dataset.dt;

    this.data.ducumentList.map(item => {
      if (item.id == datas.id) {
        item.selected = true;
      } else {
        item.selected = false;
      }
    })
    this.setData({
      ducumentList: this.data.ducumentList
    })
  },
  //获取列表
  getList(caseNo) {
    let that = this;
    getProtocolByCaseId(app.globalData.caseId).then(res => {
      console.log(res)
      let arr = [];
      if (res.protocolList) {
        res.protocolList.map(item => {
          item.selected = false;
          arr.push(item);
        })
      }


      this.setData({
        ducumentList: arr
      })
    })
  },
  send(e) {
    console.log(e.currentTarget.dataset.id)
    wx.navigateTo({
      url: `/pages/ducumentManage/sendEmail/sendEmail?dip=` + e.currentTarget.dataset.text + "&did=" + e.currentTarget.dataset.id,
    })
  },
  searchCaseNo() {
    this.setData({
      page: 1,
    })
    this.getList(this.data.searchNo)
  },
  getNo(e) {
    console.log(e)
    this.setData({
      searchNo: e.detail.value,
    })
  },
  // 顶部的搜索按钮
  searchBar() {
    this.setData({
      topSeachBarBox: true
    });
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  loadingData: function () {
    console.log("上拉触顶")
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
  // 选中标题
  handleChange() {
    if (this.data.caseType == 0) {
      this.setData({
        caseType: 1,
        page: 1,
      })
      this.getList();
    } else if (this.data.caseType == 1) {
      let arr = [{
        name: "调解协议",
        selected: true,
      }]
      this.setData({
        caseType: 0,
        page: 1,
        ducumentList: arr
      })
      // this.getList();
    }
    console.log(this.data.caseType)
  },
  handleTap() {
    this.setData({
      topSeachBarBox: false
    });
  },
  //回退
  back() {
    wx.navigateBack({
      delta: 1
    })
  },
  onLoad: function (options) {
    this.getList();
  },
  onLaunch: function () {
    this.setData({
      isLogin: app.globalData.isLogin
    })
  },
})
