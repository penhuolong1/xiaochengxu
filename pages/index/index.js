 const app = getApp();
 // const { $Toast } = require('../../dist/base/index');
 var util = require('../../common/utils.js')
 import {
   IMGURL
 } from '../../common/constVal'
 import {
   selectCase
 } from '../../common/case';
 import {
   getNotice
 } from '../../common/message';
 var SocketTask;
 //触屏开始点坐标
 var startDot = {
   X: 0,
   Y: 0
 };
 //触屏到点坐标
 var touchDot = {
   X: 0,
   Y: 0
 };
 var time = 0; //触屏时间
 var number; //定时器ID
 Page({
   data: {
     logShow: false, //报警模态框显示
     statusBarHeight: app.globalData.statusBarHeight, // 头部的自定义的高度
     topSeachBarBox: false, // 头部的搜索框显示隐藏
     logining: true, //是否已经登录
     isAttest: false, //是否认证过
     isAttestModal: false, //认证提示框
     userInfoName: "请登录",
     isHaveNews: false,
     roleType: 'averageUser', //登录的角色 caseStaff案管人员 averageUser当事人
     // 当事人首页
     averageUser: [{
         'logo': `${IMGURL}/home-icon/apply-for.png`,
         'name': '调解申请',
         'url': '../setcase/steps-one/steps-one'

       },
       {
         'logo': `${IMGURL}/home-icon/my-mediation.png`,
         'name': '我的调解',
         'url': '../mycase/index/index'
       },
       {
         'logo': `${IMGURL}/home-icon/video-mediation.png`,
         'name': '视频调解',
         'url': '../rtcList/rtcList'
       },
       {
         'logo': `${IMGURL}/home-icon/my-documents.png`,
         'name': '我的文书',
         'url': '../myDocument/case-list/index'
        //  'url': '../myDocument/document-list/document-list'
       },
       {
         'logo': `${IMGURL}/home-icon/judicial-confirmation.png`,
         'name': '司法确认',
         'url': '#'
       },
       {
         'logo': `${IMGURL}/home-icon/law-queries.png`,
         'name': '法律查询',
         'url': '#'
       }
     ],
     // 案管人员首页
     caseStaff: [
      //  {
      //    'logo': '{{IMGURL}}/home-icon/apply-for.png',
      //    'name': '调解申请',
      //    'url': '../setcase/steps-one/steps-one'

      //  },
       {
         'logo': `${IMGURL}/home-icon/accept-case.png`,
         'name': '调解申请受理',
         'url': '../acceptCase/acceptCase'
       },
       {
         'logo': `${IMGURL}/home-icon/case-management.png`,
         'name': '案件管理',
         'url': '../caseList/caseList'
       },
       {
         'logo': `${IMGURL}/home-icon/video-mediation.png`,
         'name': '视频调解',
         'url': '../rtcList/rtcList'
       },
      //  {
      //    'logo': `${IMGURL}/home-icon/documents-management.png`,
      //    'name': '文书管理',
      //    'url': '../ducumentManage/caseList/caseList'
      //  },
       {
         'logo': `${IMGURL}/home-icon/my-documents.png`,
         'name': '我的文书',
         'url': '../myDocument/case-list/index'
       },
       {
         'logo': `${IMGURL}/home-icon/judicial-confirmation.png`,
         'name': '司法确认',
         'url': '#'
       }
     ],
     imgUrl: IMGURL
   },
   onLoad() {

   },
   // 初始化数据
   onShow() {
     console.log(app.globalData.roleType)
     if (app.globalData.roleType == 0) {
       this.setData({
         roleType: "averageUser",
       })
     } else {
       this.setData({
         roleType: "caseStaff",
       })
     }
     this.setData({
       topSeachBarBox: false
     });
     if (app.globalData.userInfo == null) {
       this.setData({
         logining: false,
         userInfoName: "请登录"
       })
     } else {
       app.globalData.isNeedCloase = false;
       app.linkSocket();
       this.getNote();
       this.setData({
         logShow: false,
         logining: true,
         userInfoName: app.globalData.userInfo ? "欢迎，" + app.globalData.userInfo.name : "",
         isAttest: app.globalData.userInfo && app.globalData.userInfo.certification ? app.globalData.userInfo.certification : false,
       })

     }
     let that = this;
     app.globalData.callback = function (res) { //接收服务器发来的非心跳包数据
       /**
        *里面写收到服务器发来的非心跳包数据，根据业务需求做后续逻辑处理
        */
       console.log(res)
       var onMessage_data = JSON.parse(res.data);
       console.log(onMessage_data)
       if (onMessage_data.room) {
         app.globalData.roomId = onMessage_data.room;
         wx.vibrateLong();
         that.setData({
           logShow: true,
         });
       }
     }
   },
   exampless: function () { //根据业务需求自己定义名称，此处为举例
     wx.sendSocketMessage({
       data: "要向服务器发送的数据",
     })
   },
   // -------------------------左右滑动切换页面开始--------------------------
   /**
    * 触屏开始计时和获取坐标
    */
   touchstart(event) {
     startDot.X = event.touches[0].pageX;
     startDot.Y = event.touches[0].pageY;
     number = setInterval(function () {
       time++;
     }, 100);
   },
   /**
    * 判断滑动距离和时间是否需要切换页面
    */
   touchmove(event) {
     touchDot.X = event.touches[0].pageX;
     touchDot.Y = event.touches[0].pageY;
     //向左滑处理
     if ((startDot.X - touchDot.X) > 200 && (startDot.Y - touchDot.Y) < 150 && time < 3 && time > 0.1) {
       wx.navigateTo({
         url: "/pages/message/message",
       })
       clearInterval(number);
       time = 0;
     }
   },
   /**
    * 结束触屏重置计时
    */
   touchend() {
     clearInterval(number);
     time = 0;
   },
   // -------------------------左右滑动切换页面结束--------------------------
   // 顶部的搜索按钮
   searchBar() {
     this.setData({
       topSeachBarBox: true
     });
   },
   // tab跳转页面
   changeTabUrl(e) {
     if (e.currentTarget.dataset.text == '消息') {
       wx.redirectTo({
         url: "/pages/message/message",
       })
     } else if (e.currentTarget.dataset.text == '我的') {
       wx.navigateTo({
         url: "/pages/user/user",
       })
     }
   },
   //-------------------------------------菜单点击--------------------------
   selectMenu(e) {
     let toPage = e.currentTarget.dataset['item'];
     if (app.globalData.userInfo == null) {
       wx.navigateTo({
         url: "/pages/selectLogin/selectLogin",
       })
     } else {
       if (app.globalData.roleType == 0 && !app.globalData.userInfo.certification) {
         this.setData({
           isAttestModal: true
         });
       } else {
         if (toPage.name == '调解申请') {
           this.selectCase()
         } else {
           wx.navigateTo({
             url: toPage.url
           })
         }
       }
     }
   },
   // 查询草稿箱是否有案件  有则去草稿箱 无则调解须知
   selectCase() {
     let data = {
       pageNumber: 1,
       pageSize: 8,
       process: 0
     }
     selectCase(data).then(res => {
       if (res.state == 100) {
         if (res.result.content.length > 0) {
           wx.navigateTo({
             url: '/pages/setcase/drafts/drafts'
           })
         } else {
           wx.navigateTo({
             url: "/pages/setcase/setNotice/setNotice"
           })
         }
       }
     })
   },
   // 认证模态框的方法
   certification(e) {
     if (e.currentTarget.dataset.text == 'yes') {
       wx.navigateTo({
         url: `/pages/one/one`,
       })
     } else if (e.currentTarget.dataset.text == 'no') {
       this.setData({
         isAttestModal: false
       });
     }
   },
   getNote() {
     getNotice(1, 15, 0).then(res => {
       if (res.content && res.content.length > 0) {
         this.setData({
           isHaveNews: true,
         })
       } else {
         this.setData({
           isHaveNews: false,
         })
       }
     })
   },
   onHide() {
     wx.closeSocket();

   },
   /**
    * 模态框按钮操作
    */
   getInRoom() {
     let that = this;
     util.getInRoom(that)
   },
   close() {
     let that = this;
     util.cloaseAlarm(that)
   },
   watchBack: function (userInfo) {
     if (userInfo) {
       this.setData({
         logining: true,
         userInfoName: app.globalData.userInfo.name,
         isAttest: app.globalData.userInfo.certification,
       })
     }
   }
 })
