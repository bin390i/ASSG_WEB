// pages/goodsAppraisal/goodsAppraisal.js
const util = require('../../utils/util.js');
const api = require('../../config/api.js');
const constant = require('../../config/constant.js')
Page({
  data: {
  
  },
  onLoad: function (options) {
    this.data.goodsId=options.goodsId
  },
  onReady: function () {
    
  },

  onShow: function () {
    var _this = this;
    var data = {
      goodsId: _this.data.goodsId,
      page: 1,
      limit: 1000
    }
    util.request(api.queryAppraises, data).then(function (resolve) {
      if (resolve.code == constant.QUERY_OK) {
        var appraises = resolve.data
        for (var i = 0; i < appraises.length; i++) {
          var formatTime = util.formatTime(appraises[i].creatTime)
          appraises[i].creatTime = formatTime
        }
        _this.setData({
          appraises: resolve.data
        })
      }
    })
  },
})