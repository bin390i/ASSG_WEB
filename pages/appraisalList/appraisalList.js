const util = require('../../utils/util.js');
const api = require('../../config/api.js');
const constant = require("../../config/constant.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderId: '',
    url: api.baseUrl
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this = this;
    _this.data.orderId = options.orderId
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var _this = this;
    var data = {
      session: util.getRession(),
      orderId: _this.data.orderId
    }
    util.request(api.getOrderList, data).then(function (resolve) {
      var resData = resolve.data;
      _this.setData({
        'order': resData[0],
      })
    });
  },
  /**
   * 评价晒单
   */
  btn_appraisal:function(e){
    var goodsId = e.currentTarget.dataset.goodsid;
      console.log(e)
      console.log('../appraisal/appraisal?orderId=' + this.data.orderId + "&goodsId=" + goodsId)
      wx.navigateTo({
        url: '../appraisal/appraisal?orderId='+this.data.orderId+"&goodsId="+goodsId,
      })
  },
})