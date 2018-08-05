// pages/login/login.js
const util = require('../../utils/util.js');
const api = require('../../config/api.js');
const constant = require('../../config/constant.js')
var app = getApp();


Page({
  data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
  },

  onLoad: function () {
    console.log("login_onLoad")
    var _this = this;
    wx.getSetting({
      success: (res) => {   
        if (res.authSetting['scope.userInfo']) {
          //已授权,直接登录
          wx.switchTab({
            url: '../shopList/shopList',
          })
        } 
      }
    })
  },

  bindGetUserInfo: function (e) {
    //未授权,开始进行授权
    util.validateAuthorize('userInfo', function () {
      // 获取权限后,获取用户信息
      wx.getUserInfo({
        success: userinfo_res => {
          app.globalData.userInfo = userinfo_res.userInfo
          //保存用户信息
          var data = {
            session: wx.getStorageSync('wxUser'),
            nickName: userinfo_res.userInfo.nickName,
            gender: userinfo_res.userInfo.gender,
            avatarUrl: userinfo_res.userInfo.avatarUrl
          }
          util.request(api.saveWxUserInfo, data).then(function (resolve) {
            if (resolve.code == constant.QUERY_OK) {
              wx.switchTab({
                url: '../shopList/shopList',
              })
              saveSystemInfo();
            } else {
              util.showErrorToast('请求失败')
            }
          })
        }
      })
    })
  },
})

function saveSystemInfo() {
  wx.getSystemInfo({
    success: function (res) {
      console.log("statusBarHeight==>"+res.statusBarHeight)
      var systemInfo = new Object();
      systemInfo.brand = res.brand;
      systemInfo.model = res.model;
      systemInfo.pixelRatio = res.pixelRatio;
      systemInfo.screenWidth = res.screenWidth;
      systemInfo.screenHeight = res.screenHeight;
      systemInfo.windowWidth = res.windowWidth;
      systemInfo.windowHeight = res.windowHeight;
      systemInfo.statusBarHeight = res.statusBarHeight; 
      systemInfo.language = res.language;
      systemInfo.version = res.version;
      systemInfo.system = res.system;
      systemInfo.platform = res.platform;
      systemInfo.fontSizeSetting = res.fontSizeSetting;
      systemInfo.SDKVersion = res.SDKVersion;
      var data = {
        sinfo : JSON.stringify(systemInfo),
        session : util.getRession()
      }
      util.request(api.saveSystemInfo, data)
    },
  })
}



