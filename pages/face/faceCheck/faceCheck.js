const app = getApp();
const { $Toast } = require('../../../dist/base/index');
Page({
  data: {
    startPlay: false,
    userId: wx.getStorageSync('userId') || '',
    roomName: '',
    roomToken: '',
    current: 0, //当前步骤，从 0 开始计数
    id_number: '',
    name: '',
    navbarData: {
      title: '视频录制',
      height: app.globalData.height * 6 + 10
    },
  },
  onLoad() {
    // console.log(app.globalData.flag)
    // if (app.globalData.flag) {//如果flag为true，退出  
    // console.log(9595)
    //   wx.navigateBack({   
    //     delta:1  
    //   }) 
    // } 
    // 获取权限
    wx.getSetting({
      success: res => {
        if (!res.authSetting['scope.camera']) {     //获取摄像头权限
          wx.authorize({
            scope: 'scope.camera',
            success() {
              console.log('授权成功')
            }, fail() {
              wx.showModal({
                title: '提示',
                content: '尚未进行授权，部分功能将无法使用',
                showCancel: false,
                success(res) {
                  console.log(res)
                  if (res.confirm) {
                    console.log('用户点击确定')
                    wx.openSetting({      //这里的方法是调到一个添加权限的页面，可以自己尝试
                      success: (res) => {
                        if (!res.authSetting['scope.camera']) {
                          wx.authorize({
                            scope: 'scope.camera',
                            success() {
                              console.log('授权成功')
                            }, fail() {
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
        if (!res.authSetting['scope.record']) {     //获取录音权限
          wx.authorize({
            scope: 'scope.record',
            success() {
              console.log('授权成功')
            }, fail() {
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
                            }, fail() {
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
  // 提交
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
    if (!(/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(this.data.id_number))) {
      $Toast({
        content: '身份证号码有误',
        type: 'warning'
      });
      return false;
    }
    let that = this;
    console.log('000')
    wx.startFacialRecognitionVerify({
      name: that.data.name,
      idCardNumber: that.data.id_number,
      checkAliveType: 1,
      success(res) {
        console.log(res)
        app.globalData.flag = true;
        wx.showToast({
          title: '认证成功',
          icon: 'success',
          duration: 1500
        })
        setTimeout(function () {
          wx.redirectTo({
            url: `/pages/face/compete/compete`,
          })
        }, 1000)
        
      },
      fail(res) {
        console.log(res)
      }
    })
  },
  
})
