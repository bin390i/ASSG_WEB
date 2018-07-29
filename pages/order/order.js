// pages/order/order.js
var sliderWidth = 80; // 需要设置slider的宽度，用于计算中间位置
const util = require('../../utils/util.js');
const api = require('../../config/api.js');
const constant = require("../../config/constant.js");

Page({
  data: {
    tabs: [{ name: "全部订单", value: 0 }, { name: "代付款", value: 1 }, { name: "待收货", value: 2 }, {
      name: "待评价", value: 4
    }],
    activeIndex: 0,
    sliderOffset: 0,
    sliderLeft: 0,
    url: api.baseUrl,
    emptyOrder: false,
    btnClickFlag : true
  },
  onLoad: function () {
    var _this = this;
    wx.getSystemInfo({
      success: function (res) {
        _this.setData({
          sliderLeft: (res.windowWidth / _this.data.tabs.length - sliderWidth) / 2,
          sliderOffset: res.windowWidth / _this.data.tabs.length * _this.data.activeIndex
        });
      }
    });
  },
  onShow: function () {
    var _this = this;
    var data = {
      session: util.getRession(),
    }
    util.request(api.getOrderList, data).then(function (resolve) {
      var resData = resolve.data;
      if (resData.length == 0) {
        _this.data.emptyOrder = true;
      }
      _this.setData({
        'orderList': resData,
        emptyOrder: _this.data.emptyOrder
      })
    });
  },
  /**
   * 点击tab事件
   */
  tabClick: function (e) {
    var _this = this
    var status = new Array();
    status.push(e.currentTarget.id)
    var data = {
      session: util.getRession(),
      status: JSON.stringify(status)
    }
    util.request(api.getOrderList, data).then(function (resolve) {
      var resData = resolve.data;
      if (resData.length == 0) {
        _this.data.emptyOrder = true;
      } else {
        _this.data.emptyOrder = false;
      }
      _this.setData({
        orderList: resData,
        sliderOffset: e.currentTarget.offsetLeft,
        activeIndex: e.currentTarget.id,
        emptyOrder: _this.data.emptyOrder
      })
    });
  },
  /**
   * 查看订单详情
   */
  watchOrderDetail: function (e) {
    var orderId = e.currentTarget.id;
    if(this.data.btnClickFlag){
      util.btnClickFlag(this)
      wx.navigateTo({
        url: '../orderDetail/orderDetail?orderId=' + orderId,
      })
    }
  },
  /**
   * 评价
   */
  btn_appraise:function(e){
    var orderId = e.currentTarget.dataset.orderId;
    wx.navigateTo({
      url: '',
    })
  }

});