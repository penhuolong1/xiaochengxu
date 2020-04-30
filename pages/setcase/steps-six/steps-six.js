// pages/setcase/EvidenceMaterial/EvidenceMaterial.js
import {
  uploadFrontImage,
  addEvidence,
  addEvidenceNew
} from '../../../common/setcase';
import {
  detailsCase
} from '../../../common/case';
const app = getApp();
import {
  IMGURL,
  SERVICEURL
} from '../../../common/constVal'
let setcaseInfo = app.globalData.setcaseInfo;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    statusBarHeight: app.globalData.statusBarHeight, // 头部的自定义的高度
    litigantId: "", // 当事人id
    eviName: "", //证据名称
    objectOfProof: "", //证明对象
    urls: "", // 上传用的
    photoUrl1: "", //展示用的
    allEvidenceAry: [{
      eviName: '',
      objectOfProof: '',
      source: '',
      count: '',
      litigantId: '',
      imgAry: [
        // {
        //   viewImg: "",//显示的图片路径
        //   uploadImg: "",// 上传的图片路径
        // }
      ]
    }],
    imgUrl: IMGURL,
    caseId: '',
    // caseId: app.globalData.setcaseInfo.lawCaseId,
    litigants: [], // 案件相关当事人
    isShowDetail: true
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.caseId) {
      this.setData({
        caseId: options.caseId
      })
    } else {
      this.setData({
        caseId: app.globalData.setcaseInfo.lawCaseId
      })
    }
    if (options.isShowDetail == 1) {
      this.setData({
        isShowDetail: false
      })
    }
    this.detailsCase(this.data.caseId)
  },
  onShow() {
    console.log(app.globalData.setcaseInfo.lawCaseId)
    // this.detailsCase(app.globalData.setcaseInfo.lawCaseId)
    // this.detailsCase(this.data.caseId)
  },
  //回退
  back() {
    wx.navigateBack({
      delta: 1
    })
  },
  nextStep() {
    let flog = 0; // 标记数据是否完整 1 不完整 0完整
    this.data.allEvidenceAry.map((item, index) => {
      if (item.eviName == "" || item.imgAry.length == 0) {
        flog = 1;
        wx.showToast({
          icon: "none",
          title: "数据请填写完整"
        })
      }
    })
    if (flog == 0) {
      this.data.allEvidenceAry.map((item, index) => {
        let litigantId = this.data.litigants[item.litigantId].id
        let obj = {
          litigantId: litigantId,
          eviName: item.eviName,
          objectOfProof: item.objectOfProof,
          source: item.source,
          count: Number(item.count),
          urls: item.imgAry.map(item1 => item1.uploadImg).join(',')
        }
        this.addEvidence(obj, index + 1)
      })
    }
  },
  // 添加
  addObj() {
    let obj = [{
      eviName: '',
      objectOfProof: '',
      source: '',
      count: '',
      litigantId: '',
      imgAry: [
        // {
        //   viewImg: "",//显示的图片路径
        //   uploadImg: "",// 上传的图片路径
        // }
      ]
    }]
    this.setData({
      allEvidenceAry: this.data.allEvidenceAry.concat(obj), // 拼接数组
    })
  },
  // 证据保存 obj保存的数据，length判断是否保存到最后一条了
  addEvidence(obj, length) {
    addEvidenceNew(obj).then(res => {
      if (res.state == 100) {
        if (length == this.data.allEvidenceAry.length) {
          wx.navigateTo({
            url: '/pages/setcase/steps-preview/steps-preview?operation=add',
          })
        }
      }
    })
    // wx.navigateTo({
    //   url: '/pages/setcase/steps-preview/steps-preview?operation=add',
    // })
  },
  // 查看案件详情
  detailsCase(id) {
    detailsCase(id).then(res => {
      if (res.state == 100) {
        let eviAry = []
        let data = res.lawCase
        if (data.litigants && data.litigants.length > 0) {
          data.litigants.forEach((item, index) => {
            if (item.evidences && item.evidences.length > 0) {
              item.evidences.forEach(item1 => {
                let imgObj1 = []
                if (item1.evidenceAttachments && item1.evidenceAttachments.length > 0) {
                  item1.evidenceAttachments.forEach(item2 => {
                    let obj1 = {
                      viewImg: `${SERVICEURL}${item2.url}`,
                      uploadImg: item2.url
                    }
                    imgObj1.push(obj1)
                  })
                }
                let obj = {
                  eviName: item1.evidenceName,
                  objectOfProof: item1.objectOfProof,
                  source: item1.source,
                  count: item1.count,
                  litigantId: index,
                  imgAry: [...imgObj1]
                }
                eviAry.push(obj)
              })
            }
          })
        }
        if (eviAry.length > 0) {
          this.setData({
            allEvidenceAry: eviAry
          })
        }
        this.setData({
          litigants: [...res.lawCase.litigants]
        })
      }
    })
  },
  // 获取提供人
  getlitigantId(e) {
    let index = e.currentTarget.dataset.type
    let value = e.detail.value
    let ary = this.data.allEvidenceAry
    ary[index].litigantId = value
    this.setData({
      allEvidenceAry: ary
    })
  },
  //上传照片
  uploadImg(e) {
    let index = e.currentTarget.dataset.index;
    let name = 'allEvidenceAry[' + index + '].imgAry'; //需要添加照片的数组
    let that = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        const tempFilePaths = res.tempFilePaths
        console.log(tempFilePaths[0])
        uploadFrontImage(tempFilePaths[0]).then(res => {
          wx.showToast({
            title: res.message,
            icon: 'success',
            duration: 1500
          })
          let ary = [{
            viewImg: tempFilePaths[0], //显示的图片路径
            uploadImg: res.url, // 上传的图片路径
          }]
          that.setData({
            [name]: that.data.allEvidenceAry[index].imgAry.concat(ary), // 拼接数组
          })
        })
      }
    })
  },
  //图片点击事件
  imgYu(event) {
    console.log(event)
    var src = event.currentTarget.dataset.src; //获取data-src
    var imgList = event.currentTarget.dataset.list.map(obj => {
      return obj.viewImg
    }); //获取data-list
    //图片预览
    wx.previewImage({
      current: src, // 当前显示图片的http链接
      urls: imgList // 需要预览的图片http链接列表
    })
  },
  // 删除 某条证据
  del(e) {
    let index1 = e.currentTarget.dataset.index;
    this.data.allEvidenceAry.splice(index1, 1)
    this.setData({
      allEvidenceAry: this.data.allEvidenceAry
    })
  },
  // 删除 某张图片
  delImg(e) {
    let index1 = e.currentTarget.dataset.index; // 证据index
    let index2 = e.currentTarget.dataset.img; // 图片index
    this.data.allEvidenceAry[index1].imgAry.splice(index2, 1)
    this.setData({
      allEvidenceAry: this.data.allEvidenceAry
    })
  },
  geteviName(e) {
    let index = e.currentTarget.dataset.index;
    let name = 'allEvidenceAry[' + index + '].eviName'
    this.setData({
      [name]: e.detail.detail.value
    })
  },
  getobjectOfProof(e) {
    let index = e.currentTarget.dataset.index;
    let name = 'allEvidenceAry[' + index + '].objectOfProof'
    this.setData({
      [name]: e.detail.detail.value
    })
  },
  getsource(e) {
    let index = e.currentTarget.dataset.index;
    let name = 'allEvidenceAry[' + index + '].source'
    this.setData({
      [name]: e.detail.detail.value
    })
  },
  getCount(e) {
    let index = e.currentTarget.dataset.index;
    let name = 'allEvidenceAry[' + index + '].count'
    this.setData({
      [name]: e.detail.detail.value
    })
  },
  // 下一步
  nextStep1() {
    wx.navigateTo({
      url: '/pages/setcase/steps-preview/steps-preview?operation=add',
    })
  }
})
