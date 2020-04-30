// pages/chat/chat.js
const app = getApp();
var util = require('../../common/utils')
import {IMGURL} from '../../common/constVal'
import {
  getUserDetail1
} from '../../common/rtc';
import {
  intoTalkRoom
} from '../../common/case'
let wSocket = ''
let heartCheck = {
  timeout: 3000, //1分钟发一次心跳
  timeoutObj: null,
  serverTimeoutObj: null,
  reset: function () {
    clearTimeout(this.timeoutObj);
    clearTimeout(this.serverTimeoutObj);
    return this;
  },
  start: function () {
    var self = this;
    this.timeoutObj = setTimeout(function () {
      //这里发送一个心跳，后端收到后，返回一个心跳消息，
      //onmessage拿到返回的心跳就说明连接正常
      if (wSocket.readyState != 1) { // 只有在连接状态下才发送心跳
        console.log('websocket已关闭不发送心跳')
        return
      }
      wSocket.send("ping");
      console.log("ping!")
    }, this.timeout)
  }
}
Page({

  /**
   * 页面的初始数据
   */
  data: {
    statusBarHeight: app.globalData.statusBarHeight,
    chatRecord: [],
    sendText: '', //发送的聊天内容
    URL: "wss://cstj.olcourt.cn/websocket",
    titleText: '调解室',
    isShowFileFlag: false,
    groupUser: null,
    scrollTop: 0,
    time: util.formatDate(new Date(), 'hh:mm'),
    rotes: [],
    chatLength: 0,
    imgUrl: IMGURL
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wSocket = wx.connectSocket({
      url: `${this.data.URL}?username=${app.globalData.loginInfo.result.id}&roomId=${app.globalData.caseId}`
    })
    wx.onSocketOpen(function (res) {
      heartCheck.reset().start()
      console.log('WebSocket连接已打开！')
    })
    wx.onSocketMessage(res => {
      heartCheck.reset().start()
      let data = JSON.parse(res.data)
      if (data.command == 11) {
        let chats = this.data.chatRecord
        console.log(data.data.content)
        let data1 = JSON.parse(data.data.content)
        if (data1.type == 'rollback') { //发送的状态是撤回
          chats.forEach(item => {
            if (item.messageid == data1.text) {
              item.iswithdraw = true
            }
          })
        } else if (data1.type == 'words') { //发送的状态是禁言

        } else {
          chats.push(JSON.parse(data.data.content))
        }
        this.setData({
          chatRecord: chats
        })
        // 每获取到一条数据都滑倒最下面
        let length = this.data.chatRecord.length
        setTimeout(() => {
          this.setData({
            scrollTop: length * 100
          })
        }, 300);
      }
      if (data.command === 18) {
        let users = data.data.groups[0].users
        this.setData({
          groupUser: users
        })
        let array = []
        users.forEach(item => {
          getUserDetail1({
            adminId: item.id,
            caseId: app.globalData.caseId
          }).then(res => {
            let obj = {
              name: res.result.name,
              role: res.result.roleType
            }
            array.push(obj)
            this.setData({
              rotes: array
            })
          })
        })
      }
      if (data.command === 9) {
        this.getGroupUser()
      }
      if (data.command === 10) {
        this.getGroupUser()
      }
    })
    wx.onSocketClose((res) => {
      console.log('chat WebSocket 已关闭！')
      // wSocket = wx.connectSocket({
      //   url: `${this.data.URL}?username=${app.globalData.loginInfo.result.id}&roomId=${app.globalData.caseId}`
      // })
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

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

  },
  // 发送文字信息
  chatSend(e) {
    let time = new Date().getTime()
    this.setData({
      sendText: e.detail
    })
    let params = {
      from: app.globalData.loginInfo.result.id,
      group_id: app.globalData.caseId,
      content: {
        userName: app.globalData.loginInfo.roleName,
        role: app.globalData.loginInfo.roleType,
        text: this.data.sendText,
        loginId: app.globalData.loginInfo.result.id,
        type: 'text',
        time: time,
        messageid: `${app.globalData.loginInfo.result.id}${time}`
      }
    }
    params.createTime = new Date().getTime()
    params.cmd = 11
    params.chatType = 1
    params.msgType = 0
    wSocket.send({
      data: JSON.stringify(params),
      success: () => {
        console.log("发送成功")
      }
    })
  },
  // 发送图片信息
  chatSendImg(e) {
    console.log('发送图片信息')
    console.log(e.detail)
    let time = new Date().getTime()
    if (e.detail && e.detail.length > 0) {
      e.detail.forEach(item => {
        let params = {
          from: app.globalData.loginInfo.result.id,
          group_id: app.globalData.caseId,
          content: {
            userName: app.globalData.loginInfo.roleName,
            role: app.globalData.loginInfo.roleType,
            text: item,
            loginId: app.globalData.loginInfo.result.id,
            type: 'img',
            time: time,
            messageid: `${app.globalData.loginInfo.result.id}${time}`
          }
        }
        params.createTime = new Date().getTime()
        params.cmd = 11
        params.chatType = 1
        params.msgType = 0
        wSocket.send({
          data: JSON.stringify(params),
          success: () => {
            console.log("发送成功")
          }
        })
      })
    }
  },
  // 发送语音
  chatSendVoice(e) {
    console.log('发送语音')
    console.log(e.detail)
    let time = new Date().getTime()
    let params = {
      from: app.globalData.loginInfo.result.id,
      group_id: app.globalData.caseId,
      content: {
        userName: app.globalData.loginInfo.roleName,
        role: app.globalData.loginInfo.roleType,
        text: e.detail.voiceText,
        src: e.detail.src.path,
        voiceTime: e.detail.time,
        loginId: app.globalData.loginInfo.result.id,
        type: 'voice',
        time: new Date().getTime(),
        messageid: `${app.globalData.loginInfo.result.id}${time}`
      }
    }
    params.createTime = new Date().getTime()
    params.cmd = 11
    params.chatType = 1
    params.msgType = 0
    wSocket.send({
      data: JSON.stringify(params),
      success: () => {
        console.log("发送成功")
      }
    })
  },
  chatSendFile(e) {
    let file = e.detail
    if (file && file.length > 0) {
      file.forEach(item => {
        if (item.checked) {
          let time = new Date().getTime()
          let params = {
            from: app.globalData.loginInfo.result.id,
            group_id: app.globalData.caseId,
            content: {
              userName: app.globalData.loginInfo.roleName,
              role: app.globalData.loginInfo.roleType,
              text: item.url,
              fileName: item.name,
              loginId: app.globalData.loginInfo.result.id,
              type: 'file',
              time: time,
              messageid: `${app.globalData.loginInfo.result.id}${time}`
            }
          }
          params.createTime = new Date().getTime()
          params.cmd = 11
          params.chatType = 1
          params.msgType = 0
          wSocket.send({
            data: JSON.stringify(params),
            success: () => {
              console.log("发送成功")
            }
          })
        }
      })
    }
    this.setData({
      isShowFileFlag: false,
      titleText: '调解室'
    })
    this.chatSend = this.selectComponent('#chatSend')
    this.chatSend.showOrHideFile(false)
  },
  // 监听上传文件
  isShowFile() {
    this.setData({
      isShowFileFlag: true,
      titleText: '案件受理'
    })
  },
  hideFile() {
    this.setData({
      isShowFileFlag: false,
      titleText: '调解室'
    })
    this.chatSend = this.selectComponent('#chatSend')
    this.chatSend.showOrHideFile(false)
  },
  // 获取组群信息
  getGroupUser() {
    let params = {}
    params.cmd = 17
    params.type = 0
    params.userid = app.globalData.loginInfo.result.id
    wSocket.send({
      data: JSON.stringify(params),
      success: () => {
        console.log("发送成功")
      }
    })
  },
  // 返回上一页
  back() {
    intoTalkRoom({
      caseId: app.globalData.caseId,
      type: 1
    })
    wx.navigateBack({ //返回
      delta: 1
    })
  },
  // 撤回
  withdraw(e) {
    let time = new Date().getTime()
    let params = {
      from: app.globalData.loginInfo.result.id,
      group_id: app.globalData.caseId,
      content: {
        userName: app.globalData.loginInfo.roleName,
        role: app.globalData.loginInfo.roleType,
        text: e.detail,
        content: '',
        loginId: app.globalData.loginInfo.result.id,
        type: 'rollback',
        time: new Date().getTime(),
        messageid: `${app.globalData.loginInfo.result.id}${time}`
      }
    }
    params.createTime = new Date().getTime()
    params.cmd = 11
    params.chatType = 1
    params.msgType = 0
    wSocket.send({
      data: JSON.stringify(params),
      success: () => {
        console.log("发送成功")
      }
    })
  }
})
