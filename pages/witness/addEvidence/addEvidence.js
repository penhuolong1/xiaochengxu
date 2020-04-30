// pages/witness/addEvidence/addEvidence.js
import { getEviById, upFile, addEvi, deleteFile  } from '../../../common/mycase';
var util = require('../../../common/utils.js')
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    evidencInfo:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: '#40A9FF',
      animation: {
        duration: 400,
        timingFunc: 'easeInOut'
      }
    })
    if (app.globalData.nowEvidenceId != ""){
      wx.setNavigationBarTitle({
        title: '编辑证据'
      })
      this.getEviInfo();
    }else{
      wx.setNavigationBarTitle({
        title: '添加证据'
      })
      let obj = {
        name: "",
        pageno: 1,
        prove: "",
        source: "",
        evidenceId:"",
        file:[],
      }
      this.setData({
        evidencInfo:obj
      })
    }
    
  },
  getEviInfo (){
    getEviById(app.globalData.nowMyCaseId, app.globalData.nowEvidenceId).then(res => {
      this.setData({
        evidencInfo: res.result
      })
    })
  },
  submits(){
    let arr = [];
    let ary = this.data.evidencInfo.file;
    ary.map(item => {
      if (item.fileId == ""){
        arr.push(item.fileAddr)
      }
    })
    if (ary.length < 1){
      wx.showToast({
        icon: "none",
        title: '请上传证据文件'
      })
      return false;
    }
    let data = {
      lawCaseId: app.globalData.nowMyCaseId,
      eviprove: this.data.evidencInfo.prove,
      eviname: this.data.evidencInfo.name,
      evisource: this.data.evidencInfo.source,
      pageNo: this.data.evidencInfo.pageno,
      evidenceId: this.data.evidencInfo.evidenceId,
      litigantId: '',
      filePath: arr.join(",")
    }
    addEvi(data).then(res => {
      if (this.data.evidencInfo.evidenceId == ""){
        wx.showToast({
          icon: "success",
          title: '添加成功'
        })
      }else{
        wx.showToast({
          icon: "success",
          title: '修改成功'
        })
      }
      setTimeout(()=>{
        wx.navigateBack({ delta: 1 })
      },1500)
    })
  },
  delEvi(e){
    let datas = e.currentTarget.dataset.dt;
    let objs = this.data.evidencInfo;
    if (datas.fileId == ""){
      for (let i = 0; i < objs.file.length; i++) {
        if (datas.fileAddr == objs.file[i].fileAddr) {
          objs.file.splice(i, 1)
          break;
        }
      }
      this.setData({
        evidencInfo: objs
      })
    }else{
      deleteFile(app.globalData.nowMyCaseId, objs.evidenceId, datas.fileId).then(res => {
        wx.showToast({
          icon: "success",
          title: '删除成功'
        })
        for (let i = 0; i < objs.file.length; i++) {
          if (datas.fileAddr == objs.file[i].fileAddr) {
            objs.file.splice(i, 1)
            break;
          }
        }
        this.setData({
          evidencInfo: objs
        })
      })
    }
    
    
  },
  selectFiles(){
    let that = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        // tempFilePath可以作为img标签的src属性显示图片
        const tempFilePaths = res.tempFilePaths
        console.log(res)
        console.log(tempFilePaths)
        upFile(tempFilePaths[0]).then(res => {
          wx.showToast({
            icon: "success",
            title: '上传成功'
          })
          let arr = that.data.evidencInfo;
          let aryss = res.filePath.split(".");
          let xar = aryss[aryss.length - 2].split("/");
          console.log(xar);
          let type = aryss[aryss.length - 1];
          let name = xar[xar.length - 1];
          let names= name + "." + type; //图片名
          let obj = {
            fileAddr: res.filePath,
            fileName: names,
            fileType:"",
            fileId:"",
          }
          arr.file.push(obj);
          that.setData({
            evidencInfo: arr
          })
        })
      }
    })
  },
  getEvidenceName(e){
    let obj = this.data.evidencInfo;
    obj.name = e.detail.detail.value;
    this.setData({
      evidencInfo: obj
    })
    console.log(this.data.evidencInfo)
  },
  getEvidenceprove(e){
    let obj = this.data.evidencInfo;
    obj.prove = e.detail.detail.value;
    this.setData({
      evidencInfo: obj
    })
  },
  getEvidencesource(e) {
    let obj = this.data.evidencInfo;
    obj.source = e.detail.detail.value;
    this.setData({
      evidencInfo: obj
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})