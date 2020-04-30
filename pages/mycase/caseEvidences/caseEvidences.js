// pages/mycase/caseEvidences/caseEvidences.js
import {
  getReverts
} from '../../../common/mycase';
import {
  IMGURL
} from '../../../common/constVal'
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    selectNames: "全部",
    array: [],
    evdenceList: [],
    stateAllList: [],
    nowId: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: '#40A9FF',
      animation: {
        duration: 400,
        timingFunc: 'easeInOut'
      }
    })
    wx.setNavigationBarTitle({
      title: '案件证据列表'
    })
    this.getEvit();
  },
  entryEvi(e) {
    let datas = e.currentTarget.dataset.dt;
    app.globalData.nowEvidenceId = datas.id;
    wx.navigateTo({
      url: '/pages/mycase/evidenceInfo/evidenceInfo',
    })
  },
  getEvit() {
    // wx.showLoading({ title: '加载中… '})
    getReverts(app.globalData.nowMyCaseId).then(res => {
      // wx.hideLoading()
      var arr = [];
      let nameList = [];
      res.result.map((item, index) => {
        const ss = {};
        ss.dsrName = item.dsrName;
        ss.dsrStatus = item.dsrStatus;
        ss.names = "(" + item.dsrStatus + ")" + item.dsrName;
        arr.push(ss);
      });
      for (var i = 0; i < arr.length - 1; i++) {
        for (var j = i + 1; j < arr.length; j++) {
          if (arr[i].dsrName == arr[j].dsrName) {
            arr.splice(j, 1);
            j--;
          }
        }
      }
      var newArr = arr;
      nameList = arr;
      for (var i = 0; i < newArr.length; i++) {
        var arySmall = [];
        res.result.map((item, index) => {
          if (item.dsrName == newArr[i].dsrName) {
            let data = {};
            var ty1 = 0;
            var ty2 = 0;
            var ty3 = 0;
            var ty4 = 0;
            var ty5 = 0;
            for (var t = 0; t < item.reverts.length; t++) {
              if (item.reverts[t].result == '110' || item.reverts[t].result == '011' || item.reverts[t].result == '101') {
                ty2 = 1;
              } else if (item.reverts[t].result == '100' || item.reverts[t].result == '001' || item.reverts[t].result == '010') {
                ty3 = 1;
              } else if (item.reverts[t].result == '000') {
                ty4 = 1;
              } else if (item.reverts[t].result == '111') {
                ty5 = 1;
              }
            }
            if (ty5 == 1) {
              data.stateed = 'stateShow4';
              data.url = `${IMGURL}/state4.png`;
            }
            //越来越多反对
            if (ty2 == 1) {
              data.stateed = 'stateShow1';
              data.url = `${IMGURL}/state1.png`;
            }
            if (ty3 == 1) {
              data.stateed = 'stateShow2';
              data.url = `${IMGURL}/state2.png`;
            }
            if (ty4 == 1) {
              data.stateed = 'stateShow3';
              data.url = `${IMGURL}/state3.png`;
            }
            if (item.reverts.length == 0) {
              data.stateed = 'stateShow';
              data.url = `${IMGURL}/state.png'`
            }
            data.id = item.evidenceId;
            data.isSameSite = item.isSameSite ? 0 : 1; //1为能发表意见
            data.prove = item.prove;
            data.name = item.name;
            data.fileAddr = item.fileAddr;
            data.fileName = item.fileName;
            data.file = item.file;
            data.where = item.source;
            // data.pageNum = item.
            data.proveTime = item.time;
            arySmall.push(data);
          }
        });
        newArr[i].eviList = arySmall;
      }
      let alld = {
        dsrName: "全部",
        dsrStatus: "全部",
        names: "全部",
      }
      let otherNameList = JSON.parse(JSON.stringify(nameList));
      otherNameList.unshift(alld);
      this.setData({
        array: otherNameList,
        evdenceList: newArr,
        stateAllList: newArr
      })
      console.log(this.data.evdenceList)
    }).catch(err => {
      // wx.hideLoading()
    })
  },
  bindPickerChangeAn(e) {
    let arys = [];
    if (this.data.array[e.detail.value].dsrName === '全部') {
      console.log(9999)
      arys = this.data.stateAllList;
    } else {
      console.log(888)
      console.log(e.detail.value)
      console.log(this.data.evdenceList)
      for (var i = 0; i < this.data.stateAllList.length; i++) {
        if (this.data.stateAllList[i].dsrName == this.data.array[e.detail.value].dsrName) {
          arys.push(this.data.stateAllList[i])
        }
      }
    }
    this.setData({
      selectNames: this.data.array[e.detail.value].names,
      evdenceList: arys
    })

  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
