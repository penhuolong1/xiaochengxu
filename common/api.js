export const HOST = 'https://api-demo.qnsdk.com';

export const PREFIX = '/v1/rtc';

const getAppId = () => getApp().appid

const app = getApp();

export const API = {
  LIST_ROOM: () => `/rooms/app/${getAppId()}`,
  LIST_USERS: (appid, roomid) =>
    `${HOST}${PREFIX}/users/app/${appid || getAppId()}/room/${roomid}`,
  GET_APP_CONFIG: (appid) =>
    `${HOST}${PREFIX}/app/${appid || getAppId()}`,
  JOIN_ROOM_TOKEN: (roomid, userid, appid) =>
    `${HOST}${PREFIX}/token/app/${appid || getAppId()}/room/${roomid}/user/${userid}`,
  CREATE_ROOM_TOKEN: (roomid, userid, appid) =>
    `${HOST}${PREFIX}/token/admin/app/${appid || getAppId()}/room/${roomid}/user/${userid}`,
};

export const getToken = (appid, roomid, userid) => {
  return new Promise((resolve, reject) => {
    const api = userid === 'admin' ? API.CREATE_ROOM_TOKEN : API.JOIN_ROOM_TOKEN;
    const requestURL = `${api(roomid, userid, appid)}?bundleId=demo-rtc.qnsdk.com`;
    wx.request({
      url: requestURL,
      success: (res) => {
        const code = res.statusCode;
        if (code >= 200 && code < 300) {
          resolve(res.data);
        } else {
          reject(res);
        }
      },
      fail: reject,
    });
  })
}

export const getRoomToken = (caseId, roomType) => {
  let sessionId = app.globalData.userInfo ? app.globalData.userInfo.sessionId : "";
  return new Promise((resolve, reject) => {
    wx.request({
      url: 'https://court1.ptnetwork001.com/api/online/getRoomToken.jhtml',
      // url: 'https://dq.hlcourt.gov.cn/api/online/getRoomToken.jhtml',
      method: "GET",
      header: {
        'Content-Type': 'application/json',
        'Cookie': 'JSESSIONID=' + sessionId,
      },
      data: {
        caseId, //参数
        roomType,
      },
      success: (res) => {
        const code = res.statusCode;
        if (code >= 200 && code < 300) {
          resolve(res.data);
        } else {
          reject(res);
        }
      },
      fail: reject,
    });
  })
}
/**
 * 获取普通用户的openid
 */
export const getWXRoutineOpenId = (code, state) => {
  return new Promise((resolve, reject) => {
    wx.request({
      url: 'https://cstj.olcourt.cn/api/court/wxRegister/getWXRoutineOpenId.jhtml',
      // url: 'https://dq.hlcourt.gov.cn/api/main/litigantPhoneLogin.jhtml',
      method: "GET",
      header: {
        'Content-Type': 'application/json'
      },
      data: {
        code, //参数
        state
      },
      success: (res) => {
        const code = res.statusCode;
        if (code >= 200 && code < 300) {
          resolve(res.data);
        } else {
          reject(res);
        }
      },
      fail: reject,
    });
  })
}
/**
 * 登录
 */
export const login = (username, password, type) => {
  return new Promise((resolve, reject) => {
    wx.request({
      url: 'https://court1.ptnetwork001.com/api/main/litigantPhoneLogin.jhtml',
      // url: 'https://dq.hlcourt.gov.cn/api/main/litigantPhoneLogin.jhtml',
      method: "GET",
      header: {
        'Content-Type': 'application/json'
      },
      data: {
        username, //参数
        password,
        type,
      },
      success: (res) => {
        const code = res.statusCode;
        if (code >= 200 && code < 300) {
          resolve(res.data);
        } else {
          reject(res);
        }
      },
      fail: reject,
    });
  })
}

/**
 * 庭审案件列表
 */
export const rtcCaseList = (caseNo, pageNumber) => {
  let sessionId = app.globalData.userInfo ? app.globalData.userInfo.sessionId : "";
  return new Promise((resolve, reject) => {
    wx.request({
      // url: 'https://dq.hlcourt.gov.cn/api/online/caseList.jhtml',
      url: 'https://court1.ptnetwork001.com/api/online/caseList.jhtml',
      method: "GET",
      header: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Cookie': 'JSESSIONID=' + sessionId,
      },
      data: {
        caseNo,
        pageNumber
      },
      success: (res) => {
        const code = res.statusCode;
        if (code >= 200 && code < 300) {
          resolve(res.data);
        } else {
          reject(res);
        }
      },
      fail: reject,
    });
  })
}


/**
 * 获取案件信息
 */
export const getLawCaseInfo = (lawCaseId) => {
  let sessionId = app.globalData.userInfo ? app.globalData.userInfo.sessionId : "";
  return new Promise((resolve, reject) => {
    wx.request({
      url: 'https://court1.ptnetwork001.com/api/online/getLawCaseInfo.jhtml',
      // url: 'https://dq.hlcourt.gov.cn/api/online/getLawCaseInfo.jhtml',
      method: "GET",
      header: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Cookie': 'JSESSIONID=' + sessionId,
      },
      data: {
        lawCaseId
      },
      success: (res) => {
        const code = res.statusCode;
        if (code >= 200 && code < 300) {
          resolve(res.data);
        } else {
          reject(res);
        }
      },
      fail: reject,
    });
  })
}

/**
 * 获取证据信息
 */
export const getEviByCaseId = (lawCaseId) => {
  let sessionId = app.globalData.userInfo ? app.globalData.userInfo.sessionId : "";
  return new Promise((resolve, reject) => {
    wx.request({

      url: 'https://court1.ptnetwork001.com/api/qtw/out/evi/getEviByCaseId.jhtml',
      // url: 'https://dq.hlcourt.gov.cn/api/qtw/out/evi/getEviByCaseId.jhtml',
      method: "GET",
      header: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Cookie': 'JSESSIONID=' + sessionId,
      },
      data: {
        lawCaseId
      },
      success: (res) => {
        const code = res.statusCode;
        if (code >= 200 && code < 300) {
          resolve(res.data);
        } else {
          reject(res);
        }
      },
      fail: reject,
    });
  })
}

/**
 * 获取签名信息
 */
export const createImg = () => {
  let sessionId = app.globalData.userInfo ? app.globalData.userInfo.sessionId : "";
  return new Promise((resolve, reject) => {
    wx.request({

      url: 'https://court1.ptnetwork001.com/api/online/createImg.jhtml',
      // url: 'https://dq.hlcourt.gov.cn/api/online/createImg.jhtml',
      method: "GET",
      header: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Cookie': 'JSESSIONID=' + sessionId,
      },
      data: {

      },
      success: (res) => {
        const code = res.statusCode;
        if (code >= 200 && code < 300) {
          resolve(res.data);
        } else {
          reject(res);
        }
      },
      fail: reject,
    });
  })
}

/**
 * 获取用户信息
 */
export const userDetail = (adminId) => {
  let sessionId = app.globalData.userInfo ? app.globalData.userInfo.sessionId : "";
  return new Promise((resolve, reject) => {
    wx.request({
      // url: 'https://dq.hlcourt.gov.cn/api/online/userDetail.jhtml',
      url: 'https://court1.ptnetwork001.com/api/online/userDetail.jhtml',
      method: "GET",
      header: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Cookie': 'JSESSIONID=' + sessionId,
      },
      data: {
        adminId
      },
      success: (res) => {
        const code = res.statusCode;
        if (code >= 200 && code < 300) {
          resolve(res.data);
        } else {
          reject(res);
        }
      },
      fail: reject,
    });
  })
}
