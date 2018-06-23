// pages/login/login.js
const util = require('../../utils/util.js');
const api = require('../../config/api.js');
var app = getApp();

Page({
  data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    getUserInfo: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this = this;
    wx.getSetting({
      success: (res) => {   //已授权
        if (res.authSetting['scope.userInfo']) {
          _this.setData({
            authSuccess: true
          })
          // 登录
          wx.login({
            success: login_res => {
              // 发送 res.code 到后台换取 openId, sessionKey, unionId
              wx.getUserInfo({
                success: userinfo_res => {
                  app.globalData.userInfo = userinfo_res.userInfo
                  //将userInfo和code发送到后台
                  var data = {
                    code: login_res.code,
                    nickName: userinfo_res.userInfo.nickName,
                    gender: userinfo_res.userInfo.gender,
                    avatarUrl: userinfo_res.userInfo.avatarUrl
                  }
                  util.request(api.login, data).then(function (resolve) {
                    if (resolve.code == 1000) {
                      wx.setStorage({
                        key: 'wxUser',
                        data: resolve.data,
                      })
                      wx.switchTab({
                        url: '../main/main',
                      })
                      saveSystemInfo();
                    } else {
                      util.showErrorToast('登录失败')
                    }
                  })
                }
              })
            }
          })
        } else {
          _this.setData({
            authSuccess: false
          })
          var timer = setInterval(
            function () {
              if (_this.data.getUserInfo) {
                clearInterval(timer)
                // 登录
                wx.login({
                  success: login_res => {
                    // 发送 res.code 到后台换取 openId, sessionKey, unionId
                    util.validateAuthorize('userInfo', function () {
                      // 获取权限后,获取用户信息
                      console.log("开始执行函数")
                      wx.getUserInfo({
                        success: userinfo_res => {
                          app.globalData.userInfo = userinfo_res.userInfo
                          //将userInfo和code发送到后台
                          var data = {
                            code: login_res.code,
                            nickName: userinfo_res.userInfo.nickName,
                            gender: userinfo_res.userInfo.gender,
                            avatarUrl: userinfo_res.userInfo.avatarUrl
                          }
                          util.request(api.login, data).then(function (resolve) {
                            if (resolve.code == 1000) {
                              wx.setStorage({
                                key: 'wxUser',
                                data: resolve.data,
                              })
                              wx.switchTab({
                                url: '../main/main',
                              })
                              saveSystemInfo();
                            } else {
                              util.showErrorToast('请求失败')
                            }
                          })
                        }
                      })
                    })
                  }
                })
              }
            }
            , 100)
        }
      }
    })
  },
  onReady: function () {
    var _this = this;
    wx.getSystemInfo({
      success: function (res) {
        _this.setData({
          sysWidth: res.windowWidth,
          sysHeight: res.windowHeight,
          login: api.baseUrl + "upload/sysImg/webLogin.jpg"
        })
      },
    })
  },
  bindGetUserInfo: function (e) {
    console.log(e.detail.userInfo)
    this.data.getUserInfo = true
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