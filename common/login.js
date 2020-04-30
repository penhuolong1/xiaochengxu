import {
  http,
  upload
} from './request.js';
const app = getApp();

module.exports = {
  /**
   * 获取登录状态
   */
  getinfo() {
    let sessionId = app.globalData.sessionId ? app.globalData.sessionId : "";
    return http({
      url: 'court/wxRegister/getinfo.jhtml',
      data: {},
      method: 'get',
      isloading: false,
      header: {
        "Content-Type": "application/json;charset=UTF-8",
        'Cookie': 'JSESSIONID=' + sessionId,
      }
    })
  },
  /**
   * 获取普通用户的openid
   * code 用户登录凭证   state 填写：weixincode
   */
  getWXRoutineOpenId(code, state) {
    let sessionId = app.globalData.sessionId ? app.globalData.sessionId : "";
    return http({
      url: 'court/wxRegister/getWXRoutineOpenId.jhtml',
      data: {
        code,
        state
      },
      method: 'get',
      isloading: false,
      header: {
        "Content-Type": "application/json;charset=UTF-8",
        'Cookie': 'JSESSIONID=' + sessionId,
      }
    })
  },
  /**
   * openid登录
   */
  WXLogin() {
    let sessionId = app.globalData.sessionId ? app.globalData.sessionId : "";
    return http({
      url: 'court/wxRegister/WXLogin.jhtml',
      data: {},
      method: 'get',
      isloading: true,
      header: {
        "Content-Type": "application/json;charset=UTF-8",
        'Cookie': 'JSESSIONID=' + sessionId,
      }
    })
  },
  /**
   * 调解机构登录
   */
  mediaterLogin(name, password) {
    let sessionId = app.globalData.sessionId ? app.globalData.sessionId : "";
    return http({
      url: 'main/mediaterLogin.jhtml',
      data: {
        name,
        password
      },
      method: 'get',
      isloading: true,
      header: {
        "Content-Type": "application/json;charset=UTF-8",
        'Cookie': 'JSESSIONID=' + sessionId,
      }
    })
  },
  /**
   * 获取用户信息
   */
  getAdminInfo() {
    let sessionId = app.globalData.sessionId ? app.globalData.sessionId : "";
    return http({
      url: 'main/getAdminInfo.jhtml',
      data: {},
      method: 'get',
      isloading: true,
      header: {
        "Content-Type": "application/json;charset=UTF-8",
        'Cookie': 'JSESSIONID=' + sessionId,
      }
    })
  },
  /**
   * 修改用户信息
   */
  modifyAdminInfo(phone, email) {
    let sessionId = app.globalData.sessionId ? app.globalData.sessionId : "";
    return http({
      url: 'main/modifyAdminInfo.jhtml',
      data: {
        phone,
        email
      },
      method: 'get',
      isloading: true,
      header: {
        "Content-Type": "application/json;charset=UTF-8",
        'Cookie': 'JSESSIONID=' + sessionId,
      }
    })
  },
  // 获取登陆人id
  getAdminId(params) {
    let sessionId = app.globalData.sessionId ? app.globalData.sessionId : "";
    return http({
      url: 'main/getAdminId.jhtml',
      method: 'get',
      header: {
        "Content-Type": "application/json;charset=UTF-8",
        'Cookie': 'JSESSIONID=' + sessionId,
      }
    })
  }
}
