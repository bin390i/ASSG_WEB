var api = require('../config/api.js');
var CryptoJS = require('aes.js');  //引用AES源码js
var key = CryptoJS.enc.Utf8.parse('2sdfe5xd2fArDdsT');//十六位十六进制数作为秘钥
var iv = CryptoJS.enc.Utf8.parse('DAB45EF341GHJ412');//十六位十六进制数作为秘钥偏移量

function formatTime(timestamp) {
  var date = new Date(timestamp)
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()
  return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

function formatDate(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()
  return [year, month, day].map(formatNumber).join('-')
}

function formatCouponDate(timestamp) {
  var date = new Date(timestamp)
  var year = date.getFullYear()
  var yy = year.toString().substr(2, 2);
  var month = date.getMonth() + 1
  var day = date.getDate()
  return [yy, month, day].map(formatNumber).join('/')
}

function formatCountdown(micro_second) {
  var second = micro_second;//总的秒数
  // 天数位
  var day = Math.floor(second / 3600 / 24);
  var dayStr = day.toString();
  if (dayStr.length == 1) dayStr = '0' + dayStr;

  // 小时位
  var hr = Math.floor((second - day * 3600 * 24) / 3600);
  var hrStr = (hr + day * 24).toString();
  if (hrStr.length == 1) hrStr = '0' + hrStr;

  // 分钟位
  var min = Math.floor((second - day * 3600 * 24 - hr * 3600) / 60);
  var minStr = min.toString();
  if (minStr.length == 1) minStr = '0' + minStr;

  // 秒位
  var sec = second - day * 3600 * 24 - hr * 3600 - min * 60;
  var secStr = sec.toString();
  if (secStr.length == 1) secStr = '0' + secStr;

  return hrStr + " : " + minStr + " : " + secStr;
}

function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}

/**
 * 封封微信的的request
 */
function request(url, data = {}, method = "POST") {
  var postData = {
    params: encrypt(JSON.stringify(data))
  }
  wx.showLoading({
    title: '加载中...',
  })
  return new Promise(function (resolve, reject) {
    wx.request({
      url: url,
      data: postData,
      method: method,
      header: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      success: function (res) {
        wx.hideLoading();
        var resData = res.data.data;
        if (isTrue(resData) ) {
          var decryptText = decrypt(resData)
          var parseText = JSON.parse(decryptText);
          res.data.data = parseText.object;
        }
          console.log(res.data)
        resolve(res.data);
      },
      fail: function (err) {
        wx.hideLoading();
        reject(err)
      }
    })
  });
}

/**
 * 检查微信会话是否过期
 */
function checkSession() {
  return new Promise(function (resolve, reject) {
    wx.checkSession({
      success: function () {
        resolve(true);
      },
      fail: function () {
        reject(false);
      }
    })
  });
}


function getUserInfo() {
  return new Promise(function (resolve, reject) {
    wx.getUserInfo({
      withCredentials: true,
      success: function (res) {
        console.log(res)
        resolve(res);
      },
      fail: function (err) {
        reject(err);
      }
    })
  });
}

/**
 * 显示错误信息
 */
function showErrorToast(msg) {
  wx.showToast({
    title: msg,
    image: '/static/icon/ic_toast_error.png',
    mask: true
  })
}

/**
 * 显示成功信息
 */
function showSuccessToast(msg, pageIndex) {
  wx.showToast({
    title: msg,
    image: '/static/icon/ic_toast_success.png',
    success: function () {
      if (pageIndex > 0) {
        setTimeout(function () {
          wx.navigateBack({
            delta: pageIndex
          })
        }, 2000)
      }
    },
    mask: true
  })

}

/**
 * 获取缓存中的session
 */
function getRession() {
  return wx.getStorageSync("wxUser");
}

/**
 * 点击触发
 */
function btnClickFlag(_this) {
  _this.data.btnClickFlag = false;
  setTimeout(function () {
    _this.data.btnClickFlag = true;
  }, 1500)
}

/**
     * 设置授权
     * scopeType:权限类型(userInfo/werun)
     * fun:回调函数，表示需要刷新的内容
     */
function validateAuthorize(scopeType, fun) {
  var that = this;
  wx.getSetting({
    success: result => {
      if (result.authSetting['scope.' + scopeType]) {
        console.log(scopeType + '已授权')
        fun();
      } else {
        console.log(scopeType + '未授权')
        wx.authorize({
          scope: 'scope.' + scopeType,
          success(res) {
            console.log(scopeType + '授权成功')
            fun();
          },
          fail(res) {
            console.log(scopeType + '授权失败')
            console.log(res)
            wx.showModal({
              title: '提示',
              content: '请允许授权以便为你提供更好的服务',
              showCancel: false,
              success: function () {
                wx.openSetting({
                  success: (res) => {
                    if (res.authSetting['scope.' + scopeType]) { //已请求过授权
                      fun();
                    } else { //未请求过授权
                      that.validateAuthorize(scopeType, fun);
                    }
                  },
                  fail() {
                    that.validateAuthorize(scopeType, fun);
                  }
                });
              }
            })
          }
        });
      }
    }
  })
}

/**
 * 检查字符串是否存在
 */
function isTrue(exp) {
  //var exp = null;
  if (exp != null && typeof (exp) != "undefined") {
    return true;
  } else {
    return false;
  }
}

//格式js计算带来的误差
function formatJsCompute(num, toFixed) {
  let base = Math.pow(10, toFixed);
  return (Math.round(num * base) / base).toFixed(2);
}

//解密方法
function decrypt(word) {
  var encryptedHexStr = CryptoJS.enc.Hex.parse(word); //解析为16进制数据
  var srcs = CryptoJS.enc.Base64.stringify(encryptedHexStr); //base64解码
  var decrypt = CryptoJS.AES.decrypt(srcs, key, { iv: iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 });
  var decryptedStr = decrypt.toString(CryptoJS.enc.Utf8);
  return decryptedStr.toString();
}
//加密方法
function encrypt(word) {
  var srcs = CryptoJS.enc.Utf8.parse(word);
  var encrypted = CryptoJS.AES.encrypt(word, key, { iv: iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 });//base64编码后的数据
  return encrypted.ciphertext.toString().toUpperCase(); //转化为二进制后的数据
}

module.exports = {
  formatTime,
  formatDate,
  formatCouponDate,
  formatCountdown,
  request,
  showErrorToast,
  checkSession,
  getUserInfo,
  getRession,
  showSuccessToast,
  btnClickFlag,
  validateAuthorize,
  isTrue,
  formatJsCompute,
  decrypt,
  encrypt
}
