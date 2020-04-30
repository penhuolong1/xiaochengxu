//app.js
import {
  IMGURL
} from './common/constVal.js'
App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    this.autoUpdate();
    //this.linkSocket();
  },
  autoUpdate: function () {
    console.log(new Date())
    var self = this
    // 获取小程序更新机制兼容
    if (wx.canIUse('getUpdateManager')) {
      const updateManager = wx.getUpdateManager()
      //1. 检查小程序是否有新版本发布
      updateManager.onCheckForUpdate(function (res) {
        // 请求完新版本信息的回调
        if (res.hasUpdate) {
          //2. 小程序有新版本，则静默下载新版本，做好更新准备
          updateManager.onUpdateReady(function () {
            console.log(new Date())
            wx.showModal({
              title: '更新提示',
              content: '新版本已经准备好，是否重启应用？',
              success: function (res) {
                if (res.confirm) {
                  //3. 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
                  updateManager.applyUpdate()
                } else if (res.cancel) {
                  //如果需要强制更新，则给出二次弹窗，如果不需要，则这里的代码都可以删掉了
                  wx.showModal({
                    title: '温馨提示~',
                    content: '本次版本更新涉及到新的功能添加，旧版本无法正常访问的哦~',
                    success: function (res) {
                      self.autoUpdate()
                      return;
                      //第二次提示后，强制更新                      
                      if (res.confirm) {
                        // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
                        updateManager.applyUpdate()

                      } else if (res.cancel) {
                        //重新回到版本更新提示                         
                        self.autoUpdate()
                      }
                    }
                  })
                }
              }
            })
          })
          updateManager.onUpdateFailed(function () {
            // 新的版本下载失败
            wx.showModal({
              title: '已经有新版本了哟~',
              content: '新版本已经上线啦~，请您删除当前小程序，重新搜索打开哟~',
            })
          })
        }
      })
    } else {
      // 如果希望用户在最新版本的客户端上体验您的小程序，可以这样子提示
      wx.showModal({
        title: '提示',
        content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
      })
    }
  },
  globalData: {
    http: "https://cstj.olcourt.cn/api/",
    http1: "https://cstj.olcourt.cn", //图片展示/文件等
    statusBarHeight: wx.getSystemInfoSync()['statusBarHeight'], // 头部的自定义的高度
    backPage: null, //返回的页面
    sessionId: null,
    roleType: 0, //1表示管理人员 0表示普通用户
    userInfo: null,
    id_number: '', //实名认证处的身份证号
    name: '', //实名认证处的名字
    acceptCaseObj: {
      caseId: "", //案件id
      step: 1
    }, //案件审核对象
    flag: false,
    isFace: false, //是否实名认证
    appid: '',
    //立案信息---开始-----
    setcaseInfo: {
      lawCaseId: "", //立案的案件id
      courtId: "", // 调解机构id
      courtName: "", // 调解机构名字
      identity: '', //身份信息
      roleType: null, //当事人类型（主要是添加申请人的时候）
      mediateRequest: "", // 诉讼请求
      applyStandard: "", //标的
      reason: "", // 事实与理由
      // 当事人信息
      litigant: {
        id: "",
        name: "",
        frontImage: "", //身份证正面
        backImage: "", // 身份证反面
      },
      //代理人
      lawyer: {
        agentType: "", //代理人类型
        frontImage: "", //身份证正面
        backImage: "", // 身份证反面
      },
      type: '1', //案件类型，1为民商案件，2为执行案件
      onlineBriefId: "", //案由id
      //当事人列表
      litigantInfoArr: [{
        onlineLitigantId: "", //当事人id
        fileType: 1, //当事人类型
        //身份证预览照片
        photoUrl1: `${IMGURL}/itentity1.png`,
        photoUrl2: `${IMGURL}/itentity2.png`,
        photoUrl3: `${IMGURL}/itentity3.png`,
        name: "", //姓名
        identityCard: "", //身份证号码
        nation: "", //民族
        address: "", //户籍地址
      }]
    },
    nowLitigantId: "", //立案当前选中当事人的id
    nowLawyerId: "", //立案当前选择的律师的id
    legalImg: "",
    //立案信息 ---结束-----
    //我的案件---开始----
    nowMyCaseId: "67e15461186011e9b39a00163e0af9c6", //当前选中案件id
    nowEvidenceId: "", //证据id
    setPhone: "", //手机号
    //我的案件---结束----
    //注册信息----开始----
    identity: "", //身份信息
    LawyerState: "", //代理人身份
    phoneNumber: "", //手机号
    //注册信息----结束----
    signUrl: "", //签名webview路径
    secret: '',
    hasFaceCheck: false,
    openid: '',
    token: '',
    caseId: "",
    caseNo: "",
    height: 0,
    username: "",
    roomId: "", //一键报警警方收到的房间id
    //websocket
    isNeedCloase: false,
    ipw: "wss://cstj.olcourt.cn/api/web/webSocket.jhtml", //服务器网址
    limit: 0,
    timeout: 10000,
    timeoutObj: null,
    serverTimeoutObj: null,
    loginInfo: null, //登陆信息
    chatFile: [], // 聊天文件
    loginId: ''
  },
  //建立websocket连接
  linkSocket() {
    var that = this
    wx.connectSocket({
      url: that.globalData.ipw,
      header: {
        'content-type': 'application/json',
        'Cookie': 'JSESSIONID=' + that.globalData.sessionId,
      },
      success() {
        that.initEventHandle()
      }
    })
  },

  //绑定事件
  initEventHandle() {
    var that = this
    wx.onSocketMessage((res) => {
      if (res.data == "pong") {
        that.reset()
        that.start()
      } else {
        if (!that.globalData.isNeedCloase) {
          console.log('test')
          that.globalData.callback(res)
        }
      }
    })
    wx.onSocketOpen(() => {
      console.log('WebSocket连接打开')
      that.reset()
      that.start()
    })
    wx.onSocketError((res) => {
      console.log('WebSocket连接打开失败')
      that.reconnect()
    })
    wx.onSocketClose((res) => {
      console.log('WebSocket 已关闭！')
      that.reconnect()
    })
  },
  //重新连接
  reconnect() {
    var that = this;
    console.log('--重新连接--')
    if (this.globalData.userInfo == null || that.globalData.isNeedCloase) {
      wx.closeSocket();
      return false;
    }
    if (that.lockReconnect) return;
    that.lockReconnect = true;
    clearTimeout(that.timer)
    if (that.globalData.limit < 10) { //连接10次后不再重新连接
      that.timer = setTimeout(() => {
        that.linkSocket();
        that.lockReconnect = false;
        console.log("次数:" + that.globalData.limit)
      }, 5000); //每隔5秒连接一次
      that.globalData.limit = that.globalData.limit + 1
    }
  },

  //心跳包开始
  reset: function () {
    var that = this;
    clearTimeout(that.globalData.timeoutObj);
    clearTimeout(that.globalData.serverTimeoutObj);
    return that;
  },

  start: function () {
    var that = this;
    var randomNum = that.randomWord(false, 16); //生成随机码
    that.globalData.timeoutObj = setTimeout(() => {
      console.log("发送ping");
      if (that.globalData.userInfo == null || that.globalData.isNeedCloase) {
        wx.onSocketClose()
        return false;
      }
      wx.sendSocketMessage({
        data: randomNum + "ping",
        success() {
          console.log("发送ping成功");
        }
      });
      // that.globalData.serverTimeoutObj = setTimeout(() => {
      //   wx.closeSocket();
      // }, that.globalData.timeout);
    }, that.globalData.timeout);
  },
  //心跳包结束
  //创建随机数，服务器用来存储是哪个小程序的心跳包的key，由于本案逻辑需要与其它信息存储的key分开，如果逻辑不需要，可以不进行分离，自定义存储的key
  randomWord: function (randomFlag, min, max) {
    var str = "",
      range = min,
      arr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
    // 随机产生
    if (randomFlag) {
      range = Math.round(Math.random() * (max - min)) + min;
    }
    for (var i = 0; i < range; i++) {
      var pos = Math.round(Math.random() * (arr.length - 1));
      str += arr[pos];
    }
    return str;
  },
  watch: function (method) {
    let that = this;
    var obj = this.globalData;
    Object.defineProperty(obj, "userInfo", {
      configurable: true,
      enumerable: true,
      set: function (value) {
        this._name = value;
        // that.getSetting();
        method(value);
      },
      get: function () {
        // 可以在这里打印一些东西，然后在其他界面调用getApp().globalData.sessionId的时候，这里就会执行。
        return this._name
      }
    })
  },
})
