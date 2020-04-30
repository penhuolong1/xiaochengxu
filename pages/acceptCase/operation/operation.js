import { getMediater } from '../../../common/setcase'
import { getMByCId,distributeCase } from '../../../common/case'
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    caseId: "", // 案件id
    pageNumber: 1,// 后端返回的的页码
    pageNum: 1,// 前端访问的页码
    pageSize: 15, // 单页返回的数据量
    title: null, //显示的名字类型
    // 调解机构数组
    jigouType: [],
    peopleName: [], //调解员数组
    checkItem: {}, //选中的对象
    pageBack: null, // 返回的页数--用于成功之后
    courtId: "", //调解机构id
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    console.log(options.pageBack)
    this.setData({
      title: options.title? options.title:'操作',
      caseId: app.globalData.acceptCaseObj.caseId,
      pageBack: options.pageBack?options.pageBack:'',
      courtId: options.courtId?options.courtId:''
    })
    if(this.data.title=='分发机构'){
      this.getMediater();
    } else if(this.data.title=='调解员') {
      this.getMByCId();
    }
  },
  // 改变选中
  changeCheck(e) {
    if(this.data.title=='分发机构'){
      this.checkFn(this.data.jigouType,'jigouType',e.currentTarget.dataset.index);
    } else if(this.data.title=='调解员') {
      this.checkFn(this.data.peopleName,'peopleName',e.currentTarget.dataset.index);
    }
  },
  // 改变的数组内选中
  checkFn(ary,name,idx) {
    ary.map((item,index) => {
      let changeCheck=name+'['+index+'].check'
      this.setData({
        [changeCheck]: false
      })
    })
    let check=name+'['+idx+'].check'
    this.setData({
      [check]: true,
      checkItem: ary[idx]
    })
  },
  // 下拉加载更多
  loadingData() {
    var that = this;
    // 页数+1
    if(that.data.pageNum<that.data.pageNumber) {
      this.setData({
        pageNum: that.data.pageNum + 1,
      })
      if(this.data.title=='分发机构'){
        this.getMediater();
      } else if(this.data.title=='调解员') {
        this.getMByCId();
      }
    }
  },
  // 获取调解机构
  getMediater() {
    let that = this;
    getMediater(this.data.pageNum, this.data.pageSize).then(res => {
      if(res.state == 100){
        that.setData({
          jigouType: that.data.jigouType.concat(res.content), // 拼接数组
          pageNumber: res.totalPages
        })
      }
    })
  },
  // 获取调解员
  getMByCId() {
    let that = this;
    getMByCId(this.data.pageNum, this.data.pageSize,this.data.courtId).then(res => {
      if(res.state == 100){
        that.setData({
          peopleName: that.data.peopleName.concat(res.dataPage.content), // 拼接数组
          pageNum: res.dataPage.totalPages
        })
      }
    })
  },
  nextStep() {
    let changTit = ''; //传给下一页识别的名字
    let obj = {}; //传给接口调用的数据
    if(!this.data.caseId) {
      return false;
    }else {
      obj.caseId = this.data.caseId;
    }
    if(this.data.title=='分发机构'){
      changTit = "分发";
      obj.courtId = this.data.checkItem.id; 
      console.log('obj',obj)
      this.distributeCase(changTit,obj)
    } else if(this.data.title=='调解员') {
      changTit = "分配"
      obj.mediaterId = this.data.checkItem.id;
      this.distributeCase(changTit,obj)
    }
  },
  // 案件分发机构/案件分配调解人员
  distributeCase(title,obj) {
    let that = this;
    distributeCase(obj).then(res => {
      if(res.state == 100){
        wx.navigateTo({
          url: '/pages/acceptCase/operationSuccess/operationSuccess?title='+title+'&pageBack='+that.data.pageBack+"&courtId="+this.data.checkItem.id,
        })
      }
    })
  }
})