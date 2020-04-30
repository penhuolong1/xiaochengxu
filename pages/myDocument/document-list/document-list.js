import {
  listDirType
} from '../../../common/book';
import {
  IMGURL
} from '../../../common/constVal'
import { baseUrl } from "../../../common/request.js"
// caseId = 67e0dcf2186011e9b39a00163e0af9c6 & roomType=1
var app = getApp();
Page({
  data: {
    baseUrl: baseUrl,
    statusBarHeight: app.globalData.statusBarHeight, // 头部的自定义的高度
    caseType: 1, // 1表示正在调解 0表示待调解
    startPlay: false,
    isLoading: false, //是否加载中
    tip: '暂无数据',
    userId: wx.getStorageSync('userId') || '',
    searchNo: '',
    showLoad: false,
    isLogin: app.globalData.isLogin,
    imgUrl: IMGURL,
    list: [],
  },
  

  /**
   * 选择案件
   */
  selectCase(e) {

  },
  //获取列表
  getList() {
    let that = this;
    listDirType({ tableId: app.globalData.caseId}).then(res => {
      console.log(res)
      for(let i in res.data){
        res.data[i].openFlag = false;
        for (let j in res.data[i].listFile){
          res.data[i].listFile[j].check = false;
        }
      }
      this.setData({
        list: res.data
      })
    })
  },
  // 展开目录
  openMenu(e){
    let index = e.currentTarget.dataset.index;
    this.data.list[index].openFlag = !this.data.list[index].openFlag;
    this.setData({
      list: [...this.data.list]
    })
  },
  // 选中文书
  checkBook(e){
    let index = e.currentTarget.dataset.index;
    let idx = e.currentTarget.dataset.idx;
    if (this.data.list[index].listFile[idx].signType == 1) return;
    this.data.list[index].listFile[idx].check = !this.data.list[index].listFile[idx].check;
    this.setData({
      list: [...this.data.list]
    })
  },
  //批量签署
  nextStep() {
    let list = this.data.list;
    let checkAry = []
    for(let i in list){
      for (let j in list[i].listFile){
        if (list[i].listFile[j].check){
          checkAry.push(list[i].listFile[j].id)
        }
      }
    }
    if (checkAry.length) {
      wx.navigateTo({
        url: `/pages/handWriting/handWriting?checkAry=${checkAry.join(',')}`,
      })
    } else {
      wx.showToast({
        title: '请选择文书',
        icon: 'none',
      })
    }
  },
  // 查看文书
  lookBook(e){
    wx.getSystemInfo({
      success: (res) => {
        if(res.system.indexOf('iOS') != -1){
          wx.navigateTo({
            url: `/pages/bookWeb/bookWeb?path=${e.currentTarget.dataset.path}`,
          })
        }else {
          wx.downloadFile({
            url: this.data.baseUrl + e.currentTarget.dataset.path,
            success: function (res) {
              const filePath = res.tempFilePath;
              wx.openDocument({
                filePath: filePath
              })
            }
          })
        }
      }
    })
  },
  //回退
  back() {
    wx.navigateBack({
      delta: 1
    })
  },
  onLoad: function (options) {
    this.getList();
    this.setData({
      userId: wx.getStorageSync('userId')
    })
  },
  onShow() {
    if (app.globalData.rePage){
      this.getList();
      app.globalData.rePage = null
    }
  },
  onLaunch: function () {
    this.setData({
      isLogin: app.globalData.isLogin
    })
  },
})
