import { http, upload } from './request.js';
const app = getApp();

module.exports = {
  /**
  * 获取调解协议信息
  *caseId 案件id
  */
  getProtocolInfo(caseId) {
    let sessionId = app.globalData.sessionId ? app.globalData.sessionId : "";
    return http({
      url: 'court/protocol/getProtocolInfo.jhtml',
      data: { caseId },
      method: 'get',
      isloading: true,
      header: {
        "Content-Type": "application/json;charset=UTF-8",
        'Cookie': 'JSESSIONID=' + sessionId,
      }
    })
  },
  /**
  * 签名
  *caseId 案件id
  *image  base64位图片字符串
  */
  addProtocolSign(caseId, image) {
    let sessionId = app.globalData.sessionId ? app.globalData.sessionId : "";
    return http({
      url: 'court/protocol/addProtocolSign.jhtml',
      data: { caseId, image},
      method: 'post',
      isloading: false,
      header: {
        "Content-Type": "application/json;charset=UTF-8",
        'Cookie': 'JSESSIONID=' + sessionId,
      }
    })
  },
  /**
  * 获取登录人员的是否签名
  *caseId 案件id
  */
  getSign(caseId) {
    let sessionId = app.globalData.sessionId ? app.globalData.sessionId : "";
    return http({
      url: 'court/protocol/getSign.jhtml',
      data: { caseId},
      method: 'get',
      isloading: false,
      header: {
        "Content-Type": "application/json;charset=UTF-8",
        'Cookie': 'JSESSIONID=' + sessionId,
      }
    })
  },
  /**
  * 保存事实和协议
  *caseId 案件id
  *fact 事实部分
  *agreement 协议
  *method  履行方式
  *total  份数
  */
  saveProtocolInfo(data) {
    let sessionId = app.globalData.sessionId ? app.globalData.sessionId : "";
    return http({
      url: 'court/protocol/saveProtocolInfo.jhtml',
      data: { caseId: data.caseId, fact: data.fact, agreement: data.agreement, method: data.method,total:data.total },
      method: 'post',
      isloading: false,
      header: {
        "Content-Type": "application/json;charset=UTF-8",
        'Cookie': 'JSESSIONID=' + sessionId,
      }
    })
  },
  /**
  * 生成调解协议
  *caseId 案件id
  */
  createProtocol(caseId) {
    let sessionId = app.globalData.sessionId ? app.globalData.sessionId : "";
    return http({
      url: 'court/protocol/createProtocol.jhtml',
      data: { caseId },
      method: 'get',
      isloading: false,
      header: {
        "Content-Type": "application/json;charset=UTF-8",
        'Cookie': 'JSESSIONID=' + sessionId,
      }
    })
  },
  /**
  * 发起签名
  *caseId 案件id
  */
  sendSignProcess(caseId) {
    let sessionId = app.globalData.sessionId ? app.globalData.sessionId : "";
    return http({
      url: 'court/protocol/sendSignProcess.jhtml',
      data: { caseId },
      method: 'get',
      isloading: false,
      header: {
        "Content-Type": "application/json;charset=UTF-8",
        'Cookie': 'JSESSIONID=' + sessionId,
      }
    })
  },
  /**
  * 结束签名
  *caseId 案件id
  */
  endSignProcess(caseId) {
    let sessionId = app.globalData.sessionId ? app.globalData.sessionId : "";
    return http({
      url: 'court/protocol/endSignProcess.jhtml',
      data: { caseId },
      method: 'get',
      isloading: false,
      header: {
        "Content-Type": "application/json;charset=UTF-8",
        'Cookie': 'JSESSIONID=' + sessionId,
      }
    })
  },
  /**
  * 获取当事人信息
  *caseId 案件id
  */
  getLitigantInfo(caseId) {
    let sessionId = app.globalData.sessionId ? app.globalData.sessionId : "";
    return http({
      url: 'court/protocol/getLitigantInfo.jhtml',
      data: { caseId },
      method: 'get',
      isloading: false,
      header: {
        "Content-Type": "application/json;charset=UTF-8",
        'Cookie': 'JSESSIONID=' + sessionId,
      }
    })
  },
  /**
  * 获取文书列表
  *caseId 案件id
  */
  getProtocolByCaseId(caseId) {
    let sessionId = app.globalData.sessionId ? app.globalData.sessionId : "";
    return http({
      url: 'court/protocol /getProtocolByCaseId.jhtml',
      data: { caseId },
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
  * 邮箱发送文书
  *caseId 案件id
  *protocolId文书id
  *litigantId当事人id
  *email邮箱
  */
  sendEmail(caseId, protocolId, litigants) {
    let sessionId = app.globalData.sessionId ? app.globalData.sessionId : "";
    return http({
      url: 'court/protocol/sendEmail.jhtml',
      data: { caseId, protocolId, litigants },
      method: 'post',
      isloading: false,
      header: {
        "Content-Type": "application/json;charset=UTF-8",
        'Cookie': 'JSESSIONID=' + sessionId,
      }
    })
  },
  /**
  * 获取事实
  *caseId 案件id
  */
  getProtocolDetail(caseId) {
    let sessionId = app.globalData.sessionId ? app.globalData.sessionId : "";
    return http({
      url: 'court/protocol /getProtocolDetail.jhtml',
      data: { caseId },
      method: 'get',
      isloading: false,
      header: {
        "Content-Type": "application/json;charset=UTF-8",
        'Cookie': 'JSESSIONID=' + sessionId,
      }
    })
  },
}