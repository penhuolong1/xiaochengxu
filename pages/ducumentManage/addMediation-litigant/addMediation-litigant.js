import {
  getProtocolInfo,
  saveProtocolInfo,
  getLitigantInfo
} from '../../../common/document';
import {
  IMGURL
} from '../../../common/constVal'

// caseId = 67e0dcf2186011e9b39a00163e0af9c6 & roomType=1
var app = getApp();
Page({
  data: {
    statusBarHeight: app.globalData.statusBarHeight, // 头部的自定义的高度
    topSeachBarBox: false, // 头部的搜索框显示隐藏
    startPlay: false,
    tip: '暂无数据',
    userId: wx.getStorageSync('userId') || '',
    roomName: '',
    roomToken: '',
    page: 1,
    total: 1,
    roleType: '自然人',
    sexAry: [{
        type: 0,
        text: '男'
      },
      {
        type: 1,
        text: '女'
      },
    ],
    roleTypeAry: [{
        type: 0,
        text: '自然人'
      },
      {
        type: 1,
        text: '法人'
      },
    ],
    litigantList: [{
        'name': '申请人1信息',
        'lawCaseId': 'sdejfks',
        'check': false
      },
      {
        'name': '申请人〇与被申请人〇之间〇〇〇纠纷',
        'lawCaseId': 'sdejfks',
        'check': false
      }
    ],
    imgUrl: IMGURL
  },
  onShow() {},
  //下一步
  nextStep() {
    wx.navigateTo({
      url: `/pages/myDocument/mediation/mediation`,
    })
  },
  //获取列表
  getList(caseNo) {
    let that = this;
    getLitigantInfo(app.globalData.caseId).then(res => {
      let arr1 = [];
      if (res.state == 100) {
        res.litigants.map(item => {
          item.check = false;
          arr1.push(item)
        })
        that.setData({
          litigantList: arr1
        })
      }
    })
  },
  // 改变下拉的显示隐藏
  openDetail(e) {
    let changeCheck = 'litigantList[' + e.currentTarget.dataset.check + '].check'
    this.setData({
      [changeCheck]: !this.data.litigantList[e.currentTarget.dataset.check].check
    })
  },
  // 选择框改变
  bindPickerChangeAn(e) {
    if (e.currentTarget.dataset.type == '当事人身份类型') {
      this.setData({
        roleType: this.data.roleTypeAry[e.detail.value].text
      })
    } else if (e.currentTarget.dataset.type == '性别') {
      let sex = 'nomalPeople.sex'
      this.setData({
        [sex]: this.data.sexAry[e.detail.value].text
      })
    }
  },
  // 获取名字
  getName(e) {
    let name = "";
    if (this.data.roleType == '自然人') {
      name = 'nomalPeople.name'
    } else if (this.data.roleType == '法人') {
      name = 'legalPeople.name'
    }
    this.setData({
      [name]: e.detail.detail.value
    })
  },
  // 生日
  bindDateChange(e) {
    console.log(e.detail.value)
    let name = 'nomalPeople.birthday';
    this.setData({
      [name]: e.detail.value
    })
  },
  // 获取身份证号
  getCard(e) {
    let name = "";
    if (this.data.roleType == '自然人') {
      name = 'nomalPeople.identityCard'
    } else if (this.data.roleType == '法人') {
      name = 'legalPeople.identityCard'
    }
    this.setData({
      [name]: e.detail.detail.value
    })
  },
  // 获取身份证号
  getlitPhone(e) {
    let name = 'nomalPeople.litigantPhone';
    this.setData({
      [name]: e.detail.detail.value
    })
  },
  // 获取地址
  getaddress(e) {
    let name = "";
    if (this.data.roleType == '自然人') {
      name = 'nomalPeople.address'
    } else if (this.data.roleType == '法人') {
      name = 'legalPeople.address'
    }
    this.setData({
      [name]: e.detail.detail.value
    })
  },
  // 单位
  getemployer(e) {
    let name = "";
    if (this.data.roleType == '自然人') {
      name = 'nomalPeople.employer'
    } else if (this.data.roleType == '法人') {
      name = 'legalPeople.employer'
    }
    this.setData({
      [name]: e.detail.detail.value
    })
  },
  // 代表人名字
  getlegalManName(e) {
    let name = 'nomalPeople.legalManName';
    this.setData({
      [name]: e.detail.detail.value
    })
  },
  // 代表人手机号
  getlegalManPhone(e) {
    let name = 'nomalPeople.legalManPhone';
    this.setData({
      [name]: e.detail.detail.value
    })
  },
  // 代表人身份证号
  getlegalManId(e) {
    let name = 'nomalPeople.legalManId';
    this.setData({
      [name]: e.detail.detail.value
    })
  },
  //回退
  back() {
    wx.navigateBack({
      delta: 1
    })
  },
  onLoad: function (options) {
    this.getList();
  },
  onLaunch: function () {
    this.setData({
      isLogin: app.globalData.isLogin
    })
  },
})
