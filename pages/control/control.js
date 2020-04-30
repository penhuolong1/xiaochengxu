const app = getApp();
import { getAdminInfo, modifyAdminInfo } from '../../common/login';
Page({
  data: {
    switch1 : false,
    isEdit:true,
    phone:"",
    email:""
  },
  onChange(event){
    const detail = event.detail;
    this.setData({
        'switch1' : detail.value
    })
  },
  onLoad() {
    if (app.globalData.roleType == 0 && !app.globalData.userInfo.certification) {
      this.setData({
        // isAttestModal: true
      });
    }
    this.getInfo();
  },
  getInfo(){
    getAdminInfo().then(res => {
      this.setData({
        phone: res.phone,
        email: res.email
      })
    })
  },
  handleClick(){
    if (this.data.isEdit){
      this.setData({
        isEdit: false,
      })
    }else{
      modifyAdminInfo(this.data.phone,this.data.email).then(res => {
        wx.showToast({
          title: '保存成功',
          icon: 'success',
        })
        this.setData({
          isEdit: true,
        })
      })
      
    }
    
  },
  changeIdNumber(e) {
    this.setData({
      id_number: e.detail.detail.value
    })
  },
  changeemail(e) {
    this.setData({
      email: e.detail.detail.value
    })
  },
  changephone(e){
    this.setData({
      phone: e.detail.detail.value
    })
  },
})
