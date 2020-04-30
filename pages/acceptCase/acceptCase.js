import {
  selectCase,
  getBrief,
  acceptCase,
  getCaseNo
} from '../../common/case';
var app = getApp();
Page({
  data: {
    process: 1, //案件进程：0：未申请；1：已申请；2：已受理；3：已分发；4：已分配；5：调解中·；6：待调解；7:调解成功；
    caseType: 0, // 0表示审核 1表示分发  2表示分配
    pageNumber: 1, // 后端返回的的页码
    pageNum: 1, // 前端访问的页码
    pageSize: 15, // 单页返回的数据量
    isLoading: false, //是否加载中
    caseList: [], //案件列表
    tip: '暂无数据',
    isOverStr: true, //案件 已申请/未申请
    acceptance: 0, //0未审核；1同意；2不同意；3补正
    isDisStr: false, // 案件 已分配/未分配
    keyWords: "", //关键字搜索
    briefNum: 1, // 案由页码
    briefAry: [], //案由数组
  },
  onShow() {
    this.setData({
      caseList: []
    })
    // this.selectCase();
    if (this.data.caseType == 0) {
      this.getBrief();
    }
  },
  onLoad() {
    this.setData({
      pageNumber: 1,
      caseList: []
    })
    this.selectCase();
    this.getBrief();
  },
  // 各角色人员查询案件，支持模糊搜索
  selectCase() {
    let that = this;
    let data = {
      pageNum: this.data.pageNum,
      pageSize: this.data.pageSize,
      process: this.data.process
    }
    selectCase(data).then(res => {
      if (res.state == 100) {
        that.setData({
          caseList: that.data.caseList.concat(res.result.content), // 拼接数组
          pageNumber: res.result.totalPages
        })
        if (that.data.pageNum == 1 && that.data.caseList.length == 0) {
          that.setData({
            tip: '暂无数据',
            isLoading: false,
          })
        }
      }
    })
  },
  getBrief() {
    let obj = {
      pageNum: this.data.briefNum,
      pageSize: 8
    }
    let that = this;
    getBrief(obj).then(res => {
      if (res.state == 100) {
        that.setData({
          briefAry: that.data.briefAry.concat(res.briefPage.content), // 拼接数组
        })
        if (that.data.briefNum < res.briefPage.totalPages) {
          that.setData({
            briefNum: that.data.briefNum + 1
          })
          that.getBrief();
        }
      }
    })
  },
  // 选中标题
  handleChange(e) {
    if (e.currentTarget.dataset.text == '审核') {
      if (this.data.caseType !== 0) {
        this.setData({
          process: 1,
          caseType: 0,
          isOverStr: true, //案件 已申请/未申请
          acceptance: 0, //0未审核；1同意；2不同意；3补正
          isDisStr: false, // 案件 已分配/未分配
          keyWords: "", //关键字搜索
          caseList: []
        })
        this.selectCase();
      }
    } else if (e.currentTarget.dataset.text == '分发') {
      if (this.data.caseType !== 1) {
        this.setData({
          process: 2,
          caseType: 1,
          isOverStr: true, //案件 已申请/未申请
          acceptance: 0, //0未审核；1同意；2不同意；3补正
          isDisStr: false, // 案件 已分配/未分配
          keyWords: "", //关键字搜索
          caseList: []
        })
        this.selectCase();
      }
    } else if (e.currentTarget.dataset.text == '分配') {
      if (this.data.caseType !== 2) {
        this.setData({
          process: 3,
          caseType: 2,
          caseList: []
        })
        this.selectCase();
      }
    }
  },
  // 改变传的文字
  changeTxt() {
    let type = 'null';
    if (this.data.caseType == 0) {
      return type = '审核'
    } else if (this.data.caseType == 1) {
      return type = '分发'
    } else if (this.data.caseType == 2) {
      return type = '分配'
    }
  },
  // 跳转的页面
  changeUrl(e) {
    app.globalData.acceptCaseObj.caseId = e.currentTarget.dataset.item.lawCaseId;
    if (e.currentTarget.dataset.text == '案件信息') {
      let type = this.changeTxt();
      wx.navigateTo({
        url: '/pages/caseList/caseInfo/caseInfo?caseId=' + app.globalData.acceptCaseObj.caseId + '&type=view',
      })
    } else {
      let title = e.currentTarget.dataset.text;
      if (title == '分发机构' && this.data.caseType == 1) {
        wx.navigateTo({
          url: '/pages/acceptCase/operation/operation?title=' + title,
        })
      } else if (title == '调解员') {
        let courtId = e.currentTarget.dataset.item.courtId;
        wx.navigateTo({
          url: '/pages/acceptCase/operation/operation?title=' + title + '&courtId=' + courtId,
        })
      }

    }
  },
  // 改变下拉的显示隐藏
  openDetail(e) {
    this.data.caseList.map((item, index) => {
      if (index !== e.currentTarget.dataset.check) {
        let closeCheck = 'caseList[' + index + '].check'
        this.setData({
          [closeCheck]: false
        })
      } else {
        let changeCheck = 'caseList[' + e.currentTarget.dataset.check + '].check'
        this.setData({
          [changeCheck]: !this.data.caseList[e.currentTarget.dataset.check].check
        })
      }
    })
    // 数据初始化
    if (!this.data.caseList[e.currentTarget.dataset.check].check) {
      let name1 = 'caseList[' + e.currentTarget.dataset.check + '].optionBox'
      let name2 = 'caseList[' + e.currentTarget.dataset.check + '].optionType'
      let name3 = 'caseList[' + e.currentTarget.dataset.check + '].sqCaseNo'
      this.setData({
        [name1]: false,
        [name2]: "",
        // [name3]: ""
      })
    }
  },
  // 审核意见框显示隐藏
  openMinBox(e) {
    if (this.data.caseType == 0) {
      let name1 = 'caseList[' + e.currentTarget.dataset.index + '].optionBox'
      this.setData({
        [name1]: !this.data.caseList[e.currentTarget.dataset.index].optionBox
      })
    }
  },
  // 审核意见框选项
  changeOption(e) {
    let name1 = 'caseList[' + e.currentTarget.dataset.index + '].optionType'
    if (this.data.caseList[e.currentTarget.dataset.index].optionType == e.currentTarget.dataset.num) {
      this.setData({
        [name1]: ""
      })
    } else {
      this.setData({
        [name1]: e.currentTarget.dataset.num
      })
      // 勾选同意
      if (this.data.caseList[e.currentTarget.dataset.index].optionType == 1) {
        this.getCaseNo(2);
      }
    }
  },
  // 获取登字号
  getCaseNo(type) {
    getCaseNo(type).then(res => {
      if (res.state == 100) {
        this.data.caseList.map((item, index) => {
          if (item.check) {
            let write = 'caseList[' + index + '].sqCaseNo'
            this.setData({
              [write]: res.data
            })
          }
        })
      }
    })
  },
  // 下拉加载更多
  loadingData() {
    var that = this;
    // 页数+1
    if (that.data.pageNum < that.data.pageNumber) {
      this.setData({
        pageNum: that.data.pageNum + 1,
      })
      this.selectCase();
    }
  },
  // 确认
  nextStep(e) {
    let item = e.currentTarget.dataset.item;
    let obj = {
      caseId: item.lawCaseId,
      sqCaseNo: item.sqCaseNo ? item.sqCaseNo : "",
      briefId: item.brife && JSON.stringify(item.brife) !== "{}" ? item.brife.id : "",
      acceptance: item.optionType ? item.optionType : "",
    }
    if (item.optionType == 3) {
      obj.opinion = item.opinion ? item.opinion : ''
    }
    this.acceptCase(obj);
  },
  // 案件审核
  acceptCase(obj) {
    acceptCase(obj).then(res => {
      if (res.state == 100) {
        this.setData({
          pageNum: 1,
          caseList: []
        })
        this.selectCase();
      }
    })
  },
  //获取调解号
  getsqCaseNo(e) {
    this.data.caseList.map((item, index) => {
      if (item.check) {
        let write = 'caseList[' + index + '].sqCaseNo'
        this.setData({
          [write]: e.detail.detail.value
        })
      }
    })
  },
  // 案由选择框改变
  bindPickerChangeAn(e) {
    let name1 = 'caseList[' + e.currentTarget.dataset.index + '].brife.id'
    let name2 = 'caseList[' + e.currentTarget.dataset.index + '].brife.name'
    this.setData({
      [name1]: this.data.briefAry[e.detail.value].id,
      [name2]: this.data.briefAry[e.detail.value].name
    })
  },
  getOpinion(e) {
    this.data.caseList.map((item, index) => {
      if (item.check) {
        let write = 'caseList[' + index + '].opinion'
        this.setData({
          [write]: e.detail.value
        })
      }
    })
  }
})
