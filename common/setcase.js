import {
  http,
  upload
} from './request.js';
const app = getApp();


module.exports = {
  /**
   * 获取调解机构
   * @param {页码默认1} pageNum 
   * @param {每页记录数默认5} pageSize 
   */
  getMediater(pageNum, pageSize) {
    let sessionId = app.globalData.sessionId ? app.globalData.sessionId : "";
    return http({
      url: 'court/mediateter/getMediater.jhtml',
      data: {
        pageNum,
        pageSize
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
   * 添加案件
   */
  addCase() {
    let sessionId = app.globalData.sessionId ? app.globalData.sessionId : "";
    return http({
      url: 'court/case/addCase.jhtml',
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
   * 添加当事人--自然人
   */
  addLitigant(params) {
    let sessionId = app.globalData.sessionId ? app.globalData.sessionId : "";
    return http({
      url: 'court/litigant/addLitigant.jhtml',
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
   * 添加当事人--法人
   */
  addCompanyLit(params) {
    let sessionId = app.globalData.sessionId ? app.globalData.sessionId : "";
    return http({
      url: 'court/litigant/addCompanyLit.jhtml',
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
   * 添加代理人
   */
  addLawyer(params) {
    let sessionId = app.globalData.sessionId ? app.globalData.sessionId : "";
    return http({
      url: 'court/lawyer/addLawyer.jhtml',
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
   * 添加案件
   */
  submitCase(params) {
    let sessionId = app.globalData.sessionId ? app.globalData.sessionId : "";
    return http({
      url: 'court/case/submitCase.jhtml',
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
   * 上传身份信息(正)
   */
  uploadFrontImage(url) {
    let sessionId = app.globalData.userInfo ? app.globalData.userInfo.sessionId : "";
    return upload({
      url: 'court/wxRegister/uploadFrontImage.jhtml',
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
   *身份证正面照片识别
   *
   * @param {身份证正面照URL} url
   * @param {状态码：此处填-shenfenzheng} state
   * @returns
   */
  uploadWXFrontImage(url, state) {
    let sessionId = app.globalData.sessionId ? app.globalData.sessionId : "";
    return http({
      url: 'court/wxRegister/uploadWXFrontImage.jhtml',
      data: {
        url,
        state
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
   * 上传证据材料
   */
  addEvidence(params) {
    let sessionId = app.globalData.sessionId ? app.globalData.sessionId : "";
    return http({
      url: 'court/evidence/addEvidence.jhtml',
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
   *查询当事人详情
   *
   * @param {*} litigantId
   * @returns
   */
  selectLitigant(litigantId) {
    let sessionId = app.globalData.sessionId ? app.globalData.sessionId : "";
    return http({
      url: 'court/litigant/selectLitigant.jhtml',
      data: {
        litigantId
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
   *修改当事人--自然人
   *
   * @param {*} params
   * @returns
   */
  editLitigant(params) {
    let sessionId = app.globalData.sessionId ? app.globalData.sessionId : "";
    return http({
      url: 'court/litigant/editLitigant.jhtml',
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
   * 
   * @param {修改法人} params 
   */
  editCompanyLit(params) {
    let sessionId = app.globalData.sessionId ? app.globalData.sessionId : "";
    return http({
      url: 'court/litigant/editCompanyLit.jhtml',
      data: params,
      method: 'get',
      isloading: true,
      header: {
        "Content-Type": "application/json;charset=UTF-8",
        'Cookie': 'JSESSIONID=' + sessionId,
      }
    })
  },
  // 添加或者修改代理人
  addOrUpdateLawyer(params) {
    let sessionId = app.globalData.sessionId ? app.globalData.sessionId : "";
    return http({
      url: 'court/lawyer/addOrUpdateLawyer.jhtml',
      data: params,
      method: 'post',
      isloading: true,
      header: {
        "Content-Type": "application/json;charset=UTF-8",
        'Cookie': 'JSESSIONID=' + sessionId,
      }
    })
  },
  // 获取代理人信息
  getLaywer(params) {
    let sessionId = app.globalData.sessionId ? app.globalData.sessionId : "";
    return http({
      url: 'court/lawyer/detailById.jhtml',
      data: params,
      method: 'get',
      isloading: true,
      header: {
        "Content-Type": "application/json;charset=UTF-8",
        'Cookie': 'JSESSIONID=' + sessionId,
      }
    })
  },
  // 上传证据新
  addEvidenceNew(params) {
    let sessionId = app.globalData.sessionId ? app.globalData.sessionId : "";
    return http({
      url: 'court/evidence/addOrUpdateEvi.jhtml',
      data: params,
      method: 'post',
      isloading: true,
      header: {
        "Content-Type": "application/json;charset=UTF-8",
        'Cookie': 'JSESSIONID=' + sessionId,
      }
    })
  },
}