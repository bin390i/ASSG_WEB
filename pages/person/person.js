// pages/personal/personal.js
var app =getApp();
const util = require('../../utils/util.js');
const api = require('../../config/api.js');
const constant = require("../../config/constant.js");
Page({

  data: {
    balance : 0
  },
  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  onShow:function(){
    var _this  = this;
    //加载账户余额
    util.request(api.getAccount, { session: util.getRession() }).then(function (resolve) {
      if (resolve.code == constant.QUERY_OK) {
        _this.data.balance = resolve.data;
        _this.setData({
          balance: _this.data.balance,
        })
      }
    });
  },
  getUserInfo: function (e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
 


})