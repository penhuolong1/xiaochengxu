import {
  http,
  upload
} from './request.js';
const app = getApp();
module.exports = {
  // 获取目录
  listDirType(params) {
    let sessionId = app.globalData.sessionId ? app.globalData.sessionId : "";
    return http({
      url: 'mediate/file/listDirType.jhtml?',
      data: params,
      method: 'get',
      isloading: true,
      navigationBarLoading: true,
      header: {
        "Content-Type": "application/json;charset=UTF-8",
        'Cookie': 'JSESSIONID=' + sessionId,
      }
    })
  },
  // 获取调解卷宗
  listMediateTable(params) {
    let sessionId = app.globalData.sessionId ? app.globalData.sessionId : "";
    return http({
      url: 'mediate/file/listMediateTable.jhtml?',
      data: params,
      method: 'get',
      isloading: false,
      navigationBarLoading: true,
      header: {
        "Content-Type": "application/json;charset=UTF-8",
        'Cookie': 'JSESSIONID=' + sessionId,
      }
    })
  },
  // 当事人查询卷宗
  listTableLit(params) {
    let sessionId = app.globalData.sessionId ? app.globalData.sessionId : "";
    return http({
      url: 'mediate/file/listTableLit.jhtml?',
      data: params,
      method: 'get',
      isloading: false,
      navigationBarLoading: true,
      header: {
        "Content-Type": "application/json;charset=UTF-8",
        'Cookie': 'JSESSIONID=' + sessionId,
      }
    })
  },
  // 批量签字
  tableFileAddSign(params) {
    let sessionId = app.globalData.sessionId ? app.globalData.sessionId : "";
    return http({
      url: 'mediate/file/tableFileAddSign.jhtml?',
      data: params,
      method: 'post',
      isloading: false,
      navigationBarLoading: true,
      header: {
        "Content-Type": "application/json;charset=UTF-8",
        'Cookie': 'JSESSIONID=' + sessionId,
      }
    })
  },
}