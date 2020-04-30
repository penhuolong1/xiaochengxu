import {
  getUserDetail1
} from '../../../common/rtc';
const app = getApp();
Component({
  data: {
    rotes: []
  },
  properties: {
    groupUser: {
      type: Array,
      value: []
    }
  },
  lifetimes: {
    ready() {
      if (this.properties.groupUser && this.properties.groupUser.length > 0) {
        let array = []
        debugger
        this.properties.groupUser.forEach(item => {
          debugger
          getUserDetail1({
            adminId: item.id,
            caseId: app.globalData.caseId
          }).then(res => {
            let obj = {
              name: res.result.name,
              role: res.result.roleType
            }
            array.push(obj)
            this.setData({
              rotes: array
            })
          })
        })
      }
    }
  },
  methods: {}
})
