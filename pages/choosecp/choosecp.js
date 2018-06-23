// pages/choosecp/choosecp.js
var sliderWidth = 80; // 需要设置slider的宽度，用于计算中间位置
var app = getApp();
const util = require('../../utils/util.js');
const api = require('../../config/api.js');
const constant = require("../../config/constant.js");

Page({
  data: {
    tabs: ["当前可用", "当前不可用"],
    activeIndex: 0,
    sliderOffset: 0,
    sliderLeft: 0,
    amount:0
  },
  onLoad: function (option) {
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          sliderLeft: (res.windowWidth / that.data.tabs.length - sliderWidth) / 2,
          sliderOffset: res.windowWidth / that.data.tabs.length * that.data.activeIndex
        });
      }
    });
    that.data.amount = option.amount
  },
  onReady: function () {
    var _this =this;
    var data = {
      session :wx.getStorageSync("wxUser"),
      amount: _this.data.amount
    }
    util.request(api.selectEnableCouponForWxUser,data).then(function(resolve){
      if(resolve.code = constant.QUERY_OK){
      var  enableCoupon = resolve.data.enable;
      if (enableCoupon != null) {
        for (var i = 0; i < enableCoupon.length; i++) {
          enableCoupon[i].receiveTime = util.formatCouponDate(enableCoupon[i].receiveTime)
          enableCoupon[i].deadTime = util.formatCouponDate(enableCoupon[i].deadTime)
        }
        _this.setData({
          'enableCoupon': enableCoupon
        })
      }
      var disableCoupon = resolve.data.disable;
      if (disableCoupon != null) {
        for (var i = 0; i < disableCoupon.length; i++) {
          disableCoupon[i].receiveTime = util.formatCouponDate(disableCoupon[i].receiveTime)
          disableCoupon[i].deadTime = util.formatCouponDate(disableCoupon[i].deadTime)
        }
        _this.setData({
          'disableCoupon': disableCoupon
        })
      }
      }
    })
  },
  tabClick: function (e) {
    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id
    });
  },
  /**
   * 选择优惠券
   */
  chooseCoupon:function(e){
    var code = e.currentTarget.dataset.code;
    var face = e.currentTarget.dataset.face;
    var chooseCp = {
      code:code,
      face:face
    }
    wx.setStorageSync('chooseCp', chooseCp)
    wx.navigateBack({
      delta:1
    })
  }
});