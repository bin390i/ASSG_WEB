// pages/home/pay.js
const util = require('../../utils/util.js');
const api = require('../../config/api.js');
const constant = require("../../config/constant.js");

Page({
  data: {
    payment_mode: 2,//默认支付方式 钱包支付
    isFocus: false,//控制input 聚焦
    balance: 0,//余额
    payAmount: 0,//待支付
    wallets_password_flag: false,//密码输入遮罩,
    wallets_password: [], //当前输入的密码
    orderNo: '',
  },
  /**
   * 页面加载事件
   */
  onLoad: function (option) {
    var _this = this;
    _this.data.orderNo = option.orderNo
    _this.data.payAmount = option.payAmount

    //加载账户余额
    util.request(api.getAccount, { session: util.getRession() }).then(function (resolve) {
      if (resolve.code == constant.QUERY_OK) {
        _this.data.balance = resolve.data;
        _this.setData({
          balance: _this.data.balance,
          payAmount: _this.data.payAmount
        })
      }
    });
  },
  onReady : function(){
    var _this = this;
    //加载账户余额
    util.request(api.getAccount, { session: util.getRession() }).then(function (resolve) {
      if (resolve.code == constant.QUERY_OK) {
        _this.data.balance = resolve.data;
        _this.setData({
          balance: _this.data.balance,
          payAmount: _this.data.payAmount
        })
      }
    });
  },
  /**
   * 监听页面卸载
   */
  onUnload: function () {
    // wx.showModal({
    //   title: '确认退出支付',
    //   content: '您的订单在2小时内未支付将被取消,请尽快完成支付.',
    //   cancelText:'继续支付',
    //   confirmText:'确定离开',
    //   success:function(e){
    //     wx.redirectTo({
    //       url: '../order/order',
    //     })
    //   }
    // })
  },
  /**
  * 转换为微信支付
  */
  wx_pay() {
    this.setData({
      payment_mode: 1
    })
  },
  /**
   * 转换为钱包支付
   */
  wallet_pay() {
    this.setData({
      payment_mode: 2
    })
  },
  /**
   * 获取钱包密码
   */
  set_wallets_password(e) {
    console.log(e.detail.value)
    this.setData({
      wallets_password: e.detail.value
    })
    if (this.data.wallets_password.length == 6) {//密码长度6位时，自动验证钱包支付结果
      wallet_pay(this, this.data.wallets_password)
    }
  },
  /**
   * 聚焦input
   */
  set_Focus() {
    console.log('isFocus', this.data.isFocus)
    this.setData({
      isFocus: true,
    })
  },

  /**
   * 关闭钱包输入密码遮罩
   */
  close_wallets_password() {
    this.setData({
      isFocus: false,//失去焦点
      wallets_password_flag: false,
      wallets_password: [],
      inputValue: ''
    })
  },
  /**
   * 去支付
   */
  pay(e) {
    pay(this)
  }

})

/*-----------------------------------------------*/
/**
 * 支付
 */
function pay(_this) {
  let apikey = _this.data.apikey;
  let id = _this.data.id;
  let payment_mode = _this.data.payment_mode
  if (payment_mode == 1) {
    //  微信支付,微信自带密码输入框
  } else if (payment_mode == 2) {
    //钱包支付
    _this.setData({
      isFocus: true,
      wallets_password_flag: true,
      wallets_password: [],
      inputValue: ''
    })
  }
}

/**
 * 钱包支付
 */
function wallet_pay(_this, password) {
  var data = {
    session: util.getRession(),
    password: password,
    orderNo: _this.data.orderNo,
    amount: _this.data.payAmount
  };
  util.request(api.payForAccount, data).then(function (resolve) {
    if (resolve.code == constant.QUERY_OK) {
      //1.支付成功
      wx.showToast({
        title: '支付成功',
        icon: 'success',
        success: function (e) {
          setTimeout(function(){
            wx.navigateBack({
              delta: 1
            })
          }, 1500)
        }
      })
    } else {
      util.showErrorToast(resolve.msg);
      // 2.支付失败
      _this.setData({
        isFocus: true,
        wallets_password: [],
        inputValue: ''
      })
    }
  });
}