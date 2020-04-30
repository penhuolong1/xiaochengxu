import {
  RoomSession,
  version
} from 'pili-rtc-wxapp'
import {
  verifyRoomId,
  verifyUserId
} from '../../common/utils';
import {
  HZRecorder
} from '../../common/recorder-worker';
import {
  getPoliceUserDetail,
  closePoliceRoom
} from '../../common/alarm';
import {
  getToken,
  getLawCaseInfo,
  getEviByCaseId,
  userDetail,
  createImg
} from '../../common/api';
import {
  IMGURL
} from '../../common/constVal'
var SocketTask;
var socketOpen = false
var app = getApp();
const recorderManager = wx.getRecorderManager();
Page({

  data: {
    caseNo: "",
    showRight1: false,
    token: '',
    nowUserName: "",
    mic: true,
    caseInfo: {},
    volume: true,
    camera: true,
    rec: {},
    beauty: 0,
    publishPath: undefined,
    subscribeList: [],
    subscribeList2: [],
    messageList: [],
    evidenceList: [],
    isPic: false,
    picSrc: "",
    debug: false,
    topClass: "item top containerss right-container",
    playClass: "col-12 row-6 overf",
    bottomClass: "containerss bottom",
    bottomClassOne: "containerss row",
    bottomClassTwo: "detail nonde",
    isTop: false,
    nowTabs: "",
    tabValue1: false,
    tabValue2: true,
    tabValue3: true,
    nowsss: "原告",
    xiangqingClass: "ft-div",
    yuyingClass: "ft-div",
    zhengjuClass: "ft-div",
    scrollTop: 0,
    // 触摸开始时间
    touchStartTime: 0,
    // 触摸结束时间
    touchEndTime: 0,
    //录音文件路径
    temFiles: "",
    testOP: "",
    isClose: false,
    imgUrl: IMGURL
  },
  //长按事件
  // onSpeech(e) {
  //   console.log(111)
  //   this.data.touchStartTime = e.timeStamp;
  //   // this.speechStart()
  //   let cls = this.data.yuyingClass + ' ' + 'onpresssing';
  //   this.setData({
  //     yuyingClass: cls,
  //   })
  // },
  // //长按离开事件
  // sendVoice(e) {
  //   let clsd = this.data.yuyingClass;
  //   clsd = clsd.replace(" onpresssing", "");
  //   this.setData({
  //     yuyingClass: clsd,
  //   })
  //   console.log(this.data.touchStartTime)
  //   this.data.touchEndTime = e.timeStamp;
  //   console.log(this.data.touchEndTime)
  //   this.speechEnd();
  // },
  // /** 录音开始 */
  // speechStart(e, that) {
  //   let thay = this;


  //   const option = {
  //     duration: 6000000, //指定录音的时长，单位 ms
  //     sampleRate: 16000, //采样率
  //     numberOfChannels: 1, //录音通道数
  //     encodeBitRate: 24000, //编码码率
  //     format: 'mp3', //音频格式，有效值 aac/mp3
  //     frameSize: 15, //指定帧大小，单位 KB
  //   }
  //   recorderManager.start(option);
  //   console.log('录音开始---')
  //   recorderManager.onStop((res) => {
  //     console.log('recorder stop', res)
  //     const { tempFilePath } = res
  //     this.data.temFiles = res.tempFilePath;
  //     let data = {
  //       // type: res.fileSize,
  //       type: 'mp3'
  //     }
  //     if (!this.data.isClose){
  //       setTimeout(function(){
  //         thay.speechStart();
  //       },200)
  //     }
  //     // sendSocketMessage(data)

  //   })
  //   recorderManager.onFrameRecorded((res) => {
  //     console.log(858585858)
  //     // sendSocketMessage(res.frameBuffer)
  //     // let rec = this.encodeWAV(res.frameBuffer);
  //     // console.log(res.frameBuffer)
  //     // console.log(rec)
  //     sendSocketMessage(res.frameBuffer)

  //   })
  //   recorderManager.onInterruptionEnd((res) => {
  //     console.log(6666666666668)
  //     console.log(res)
  //     if (!this.data.isClose) {
  //       setTimeout(function () {
  //         thay.speechStart();
  //       }, 200)
  //     }
  //   })
  //   recorderManager.onError((res) => {
  //     console.log(777777778)
  //     console.log(res)
  //     if (res.errCode == 6){
  //       if (!this.data.isClose) {
  //         setTimeout(function () {
  //           thay.speechStart();
  //         }, 200)
  //       }
  //     }

  //   })
  //   // if (!this.data.isClose) {
  //   //   setTimeout(function () {
  //   //     thay.speechStart();
  //   //   }, 200)
  //   // }
  // },

  // /** 录音结束 */
  // speechEnd() {
  //   const recorderManager = wx.getRecorderManager();
  //   recorderManager.stop();

  // },
  onLoad(query) {
    const app = getApp();

    const appid = query.appid || app.appid
    // const userid = query.userId || wx.getStorageSync('userId')
    const room = query.room
    this.pushContext = wx.createLivePusherContext()
    wx.showToast({
      title: '加入房间中',
      icon: 'loading',
      mask: true,
    })
    this.setData({
      caseNo: app.globalData.caseNo
    })
    // this.getCaseInfo();
    // this.getEvidence();

  },
  onReady() {
    const app = getApp();
    if (app.roomToken) {
      this.initRoomWithToken(app.roomToken)
      // this.webSocket_open();
      return
    }
  },
  // // 创建websocket
  // webSocket_open: function () {
  //   var that = this;
  //   // 创建Socket
  //   SocketTask = wx.connectSocket({
  //     url: `wss://dq.hlcourt.gov.cn/api/voice/ws.jhtml`,
  //     header: {
  //       'content-type': 'application/json',
  //       'Cookie': 'JSESSIONID=' + app.globalData.userInfo.sessionId,
  //     },
  //     method: 'POST',
  //     success: function (res) {
  //       console.log('WebSocket连接创建', res)

  //     },
  //     fail: function (err) {
  //       wx.showToast({
  //         title: '网络异常！',
  //       })
  //       console.log(err)
  //     },
  //   })
  //   that.initSocket();
  // },
  // socket监听事件
  // initSocket: function () {
  //   var that = this;
  //   SocketTask.onOpen(res => {
  //     socketOpen = true;
  //     console.log('监听 WebSocket 连接打开事件。', res)
  //   })
  //   SocketTask.onClose(onClose => {

  //     console.log('监听 WebSocket 连接关闭事件。', onClose)
  //     SocketTask = false;
  //     socketOpen = false;
  //     if (!this.data.isClose) {
  //       this.webSocket_open();
  //     }
  //   })
  //   SocketTask.onError(onError => {
  //     console.log('监听 WebSocket 错误。错误信息', onError)
  //   })
  //   //接收消息
  //   SocketTask.onMessage(onMessage => {
  //     var onMessage_data = JSON.parse(onMessage.data);
  //     console.log("收到消息:", onMessage_data);

  //     if (onMessage_data.type === 0){
  //       if (that.data.messageList.length > 0) {
  //         if (onMessage_data.name == that.data.messageList[that.data.messageList.length - 1].name){
  //           that.data.messageList[that.data.messageList.length - 1].content = that.data.messageList[that.data.messageList.length - 1].content + '  ' + onMessage_data.content;
  //         }else{
  //           that.data.messageList.push(onMessage_data)
  //         }
  //       }else{
  //         that.data.messageList.push(onMessage_data)
  //       }
  //       // that.data.messageList.push(onMessage_data)
  //       let length = that.data.messageList.length;
  //       that.setData({
  //         messageList: that.data.messageList,
  //         scrollTop: length * 600
  //       })

  //       // mdiv2.scrollTop = mdiv.scrollHeight;
  //     } else if (onMessage_data.type === 3){
  //       wx.showToast({
  //         title: '打开文件中。。。',
  //         icon: 'loading',
  //         mask: true,
  //       })
  //       console.log(onMessage_data.content)
  //       let aryss = onMessage_data.content.split(".");
  //       let type = aryss[aryss.length - 1];
  //       let urls = "";
  //       if (onMessage_data.content.indexOf("http") != -1){
  //         urls = onMessage_data.content;
  //       }else{
  //         urls = 'https://dq.hlcourt.gov.cn/' + onMessage_data.content;
  //       }

  //       setTimeout(()=>{
  //         wx.hideLoading();
  //       },1000)
  //       if (type == 'pdf' || type == 'docx' || type == 'doc' || type == 'exel') {
  //         wx.downloadFile({
  //           url: urls,
  //           success: function (res) {
  //             var filePath = res.tempFilePath
  //             wx.openDocument({
  //               filePath: filePath,
  //               success: function (res) {
  //                 console.log('打开文档成功')
  //               }
  //             })
  //           }
  //         })
  //       } else if (type == 'png' || type == 'jpg' || type == 'gif') {
  //         this.setData({
  //           isPic: true,
  //           picSrc: urls,

  //         })
  //       }
  //     }

  //   })
  // },
  //菜单点击事件
  onShowDetail(e) {
    var query = e.currentTarget.dataset['index'];
    if (query == 1) {
      this.setData({
        tabValue1: false,
        tabValue2: true,
        tabValue3: true,
        xiangqingClass: "ft-div blue",
        yuyingClass: "ft-div",
        zhengjuClass: "ft-div",
      })
    } else if (query == 2) {
      this.setData({
        tabValue1: true,
        tabValue2: false,
        tabValue3: true,
        xiangqingClass: "ft-div",
        yuyingClass: "ft-div blue",
        zhengjuClass: "ft-div",
      })
    } else if (query == 3) {
      this.setData({
        tabValue1: true,
        tabValue2: true,
        tabValue3: false,
        xiangqingClass: "ft-div",
        yuyingClass: "ft-div",
        zhengjuClass: "ft-div blue",
      })
    }
    this.changeClass(query);

  },
  changeClass(query) {
    if (!this.data.isTop || this.data.nowTabs != query) {
      //显示
      console.log('显示')
      console.log(this.data.nowTabs != query)
      this.setData({
        topClass: "item top containerss right-container row-9",
        bottomClass: "containerss bottom row-3",
        bottomClassOne: "containerss  row-3",
        bottomClassTwo: "detail row-9",
        isTop: true,
        nowTabs: query
      })
    } else if (this.data.nowTabs == query) {
      //隐藏
      this.setData({
        topClass: "item top containerss right-container",
        bottomClass: "containerss bottom",
        bottomClassOne: "containerss row",
        bottomClassTwo: "detail nonde",
        isTop: false,
        nowTabs: query,
        xiangqingClass: "ft-div",
        yuyingClass: "ft-div",
        zhengjuClass: "ft-div",
      })
    }
  },
  onShow() {
    // 保持屏幕常亮
    wx.setKeepScreenOn({
      keepScreenOn: true
    });
    console.log(96666666666666666666)
    console.log('onShow' + Date.now().valueOf())
    // onShow 中直接调用 play 无效
    wx.nextTick(() => {
      for (const {
          key
        } of this.data.subscribeList) {
        const ctx = wx.createLivePlayerContext(key)
        if (ctx) {
          ctx.play()
        }
      }
    })
    // this.speechStart();
  },
  toggleDebug() {
    this.setData({
      debug: !this.data.debug
    })
  },
  pushStateChange(e) {
    let code;
    if (e.detail) {
      code = e.detail.code;
    } else {
      code = e;
    }
  },
  livePusherError(e) {
    if (Number(e.code) < 0) {
      wx.showToast({
        title: '发布失败'
      })
    }
    console.error('live-pusher error:', e.detail.code, e.detail.errMsg)
  },
  livePlayerError(e) {
    console.error('live-player error:', e.detail.code, e.detail.errMsg)
  },
  joinRoom(roomToken) {
    const starttime = Date.now().valueOf()
    console.log(`[${starttime}] joinRoomWithToken: ${roomToken}`)
    console.log(this.session)
    let that = this;
    return this.session.joinRoomWithToken(roomToken).then(() => {
        const endtime = Date.now().valueOf()
        console.log(`[${endtime}] +${endtime - starttime}ms joinRoom success`)
        const path = this.session.publish()
        getPoliceUserDetail(this.session.userId).then(res => {
          if (res.state == 100) {
            this.setData({
              nowUserName: res.result.roleName + ' ' + res.result.name,
            })
          }
        })
        this.setData({
          publishPath: path,
        }, () => {
          this.startPush()
        })
        console.log(this.session.users)
        // this.session.users.push({
        //   playerdata:"",
        //   playerid:"dddd6b0d186411e9b39a00163e0af9c6"
        // })
        this.session.users
          .filter(v => v.playerid !== this.session.userId)
          .forEach(v => {
            getPoliceUserDetail(v.playerid).then(res => {
              if (res.state == 100) {
                this.subscribe(v.playerid, res.result.name, res.result.roleName)
              }
            })
          })
        wx.hideToast()
      })
      .catch(err => {
        console.log('加入房间失败', err)
        this.setData({
          isClose: true,
        })
        // SocketTask.close();
        // this.speechEnd();
        wx.navigateBack({
          changed: true,
          success: () => {
            wx.showToast({
              title: '加入房间失败',
              icon: 'none',
            })
          }
        })
        // wx.reLaunch({
        //   url: '/pages/rtcList/rtcList',
        //   success: () => {
        //     wx.showToast({
        //       title: '加入房间失败',
        //       icon: 'none',
        //     })
        //   }
        // })
      })
  },
  leaveRoom() {
    if (this.session) {
      return this.session.leaveRoom()
    }
  },
  subscribe(playerid, name, roleName) {
    var that = this;
    if (this.data.subscribeList.length === 9) {
      return wx.showToast({
        title: '最多订阅9个',
        icon: 'none'
      })
    }
    const path = this.session.subscribe(playerid)
    console.log('subpath: ' + path)
    if (path) {
      const sub = this.data.subscribeList.filter(v => v.key !== playerid)
      // userDetail(playerid).then(res => {
      //   if (res.state == 100) {
      //     sub.push({
      //       name: res.result.name,
      //       roleName: res.result.roleName,
      //       url: path,
      //       key: playerid,
      //     })
      //   }
      // })
      if (roleName == '法官') {
        sub.unshift({
          name: name,
          roleName: roleName,
          url: path,
          key: playerid,
        })
      } else {
        sub.push({
          name: name,
          roleName: roleName,
          url: path,
          key: playerid,
        })
      }


      this.setData({
        subscribeList: sub,
      }, () => {
        const ctx = wx.createLivePlayerContext(playerid)
        if (ctx) {
          ctx.play()
        }
      })
      console.log(this.data.subscribeList)
    }
  },
  startPush() {
    this.pushContext.start({
      success: () => {
        console.log('push success')
      },
      fail: () => {
        wx.showToast({
          title: '推流开始失败',
          icon: 'none',
        })
      },
    })
  },
  onHide() {
    wx.setKeepScreenOn({
      keepScreenOn: false
    });
    console.log('onHide')
  },
  onUnload() {
    console.log('onUnload')
    this.setData({
      isClose: true,
    })
    // SocketTask.close();
    // this.speechEnd();
    this.leaveRoom()
  },
  toggleMic() {
    this.setData({
      mic: !this.data.mic
    })
  },
  toggleVolume() {
    this.setData({
      volume: !this.data.volume
    })
  },
  toggleCamera() {
    this.setData({
      camera: !this.data.camera
    })
  },
  toggleBeauty() {
    this.setData({
      beauty: this.data.beauty ? 0 : 9
    })
  },
  onPhoneTab() {
    // leave room
    closePoliceRoom().then(res => {
      wx.navigateBack({
        delta: 1
      })
    })

  },
  switchCamera() {
    this.pushContext.switchCamera()
  },

  initRoom(appid, room, userid, url) {
    let session
    if (url) {
      session = new RoomSession({
        server: url,
      })
    } else {
      session = new RoomSession()
    }
    this.handleEvent(session)
    this.session = session
    return getToken(appid, room, userid)
      .then(token => {
        const app = getApp()
        app.url = url
        return this.joinRoom(token)
      })
  },
  initRoomWithToken(roomToken, url) {
    let session
    if (url) {
      session = new RoomSession({
        server: url,
      })
    } else {
      session = new RoomSession()
    }
    this.handleEvent(session)
    this.session = session
    return this.joinRoom(roomToken)
  },
  handleEvent(session) {
    session.on('track-add', (tracks) => {
      console.log('track-add', tracks)
      const set = {}
      for (const track of tracks) {
        // 每个 playerid 只订阅一次
        if (!set[track.playerid]) {
          set[track.playerid] = true
          getPoliceUserDetail(track.playerid).then(res => {
            if (res.state == 100) {
              this.subscribe(track.playerid, res.result.name, res.result.roleName)
            }
          })
          // this.subscribe(track.playerid)
        }
      }
    })
    session.on('track-remove', (tracks) => {
      console.log('track-remove', tracks)
      this.setData({
        subscribeList: this.data.subscribeList
          .filter(v => !tracks.reduce((accumulator, currentValue) =>
            accumulator && v.url.includes(currentValue.trackid), true)),
      })
    })
    session.on('user-leave', (user) => {
      console.log('user-leave', user)
      this.setData({
        subscribeList: this.data.subscribeList.filter(v => v.key !== user.playerid),
      })
    })
    session.on('user-join', (users) => {
      console.log('user-join', users)
    })
    session.on('disconnect', (ress) => {
      let title = '已离开房间'
      if (res.code === 10006) {
        title = '被踢出房间'
      }
      wx.reLaunch({
        url: '/pages/index/index',
        success: () => {
          wx.showToast({
            title,
            icon: 'none',
          })
        },
      })
    })
    session.on('error', (res) => {
      console.log('session error', res)
      this.reconnect()
    })
    session.on('reconnecting', () => {
      console.log('尝试重连中...')
      wx.showToast({
        title: '尝试重连中...',
        icon: 'loading',
        mask: true,
      })
    })
    session.on('reconnected', () => {
      this.startPush()
      for (const track of this.data.subscribeList) {
        const ctx = wx.createLivePlayerContext(track.key)
        if (ctx) {
          ctx.play()
        }
      }
      wx.hideToast()
    })
  },
  reconnect() {
    console.log('尝试重连中...')
    wx.showToast({
      title: '尝试重连中...',
      icon: 'loading',
      mask: true,
    })
    this.session && this.session.leaveRoom()
    this.setData({
      publishPath: '',
      subscribeList: [],
    })
    this.pushContext.stop()
    this.reconnectTimer = setTimeout(() => {
      const app = getApp()
      if (app.roomToken) {
        this.initRoomWithToken(app.roomToken, app.url).then(() => {
          wx.hideToast()
        }).catch(e => {
          console.log(`reconnect failed: ${e}`)
          return this.reconnect()
        })
      } else if (this.appid && this.roomName && this.userid) {
        this.initRoom(this.appid, this.roomName, this.userid, app.url).then(() => {
          wx.hideToast()
        }).catch(e => {
          console.log(`reconnect failed: ${e}`)
          return this.reconnect()
        })
      } else {
        this.setData({
          isClose: true,
        })
        // SocketTask.close();
        // this.speechEnd();
        wx.reLaunch({
          url: '/pages/index/index',
          success: () => {
            wx.showToast({
              title: '加入房间失败',
              icon: 'none',
            })
          }
        })
      }
    }, 1000)
  },
  /**
   * 关闭右边抽屉
   */
  toggleRight1() {
    var that = this;

    if (!this.data.showRight1) {
      let cls = that.data.topClass;
      cls = cls + " " + "halfB"
      console.log(cls)
      that.setData({
        topClass: cls,
      })
    } else {
      let clsd = that.data.topClass;
      clsd = clsd.replace(" halfB", "");
      that.setData({
        topClass: clsd,
      })
    }

    this.setData({
      showRight1: !this.data.showRight1
    });
  },
  /**
   * 切换原被告
   */
  changeLiti(e) {
    let to = e.currentTarget.dataset['liti'];
    this.setData({
      nowsss: to,
    })
  },
  /**
   * 获取案件信息
   */
  getCaseInfo() {
    let that = this;
    getLawCaseInfo(app.globalData.caseId).then(res => {
      if (res.state == 100) {
        that.setData({
          caseInfo: res.data
        })
      }
    })
  },
  /**
   * 获取证据信息
   */
  getEvidence() {
    let that = this;
    getEviByCaseId(app.globalData.caseId).then(res => {
      if (res.state == 100) {
        // this.data.evidenceList
        that.setData({
          evidenceList: res.result
        })
      }
    })
  },
  toggleClosePic() {
    this.setData({
      isPic: false,
      picSrc: ""
    })
  },
  //签名确认
  signCheck() {
    createImg().then(res => {
      if (res.state === 100) {
        app.globalData.signUrl = res.url;
        wx.navigateTo({
          url: "/pages/handWriting/handWriting",
        })
      }
    })
  },
  /**
   * 预览pdf或doc文件
   */
  preViewPdf(e) {
    let datas = e.currentTarget.dataset.dt;
    console.log(datas);
    let urls = '';
    if (datas.file) {

      urls = 'https://dq.hlcourt.gov.cn/' + datas.file[0].fileAddr;
    } else {
      return false;
    }
    if (datas.file[0].fileType == 'pdf' || datas.file[0].fileType == 'docx' || datas.file[0].fileType == 'doc' || datas.file[0].fileType == 'exel') {
      wx.downloadFile({
        url: urls,
        success: function (res) {
          var filePath = res.tempFilePath
          wx.openDocument({
            filePath: filePath,
            success: function (res) {
              console.log('打开文档成功')
            }
          })
        }
      })
    } else if (datas.file[0].fileType == 'png' || datas.file[0].fileType == 'jpg' || datas.file[0].fileType == 'gif') {
      this.setData({
        isPic: true,
        picSrc: urls,

      })
      this.toggleRight1();
    }

  }
})


//通过 WebSocket 连接发送数据，需要先 wx.connectSocket，并在 wx.onSocketOpen 回调之后才能发送。
function sendSocketMessage(msg) {
  console.log('发送')
  console.log(msg)
  var that = this;
  // console.log('通过 WebSocket 连接发送数据', JSON.stringify(msg))
  SocketTask.send({
    data: msg
  }, function (res) {
    console.log('已发送', res)
  })

}
