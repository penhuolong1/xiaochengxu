import { http, upload } from './request.js';
const app = getApp();


module.exports = {
  /**
 * 获得消息列表
 * isRead 0：未读  1：已读
 */
  getNotice(pageNum, pageSize, isRead) {
    let sessionId = app.globalData.sessionId ? app.globalData.sessionId : "";
    return http({
      url: 'court/notice/getNotice.jhtml',
      data: { pageNum, pageSize, isRead},
      method: 'GET',
      isloading: false,
      navigationBarLoading: true,
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
        'Cookie': 'JSESSIONID=' + sessionId,
      }
    })
  },
  /**
 * 获得消息列表
 */
  readNotice(noticeId) {
    let sessionId = app.globalData.sessionId ? app.globalData.sessionId : "";
    return http({
      url: 'court/notice/readNotice.jhtml',
      data: { noticeId },
      method: 'GET',
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
        'Cookie': 'JSESSIONID=' + sessionId,
      }
    })
  },
}
