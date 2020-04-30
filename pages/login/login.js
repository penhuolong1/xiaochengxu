import {
  mediaterLogin,
  getAdminId
} from '../../common/login';
import {
  userInfo
} from '../../common/case';
import {
  IMGURL
} from '../../common/constVal'
const app = getApp();
const md5 = require('../../common/md5.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 账号：案管机构；密码：284225
    name: '仓山调解员',
    password: '123456',
    imgUrl: IMGURL
  },
  onLoad() {

  },
  login() {
    let that = this;
    mediaterLogin(this.data.name, md5.hexMD5(this.data.password)).then(res => {
      if (res.state == 100) {
        app.globalData.sessionId = res.sessionId; //用于请求头部      
        app.globalData.roleType = res.roleType; //用于请求头部      
        app.globalData.userInfo = {
          name: that.data.name
        }
        app.globalData.isLogin = true;
        getAdminId().then(res => {
          app.globalData.loginId = res
        })
        userInfo().then(res => {
          app.globalData.loginInfo = res
        })
        wx.redirectTo({
          url: '/pages/index/index'
        })
      }
    })
  },
  // 生日
  getName(e) {
    this.setData({
      name: e.detail.value
    })
  },
  // 密码
  getPwd(e) {
    this.setData({
      password: e.detail.value
    })
  },
})
