import {
  http,
  upload
} from './request.js';
const app = getApp();


module.exports = {
  /**
   * 各角色人员查询案件，支持模糊搜索
   * @param {页码} pageNumber 
   * @param {每页记录数默认5} pageSize 
   * @param {关键字搜索} sqCaseNo 
   * @param {案件进程：0：未申请；1：已申请；2：已受理；3：已分发；4：已分配；5：调解中·；6：调解结束；} process 
   * @param {审核意见 0未审核 1 同意 2 不同意 3 补正} acceptance 
   */
  selectCase(params) {
    let sessionId = app.globalData.sessionId ? app.globalData.sessionId : "";
    return http({
      url: 'court/case/selectCase.jhtml',
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
  // 获取案由
  getBrief(params) {
    let sessionId = app.globalData.sessionId ? app.globalData.sessionId : "";
    return http({
      url: 'court/case/getBrief.jhtml',
      data: params,
      method: 'get',
      isloading: true,
      header: {
        "Content-Type": "application/json;charset=UTF-8",
        'Cookie': 'JSESSIONID=' + sessionId,
      }
    })
  },
  /**
   * 案件详情
   * @param {案件id} lawCaseId 
   */
  detailsCase(lawCaseId) {
    let sessionId = app.globalData.sessionId ? app.globalData.sessionId : "";
    return http({
      url: 'court/case/detailsCase.jhtml',
      data: {
        lawCaseId
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
   * 删除案件
   * @param {案件id} caseId 
   */
  deleteCase(caseId) {
    let sessionId = app.globalData.sessionId ? app.globalData.sessionId : "";
    return http({
      url: 'court/case/deleteCase.jhtml',
      data: {
        caseId
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
   * 根据机构id获取调解人员
   * @param {页码} pageNum 
   * @param {每页记录数默认5} pageSize 
   * @param {机构id} courtId 
   */
  getMByCId(pageNum, pageSize, courtId) {
    let sessionId = app.globalData.sessionId ? app.globalData.sessionId : "";
    return http({
      url: 'court/mediateter/getMByCId.jhtml',
      data: {
        pageNum,
        pageSize,
        courtId
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
   * 根据机构id/调解人员id分发/分配案件
   * @param {案件id} caseId 
   * @param {机构id，存在时为分发机构，与mediaterId不可同时存在}  courtId
   * @param {调解人员id，存在时分配调解员，与courtId不可同时存在} mediaterId
   */
  distributeCase(param) {
    let sessionId = app.globalData.sessionId ? app.globalData.sessionId : "";
    return http({
      url: 'court/case/distributeCase.jhtml',
      data: param,
      method: 'get',
      header: {
        "Content-Type": "application/json;charset=UTF-8",
        'Cookie': 'JSESSIONID=' + sessionId,
      }
    })
  },
  /**
   * 案件审核
   * @param {案件id--是} caseId 
   * @param {1为修改登字号/调解号 2为审核意见--是} step 
   * @param {登字号 （step为1传值）} casenNo 
   * @param {调解号 （step为1传值）} sqCaseNo 
   * @param {审核意见 0未审核；1同意；2不同意；3补正 （step为2传值）} acceptance 
   * @param {补正意见 （step为2传值）} opinion 
   */
  acceptCase(param) {
    let sessionId = app.globalData.sessionId ? app.globalData.sessionId : "";
    return http({
      url: 'court/case/acceptCase.jhtml',
      data: param,
      method: 'get',
      header: {
        "Content-Type": "application/json;charset=UTF-8",
        'Cookie': 'JSESSIONID=' + sessionId,
      }
    })
  },
  /**
   *获取登字号/调解号
   *
   * @param {“1”:查询登字号,”2”查询调解号} type
   * @returns
   */
  getCaseNo(type) {
    let sessionId = app.globalData.sessionId ? app.globalData.sessionId : "";
    return http({
      url: 'court/case/getCaseNo.jhtml',
      data: {
        type
      },
      method: 'get',
      header: {
        "Content-Type": "application/json;charset=UTF-8",
        'Cookie': 'JSESSIONID=' + sessionId,
      }
    })
  },
  // 案件证据详情
  detailsEvidence(lawCaseId, litigantStatus) {
    let sessionId = app.globalData.sessionId ? app.globalData.sessionId : "";
    return http({
      url: 'court/evidence/detailsEvidence.jhtml',
      data: {
        lawCaseId,
        litigantStatus
      },
      method: 'get',
      header: {
        "Content-Type": "application/json;charset=UTF-8",
        'Cookie': 'JSESSIONID=' + sessionId,
      }
    })
  },
  // 获取用户信息
  userInfo() {
    let sessionId = app.globalData.sessionId ? app.globalData.sessionId : "";
    return http({
      url: 'main/getUserInfo.jhtml',
      method: 'get',
      header: {
        "Content-Type": "application/json;charset=UTF-8",
        'Cookie': 'JSESSIONID=' + sessionId,
      }
    })
  },
  // 上传语音
  uploadVoice(url) {
    let sessionId = app.globalData.sessionId ? app.globalData.sessionId : "";
    return upload({
      url: 'court/group/uploadVoice.jhtml',
      filePath: url,
      name: "file",
      // formData:{},
      header: {
        "Content-Type": " multipart/form-data",
        'Cookie': 'JSESSIONID=' + sessionId,
      }
    })
  },
  // 上传文件
  uploadFile(url) {
    let sessionId = app.globalData.sessionId ? app.globalData.sessionId : "";
    return upload({
      url: "court/group/uploadImage.jhtml",
      header: {
        "Content-Type": "multipart/form-data",
        'Cookie': 'JSESSIONID=' + sessionId,
      },
      filePath: url,
      name: "file",
    });
  },
  // 获取用户信息
  downRecord(params) {
    let sessionId = app.globalData.sessionId ? app.globalData.sessionId : "";
    return http({
      url: 'court/group/downloadMessage.jhtml',
      method: 'get',
      data: params,
      header: {
        "Content-Type": "application/json;charset=UTF-8",
        'Cookie': 'JSESSIONID=' + sessionId,
      }
    })
  },
  // 进入房间
  intoTalkRoom(params) {
    let sessionId = app.globalData.sessionId ? app.globalData.sessionId : "";
    return http({
      url: 'court/room/talkRoom.jhtml',
      method: 'post',
      data: params,
      header: {
        "Content-Type": "application/json;charset=UTF-8",
        'Cookie': 'JSESSIONID=' + sessionId,
      }
    })
  },
  // 上传签名
  uploadSign(params) {
    let sessionId = app.globalData.sessionId ? app.globalData.sessionId : "";
    return http({
      url: 'court/group/uploadSign.jhtml',
      method: 'post',
      data: params,
      header: {
        "Content-Type": "application/json;charset=UTF-8",
        'Cookie': 'JSESSIONID=' + sessionId,
      }
    })
  },
  // 删除记录
  deleteMessage(params) {
    let sessionId = app.globalData.sessionId ? app.globalData.sessionId : "";
    return http({
      url: 'court/group/deleteMessage.jhtml',
      method: 'post',
      data: params,
      header: {
        "Content-Type": "application/json;charset=UTF-8",
        'Cookie': 'JSESSIONID=' + sessionId,
      }
    })
  }
}
