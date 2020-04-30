const app = getApp();
import {
  addCase
} from '../../../common/setcase';
import {
  IMGURL
} from '../../../common/constVal'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl: IMGURL
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  nextStep() {
    addCase().then(res => {
      if (res.state == 100) {
        app.globalData.setcaseInfo.lawCaseId = res.lawCaseId;
        wx.redirectTo({
          url: '/pages/setcase/steps-one/steps-one?page=drafts',
        })
      }
    })
  },
})
