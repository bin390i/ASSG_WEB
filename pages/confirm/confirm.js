// pages/confirm.js
const util = require('../../utils/util.js');
const api = require('../../config/api.js');
const constant = require("../../config/constant.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    index_delivery: 0,
    delivery: ['送货上门', '到店取货'], //送货方式
    remark: '',
    addressId: -1,
    url: api.baseUrl,
    date: '2016-09-01',
    startTime: '9:01',
    endTime: '18:01',
    realPayAmount: 0,
    totalAmount: 0,
    logisticsFee: 5,
    animationData: {},//选择动画
    showModalStatus: false, //显示遮罩,
    btnClickFlag: true,
    cpCode:'',
    face:0.00
  },
  onLoad: function (options) {
    var _this = this;
    //页面卸载的时候,清除优惠券缓存
    wx.removeStorageSync("chooseCp");
  },
  onReady:function(){
    var _this = this;
    
  },
  onShow: function () {
    var _this = this;

    var isAddress = false;
    //获取地址信息
    var data = {
      session: util.getRession()
    }
    util.request(api.getDefaultAddress, data).then(function (resolve) {
      if (resolve.code == constant.QUERY_OK) {
        _this.data.addressId = resolve.data.id;
        _this.setData({
          address: resolve.data,
          isAddress: true
        })
      }
    });

  //获取日期时间
    var date = util.formatDate(new Date())

    //获取cart
    var data = {
      'session': util.getRession(),
      'isCheck': constant.SELECTED_OK
    }
    util.request(api.cartList, data).then(function (resolve) {
      if (resolve.code == constant.QUERY_OK) {
        _this.setData({
          carts: resolve.data,
          totalPrice: _this.getTotalPrice(resolve.data),
          date: date,
        })
      }
    })
    //获取优惠券
    var data = {
      session: wx.getStorageSync("wxUser"),
      amount: _this.data.totalAmount
    }
    util.request(api.selectEnableCouponForWxUser, data).then(function (resolve) {
      if (resolve.code = constant.QUERY_OK) {
        var enableCoupon = resolve.data.enable;
        if (enableCoupon != null && enableCoupon.length > 0) {
          _this.setData({
            'text': '有' + enableCoupon.length + '张可用优惠券',
            'color': 'color:red;'
          })
        } else {
          _this.setData({
            'text': '当前无可用优惠券',
          })
        }
      }
    })


    var chooseCp = wx.getStorageSync('chooseCp');
    if(chooseCp){
      _this.data.cpCode = chooseCp.code;
      _this.data.face = chooseCp.face;
      _this.setData({
        'text': '已选择优惠' + chooseCp.face+'元',
        'color': 'color:red;',
        'face': chooseCp.face
      })
    }
  },
  onUnload:function(){
    //页面卸载的时候,清除优惠券缓存
    wx.removeStorageSync("chooseCp");
  },

  /**
 * 计算价格
 */
  getTotalPrice: function (items) {
    let totalPrice = 0;
    for (var i = 0; i < items.length; i++) {
      if (items[i].isCheck == 1) {
        totalPrice = totalPrice + items[i].num * items[i].goods.shopPrice;
      }
    }
    this.data.totalAmount = totalPrice
    this.data.realPayAmount = totalPrice
    return totalPrice;
  },

  /**
   * 选择日期
   */
  bindDateChange: function (e) {
    console.log(e)
    this.setData({
      date: e.detail.value
    })
  },

  /**
   * 选择开始时间
   */
  bindStartTimeChange: function (e) {
    this.setData({
      startTime: e.detail.value
    })
  },

  /**
  * 选择结束时间
  */
  bindEndTimeChange: function (e) {
    this.setData({
      endTime: e.detail.value
    })
  },

  /**
   * 获取输入的备注信息
   */
  input_remark: function (e) {
    this.data.remark = e.detail.value;
  },
  /**
   * 添加收货地址
   */
  addAddress: function (e) {
    if (this.data.btnClickFlag) {
      util.btnClickFlag(this)
      wx.navigateTo({
        url: '../addAddress/addAddress',
      })
    }
  },
  /**
 * 选择收货地址
 */
  chooseAddress: function (e) {
    if (this.data.btnClickFlag) {
      util.btnClickFlag(this)
      wx.navigateTo({
        url: '../address/address',
      })
    }
  },
  /**
   * 选择收货方式
   */
  bindPickerChange_delivery: function (e) {
    this.data.index__delivery = e.detail.value
    this.setData({
      index: this.data.index__delivery
    })
  },
  /**
   * 生成订单后跳转到支付页面
   */
  btnPayView: function (e) {
    var _this = this;
    if (_this.data.addressId>0){
      //创建订单
      var data = {
        session: util.getRession(),
        addressId: _this.data.addressId,
        deliverType: _this.data.index_delivery + 1,
        receiveStartTime: _this.data.date + ' ' + _this.data.startTime + ':00',
        receiveEndTime: _this.data.date + ' ' + _this.data.endTime + ':00',
        note: _this.data.remark,
        logisticsFee: _this.data.logisticsFee,
        realPayAmount: _this.data.realPayAmount,
        totalAmount: _this.data.totalAmount,
        cpCode: _this.data.cpCode
      }
      util.request(api.creatOrder, data).then(function (resolve) {
        if (resolve.code == constant.QUERY_OK) {
          var orderId = resolve.data;
          wx.redirectTo({
            url: '../pay/pay?orderId=' + orderId + '&payAmount=' + _this.data.realPayAmount,
          })
        } else {
          util.showErrorToast("订单生成异常");
        }
      });
    }else{
      wx.showModal({
        title: '',
        content: '请先填写收货地址',
        showCancel: false,
        confirmColor :'#21C0AE'
      })
    }
  },

  /**
   * 显示遮罩页面
   */
  viewPayArea: function (data) {
    var _this = this;
    var animation = wx.createAnimation({//动画
      duration: 5000,//动画持续时间
      timingFunction: 'linear',//动画的效果 动画从头到尾的速度是相同的
    })
    animation.translateY(0).step()//在Y轴偏移tx，单位px
    this.animation = animation
    _this.setData({
      showModalStatus: true,//显示遮罩       
      animationData: animation.export(),   //export 导出动画数据传递给组件
      wallets_password_flag: false,
      isFocus: false,
      wallets_password: [],
      inputValue: ''
    })
  },
  /**
   * 隐藏遮罩页面
   */
  hideModal: function (data) {
    var _this = this;
    _this.setData({
      showModalStatus: false,//隐藏遮罩       
    })
  },
/**
 * 
 */

})