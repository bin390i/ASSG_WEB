// pages/orderDetail/orderDetail.js
const util = require('../../utils/util.js');
const api = require('../../config/api.js');
const constant = require("../../config/constant.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderId : '',
    url:api.baseUrl
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
        'orderTime': util.formatTime(resData[0].createTime),
        'receiveTime': formatReceiveTime(resData[0].receiveStartTime, resData[0].receiveEndTime) 
      })
    });
  },
  /**
   * 取消订单
   */
  orderCancel:function(e){

  },
/**
 * 支付订单
 */
orderPay:function(e){
  wx.navigateTo({
    url: '../pay/pay?orderId=' + this.data.order.id+'&payAmount='+this.data.order.payAmount,
  })
},
/**
 * 评价晒单
 */
  orderAppraisal:function(e){
    wx.navigateTo({
      url: '../appraisalList/appraisalList?orderId=' + this.data.order.id,
    })
  }
});

function formatReceiveTime(startTimestamp, endTimestamp){
  var startDate = new Date(startTimestamp)
  var endDate = new Date(endTimestamp)
  var year = startDate.getFullYear()
  var month = startDate.getMonth() + 1
  var day = startDate.getDate()

  var startHour = startDate.getHours()
  var startMinute = startDate.getMinutes()
  var startSecond = startDate.getSeconds()

  var endtHour = endDate.getHours()
  var endMinute = endDate.getMinutes()
  var endSecond = endDate.getSeconds()
  return [year, month, day].map(formatNumber).join('-') + ' ' + [startHour, startMinute].map(formatNumber).join(':') + '~' + [endtHour, endMinute].map(formatNumber).join(':')
}


function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}