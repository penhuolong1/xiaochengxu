// pages/setcase/LawyerInfo/LawyerInfo.js
import {
  addLitigant,
  addCompanyLit,
  selectLitigant,
  editLitigant,
  editCompanyLit,
  uploadWXFrontImage
} from '../../../common/setcase';
const app = getApp();
let setcaseInfo = app.globalData.setcaseInfo;
import {
  IMGURL
} from '../../../common/constVal'
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
      lawCaseId: "",
      litigationStatus: 4, //诉讼地位：1.原告；2.被告；3.第三人；4.申请人；5.被申请人
      name: '', //当事人姓名
      identityCard: "", //身份证号
      sex: "", //性别0.男；1.女
      birthday: "1990-01-01", //出生日期
      litigantPhone: "", //手机号码
      address: "", //地址
      employer: "", //工作单位
      nation: "",
      identityType: 1, //身份证类别：1.自然人-身份证；2法人-统一信用代码
    },
    legalPeople: {
      lawCaseId: "",
      litigationStatus: 4, //诉讼地位：1.原告；2.被告；3.第三人；4.申请人；5.被申请人
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
    imgUrl: IMGURL,
    isDefendAnt: '', // 判断是被申请人还是申请人 被申请人为1 其他为申请人
    detailOpen: false,
    lawyers: []
  },
  onShow() {

  },
  onLoad(options) {
    // 链接有当事人id则为修改
    let name1 = 'nomalPeople.lawCaseId';
    let name2 = 'legalPeople.lawCaseId';
    let name3 = 'nomalPeople.frontImage';
    let name4 = 'nomalPeople.backImage';
    // 添加成功之后返回来展示名字
    this.setData({
      [name1]: app.globalData.setcaseInfo.lawCaseId,
      [name2]: app.globalData.setcaseInfo.lawCaseId,
      [name3]: app.globalData.setcaseInfo.litigant.frontImage,
      [name4]: app.globalData.setcaseInfo.litigant.backImage,
    })
    if (JSON.stringify(options) !== "{}" && options.litigantId !== '') {
      this.setData({
        litigantId: options.litigantId,
        operation: options.operation ? options.operation : '',
        isDefendAnt: options.isDefendAnt ? options.isDefendAnt : ''
      })
      this.selectLitigant(options.litigantId)
    } else {
      if (app.globalData.setcaseInfo.roleType == 0) {
        this.setData({
          roleType: '自然人'
        })
      } else if (app.globalData.setcaseInfo.roleType == 1) {
        this.setData({
          roleType: '法人'
        })
      }
      this.uploadWXFrontImage();
    }
  },
  //回退
  back() {
    wx.navigateBack({
      delta: 1
    })
  },
  // 身份证照片识别
  uploadWXFrontImage() {
    uploadWXFrontImage(app.globalData.setcaseInfo.litigant.frontImage, 'shenfenzheng').then(res => {
      if (res.state == 100) {
        console.log(res)
        let imgInfo = res.json.info; //身份证上识别出来的数据
        if (this.data.roleType == '自然人') {
          let name = 'nomalPeople.name';
          let sex = 'nomalPeople.sex';
          let nation = 'nomalPeople.nation';
          let birthday = 'nomalPeople.birthday';
          let address = 'nomalPeople.address';
          let identityCard = 'nomalPeople.identityCard';
          this.setData({
            [name]: imgInfo.name ? imgInfo.name : '',
            [sex]: imgInfo.sex ? imgInfo.sex : '',
            [nation]: imgInfo.nation ? imgInfo.nation : '',
            [birthday]: (imgInfo.year && imgInfo.month && imgInfo.day) ? imgInfo.year + '-' + imgInfo.month + '-' + imgInfo.day : '1990-01-01',
            [address]: imgInfo.address ? imgInfo.address : '',
            [identityCard]: imgInfo.number ? imgInfo.number : '',
          })
        }
      }
    })
  },
  // 查看当事人的详情
  selectLitigant(id) {
    selectLitigant(id).then(res => {
      if (res.state == 100) {
        this.setData({
          lawyers: []
        })
        console.log('当事人信息')
        console.log(res.litigant)
        let info = res.litigant
        if (info.lawyer && info.lawyer.length > 0) {
          this.setData({
            lawyers: [...info.lawyer]
          })
        }
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
        let name = 'legalPeople.companyImage';
        this.setData({
          [name]: app.globalData.setcaseInfo.litigant.frontImage
        })
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
  // 添加当事人--自然人
  addLitigant(data) {
    addLitigant(data).then(res => {
      if (res.state == 100) {
        app.globalData.setcaseInfo.litigant.id = res.litigantId
        app.globalData.setcaseInfo.litigant.name = data.name
        wx.navigateBack({ //返回
          delta: 2
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
          delta: 2
        })
      }
    })
  },
  // 修改当事人
  editLitigant(data) {
    editLitigant(data).then(res => {
      if (res.state == 100) {
        wx.navigateBack({ //返回
          delta: 2
        })
      }
    })
  },
  // 修改法人
  editCompanyLit(data) {
    editCompanyLit(data).then(res => {
      if (res.state == 100) {
        wx.navigateBack({ //返回
          delta: 2
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
  // 返回
  nextPage() {
    wx.navigateBack({ //返回
      delta: 2
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
  // 获取民族
  getnation(e) {
    let name = 'nomalPeople.nation';
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
  // 生日
  bindDateChange(e) {
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
    let name = 'legalPeople.legalManPhone'
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
  // 代表人身份证号
  getlegalManId(e) {
    let name = 'legalPeople.legalManId';
    this.setData({
      [name]: e.detail.detail.value
    })
  },
})
