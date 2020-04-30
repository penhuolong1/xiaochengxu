// pages/message/message.js
import {
  getNotice,
  readNotice
} from '../../common/message';
import {
  IMGURL
} from '../../common/constVal'
var util = require('../../common/utils.js')
const app = getApp();
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
  /**
   * 页面的初始数据
   */
  data: {
    statusBarHeight: app.globalData.statusBarHeight, // 头部的自定义的高度
    topSeachBarBox: false, // 头部的搜索框显示隐藏
    systemMsgShow: false, // 系统消息的显示隐藏
    pageNum: 1,
    noteList: [], //消息列表
    lastId: "", //上次打开的id
    total: 0,
    logShow: false, //报警模态框显示
    imgUrl: IMGURL
  },
  gerList() {
    let that = this;
    getNotice(this.data.pageNum, 15, "").then(res => {
      let arr = [];
      if (this.data.pageNum > 1) {
        arr = this.data.noteList;
      }
      res.content.map(item => {
        item.systemMsgShow = false;
        item.date = that.timestampFormat(item.create_date / 1000);
        arr.push(item)
      })

      this.setData({
        noteList: arr,
        total: res.total
      })
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '消息'
    })
    if (app.globalData.userInfo == null) {

    } else {
      console.log(522)
      this.gerList();
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
        console.log(8888)
        wx.vibrateLong();
        that.setData({
          logShow: true,
        });
      }
    }
  },
  onShow() {
    this.setData({
      topSeachBarBox: false
    });


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
  //模态框按钮操作 --- 结束-----
  // 顶部的搜索按钮
  searchBar() {
    console.log('text')
    this.setData({
      topSeachBarBox: true
    });
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
        url: "/pages/user/user",
      })
      clearInterval(number);
      time = 0;
    }
    //向右滑处理
    if ((touchDot.X - startDot.X) > 200 && (touchDot.Y - startDot.Y) < 150 && time < 3 && time > 0.1) {
      wx.navigateTo({
        url: "/pages/index/index",
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
  // 点击某条消息
  msgOpen(e) {
    console.log(e.currentTarget.dataset.id)
    console.log(e.currentTarget.dataset.read)
    console.log(this.data.lastId)
    if (!e.currentTarget.dataset.read) {
      readNotice(e.currentTarget.dataset.id).then(res => {
        let arr = this.data.noteList;
        arr.map(item => {
          if (item.id == e.currentTarget.dataset.id) {
            item.is_read = true;
            if (this.data.lastId == e.currentTarget.dataset.id) {
              item.systemMsgShow = !item.systemMsgShow;
            } else {
              item.systemMsgShow = true;
            }
          } else {
            item.systemMsgShow = false;
          }
        })
        this.setData({
          noteList: arr,
          lastId: e.currentTarget.dataset.id
        })
      })
    } else {
      let arr = this.data.noteList;
      arr.map(item => {
        if (item.id == e.currentTarget.dataset.id) {
          item.is_read = true;
          if (this.data.lastId == e.currentTarget.dataset.id) {
            item.systemMsgShow = !item.systemMsgShow;
          } else {
            item.systemMsgShow = true;
          }
        } else {
          item.systemMsgShow = false;
        }

      })
      this.setData({
        noteList: arr,
        lastId: e.currentTarget.dataset.id
      })
    }
  },
  // tab跳转页面
  changeTabUrl(e) {
    if (e.currentTarget.dataset.text == '首页') {
      wx.redirectTo({
        url: "/pages/index/index",
      })
    } else if (e.currentTarget.dataset.text == '我的') {
      wx.navigateTo({
        url: "/pages/user/user",
      })
    }
  },
  loadingData() {
    if (this.data.total > this.data.noteList.length) {
      this.setData({
        pageNum: this.data.pageNum + 1,
      })
      this.gerList();
    }

  },
  //时间转化
  timestampFormat(timestamp) {
    function zeroize(num) {
      return (String(num).length == 1 ? '0' : '') + num;
    }

    var curTimestamp = parseInt(new Date().getTime() / 1000); //当前时间戳
    var timestampDiff = curTimestamp - timestamp; // 参数时间戳与当前时间戳相差秒数

    var curDate = new Date(curTimestamp * 1000); // 当前时间日期对象
    var tmDate = new Date(timestamp * 1000); // 参数时间戳转换成的日期对象

    var Y = tmDate.getFullYear(),
      m = tmDate.getMonth() + 1,
      d = tmDate.getDate();
    var H = tmDate.getHours(),
      i = tmDate.getMinutes(),
      s = tmDate.getSeconds();

    if (timestampDiff < 60) { // 一分钟以内
      return "刚刚";
    } else if (timestampDiff < 3600) { // 一小时前之内
      return Math.floor(timestampDiff / 60) + "分钟前";
    } else if (curDate.getFullYear() == Y && curDate.getMonth() + 1 == m && curDate.getDate() == d) {
      return '今天' + zeroize(H) + ':' + zeroize(i);
    } else {
      var newDate = new Date((curTimestamp - 86400) * 1000); // 参数中的时间戳加一天转换成的日期对象
      if (newDate.getFullYear() == Y && newDate.getMonth() + 1 == m && newDate.getDate() == d) {
        return '昨天' + zeroize(H) + ':' + zeroize(i);
      } else if (curDate.getFullYear() == Y) {
        return zeroize(m) + '月' + zeroize(d) + '日 ' + zeroize(H) + ':' + zeroize(i);
      } else {
        return Y + '年' + zeroize(m) + '月' + zeroize(d) + '日 ' + zeroize(H) + ':' + zeroize(i);
      }
    }
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
    wx.closeSocket();
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
