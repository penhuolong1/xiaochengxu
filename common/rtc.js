import {
  http,
  upload
} from './request.js';
const app = getApp();

module.exports = {
  /**
   * 根据案号返回的roomToken
   * caseId 手机号
   */
  intoRoom(caseId) {
    let sessionId = app.globalData.sessionId ? app.globalData.sessionId : "";
    return http({
      url: 'court/room/intoRoom.jhtml',
      data: {
        caseId
      },
      method: 'get',
      isloading: false,
      navigationBarLoading: true,
      header: {
        "Content-Type": "application/json;charset=UTF-8",
        'Cookie': 'JSESSIONID=' + sessionId,
      }
    })
  },
  /**
   * 获取案件列表
   * sqCaseNo 案号
   *process   |int |案件进程：0：未申请；1：已申请；2：已受理；3：已分发；4：已分配；5：调解中·；6：调解结束；
   *pageNumber 页码
   *acceptance 审核意见
   *pageSize  显示几条
   */
  selectCase(sqCaseNo, process, pageNumber, acceptance, pageSize) {
    let sessionId = app.globalData.sessionId ? app.globalData.sessionId : "";
    return http({
      url: 'court/case/selectCase.jhtml',
      data: {
        sqCaseNo,
        process,
        pageNumber,
        acceptance,
        pageSize
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
   * 获取用户信息
   * adminId|是|String|用户id
   */
  getUserDetail(adminId) {
    let sessionId = app.globalData.sessionId ? app.globalData.sessionId : "";
    return http({
      url: 'court/room/getUserDetail.jhtml',
      data: {
        adminId
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
   * 获取用户信息1
   * adminId|是|String|用户id
   */
  getUserDetail1(params) {
    let sessionId = app.globalData.sessionId ? app.globalData.sessionId : "";
    return http({
      url: 'court/room/getUserDetail.jhtml',
      data: params,
      method: 'get',
      isloading: false,
      header: {
        "Content-Type": "application/json;charset=UTF-8",
        'Cookie': 'JSESSIONID=' + sessionId,
      }
    })
  },
  /**
   * 退出房间
   */
  closeRoom() {
    let sessionId = app.globalData.sessionId ? app.globalData.sessionId : "";
    return http({
      url: 'court/room/closeRoom.jhtml',
      data: {},
      method: 'get',
      isloading: false,
      header: {
        "Content-Type": "application/json;charset=UTF-8",
        'Cookie': 'JSESSIONID=' + sessionId,
      }
    })
  },
}
