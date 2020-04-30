import { http, upload } from './request.js';
const app = getApp();

module.exports = {
  /**
  * 获取报警人员信息
  * adminId|是|String|用户id
  */
  getPoliceUserDetail(adminId) {
    let sessionId = app.globalData.sessionId ? app.globalData.sessionId : "";
    return http({
      url: 'court/room/getPoliceUserDetail.jhtml',
      data: { adminId },
      method: 'get',
      isloading: false,
      header: {
        "Content-Type": "application/json;charset=UTF-8",
        'Cookie': 'JSESSIONID=' + sessionId,
      }
    })
  },
  /**
  * 关闭报警房间
  * adminId|是|String|用户id
  */
  closePoliceRoom() {
    let sessionId = app.globalData.sessionId ? app.globalData.sessionId : "";
    return http({
      url: 'court/room/closePoliceRoom.jhtml',
      data: {  },
      method: 'get',
      isloading: true,
      header: {
        "Content-Type": "application/json;charset=UTF-8",
        'Cookie': 'JSESSIONID=' + sessionId,
      }
    })
  },
  /**
  * 当事人进入一键报警
  * name 要报警的地方
  */
  sendLinkedInfo(name) {
    let sessionId = app.globalData.sessionId ? app.globalData.sessionId : "";
    return http({
      url: 'court/room/sendLinkedInfo.jhtml',
      data: { name },
      method: 'get',
      isloading: true,
      navigationBarLoading: true,
      header: {
        "Content-Type": "application/json;charset=UTF-8",
        'Cookie': 'JSESSIONID=' + sessionId,
      }
    })
  },
  /**
  * 派出所进入一键报警
  * room报警房间名
  */
  intoPolicRoom(room) {
    let sessionId = app.globalData.sessionId ? app.globalData.sessionId : "";
    return http({
      url: 'court/room/intoPolicRoom.jhtml',
      data: { room },
      method: 'get',
      isloading: true,
      navigationBarLoading: true,
      header: {
        "Content-Type": "application/json;charset=UTF-8",
        'Cookie': 'JSESSIONID=' + sessionId,
      }
    })
  },
}