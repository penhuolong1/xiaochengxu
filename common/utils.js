import { login } from './api';
const md5 = require('./md5.js');
import { intoPolicRoom } from './alarm';
const app = getApp();
//时间戳转化
function formatDate(date, fmt) {
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(
      RegExp.$1,
      (date.getFullYear() + '').substr(4 - RegExp.$1.length)
    )
  }
  let o = {
    'M+': date.getMonth() + 1,
    'd+': date.getDate(),
    'h+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds()
  }
  for (let k in o) {
    if (new RegExp(`(${k})`).test(fmt)) {
      let str = o[k] + ''
      fmt = fmt.replace(
        RegExp.$1,
        RegExp.$1.length === 1 ? str : padLeftZero(str)
      )
    }
  }
  return fmt
}
function padLeftZero(str) {
  return ('00' + str).substr(str.length)
}

function cloaseAlarm(that) {
  that.setData({
    logShow:false,
  })
}
/**
 * 进入报警房间
 */
function getInRoom(that) {
  intoPolicRoom(app.globalData.roomId).then(res => {
    app.roomToken = res.result;
    app.globalData.isNeedCloase = true;
    wx.navigateTo({
      url: `/pages/alarmRoom/alarmRoom`,
    })
  })
}

/**
 * 获得参数
 */
function getQueryString (url, name) {
  var reg = new RegExp('(^|&|/?)' + name + '=([^&|/?]*)(&|/?|$)', 'i')
  var r = url.substr(1).match(reg)
  if (r != null) {
    return r[2]
  }
  return null;
}

// 把方法暴露出来供别的页面使用
module.exports = {
  formatDate: formatDate,
  getQueryString: getQueryString,
  cloaseAlarm: cloaseAlarm,
  getInRoom: getInRoom
}