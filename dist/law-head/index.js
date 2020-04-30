import {
  IMGURL
} from '../../common/constVal.js'
Component({
  data: {
    titleTop: 0, // 头部标题距离顶部的高度
    backImgTop: 0, // 头部返回按钮距离顶部的高度
    imgUrl: IMGURL
  },
  properties: {
    isSearch: {
      type: Boolean,
      value: true
    }
  },
  methods: {
    // 获取设备顶部高度 一般用来处理刘海屏的自适应问题
    getBarHeight() {
      wx.getSystemInfo({
        success: res => {
          this.setData({
            titleTop: res.statusBarHeight + 10,
            backImgTop: res.statusBarHeight - 4
          })
        }
      })
    }
  },
  lifetimes: {
    ready() {
      console.log(this.properties.isSearch)
    }
  },
  pageLifetimes: {
    show: function () {
      this.getBarHeight()
    },
    hide: function () {
      // 页面被隐藏
    },
    resize: function (size) {
      // 页面尺寸变化
    }
  }
})
