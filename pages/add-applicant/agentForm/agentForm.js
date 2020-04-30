// pages/add-applicant/applicantForm/applicantForm.js
import {
  IMGURL,
  SERVICEURL
} from '../../../common/constVal'
import {
  uploadFrontImage,
  addOrUpdateLawyer,
  selectLitigant,
  getLaywer
} from '../../../common/setcase';
const app = getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    isAgent: {
      type: Boolean,
      value: false
    },
    litigantId: {
      type: String,
      value: ''
    },
    lawyerId: {
      type: String,
      value: ''
    },
    isShowDetail: {
      type: Boolean,
      value: true
    }, // 是显示详情还是编辑状态
    intoPageTime: {
      type: String,
      value: '',
      observer: function () {
        if (this.data.litigantId && !this.data.isAgent) {
          this.selectLitigant(this.data.litigantId)
        }
      }
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    phone: '',
    statusBarHeight: app.globalData.statusBarHeight,
    sexAry: [{
        type: 0,
        text: '男'
      },
      {
        type: 1,
        text: '女'
      },
    ],
    agentTypeAry: [{
      type: 1,
      text: '律师'
    }, {
      type: 2,
      text: '法律工作者'
    }, {
      type: 3,
      text: '单位工作人员'
    }, {
      type: 4,
      text: '近亲属'
    }, {
      type: 5,
      text: '公民'
    }],
    sex: 0,
    lawyers: [],
    lawyerId: '',
    litigantId: '',
    isOthetAuthor: false,
    isShowAuthor: true,
    agentPeople: {
      name: '',
      agentType: 1, // 代理人类型
      sex: 0,
      years: '', // 年龄
      nation: '', //民族 
      lawyerNum: '', // 律师证件号
      agentIdentiCard: '', // 身份证
      agentMobile: '', //联系方式
      address: '', //地址
      unitInfo: '', // 工作单位/职务
      authority: '', //委托权限
      otherAuthority: '', //其他委托权限
      frontImage: '',
      backImage: ''
    },
    photoUrl1: `${IMGURL}/card1.png`,
    photoUrl2: `${IMGURL}/card2.png`,
    imgUrl: IMGURL,
    authorData: '',
    isShowAuthorDetail: false,
    authorAry: [{
        check: 0,
        text: '代为申请调解或者要求终止调解',
      },
      {
        check: 0,
        text: '代为收集、提供证据',
      },
      {
        check: 0,
        text: '代为选择或者接受人民调解员',
      },
      {
        check: 0,
        text: '代为承认、变更和放弃调解请求',
      },
      {
        check: 0,
        text: '代为参加调解，签署调查记录、调解记录、 权利义务告知书、人民调解协议书等法律文书',
      },
      {
        check: 0,
        text: '代为领取相关法律文书等',
      },
      {
        check: 0,
        text: '其他委托事项',
      }
    ],
    isSave: false // 是否保存
  },
  lifetimes: {
    ready: function () {
      this.setData({
        lawyerId: this.properties.lawyerId,
        litigantId: this.properties.litigantId
      })
      if (this.data.lawyerId) {
        let name = 'agentPeople.lawyerId'
        this.setData({
          [name]: this.data.lawyerId,
          isShowAuthor: false
        })
      }
      if (this.data.lawyerId) {
        this.getLaywer(this.data.lawyerId)
      }
      if (this.data.litigantId) {
        let name = 'agentPeople.litigantId'
        this.setData({
          [name]: this.data.litigantId
        })
      }
      if (this.data.litigantId && !this.data.isAgent) {
        this.selectLitigant(this.data.litigantId)
      }
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {
    // 获取申请人信息
    selectLitigant(id) {
      selectLitigant(id).then(res => {
        if (res.state == 100) {
          let lawers = res.litigant.lawyer
          if (lawers.length == 1) {
            this.setData({
              isShowAuthor: false
            })
            this.getLaywer(lawers[0].id)
          }
          this.setData({
            lawyers: [...lawers]
          })
        }
      })
    },
    // 获取代理人信息
    getLaywer(id) {
      this.setData({
        lawyerId: id
      })
      this.setData({
        isSave: true
      })
      getLaywer({
        lawyerId: id
      }).then(res => {
        if (res.state == 100) {
          let data = res.data
          let ary = []
          ary.push(data)
          this.setData({
            lawyers: ary
          })
          console.log(data)
          let name = 'agentPeople.name'
          let agentType = 'agentPeople.agentType'
          let sex = 'agentPeople.sex'
          let years = 'agentPeople.years'
          let nation = 'agentPeople.nation'
          let lawyerNum = 'agentPeople.lawyerNum'
          let agentIdentiCard = 'agentPeople.agentIdentiCard'
          let agentMobile = 'agentPeople.agentMobile'
          let address = 'agentPeople.address'
          let unitInfo = 'agentPeople.unitInfo'
          let authority = 'agentPeople.authority'
          let otherAuthority = 'agentPeople.otherAuthority'
          let frontImage = 'agentPeople.frontImage'
          let backImage = 'agentPeople.backImage'
          this.setData({
            [name]: data.agentName,
            [agentType]: data.agentType,
            [sex]: data.sex,
            [years]: data.years,
            [nation]: data.nation,
            [lawyerNum]: data.lawerNum,
            [agentIdentiCard]: data.agentIdentiCard,
            [agentMobile]: data.agentMobile,
            [address]: data.address,
            [unitInfo]: data.unitInfo,
            [authority]: data.delegatedAuthority,
            [otherAuthority]: data.otherAuthority,
            [frontImage]: data.frontImage,
            [backImage]: data.backImage,
            photoUrl1: data.frontImage ? `${SERVICEURL}${data.frontImage}`:`${IMGURL}/card1.png`,
            photoUrl2: data.backImage ? `${SERVICEURL}${data.backImage}`:`${IMGURL}/card2.png`,
            authorData: data.delegatedAuthority ? data.delegatedAuthority.split(',') : []
          })
        }
      })
    },
    // 获取代理人类型
    changeApplicantType(e) {
      let label = 'agentPeople.agentType'
      this.setData({
        [label]: Number(e.detail.value) + 1
      })
    },
    // 选择性别
    bindPickerChangeSex(e) {
      let label = 'agentPeople.sex'
      this.setData({
        [label]: e.detail.value
      })
    },
    // 获取名字
    getName(e) {
      let name = "agentPeople.name";
      this.setData({
        [name]: e.detail.detail.value
      })
    },
    // 获取其他权限
    getOtherAuthority(e) {
      let name = "agentPeople.otherAuthority";
      this.setData({
        [name]: e.detail.value
      })
    },
    // 获取身份证号
    getCard(e) {
      let name = "agentPeople.agentIdentiCard";
      this.setData({
        [name]: e.detail.detail.value
      })
    },
    // 获取身份证号
    getlitPhone(e) {
      let name = 'agentPeople.agentMobile';
      this.setData({
        [name]: e.detail.detail.value
      })
    },
    // 获取亲属关系
    getPartyRelation(e) {
      let name = 'agentPeople.partyRelationString';
      this.setData({
        [name]: e.detail.detail.value
      })
    },
    // 获取年龄
    getyear(e) {
      let name = 'agentPeople.years';
      this.setData({
        [name]: Number(e.detail.detail.value)
      })
    },
    // 获取民族
    getnation(e) {
      let name = 'agentPeople.nation';
      this.setData({
        [name]: e.detail.detail.value
      })
    },
    // 获取律师号
    getLawyerNum(e) {
      let name = 'agentPeople.lawyerNum';
      this.setData({
        [name]: e.detail.detail.value
      })
    },
    // 获取地址
    getaddress(e) {
      let name = "agentPeople.address";
      this.setData({
        [name]: e.detail.detail.value
      })
    },
    // 获取工作单位
    getunitInfo(e) {
      let name = "agentPeople.unitInfo";
      this.setData({
        [name]: e.detail.detail.value
      })
    },
    // 单位
    getemployer(e) {
      let name = 'agentPeople.employer';
      this.setData({
        [name]: e.detail.detail.value
      })
    },
    // 生日
    bindDateChange(e) {
      let name = 'agentPeople.birthday';
      this.setData({
        [name]: e.detail.value
      })
    },
    // 提交
    submit() {
      let that = this
      if (!this.data.agentPeople.name) {
        wx.showToast({
          title: '请输入姓名',
          icon: 'none'
        })
        return
      }
      // if (!this.data.agentPeople.agentIdentiCard) {
      //   wx.showToast({
      //     title: '请输入身份证号码',
      //     icon: 'none'
      //   })
      //   return
      // }
      if (!this.data.agentPeople.agentMobile) {
        wx.showToast({
          title: '请输入联系方式',
          icon: 'none'
        })
        return
      }
      if (!this.data.agentPeople.address) {
        wx.showToast({
          title: '请输入地址',
          icon: 'none'
        })
        return
      }
      if (!this.data.agentPeople.unitInfo) {
        wx.showToast({
          title: '请输入工作地址',
          icon: 'none'
        })
        return
      }
      if (!this.data.agentPeople.years) {
        let obj = this.data.agentPeople
        delete obj.years
        this.setData({
          agentPeople: obj
        })
      }
      addOrUpdateLawyer(this.data.agentPeople).then(res => {
        if (res.state == 100) {
          wx.showToast({
            title: res.message,
            icon: 'none',
            duration: 2000
          })
          this.setData({
            isSave: true
          })
          // wx.navigateBack({
          //   delta: 1
          // })
        }
      })
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
            let label = 'agentPeople.frontImage'
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
            let label = 'agentPeople.backImage'
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
          }
        }
      })
    },
    // 选择权限
    selectAuthor(e) {
      console.log(e)
      let index = e.currentTarget.dataset.index
      let ary = this.data.authorAry
      if (ary[index].check == 1) {
        ary[index].check = 0
      } else {
        ary[index].check = 1
      }
      if (ary[6].check == 1) {
        this.setData({
          isOthetAuthor: true
        })
      } else {
        this.setData({
          isOthetAuthor: false
        })
      }
      this.setData({
        authorAry: ary
      })
    },
    // 提交权限
    submitAuthor(e) {
      let ary = this.data.authorAry
      let authority = []
      ary.forEach((item, index) => {
        if (item.check == 1) {
          authority.push(index + 1)
        }
      })
      let name = 'agentPeople.authority'
      this.setData({
        [name]: authority.join(','),
        isShowAuthor: !this.data.isShowAuthor
      })
    },
    // 显示权限部分
    showAuthor() {
      this.setData({
        isShowAuthor: true
      })
    },
    // 添加代理人
    addAgant() {
      if (!this.data.isSave) {
        wx.showToast({
          title: '请先保存当前页面信息',
          icon: 'none'
        })
        return
      }
      wx.navigateTo({
        url: `/pages/add-agent/add-agent?litigantId=${this.data.litigantId}&other=1`,
      })
    },
    // 跳转到代理人部分查看详情
    toLawerDetail(e) {
      let id = e.currentTarget.dataset.id
      if (this.properties.isShowDetail) {
        wx.navigateTo({
          url: `/pages/add-agent/add-agent?litigantId=${this.data.litigantId}&lawyerId=${id}`
        })
      } else {
        wx.navigateTo({
          url: `/pages/add-agent/add-agent?litigantId=${this.data.litigantId}&lawyerId=${id}&isEdit=1`
        })
      }
    },
    // 获取权限详情
    getAuthorDetail(e) {
      this.setData({
        isShowAuthorDetail: !this.data.isShowAuthorDetail
      })
    },
    nextStep1() {
      wx.navigateTo({
        url: `/pages/setcase/steps-three/steps-three`
      })
    }
  }
})
