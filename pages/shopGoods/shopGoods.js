// pages/shopGoods/shopGoods.js
const util = require('../../utils/util.js');
const api = require('../../config/api.js');
const constant = require('../../config/constant.js');

Page({
  data: {
    curIndex: 0,
    isScroll: false,
    url: api.baseUrl,
    btnClickFlag: true,
    modelFlag: true,
    shopNo: '',
    cartNum: 0,
    carts: [],
    none: true,
    totalPrice: 0
  },
  onLoad: function (option) {
    var _this = this;
    console.log(option)
    if (util.isTrue(option.shop)) {
      var shop = JSON.parse(option.shop);
      _this.data.shopNo = shop.shopNo;
      _this.setData({
        'shop': shop
      })
    } else {
      util.showErrorToast("传值异常")
    }
    wx.getSystemInfo({
      success: (res) => {
        _this.setData({
          height: res.windowHeight
        })
      }
    })
  },
  onReady() {
    var _this = this;
    //获取分类
    util.request(api.classify, {}).then(function (resolve) {
      var resData = new Array();
      resData = resolve.data;
      for (var i = resData.length - 1; i >= 0; i--) {
        if (resData[i].subClassify) {
          if (resData[i].subClassify.length == 0) {
            resData.splice(i, 1) //每次删除后长度减一,所以需从后面往前减
          }
        }
      }
      resData.unshift({
        'id': '-1', 'classifyName': '全部', 'classifyCode': 'all'
      });
      _this.setData({
        classify: resData,
      })
    });

    //店铺商品列表
    util.request(api.goodsList, { 'shopNo': _this.data.shopNo }).then(function (resolve) {
      var reData = resolve.data;
      if (reData != null && reData.length > 0) {
        _this.data.none = false;
      } else {
        _this.data.none = true;
      }
      _this.setData({
        goods: reData,
        cartNum: 0,
        none: _this.data.none
      })
    }).then(function () {
      //获取当前用户的购物车
      var data = {
        shopNo: _this.data.shopNo,
        session: util.getRession()
      }
      util.request(api.cartList, data).then(function (resolve) {
        if (resolve.code == constant.QUERY_OK) {
          var reData = resolve.data;
          _this.setData({
            cartNum: reData.length,
            carts: reData,
            totalPrice: _this.getTotalPrice(reData)
          })
        }
      })
    })
  },
  onShow: function () {
    var _this = this;

  },
  /**
   * left Tab切换
   */
  switchTab(e) {
    const _this = this;
    this.setData({
      isScroll: true
    })
    setTimeout(function () {
      _this.setData({
        toView: e.target.dataset.id,
        curIndex: e.target.dataset.index
      })
    }, 0)
    setTimeout(function () {
      _this.setData({
        isScroll: false
      })
    }, 1)
    //查询分类商品列表
    var data = {
      'classifyId': e.currentTarget.dataset.classify,
      'shopNo': _this.data.shopNo
    }
    util.request(api.goodsList, data).then(function (resolve) {
      var reData = resolve.data;
      if (reData != null && reData.length > 0) {
        _this.data.none = false;
      } else {
        _this.data.none = true;
      }
      _this.setData({
        goods: reData,
        none: _this.data.none
      })
    });

  },
  /**
  * 添加购物车 - catch 非冒泡事件
  */
  addCart(e) {
    let _this = this;
    let goodsId = e.currentTarget.dataset.goods;
    let shopPrice = e.currentTarget.dataset.shopPrice;
    let totalPrice = (_this.data.totalPrice * 100 + shopPrice * 100) / 100;
    let data = {
      session: util.getRession(),
      goodsId: goodsId,
      shopNo: _this.data.shopNo,
      num: 1,
    }
    util.request(api.addCart, data).then(function (resolve) {
      if (resolve.code == constant.QUERY_OK) {
        util.showSuccessToast("添加成功");
        _this.setData({
          cartNum: _this.data.cartNum + 1,
          totalPrice: util.formatJsCompute(totalPrice, 2)
        })
      } else {
        util.showErrorToast(resolve.data);
      }
    });
  },
  /**
   * 清空购物车
   */
  bindClearCart(e) {
    var _this = this;
    wx.showModal({
      title: '',
      content: '确定清空购物车',
      success: function () {
        util.request(api.removeCarts, { 'shopNo': _this.data.shopNo }).then(function (resolve) {
          if (resolve.code == constant.QUERY_OK) {
            _this.setData({
              cartNum: 0,
              carts: [],
              modelFlag: true,
              totalPrice: '0.00'
            })
          }
        })
      }
    })
  },
  /**
     * 绑定加数量事件
     */
  addCount(e) {
    var _this = this;
    var index = e.currentTarget.dataset.index;
    var data = {
      'goodsId': _this.data.carts[index].goods.id,
      'num': 1,
      'session': util.getRession(),
      'shopNo': _this.data.shopNo
    }
    util.request(api.addCart, data).then(function (resolve) {
      if (resolve.code == constant.QUERY_OK) {
        _this.data.carts[index].num = _this.data.carts[index].num + 1
        _this.setData({
          carts: _this.data.carts,
          totalPrice: _this.getTotalPrice(_this.data.carts)
        });
      }
    });
  },

  /**
   * 绑定减数量事件
   */
  minusCount(e) {
    var _this = this;
    var index = e.currentTarget.dataset.index;
    if (_this.data.carts[index].num > 1) {
      var data = {
        'goodsId': _this.data.carts[index].goods.id,
        'num': -1,
        'session': util.getRession(),
        'shopNo': _this.data.shopNo
      }
      util.request(api.addCart, data).then(function (resolve) {
        if (resolve.code == constant.QUERY_OK) {
          _this.data.carts[index].num = _this.data.carts[index].num - 1
          _this.setData({
            carts: _this.data.carts,
            totalPrice: _this.getTotalPrice(_this.data.carts)
          });
        }
      });
    }
  },
  /**
   * 计算价格
   */
  getTotalPrice: function (items) {
    let totalPrice = 0;
    for (var i = 0; i < items.length; i++) {
      totalPrice = totalPrice + items[i].num * items[i].goods.shopPrice;
    }
    return util.formatJsCompute(totalPrice, 2);
  },
  /**
   * 显示遮罩
   */
  showModel(e) {
    var _this = this;
    if (_this.data.modelFlag) {
      //获取当前用户的购物车
      var data = {
        shopNo: _this.data.shopNo,
        session: util.getRession()
      }
      util.request(api.cartList, data).then(function (resolve) {
        if (resolve.code == constant.QUERY_OK) {
          var reData = resolve.data;
          _this.setData({
            cartNum: reData.length,
            carts: reData,
            modelFlag: false,
            totalPrice: _this.getTotalPrice(reData)
          })
        }
      })
    }
  },

  hidenModel() {
    this.setData({
      modelFlag: true
    })
  },

  /**
   * 去结算
   */
  btnPayView: function (e) {
    var currentTotalPrice = e.currentTarget.dataset.totalPrice;
    if (currentTotalPrice > 0) {
      if (this.data.btnClickFlag) {
        util.btnClickFlag(this)
        wx.navigateTo({
          url: '../confirm/confirm?shopNo=' + this.data.shopNo,
        })
      }
    } else {
      wx.showModal({
        title: '提示',
        content: '你还没有选择商品额',
        showCancel: false
      })
    }
  },
})