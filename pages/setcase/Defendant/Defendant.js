// pages/setcase/LawyerInfo/LawyerInfo.js
import {
  addLitigant,
  addCompanyLit,
  selectLitigant,
  editLitigant,
  editCompanyLit
} from '../../../common/setcase';
const app = getApp();
import {
  IMGURL
} from '../../../common/constVal'
let setcaseInfo = app.globalData.setcaseInfo;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    statusBarHeight: app.globalData.statusBarHeight, // 头部的自定义的高度
    litigantId: "", // 用来接收url的当事人id
    operation: '', //链接带过来的操作，有litigantId无operation表示修改，有litigantId有operation表示查看（view）
    roleType: "自然人", // 当事人类型
    roleTypeAry: [{
        type: 0,
        text: '自然人'
      },
      {
        type: 1,
        text: '法人'
      },
    ], // 类型数组
    nomalPeople: {
      lawCaseId: app.globalData.setcaseInfo.lawCaseId,
      litigationStatus: 5, //诉讼地位：1.原告；2.被告；3.第三人；4.申请人；5.被申请人
      name: '', //当事人姓名
      identityCard: "", //身份证号
      sex: "", //性别0.男；1.女
      birthday: "1990-01-01", //出生日期
      litigantPhone: "", //手机号码
      address: "", //地址
      employer: "", //工作单位
      identityType: 1, //身份证类别：1.自然人-身份证；2法人-统一信用代码
    },
    legalPeople: {
      lawCaseId: app.globalData.setcaseInfo.lawCaseId,
      litigationStatus: 5, //诉讼地位：1.原告；2.被告；3.第三人；4.申请人；5.被申请人
      name: "", //法人公司名
      identityCard: "", //统一信用代码
      litigantPhone: "", //法人公司固定电话
      address: "", //公司注册地址
      employer: "", //公司经营地址
      legalManName: "", //法定代表人姓名
      legalManPhone: "", //法定代表人手机号码
      legalManId: "", //法定代表人身份证号码
      identityType: 2, //身份证类别：1.自然人-身份证；2法人-统一信用代码
    },
    sexAry: [{
        type: 0,
        text: '男'
      },
      {
        type: 1,
        text: '女'
      },
    ],
    imgUrl: IMGURL
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options.litigantId)
    // 添加成功之后返回来展示名字
    let name1 = 'nomalPeople.lawCaseId';
    let name2 = 'legalPeople.lawCaseId';
    this.setData({
      [name1]: app.globalData.setcaseInfo.lawCaseId,
      [name2]: app.globalData.setcaseInfo.lawCaseId
    })
    // 有当事人id
    if (JSON.stringify(options) !== "{}" && options.litigantId !== '') {
      this.setData({
        litigantId: options.litigantId,
        operation: options.operation ? options.operation : ''
      })
      this.selectLitigant(options.litigantId)
    }
  },
  back() {
    wx.navigateBack({
      delta: 1
    })
  },
  // 查看当事人的详情
  selectLitigant(id) {
    selectLitigant(id).then(res => {
      if (res.state == 100) {
        console.log(res.litigant)
        let info = res.litigant
        if (info.identityType == 1) {
          let litigationStatus = 'nomalPeople.litigationStatus';
          let name = 'nomalPeople.name';
          let identityCard = 'nomalPeople.identityCard';
          let sex = 'nomalPeople.sex';
          let birthday = 'nomalPeople.birthday';
          let litigantPhone = 'nomalPeople.litigantPhone';
          let address = 'nomalPeople.address';
          let employer = 'nomalPeople.employer';
          let nation = 'nomalPeople.nation';
          this.setData({
            [litigationStatus]: info.litigationStatus.id,
            [name]: info.litigantName ? info.litigantName : '',
            [identityCard]: info.identityCard ? info.identityCard : '',
            [sex]: info.litigantSex != null ? (info.litigantSex == 0 ? '男' : '女') : '',
            [birthday]: info.birthday ? info.birthday : '',
            [litigantPhone]: info.litigantPhone ? info.litigantPhone : '',
            [address]: info.address ? info.address : '',
            [employer]: info.employer ? info.employer : '',
            [nation]: info.nation ? info.nation : '',
          })
        } else if (info.identityType == 2) {
          let name = 'legalPeople.name';
          let identityCard = 'legalPeople.identityCard';
          let litigantPhone = 'legalPeople.litigantPhone';
          let address = 'legalPeople.address';
          let employer = 'legalPeople.employer';
          let legalManName = 'legalPeople.legalManName';
          let legalManPhone = 'legalPeople.legalManPhone';
          let legalManId = 'legalPeople.legalManId';
          this.setData({
            roleType: '法人',
            [name]: info.litigantName ? info.litigantName : '',
            [identityCard]: info.identityCard ? info.identityCard : '',
            [litigantPhone]: info.litigantPhone ? info.litigantPhone : '',
            [address]: info.address ? info.address : '',
            [employer]: info.employer ? info.employer : '',
            [legalManName]: info.legalManName ? info.legalManName : '',
            [legalManPhone]: info.legalManPhone ? info.legalManPhone : '',
            [legalManId]: info.legalManId ? info.legalManId : '',
          })
        }
      }
    })
  },
  // 下一步
  nextStep() {
    let that = this;
    if (this.data.roleType == '自然人') {
      if (this.data.nomalPeople.name == "") {
        wx.showToast({
          icon: "none",
          title: '姓名不能为空！'
        })
      } else if (this.data.nomalPeople.identityCard == "") {
        wx.showToast({
          icon: "none",
          title: '身份证号不能为空'
        })
      } else {
        let name = 'nomalPeople.sex';
        this.setData({
          [name]: this.data.nomalPeople.sex ? (this.data.nomalPeople.sex == '男' ? 0 : 1) : ''
        })
        if (this.data.litigantId) {
          let litigantId = 'nomalPeople.litigantId'
          this.setData({
            [litigantId]: this.data.litigantId
          })
          this.editLitigant(this.data.nomalPeople)
        } else {
          this.addLitigant(this.data.nomalPeople);
        }
      }
    } else if (this.data.roleType == '法人') {
      if (this.data.legalPeople.name == "") {
        wx.showToast({
          icon: "none",
          title: '公司名称不能为空！'
        })
      } else if (this.data.legalPeople.identityCard == "") {
        wx.showToast({
          icon: "none",
          title: '统一信用代码不能为空！'
        })
      } else {
        if (this.data.litigantId) {
          let litigantId = 'legalPeople.litigantId'
          this.setData({
            [litigantId]: this.data.litigantId
          })
          this.editCompanyLit(this.data.legalPeople)
        } else {
          this.addCompanyLit(this.data.legalPeople);
        }
      }
    }
  },
  //添加当事人
  addLitigant(data) {
    addLitigant(data).then(res => {
      if (res.state == 100) {
        wx.navigateBack({ //返回
          delta: 1
        })
      }
    })
  },
  // 添加当事人--法人
  addCompanyLit(data) {
    addCompanyLit(data).then(res => {
      if (res.state == 100) {
        app.globalData.setcaseInfo.litigant.id = res.litigantId
        app.globalData.setcaseInfo.litigant.name = data.name
        wx.navigateBack({ //返回
          delta: 1
        })
      }
    })
  },
  // 修改当事人
  editLitigant(data) {
    editLitigant(data).then(res => {
      if (res.state == 100) {
        wx.navigateBack({ //返回
          delta: 1
        })
      }
    })
  },
  // 修改法人
  editCompanyLit(data) {
    editCompanyLit(data).then(res => {
      if (res.state == 100) {
        wx.navigateBack({ //返回
          delta: 1
        })
      }
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
  // 下一页
  nextPage() {
    wx.navigateBack({ //返回
      delta: 1
    })
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
  // 法人公司固定电话
  getlitigantPhone(e) {
    let name = 'legalPeople.litigantPhone'
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
  // 代表人名字
  getlegalManName(e) {
    let name = 'legalPeople.legalManName';
    this.setData({
      [name]: e.detail.detail.value
    })
  },

  // 代表人手机号
  getlegalManPhone(e) {
    let name = 'legalPeople.legalManPhone';
    this.setData({
      [name]: e.detail.detail.value
    })
  },
  // 代表人身份证号
  getlegalManId(e) {
    let name = 'legalPeople.legalManId';
    this.setData({
      [name]: e.detail.detail.value
    })
  },
})
