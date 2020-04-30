const app = getApp();
import {
  IMGURL
} from '../../common/constVal'
const {
  $Toast
} = require('../../dist/base/index');
Page({
  data: {
    startPlay: false,
    userId: wx.getStorageSync('userId') || '',
    roomName: '',
    roomToken: '',
    current: 0, //当前步骤，从 0 开始计数
    // id_number: '350702199602288921',
    // name: '林玉琛',
    id_number: '',
    name: '',
    navbarData: {
      title: '人脸识别',
      height: app.globalData.height * 6 + 10
    },
    imgUrl: IMGURL
  },
  onLoad() {
    // console.log(app.globalData.flag)
    // if (app.globalData.flag) {//如果flag为true，退出  
    // console.log(9595)
    //   wx.navigateBack({   
    //     delta:1  
    //   }) 
    // } 
    wx.setNavigationBarTitle({
      title: '身份认证'
    })
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

  changeIdNumber(e) {
    this.setData({
      id_number: e.detail.detail.value
    })
  },
  changeName(e) {
    this.setData({
      name: e.detail.detail.value
    })
  },
  handleClick() {
    var app = getApp();
    app.globalData.id_number = this.data.id_number;
    app.globalData.name = this.data.name;
    //姓名校验
    if (!(/^[\u4E00-\u9FA5A-Za-z]+$/.test(this.data.name))) {
      $Toast({
        content: '姓名有误',
        type: 'warning'
      });

      return false;
    }
    //身份证校验
    var idcardReg = /^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$|^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X|x)$/;
    if (!(idcardReg.test(this.data.id_number))) {
      $Toast({
        content: '身份证号码有误',
        type: 'warning'
      });
      return false;
    }
    let that = this;

    wx.navigateTo({
      url: `/pages/second/second`,
      // url: `/pages/third/third`,
    })
  },
  bindGetUserInfo(res) {
    console.log(res);
    const app = getApp();
    if (res.detail.userInfo) {
      console.log("点击了同意授权");
      app.nowUserName = res.detail.userInfo.nickName;
      console.log(app.nowUserName);
      // wx.login({
      //   success: function (res) {
      //     console.log(res);
      //   }
      // })
      wx.navigateTo({
        url: `/pages/face/face`,
      })

    } else {
      console.log("点击了拒绝授权");
    }
  },
})
