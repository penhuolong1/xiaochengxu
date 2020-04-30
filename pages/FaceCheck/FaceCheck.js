// pages/FaceCheck/FaceCheck.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    canvasshow:true,
    noneNum: 0,   //全局检测人脸离开时间
    tips: "",  //提示语
    uploadPath: "",  //人证对比图片的路径
    base64:"",
    failTimes:0,  //认证失败次数
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    //屏幕宽度
    var sysInfo = wx.getSystemInfoSync()
    that.setData({
      windowWidth: sysInfo.windowWidth,
    })
    wx.setNavigationBarTitle({
      title: '人脸校验'
    })
    that.ctx = wx.createCameraContext()
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    wx.showLoading({
      title: '加载中...',
    })
    this.setTimesOut(10);
    this.interval = setInterval(this.takePhoto, 1000);
  },

  //人脸追踪
  takePhoto() {
    var that = this
    var takephonewidth
    var takephoneheight;
    var tempImagePath;
    let bases6Photo;
    that.ctx.takePhoto({
      quality: 'low',
      success: (res) => {

        this.setData({
          fileP: res.tempImagePath
        })
        // 获取图片真实宽高
        wx.getImageInfo({
          src: res.tempImagePath,
          success: function (res) {
            takephonewidth = res.width,
              takephoneheight = res.height
          }
        })
        wx.getFileSystemManager().readFile({
          filePath: res.tempImagePath, //选择图片返回的相对路径
          encoding: 'base64', //编码格式
          success: res => { //成功的回调
            tempImagePath = this.data.fileP,
            bases6Photo = 'data:image/png;base64,' + res.data,
            wx.uploadFile({
              url: "https://cloudapi.linkface.cn/face/face_detect",
              // url: "http://face.ptnetwork001.com/face/face_detect",
              filePath: tempImagePath,
              name: 'file',
              formData: {
                api_id: 'bac3cb6ac6ae49479b33910ce3d18978',
                // api_id: '',
                api_secret: "67da6a85740242da95cbc5c881da1b2d",
                // api_secret: "",
                auto_rotate: false,
              },
              // header: {
              //   'content-type': 'multipart/form-data'
              // },
              dataType: "json",
              success: function (res) {
                wx.hideLoading();
                var data = JSON.parse(res.data)
                if (data.status == 'NO_FACE_DETECTED'){
                  that.setData({
                    tips: "未检测到人脸"
                  })
                  // clearInterval(that.intervalTime)
                  if (that.data.noneNum == 0){
                    that.setTimesOut(10);
                  }
                } else if (data.status == 'OK'){
                  that.setData({
                    uploadPath: tempImagePath
                  })
                  // console.log(that.urlTobase64(tempImagePath));
                  if (that.data.tips == "未检测到人脸" || that.data.tips == ""){
                    that.setData({
                      tips: '识别中...',
                      noneNum:0,
                    })
                  }
                  if (that.data.base64 == ""){
                    that.setData({
                      base64: bases6Photo
                    })
                    that.setTimes(3);
                  }
                  
                  clearInterval(that.intervalTimeOut)

                  // var ctx = wx.createContext()
                  // ctx.setStrokeStyle('#31859c')
                  // ctx.lineWidth = 2
                  // // console.log('图片宽度' + takephonewidth)
                  // // console.log('屏幕宽度' + that.data.windowWidth)
                  // for (let j = 0; j < data.face_rect.length; j++) {

                  //   var cavansl = data.face_rect[j][0] / takephonewidth * takephonewidth
                  //   var cavanst = data.face_rect[j][1] / takephoneheight * 250
                  //   var cavansw = data.face_rect[j][2] / takephonewidth * takephonewidth
                  //   var cavansh = data.face_rect[j][3] / takephoneheight * 250
                  //   // console.log('left:' + cavansl)
                  //   // console.log('top:' + cavanst)
                  //   // console.log('width:' + cavansw)
                  //   // console.log('height:' + cavansh)
                  //   ctx.strokeRect(cavansl, cavanst, cavansw, cavansh)
                  // }
                  // wx.drawCanvas({
                  //   canvasId: 'canvas',
                  //   actions: ctx.getActions()
                  // })

                }else{
                  // var ctx = wx.createContext()
                  // ctx.setStrokeStyle('#31859c')
                  // ctx.lineWidth = 3
                  // wx.drawCanvas({
                  //   canvasId: 'canvas',
                  //   actions: ctx.getActions()
                  // })
                }
              },
            })

          }
        })
      },
      error: (err) => {
        console.log(err)
      }
    })
  },

  setTimes(num){
    let that = this;
    let base64s = this.data.base64;
    // clearInterval(this.interval)
    let sessionId = app.globalData.userInfo ? app.globalData.userInfo.sessionId : "";
    wx.request({
      // url: "https://court1.ptnetwork001.com/api/main/faceResult.jhtml",
      url: "https://dq.hlcourt.gov.cn/api/main/faceResult.jhtml",
      data: {
        base64: base64s,
      },
      method: 'POST',
      dataType: "json",
      header: {
        'content-type': 'application/json',
        'Cookie': 'JSESSIONID=' + sessionId,
      },
      success: function (res) {
        console.log(that.data.failTimes)
        if (res.data.state === 100){
          let data = JSON.parse(res.data.result)
          console.log(data)
          if (that.data.failTimes > 5){
            console.log(9999999999)
            that.setData({
              tips: '人脸验证失败！',
              // base64:""
            })
            setTimeout(function(){
              wx.navigateBack({ changed: true, })
            },1000)
          }else{
            if (data.confidence > 75) {
              that.setData({
                tips:'验证成功！'
              })
              setTimeout(function () {
                app.globalData.userInfo.isFace = false;
                wx.navigateTo({
                  url: `/pages/rtcList/rtcList`,
                })
              }, 1000)
              
            } else {
              console.log(22222)
              that.setData({
                failTimes: that.data.failTimes + 1,
                base64:"",
              })
              // that.interval = setInterval(that.takePhoto, 1000);
            }
          }
        }
      },
      fail:function(error){
        console.log(error)
        that.setData({
          base64: "",
        })
      }
    })
  },

  //检测人脸离开时间过长退回第一步
  setTimesOut(num) {
    var that = this;
    this.setData({
      noneNum: num
    })
    
    this.intervalTimeOut = setInterval(function () {
      let nus = that.data.noneNum - 1;
      that.setData({
        noneNum: nus,
      })
      if (nus == 0) {
        clearInterval(that.intervalTimeOut)
        clearInterval(that.interval)
        wx.navigateBack({ changed: true, })
      }
    }, 1000)
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    if (app.globalData.userInfo.isFace){

    }else{
      wx.reLaunch({
        url: '/pages/index/index',
      })
    }
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