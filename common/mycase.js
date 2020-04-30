import { http, upload } from './request.js';
const app = getApp();

module.exports = {
 /**
 * 获得我的案件列表
 * caseNo 案件编号  支持模糊查询
 * isFinsh  是否结案 true和false 
 * regiterTimeSort   立案时间排序  desc 和asc  默认desc
 * pageSize  默认15
 * pageNumber  默认1
 */
  wxLitigantLawCaseList(caseNo, isFinsh, regiterTimeSort, pageSize, pageNumber) {
    let sessionId = app.globalData.userInfo ? app.globalData.userInfo.sessionId : "";
    return http({
      url: 'court/case/wxLitigantLawCaseList.jhtml',
      data: { caseNo, isFinsh, regiterTimeSort, pageSize, pageNumber },
      method: 'get',
      header: {
        "Content-Type": "application/json;charset=UTF-8",
        'Cookie': 'JSESSIONID=' + sessionId,
      }
    })
  },
  /**
 * 保存确认送达地址接口
 * lawCaseId   	案件id
 * sendAddress  	送达地址 
 */
  wxSaveChoiceSendInfo(lawCaseId, sendAddress) {
    let sessionId = app.globalData.userInfo ? app.globalData.userInfo.sessionId : "";
    return http({
      url: 'mobile/send/wxSaveChoiceSendInfo.jhtml',
      data: { lawCaseId, sendAddress },
      method: 'get',
      header: {
        "Content-Type": "application/json;charset=UTF-8",
        'Cookie': 'JSESSIONID=' + sessionId,
      }
    })
  },
  /**
 * 获案件信息
 * @param {案件ID} lowCaseId 
 */
  wxLawCaseLitigantList(lawCaseId) {
    let sessionId = app.globalData.userInfo ? app.globalData.userInfo.sessionId : "";
    return http({
      url: 'court/case/wxLawCaseLitigantList.jhtml',
      data: { lawCaseId},
      method: 'get',
      header: {
        "Content-Type": "application/json;charset=UTF-8",
        'Cookie': 'JSESSIONID=' + sessionId,
      }
    })
  },
  /**
   * 获取案件时间轴
   */
  queryProcessNote(lawCaseId) {
    let sessionId = app.globalData.userInfo ? app.globalData.userInfo.sessionId : "";
    return http({
      url: 'main/queryProcessNote.jhtml',
      data: { lawCaseId },
      method: 'get',
      header: {
        "Content-Type": "application/json;charset=UTF-8",
        'Cookie': 'JSESSIONID=' + sessionId,
      }
    })
  },
  /**
   * 获得质证意见列表
   */
  getReverts(lawCaseId) {
    let sessionId = app.globalData.userInfo ? app.globalData.userInfo.sessionId : "";
    return http({
      url: 'qtw/reverts/getReverts.jhtml',
      data: { lawCaseId },
      method: 'get',
      header: {
        "Content-Type": "application/json;charset=UTF-8",
        'Cookie': 'JSESSIONID=' + sessionId,
      }
    })
  },
  /**
   * 获取证据以及质证信息
   */
  getEvidenceReverts(evidenceId) {
    let sessionId = app.globalData.userInfo ? app.globalData.userInfo.sessionId : "";
    return http({
      url: 'qtw/reverts/getEvidenceReverts.jhtml',
      data: { evidenceId },
      method: 'get',
      header: {
        "Content-Type": "application/json;charset=UTF-8",
        'Cookie': 'JSESSIONID=' + sessionId,
      }
    })
  },
  /**
  *获取案件列表
  */
  getlawcaselist(searchData, pageData) {
    let sessionId = app.globalData.userInfo ? app.globalData.userInfo.sessionId : "";
    return http({
      url: 'qtw/controversy/lawcaselist.jhtml',
      data: {
        caseNo: searchData.caseNo,
        litigantName: searchData.litigantName,
        states: searchData.states,
        briefName: searchData.briefName,
        filingDate: searchData.filingDate,
        pageSize: pageData.pageSize,
        pageNumber: pageData.pageNumber,
        },
      method: 'get',
      header: {
        "Content-Type": "application/json;charset=UTF-8",
        'Cookie': 'JSESSIONID=' + sessionId,
      }
    })
  },
  /**
   * 获得证据列表
   */
  getEviByCaseId(lawCaseId, isself) {
    let sessionId = app.globalData.userInfo ? app.globalData.userInfo.sessionId : "";
    return http({
      url: 'qtw/evi/getEviByCaseId.jhtml',
      data: { lawCaseId, isself },
      method: 'get',
      header: {
        "Content-Type": "application/json;charset=UTF-8",
        'Cookie': 'JSESSIONID=' + sessionId,
      }
    })
  },
  /**
   * 根据证据id提交证据
   */
  checkEvi(lawCaseId, evidenceId) {
    let sessionId = app.globalData.userInfo ? app.globalData.userInfo.sessionId : "";
    return http({
      url: 'qtw/evi/checkEvi.jhtml',
      data: { lawCaseId, evidenceId },
      method: 'get',
      header: {
        "Content-Type": "application/json;charset=UTF-8",
        'Cookie': 'JSESSIONID=' + sessionId,
      }
    })
  },
  /**
   * 根据证据id删除证据
   */
  delEvidence(lawCaseId, evidenceId) {
    let sessionId = app.globalData.userInfo ? app.globalData.userInfo.sessionId : "";
    return http({
      url: 'qtw/evi/delEvidence.jhtml',
      data: { lawCaseId, evidenceId },
      method: 'get',
      header: {
        "Content-Type": "application/json;charset=UTF-8",
        'Cookie': 'JSESSIONID=' + sessionId,
      }
    })
  },
  /**
   * 根据证据id删除证据
   */
  getEviById(lawCaseId, evidenceId) {
    let sessionId = app.globalData.userInfo ? app.globalData.userInfo.sessionId : "";
    return http({
      url: 'qtw/evi/getEviById.jhtml',
      data: { lawCaseId, evidenceId },
      method: 'get',
      header: {
        "Content-Type": "application/json;charset=UTF-8",
        'Cookie': 'JSESSIONID=' + sessionId,
      }
    })
  },
  /**
  * 根据证据id删除证据
  */
  wxLitigantSendDiplomsList(lawCaseId, pageSize, pageNumber) {
    let sessionId = app.globalData.userInfo ? app.globalData.userInfo.sessionId : "";
    return http({
      url: 'dp/wxLitigantSendDiplomsList.jhtml',
      data: { lawCaseId, pageSize, pageNumber },
      method: 'get',
      header: {
        "Content-Type": "application/json;charset=UTF-8",
        'Cookie': 'JSESSIONID=' + sessionId,
      }
    })
  },
  /**
* 证据文件上传
*/
  upFile(url) {
    let sessionId = app.globalData.userInfo ? app.globalData.userInfo.sessionId : "";
    return upload({
      url: 'qtw/evi/upFile.jhtml',
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
 * 添加/修改证据
 */
  addEvi(data) {
    let sessionId = app.globalData.userInfo ? app.globalData.userInfo.sessionId : "";
    return http({
      url: 'qtw/evi/addEvi.jhtml?lawCaseId=' + data.lawCaseId + '&eviprove=' + data.eviprove + '&eviname=' + data.eviname + '&evisource=' + data.evisource + '&pageNo=' + data.pageNo + '&evidenceId=' + data.evidenceId + '&litigantId=' + data.litigantId,
      data: { 
        filePath: data.filePath
      },
      method: 'post',
      header: {
        "Content-Type": "application/json;charset=UTF-8",
        'Cookie': 'JSESSIONID=' + sessionId,
      }
    })
  },
  /**
  * 根据证据id删除证据文件
  */
  deleteFile(lawCaseId, evidenceId, fileId) {
    let sessionId = app.globalData.userInfo ? app.globalData.userInfo.sessionId : "";
    return http({
      url: 'qtw/filepath/deleteFile.jhtml',
      data: { lawCaseId, evidenceId, fileId },
      method: 'get',
      header: {
        "Content-Type": "application/json;charset=UTF-8",
        'Cookie': 'JSESSIONID=' + sessionId,
      }
    })
  },
  /**
  * 诉讼费计算
  *type 类型
  *basicCost 基础费用
  *applyStandard 标的
  */
  litigationFeeCalculation(type, basicCost, applyStandard) {
    let sessionId = app.globalData.userInfo ? app.globalData.userInfo.sessionId : "";
    return http({
      url: 'main/litigationFeeCalculation.jhtml',
      data: { type, basicCost, applyStandard },
      method: 'get',
      header: {
        "Content-Type": "application/json;charset=UTF-8",
        'Cookie': 'JSESSIONID=' + sessionId,
      }
    })
  },
}