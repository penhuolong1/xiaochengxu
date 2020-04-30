import {
  intoRoom,
  selectCase
} from '../../common/rtc';
import {
  intoTalkRoom
} from '../../common/case'
import {
  IMGURL
} from '../../common/constVal'

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
    this.getList();
    app.globalData.isNeedCloase = true;
    // this.setData({ userId: wx.getStorageSync('userId') })
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
      this.setData({
        caseType: 0,
        page: 1,
      })
      this.getList();
    }
    console.log(this.data.caseType)
  },
  /**
   * 进入房间
   */
  entryRoom(e) {
    console.log(app.globalData.roleType)
    let datas = e.currentTarget.dataset.dt;
    if (datas.process == 5 || app.globalData.roleType == 2) {
      app.globalData.caseNo = datas.sqCaseNo;
      app.globalData.caseId = datas.lawCaseId;
      intoTalkRoom({
        caseId: app.globalData.caseId,
        type: 0
      })
      // intoRoom(datas.lawCaseId).then(res => {
      //   if (res.state == 100) {
      //     app.roomToken = res.result
      //     wx.navigateTo({
      //       url: `/pages/rtcRoom/rtcRoom`,
      //     })
      //   } else {
      //     wx.showToast({
      //       title: '网络错误',
      //       icon: 'none',
      //       duration: 2000
      //     })
      //     return;
      //   }
      // })
      wx.navigateTo({
        url: `/pages/chat/chat`,
      })

    } else {
      return false;
    }
  },
  getList(caseNo) {
    let that = this;
    let CaseName = caseNo ? caseNo : "";
    let process = this.data.caseType === 1 ? 5 : 4;
    selectCase(CaseName, process, this.data.page, "", 15).then(res => {
      console.log(res)
      let arr = [];
      if (res.state == 100) {
        if (caseNo || caseNo != '') {
          if (this.data.page > 1) {
            arr = that.data.caseList;
          }
        } else {
          arr = that.data.caseList;
        }

        for (let i = 0; i < res.result.content.length; i++) {
          arr.push(res.result.content[i])
        }
        that.setData({
          isLoading: false,
          tip: '暂无数据',
          total: res.result.totalPages,
          caseList: arr,
          showLoad: true,
        })
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

    // 获取权限
    wx.getSetting({
      success: res => {
        if (!res.authSetting['scope.camera']) { //获取摄像头权限
          wx.authorize({
            scope: 'scope.camera',
            success() {
              console.log('授权成功')
            },
            fail() {
              wx.showModal({
                title: '提示',
                content: '尚未进行授权，部分功能将无法使用',
                showCancel: false,
                success(res) {
                  console.log(res)
                  if (res.confirm) {
                    console.log('用户点击确定')
                    wx.openSetting({ //这里的方法是调到一个添加权限的页面，可以自己尝试
                      success: (res) => {
                        if (!res.authSetting['scope.camera']) {
                          wx.authorize({
                            scope: 'scope.camera',
                            success() {
                              console.log('授权成功')
                            },
                            fail() {
                              console.log('用户点击取消')
                            }
                          })
                        }
                      },
                      fail: function () {
                        console.log("授权设置录音失败");
                      }
                    })

                  } else if (res.cancel) {
                    console.log('用户点击取消')
                  }
                }
              })
            }
          })
        };
        if (!res.authSetting['scope.record']) { //获取录音权限
          wx.authorize({
            scope: 'scope.record',
            success() {
              console.log('授权成功')
            },
            fail() {
              wx.showModal({
                title: '提示',
                content: '尚未进行授权，部分功能将无法使用',
                showCancel: false,
                success(res) {
                  if (res.confirm) {
                    wx.openSetting({
                      success: (res) => {
                        if (!res.authSetting['scope.record']) {
                          wx.authorize({
                            scope: 'scope.record',
                            success() {
                              console.log('授权成功')
                            },
                            fail() {
                              console.log('用户点击取消')
                            }
                          })
                        }
                      },
                      fail: function () {
                        console.log("授权设置录音失败");
                      }
                    })
                  } else if (res.cancel) {
                    console.log('用户点击取消')
                  }
                }
              })
            }
          })
        }
      }
    })
  },
  onLaunch: function () {
    this.setData({
      isLogin: app.globalData.isLogin
    })
  },
})
