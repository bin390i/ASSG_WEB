// pages/coupon/coupon.js
var sliderWidth = 80; // 需要设置slider的宽度，用于计算中间位置
var app = getApp();
const util = require('../../utils/util.js');
const api = require('../../config/api.js');
const constant = require("../../config/constant.js");

Page({
  data: {
    tabs: ["未使用", "已使用", "已过期"],
    activeIndex: 0,
    sliderOffset: 0,
    sliderLeft: 0
  },
  onLoad: function () {
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          sliderLeft: (res.windowWidth / that.data.tabs.length - sliderWidth) / 2,
          sliderOffset: res.windowWidth / that.data.tabs.length * that.data.activeIndex
        });
      }
    });
  },
  onReady:function(){
    var coupon = app.globalData.coupon;
    if(coupon!=null){
      var enable = coupon.enable
      var used = coupon.used
      var overdue = coupon.overdue
      for (var i = 0; i < enable.length;i++){
        enable[i].receiveTime = util.formatCouponDate(enable[i].receiveTime)
        enable[i].deadTime = util.formatCouponDate(enable[i].deadTime)
      }
      for (var i = 0; i < used.length;i++){
        used[i].receiveTime = util.formatCouponDate(used[i].receiveTime)
        used[i].deadTime = util.formatCouponDate(used[i].deadTime)
      }
      for (var i = 0; i < overdue.length;i++){
        overdue[i].receiveTime = util.formatCouponDate(overdue[i].receiveTime)
        overdue[i].deadTime = util.formatCouponDate(overdue[i].deadTime)
      }
      this.setData({
        coupon: coupon
      })
    }

  },
  tabClick: function (e) {
    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id
    });
  }
});