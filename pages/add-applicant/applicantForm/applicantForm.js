// pages/add-applicant/applicantForm/applicantForm.js
import {
  IMGURL,
  SERVICEURL
} from '../../../common/constVal'
import {
  addLitigant,
  addCompanyLit,
  selectLitigant,
  editLitigant,
  editCompanyLit,
  uploadWXFrontImage,
  uploadFrontImage
} from '../../../common/setcase';
const app = getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    caseId: {
      type: String,
      value: ''
    },
    litigantId: {
      type: String,
      value: ''
    },
    type: {
      type: String,
      value: 4
    },
    isShowDetail: {
      type: Boolean,
      value: true
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    caseId: '',
    phone: '',
    applicantType: 1, // 1自然人 2法人
    applicantAry: [{
      type: 1,
      text: '自然人'
    }, {
      type: 2,
      text: '法人'
    }],
    sexAry: [{
        type: 0,
        text: '男'
      },
      {
        type: 1,
        text: '女'
      },
    ],
    sex: 0,
    litigantId: '',
    nomalPeople: {
      lawCaseId: "",
      litigationStatus: 4, //诉讼地位：1.原告；2.被告；3.第三人；4.申请人；5.被申请人
      name: '', //当事人姓名
      identityCard: "", //身份证号
      sex: 0, //性别0.男；1.女
      birthday: "1990-01-01", //出生日期
      litigantPhone: "", //手机号码
      address: "", //地址
      employer: "", //工作单位
      nation: "",
      identityType: 1, //身份证类别：1.自然人-身份证；2法人-统一信用代码
      frontImage: '', // 正面身份证照片
      backImage: '' // 反面身份证照片
    },
    photoUrl1: `${IMGURL}/card1.png`,
    photoUrl2: `${IMGURL}/card2.png`,
    legalPeople: {
      lawCaseId: "",
      litigationStatus: 4, //诉讼地位：1.原告；2.被告；3.第三人；4.申请人；5.被申请人
      name: "", //法人公司名
      identityCard: "", //统一信用代码
      litigantPhone: "", //法人公司固定电话
      address: "", //公司注册地址
      legalManName: "", //法定代表人姓名
      legalManPhone: "", //法定代表人手机号码
      legalManId: "", //法定代表人身份证号码
      identityType: 2, //身份证类别：1.自然人-身份证；2法人-统一信用代码
      companyImage: '' //公司营业执照
    },
  },
  lifetimes: {
    ready: function () {
      this.setData({
        caseId: this.properties.caseId,
        litigantId: this.properties.litigantId
      })
      if (this.data.caseId) {
        let name = 'nomalPeople.lawCaseId'
        let name1 = 'legalPeople.lawCaseId'
        this.setData({
          [name]: this.data.caseId,
          [name1]: this.data.caseId
        })
      }
      if (this.data.litigantId) {
        this.selectLitigant(this.data.litigantId)
        let name = 'nomalPeople.litigantId'
        let name1 = 'legalPeople.litigantId'
        this.setData({
          [name]: this.data.litigantId,
          [name1]: this.data.litigantId
        })
      }
      if (this.properties.type) {
        let name = 'nomalPeople.litigationStatus'
        let name1 = 'legalPeople.litigationStatus'
        this.setData({
          [name]: this.properties.type,
          [name1]: this.properties.type
        })
      }
    },
    created() {
      console.log(123)
    },
    attached() {
      console.log(123)
    },
    moved() {
      console.log(123)
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {
    changephone() {

    },
    // 选择性别
    bindPickerChangeSex(e) {
      console.log(e)
      let label = 'nomalPeople.sex'
      this.setData({
        [label]: e.detail.value
      })
    },
    // 选择身份证类型
    bindPickerChangeApplicantType(e) {
      let label = 'nomalPeople.identityType'
      let type = this.data.applicantAry[e.detail.value].type
      this.setData({
        [label]: type,
        applicantType: type
      })
    },
    // 获取名字
    getName(e) {
      let name = "";
      if (this.data.applicantType == 1) {
        name = 'nomalPeople.name'
      } else if (this.data.applicantType == 2) {
        name = 'legalPeople.name'
      }
      this.setData({
        [name]: e.detail.detail.value
      })
    },
    // 获取身份证号
    getCard(e) {
      let name = "";
      if (this.data.applicantType == 1) {
        name = 'nomalPeople.identityCard'
      } else if (this.data.applicantType == 2) {
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
      if (this.data.applicantType == 1) {
        name = 'nomalPeople.address'
      } else if (this.data.applicantType == 2) {
        name = 'legalPeople.address'
      }
      this.setData({
        [name]: e.detail.detail.value
      })
    },
    // 单位
    getemployer(e) {
      let name = "";
      if (this.data.applicantType == 1) {
        name = 'nomalPeople.employer'
      } else if (this.data.applicantType == 2) {
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
    // 添加当事人--自然人
    addLitigant(data) {
      addLitigant(data).then(res => {
        if (res.state == 100) {
          app.globalData.setcaseInfo.litigant.id = res.litigantId
          app.globalData.setcaseInfo.litigant.name = data.name
          wx.showToast({
            icon: "none",
            title: res.message
          })
          this.triggerEvent('addAddLitigantSuccess', res.litigantId)
        }
      })
    },
    // 添加当事人--法人
    addCompanyLit(data) {
      addCompanyLit(data).then(res => {
        if (res.state == 100) {
          app.globalData.setcaseInfo.litigant.id = res.litigantId
          app.globalData.setcaseInfo.litigant.name = data.name
          wx.showToast({
            icon: "none",
            title: res.message
          })
        }
      })
    },
    // 修改当事人
    editLitigant(data) {
      editLitigant(data).then(res => {
        if (res.state == 100) {
          wx.showToast({
            icon: "none",
            title: res.message
          })
        }
      })
    },
    // 修改法人
    editCompanyLit(data) {
      editCompanyLit(data).then(res => {
        if (res.state == 100) {
          wx.showToast({
            icon: "none",
            title: res.message
          })
        }
      })
    },
    // 提交
    submit() {
      let that = this;
      console.log(this.data.nomalPeople)
      if (this.data.applicantType == '1') {
        if (!this.data.nomalPeople.name) {
          wx.showToast({
            icon: "none",
            title: '姓名不能为空！'
          })
          return;
        } 
        if (!(/^1[3456789]\d{9}$/.test(this.data.nomalPeople.litigantPhone))) {
          wx.showToast({
            icon: "none",
            title: '请输入正确的手机号码'
          })
          return;
        } 
        if (this.properties.type == 4) {
          if (!(/(^\d{15}$)|(^\d{17}([0-9]|X|x)$)/.test(this.data.nomalPeople.identityCard))) {
            wx.showToast({
              icon: "none",
              title: '请输入正确的身份证号码'
            })
            return;
          }
          if (!this.data.nomalPeople.address) {
            wx.showToast({
              icon: "none",
              title: '请输入地址'
            })
            return;
          }
        }
        if (this.data.litigantId) {
          let litigantId = 'nomalPeople.litigantId'
          this.setData({
            [litigantId]: this.data.litigantId
          })
          this.editLitigant(this.data.nomalPeople)
        } else {
          this.addLitigant(this.data.nomalPeople);
        }
      } else if (this.data.applicantType == '2') {
        if (this.data.legalPeople.name == "") {
          wx.showToast({
            icon: "none",
            title: '公司名称不能为空！'
          })
          return 
        }
        if (this.data.legalPeople.identityCard == "") {
          wx.showToast({
            icon: "none",
            title: '统一信用代码不能为空！'
          })
          return
        } 
        if (!this.data.legalPeople.legalManName){
          wx.showToast({
            icon: "none",
            title: '代表人姓名不能为空'
          })
          return
        }
        if (this.properties.type == 4) {
          if (!this.data.legalPeople.address){
            wx.showToast({
              icon: "none",
              title: '公司注册地址不能为空'
            })
            return
          } 
          if (!(/^1[3456789]\d{9}$/.test(this.data.legalPeople.legalManPhone))){
            wx.showToast({
              icon: "none",
              title: '请输入正确的代表人手机号'
            })
            return
          }
          if (!(/(^\d{15}$)|(^\d{17}([0-9]|X|x)$)/.test(this.data.legalPeople.legalManId))) {
            wx.showToast({
              icon: "none",
              title: '请输入正确的代表人身份证号码'
            })
            return;
          }
        }
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
    },
    //上传照片
    uploadImg(e) {
      let that = this;
      let name = e.currentTarget.dataset.vb;
      if (this.data.isReView == 1) {
        let url = '';
        if (name == 'front') {
          url = this.data.photoUrl1;
        } else if (name == 'opposite') {
          url = this.data.photoUrl2;
        } else {
          url = this.data.photoUrl3;
        }
        wx.previewImage({
          current: url, // 当前显示图片的http链接
          urls: [url] // 需要预览的图片http链接列表
        })
        return false;
      }
      wx.chooseImage({
        count: 1,
        sizeType: ['original', 'compressed'],
        sourceType: ['album', 'camera'],
        success(res) {
          // tempFilePath可以作为img标签的src属性显示图片
          const tempFilePaths = res.tempFilePaths
          console.log(tempFilePaths[0])
          if (name == 'front') {
            let label = 'nomalPeople.frontImage'
            uploadFrontImage(tempFilePaths[0]).then(res => {
              wx.showToast({
                title: res.message,
                icon: 'success',
                duration: 1500
              })
              that.setData({
                photoUrl1: tempFilePaths[0],
                [label]: res.url
              })
            })
          } else if (name == 'opposite') {
            let label = 'nomalPeople.backImage'
            uploadFrontImage(tempFilePaths[0]).then(res => {
              wx.showToast({
                title: res.message,
                icon: 'success',
                duration: 1500
              })
              that.setData({
                photoUrl2: tempFilePaths[0],
                [label]: res.url
              })
            })
          } else if (name == 'legal') {
            let label = 'legalPeople.companyImage'
            uploadFrontImage(tempFilePaths[0]).then(res => {
              wx.showToast({
                title: res.message,
                icon: 'success',
                duration: 1500
              })
              that.setData({
                photoUrl3: tempFilePaths[0],
                [label]: res.url
              })
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
          this.setData({
            applicantType: info.identityType
          })
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
              [sex]: info.litigantSex ? info.litigantSex:0,
              [birthday]: info.birthday ? info.birthday : '',
              [litigantPhone]: info.litigantPhone ? info.litigantPhone : '',
              [address]: info.address ? info.address : '',
              [employer]: info.employer ? info.employer : '',
              [nation]: info.nation ? info.nation : '',
              photoUrl1: info.frontImage ? `${SERVICEURL}${info.frontImage}` : `${IMGURL}/card1.png`,
              photoUrl2: info.backImage ? `${SERVICEURL}${info.backImage}` : `${IMGURL}/card2.png`
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
              photoUrl3: info.companyImage ? `${SERVICEURL}${info.companyImage}` : `${IMGURL}/card3.png`
            })
          }
        }
      })
    },
    //添加代理人
    addAgent() {
      if (!this.data.litigantId) {
        wx.showToast({
          title: '请先添加当事人',
          icon: 'none'
        })
        return
      }
      this.triggerEvent('addAgent')
    }
  }
})