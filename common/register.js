import { http, upload } from './request.js';
const app = getApp();

module.exports ={
  /**
  * 注册获得手机验证码
  * phone 手机号
  */
  phoneCode(phone) {
    let sessionId = app.globalData.userInfo ? app.globalData.userInfo.sessionId : "";
    return http({
      url: 'main/phoneCode.jhtml',
      data: { phone },
      method: 'get',
      isloading:false,
      header: {
        "Content-Type": "application/json;charset=UTF-8",
        'Cookie': 'JSESSIONID=' + sessionId,
      }
    })
  },
  /**
  * 校验验证码
  * phone 手机号
  * phoneCode 验证码
  */
  registerPhone(phone, mcode) {
    let sessionId = app.globalData.userInfo ? app.globalData.userInfo.sessionId : "";
    return http({
      url: 'main/registerPhone.jhtml',
      data: { phone, mcode },
      method: 'post',
      header: {
        "Content-Type": "application/json;charset=UTF-8",
        'Cookie': 'JSESSIONID=' + sessionId,
      }
    })
  },
  /**
* 上传身份信息(正)
*/
  registerUpload(url) {
    let sessionId = app.globalData.userInfo ? app.globalData.userInfo.sessionId : "";
    return upload({
      url: 'main/registerUpload.jhtml',
      filePath: url,
      name: "file",
      // formData:{},
      header: {
        "Content-Type": "application/json;charset=UTF-8",
        'Cookie': 'JSESSIONID=' + sessionId,
      }
    })
  },
  /**
  * 注册
  */
  registerAdmin(data) {
    let sessionId = app.globalData.userInfo ? app.globalData.userInfo.sessionId : "";
    return http({
      url: 'main/registerAdmin.jhtml',
      data:  data ,
      method: 'post',
      header: {
        "Content-Type": "application/json;charset=UTF-8",
        'Cookie': 'JSESSIONID=' + sessionId,
      }
    })
  },
  /**
  * 代理人注册
  */
  registerLawyer(data) {
    let sessionId = app.globalData.userInfo ? app.globalData.userInfo.sessionId : "";
    return http({
      url: 'main/registerLawyer.jhtml',
      data: data,
      method: 'post',
      header: {
        "Content-Type": "application/json;charset=UTF-8",
        'Cookie': 'JSESSIONID=' + sessionId,
      }
    })
  },
}