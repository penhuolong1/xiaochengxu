// pages/user/user.js
const app = getApp();
var util = require('../../common/utils.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    roleType:'',// 登录的角色类型
    isAttest:false, //是否认证过
    isAttestModal: false,
    userInfoName:"请登录",
    isLoginOut:true,
    //----登录数据----
    showpass: true,  //密码是否显示
    username: "",  //用户名
    password: "",  //密码
    isSel: false,  //登录人类型是否选中
    type: 1, //类型
    buttonTxt: '认证'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (app.globalData.userInfo == null) {
    //  wx.reLaunch({
    //    url: '/pages/index/index',
    //  })
     this.setData({
       isLoginOut:true,
     })
    } else {
      this.setData({
        logining: true,
        isLoginOut: false,
        userInfoName: app.globalData.userInfo ? app.globalData.userInfo.name : "",
        isAttest: app.globalData.userInfo&&app.globalData.userInfo.certification ? app.globalData.userInfo.certification : false,
      })
    }
    this.setData({
      roleType: app.globalData.roleType
    })
    // getApp().watch(this.watchBack)
  },
  //人脸认证
  getFace() {
    wx.navigateTo({
      url: `/pages/face/faceCheck/faceCheck`,
    })
  },
  // 去往哪个页面
  changeUrl(e){
    if (app.globalData.userInfo == null){
      wx.navigateTo({
        url: "/pages/selectLogin/selectLogin",
      })
      return false;
    }
    console.log(e.currentTarget.dataset.text)
    if(e.currentTarget.dataset.text== '我的调解') {
      wx.navigateTo({
        url: "/pages/mycase/index/index",
      })
    } else if(e.currentTarget.dataset.text=='个人信息') {
      
    } else if(e.currentTarget.dataset.text=='设置') {
      wx.navigateTo({
        url: "/pages/control/control",
      })
    }
    // if (app.globalData.userInfo == null) {
    //   this.setData({
    //     logShow: true
    //   })
    // } else {
    //   wx.navigateTo({
    //     url: "/pages/mycase/index/index",
    //   })
    // }
    
  },
  goRegister() {
    console.log(111111)
    wx.navigateTo({
      url: "/pages/register/index/index",
    })
  },
  logins(){
    this.setData({
      logShow: true
    })
  },
  submit(e){
    console.log(e.target.dataset.text)
    if(e.target.dataset.text=='认证') {
      this.setData({
        isAttestModal: true
      })
      // wx.navigateTo({
      //   url: `/pages/face/faceCheck/faceCheck`,
      // })
    }else if(e.target.dataset.text=='注销'){
      this.setData({
        buttonTxt: '认证',
        isAttest: false
      })
    }
    // app.globalData.userInfo = null;
    // this.onLoad();
    // wx.reLaunch({
    //   url: '/pages/index/index',
    // })
  },
  // 认证的模态框里面的方法
  certification(e) {
    console.log(e.currentTarget.dataset.text)
    if(e.currentTarget.dataset.text == 'yes'){
      wx.navigateTo({
        url: `/pages/one/one`,
      })
    }else if(e.currentTarget.dataset.text == 'no') {
      this.setData({
        isAttestModal: false
      });
    }
  },
  quit(){
    console.log(56666)
    app.globalData.userInfo = null;
    app.globalData.roleType = 0;
    wx.closeSocket();
    wx.reLaunch({
      url: `/pages/index/index`,
    })
  },
  /**
   * 登录模态框操作 -- 开始---
   */
  //关闭登录框
  close() {
    var that = this;
    util.close(that)
  },
  //切换密码是否可见
  switchEye() {
    var that = this;
    util.switchEye(that, that.data.eye, that.data.showpass)
  },
  //获取密码
  getPassWord: function (e) {
    var that = this;
    var password = e.detail.value;
    util.getPassWord(that, password)
  },
  //获取账号
  getUsername(e) {
    var that = this;
    var username = e.detail.value;
    util.getUsername(that, username)
  },
  //登录
  loginSubmit() {
    var that = this;
    util.loginSubmit(that, that.data.username, that.data.password, that.data.type)

  },
  changeType(e) {
    var that = this;
    var loginType = e.detail.value;
    util.changeType(that, that.data.isSel, loginType)
  },
  /**
   * 登录模态框操作 -- 结束---
   */
  watchBack: function (userInfo) {
    // this.setData({
    //   sessionId: sessionId
    // })
    if (userInfo) {
      this.close();
      this.onLoad()
      // wx.navigateTo({
      //   url: `/pages/user/user`,
      // })
    }
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
    // wx.navigateBack({ delta: 99, changed: true, })
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