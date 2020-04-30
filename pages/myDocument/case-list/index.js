import {
  listMediateTable,
  listTableLit
} from '../../../common/book';
import {
  IMGURL
} from '../../../common/constVal'
// caseId = 67e0dcf2186011e9b39a00163e0af9c6 & roomType=1
var app = getApp();
Page({
  data: {
    statusBarHeight: app.globalData.statusBarHeight, // 头部的自定义的高度
    topSeachBarBox: false, // 头部的搜索框显示隐藏
    caseType: 1, // 1表示正在调解 0表示待调解
    startPlay: false,
    isLoading: false, //是否加载中
    caseList: [], //案件列表
    tip: '暂无数据',
    userId: wx.getStorageSync('userId') || '',
    roomName: '',
    roomToken: '',
    page: 1,
    total: 1,
    searchNo: '',
    showLoad: false,
    isLogin: app.globalData.isLogin,
    imgUrl: IMGURL
  },
  onShow() {
    this.setData({
      userId: wx.getStorageSync('userId')
    })
  },
  //下一步
  nextStep() {
    let flag = 0;
    this.data.caseList.map(item => {
      if (item.selected) {
        flag = 1;
        app.globalData.caseId = item.id;
      }
    })
    if (flag === 1) {
      wx.navigateTo({
        url: `/pages/myDocument/document-list/document-list`,
      })
    } else {
      wx.showToast({
        title: '请选择案件',
        icon: 'none',
      })
    }
  },
  /**
   * 选择案件
   */
  selectCase(e) {
    let datas = e.currentTarget.dataset.dt;

    this.data.caseList.map(item => {
      if (item.id == datas.id) {
        item.selected = true;
      } else {
        item.selected = false;
      }
    })
    this.setData({
      caseList: this.data.caseList
    })
  },
  //获取列表
  getList(caseNo) {
    let data = {
      type: "",
      sqCaseNo: caseNo ? caseNo : "",
      archiveNo: caseNo ? caseNo : "",
      pageNumber: this.data.page,
      pageSize: 10,
    }
    let getApi;
    if (app.globalData.roleType == 0) {
      getApi = listTableLit;
    } else {
      getApi = listMediateTable;
    }
    getApi(data).then(res => {
      console.log(res)
      let arr = [];
      if (res.state == 100) {
        for (let i = 0; i < res.data.content.length; i++) {
          res.data.content[i].selected = false;
        }
        if (this.data.page == 1){
          arr = res.data.content;
        }else{
          arr = [...this.data.caseList, ...res.data.content]
        }    
        this.setData({
          isLoading: false,
          tip: '暂无数据',
          total: res.data.totalPages,
          caseList: arr,
          showLoad: true,
        })
        if (arr.length < 10) {
          this.setData({
            tip: '暂无数据',
            showLoad: false,
          })
        }
      }
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
    if (this.data.page > this.data.total) {
      return false;
    }
    // 显示加载图标
    this.setData({
      isLoading: true,
      tip: "加载中",
      showLoad: false,
    })

    this.getList(this.data.searchNo);
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
