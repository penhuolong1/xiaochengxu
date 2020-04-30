const app = getApp();
const {
  $Toast
} = require('../../dist/base/index');
import {
  IMGURL
} from '../../common/constVal'
Page({
  data: {
    src: "",
    fengmian: "",
    videoSrc: "",
    who: "",
    openid: "",
    token: "",
    access_token: "",
    windowWidth: 0,
    current: 1,
    trackshow: "进行人脸追踪",
    canvasshow: true,
    fileP: "",
    uploadPath: "", //人证对比图片的路径
    tips: "", //提示语
    timesNum: "", //开始准备倒计时
    noneNum: 0, //全局检测人脸离开时间
    nowAction: "", //当前动作
    nowActionNums: 0, //当前动作错误执行次数
    navbarData: "人脸识别",
    actionsArr: ["BLINK", "MOUTH", "YAW"],
    complexity: 0,
    tempImage: '',
    imgUrl: IMGURL
  },

  onLoad() {
    var that = this
    //屏幕宽度
    var sysInfo = wx.getSystemInfoSync()
    that.setData({
      windowWidth: sysInfo.windowWidth,
    })

    that.ctx = wx.createCameraContext()
  },

  onReady: function () {
    wx.showLoading({
      title: '加载中...',
    })
    wx.setNavigationBarTitle({
      title: '身份确认'
    })
    this.setTimesOut(10);
    this.interval = setInterval(this.takePhoto, 700)
    // this.interval = setInterval(this.takePhoto, 500)
  },

  track(e) {
    var that = this;
    console.log(e)
    if (e.target.dataset.trackshow == "进行人脸追踪") {
      that.setData({
        trackshow: "停止人脸追踪",
        canvasshow: true
      })
      // that.takePhoto()
      that.interval = setInterval(this.takePhoto, 700)
    } else {
      clearInterval(that.interval)
      that.setData({
        trackshow: "进行人脸追踪",
        canvasshow: false
      })
    }
  },
  //人脸追踪
  takePhoto() {
    console.log("takePhoto")
    var that = this
    var takephonewidth
    var takephoneheight;
    var tempImagePath;
    that.ctx.takePhoto({
      quality: 'low',
      success: (res) => {
        this.setData({
          fileP: res.tempImagePath
        })
        // 获取图片真实宽高
        wx.getImageInfo({
          src: res.tempImagePath,
          success: function (res) {
            takephonewidth = res.width,
              takephoneheight = res.height
          }
        })
        wx.getFileSystemManager().readFile({
          filePath: res.tempImagePath, //选择图片返回的相对路径
          encoding: 'base64', //编码格式
          success: res => { //成功的回调
            tempImagePath = this.data.fileP,
              console.log('----图片显示----')
            console.log(res.data)
            wx.request({
              url: app.globalData.http + "court/wxRegister/faceDetect.jhtml",
              data: {
                image: res.data,
                image_type: "BASE64",
                // max_face_num: 10
              },
              method: 'POST',
              dataType: "json",
              header: {
                'content-type': 'application/json'
              },
              success: function (res) {
                wx.hideLoading()
                if (res.data.state === 100) {
                  if (that.data.tips == "未检测到人脸" || that.data.tips == "识别错误次数过多，请重新验证" || that.data.tips == "") {
                    that.setData({
                      tips: "请将人脸保持在屏幕中",
                      noneNum: 0,
                    })
                    that.setTimes(3)
                  }
                  that.setData({
                    uploadPath: tempImagePath
                  })
                  clearInterval(that.intervalTimeOut)
                } else if (res.data.state === 101) { //无脸部特征
                  that.setData({
                    tips: "未检测到人脸"
                  })
                  clearInterval(that.intervalTime)
                  if (that.data.noneNum == 0) {
                    that.setTimesOut(8);
                  }
                }
                // else {
                //   var ctx = wx.createContext()
                //   ctx.setStrokeStyle('#31859c')
                //   ctx.lineWidth = 3
                //   wx.drawCanvas({
                //     canvasId: 'canvas',
                //     actions: ctx.getActions()
                //   })
                // }
              },
            })
          }
        })
      },
      error: (err) => {
        console.log(err)
      }
    })
  },
  //人证对比
  verifica() {
    var that = this;
    console.log()
    wx.uploadFile({
      // url: "https://cloudapi.linkface.cn/identity/selfie_idnumber_verification",
      url: app.globalData.http + "court/wxRegister/selfie_idnumber_verification.jhtml",
      filePath: that.data.uploadPath,
      name: 'selfie_file',
      formData: {
        // api_id: 'bac3cb6ac6ae49479b33910ce3d18978',
        // api_id: '',
        // api_secret: "67da6a85740242da95cbc5c881da1b2d",
        // api_secret: "",
        name: app.globalData.name,
        id_number: app.globalData.id_number,
        state: "renxiang"
      },
      header: {
        'content-type': 'multipart/form-data'
      },
      dataType: "json",
      success: function (res) {
        wx.hideLoading();
        var data = JSON.parse(res.data)
        if (data.json.confidence) {
          if (data.json.confidence < 0.6) {
            that.setData({
              tips: '相似度过低！请重新校验！',
            })
            setTimeout(function () {
              wx.navigateBack({
                delta: 1
              })
            }, 2000)
            return false;
          }
        }
        if (!data.json.identity.validity) {
          that.setData({
            tips: '身份证与姓名不匹配，请重新填写',
          })
          setTimeout(function () {
            wx.navigateBack({
              delta: 1
            })
          }, 2000)
        } else if (data.json.identity.reason == 'Gongan status OK') {
          app.globalData.flag = true;
          wx.showToast({
            icon: "success",
            title: "校验成功！"
          })
          setTimeout(function () {
            wx.redirectTo({
              url: `/pages/third/third`,
            })
          }, 1500)

        } else if (data.json.identity.reason == 'Invalid idcard number') {
          that.setData({
            tips: '查无此身份证号',
          })
          setTimeout(function () {
            wx.navigateBack({
              delta: 1
            })
          }, 2000)
        } else if (data.json.identity.reason == 'Gongan photo doesn’t exist') {
          that.setData({
            tips: '近照不存在！',
          })
          setTimeout(function () {
            wx.navigateBack({
              delta: 1
            })
          }, 2000)
        }

      },
      fail: function (e) {
        wx.showToast({
          icon: "none",
          title: '网络错误'
        })
        setTimeout(() => {
          wx.navigateBack({
            delta: 2
          })
        }, 1500)
      }
    })
  },
  //开始录像
  startRecord() {

    var that = this;
    clearInterval(that.interval)
    clearInterval(that.intervalTimeOut)
    console.log(that.ctx)
    that.ctx.startRecord({
      success: (res) => {
        this.intervalTimeStopRecord = setTimeout(function () {
          console.log(111)
          that.stopRecord();
        }, 1700)
      },
      fail: (e) => {
        console.log(e);
      }
    })
  },
  //结束录像
  stopRecord() {
    var that = this;
    console.log(222)
    that.ctx.stopRecord({
      success: (res) => {
        console.log(res)
        that.setData({
          fengmian: res.tempThumbPath,
          videoSrc: res.tempVideoPath
        })
        console.log(333)
        that.uploadRecord(that.data.nowAction);
      },
      fail: (e) => {
        console.log(e);
      }
    })
  },
  //上传录像
  uploadRecord(action) {
    var that = this;
    // wx.showLoading({
    //   title: '上传中',
    // })
    console.log(action, that.data.videoSrc)
    //上传
    wx.uploadFile({
      url: "https://cloudapi.linkface.cn/liveness/check_liveness",
      // url: app.globalData.http + "court/wxRegister/check_liveness.jhtml",
      filePath: that.data.videoSrc,
      name: 'liveness_data_file',
      // name: 'file',
      formData: {
        api_id: 'bac3cb6ac6ae49479b33910ce3d18978',
        api_secret: "67da6a85740242da95cbc5c881da1b2d",
        motions: action,
        // state: 'huoti',
        // complexity: 0
      },
      header: {
        'content-type': 'multipart/form-data'
      },
      dataType: "json",
      success: function (res) {
        var data = JSON.parse(res.data)
        console.log('data', data)
        if (data.status == 'OK') {
          if (data.result.passed) {

            that.setData({
              nowActionNums: 0,
            })
            // if (that.data.nowAction == 'BLINK') {
            //   that.setTimeStopRecord('MOUTH');
            // } else if (that.data.nowAction == 'MOUTH') {
            //   that.setTimeStopRecord('YAW');
            // } else if (that.data.nowAction == 'YAW'){
            console.log('认证成功');
            wx.showLoading({
              title: '校验中...',
            })
            that.verifica();
            // }
          } else {
            if (that.data.nowActionNums > 2) {
              that.setData({
                tips: '识别错误次数过多，请重新验证',
                nowAction: "",
                nowActionNums: 0,
                noneNum: 0,
                src: ""
              })
              setTimeout(function () {
                that.interval = setInterval(that.takePhoto, 700);
              }, 1000)
            } else {
              that.setTimeStopRecord(that.data.nowAction);
            }
          }
        }

      }
    })
  },
  //开始准备倒计时
  setTimes(num) {

    var that = this;
    this.setData({
      timesNum: num
    })
    this.intervalTime = setInterval(function () {
      let nus = that.data.timesNum - 1;
      console.log('倒计时中' + nus)
      that.setData({
        // tips: nus,
        timesNum: nus,
      })
      if (nus == 1) {
        clearInterval(that.intervalTime)
        wx.showLoading({
          title: '校验中… '
        })
        clearInterval(that.interval)
        that.setData({
          tips: '请将人脸保持在屏幕中',
        })
        setTimeout(function () {
          console.log(99555)
          that.verifica();
        }, 1000)
        return false;
        let nnn = parseInt(Math.random() * (2 - 0 + 1) + 0, 10);
        console.log(that.data.actionsArr[nnn]);
        // that.setTimeStopRecord(that.data.actionsArr[nnn]);
        that.setTimeStopRecord("MOUTH");
        // that.setData({
        //   tips: '请眨眨眼',
        //   nowAction:"BLINK",
        //   src:"https://cstj.olcourt.cn/miniprogramImg/BLINK.gif"
        // })
        // that.setTimeStopRecord("BLINK");

      }
    }, 1000)
  },
  //检测人脸离开时间过长退回第一步
  setTimesOut(num) {
    var that = this;
    this.setData({
      noneNum: num
    })
    this.intervalTimeOut = setInterval(function () {
      let nus = that.data.noneNum - 1;
      that.setData({
        noneNum: nus,
      })
      if (nus == 0) {
        clearInterval(that.intervalTimeOut)
        clearInterval(that.interval)
        wx.navigateBack({
          delta: 2
        })
      }
    }, 1000)
  },
  //活体检测循环校验
  setTimeStopRecord(action) {
    var that = this;
    this.startRecord();

    if (this.data.nowAction != action) {
      this.setData({
        tips: action == 'MOUTH' ? '请张张嘴' : (action == 'NOD' ? '请点点头' : (action == 'YAW' ? "请摇摇头" : "")),
        nowAction: action,
        src: action == 'MOUTH' ? `${IMGURL}/MOUTH.gif` : (action == 'NOD' ? `${IMGURL}/NOD.gif` : (action == 'YAW' ? `${IMGURL}/YAW.gif` : ""))
      })
    } else {
      let num = this.data.nowActionNums + 1;
      this.setData({
        nowActionNums: num,
      })
    }

  },
  //人脸识别
  search() {
    var that = this
    var takephonewidth
    var takephoneheight
    that.ctx.takePhoto({
      quality: 'heigh',
      success: (res) => {
        // console.log(res.tempImagePath),
        // 获取图片真实宽高
        wx.getImageInfo({
          src: res.tempImagePath,
          success: function (res) {
            takephonewidth = res.width,
              takephoneheight = res.height
          }
        })

        wx.getFileSystemManager().readFile({
          filePath: that.data.src, //选择图片返回的相对路径
          encoding: 'base64', //编码格式
          success: res => {
            wx.request({
              url: "https://aip.baidubce.com/rest/2.0/face/v3/multi-search?access_token=" + this.access_token,
              data: {
                image: res.data,
                image_type: "BASE64",
                group_id_list: "camera000001",
                max_face_num: 10,
                match_threshold: 60,

              },
              method: 'POST',
              dataType: "json",
              header: {
                'content-type': 'application/json'
              },
              success: function (res) {
                console.log(res.data);
                var ctx = wx.createContext()
                if (res.data.error_code === 0) {
                  ctx.setStrokeStyle('#31859c')
                  ctx.setFillStyle('#31859c');
                  ctx.lineWidth = 3
                  for (let j = 0; j < res.data.result.face_num; j++) {
                    var cavansl = res.data.result.face_list[j].location.left / takephonewidth * that.data.windowWidth
                    var cavanst = res.data.result.face_list[j].location.top / takephoneheight * 300
                    var cavansw = res.data.result.face_list[j].location.width / takephonewidth * that.data.windowWidth
                    var cavansh = res.data.result.face_list[j].location.height / takephoneheight * 300
                    var cavanstext = res.data.result.face_list[j].user_list[0].user_id + " " + res.data.result.face_list[j].user_list[0].score.toFixed(0) + "%"
                    ctx.setFontSize(14);
                    ctx.fillText(cavanstext, cavansl, cavanst - 2)
                    ctx.strokeRect(cavansl, cavanst, cavansw, cavansh)

                  }
                  wx.drawCanvas({
                    canvasId: 'canvasresult',
                    actions: ctx.getActions()
                  })
                } else {
                  var ctx = wx.createContext()
                  ctx.setStrokeStyle('#31859c')
                  ctx.lineWidth = 3
                  wx.drawCanvas({
                    canvasId: 'canvasresult',
                    actions: ctx.getActions()
                  })
                }
              },
            })
          }
        })
      }
    })

  },
  handleClick() {
    wx.navigateTo({
      url: `/pages/third/third`,
    })
  },
  onUnload: function () {
    var that = this
    clearInterval(that.interval)
  },

  error(e) {
    console.log(e.detail)
  }

})
