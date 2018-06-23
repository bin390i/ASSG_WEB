const util = require('./utils/util.js');
const api = require('./config/api.js');
const constant = require('./config/constant.js');



//app.js
App({
  onLaunch: function () {
    wx.getSystemInfo({
      success: function (res) {
        console.log(res)
      },
    })
  },
  onShow: function () {
    var _this =this;
    var timer = setInterval(function(){
      var session = util.getRession();
      if (session) {
        clearInterval(timer);
        util.request(api.selectCouponForWxUser, { session: session }).then(function (resolve) {
          if (resolve.code == constant.QUERY_OK) {
            _this.globalData.coupon = resolve.data
          }
        })
      }
    },5000);

  },
  globalData: {
    userInfo: null,
    coupon:null
  }
})