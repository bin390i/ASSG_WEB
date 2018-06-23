// pages/list/list.js
const util = require('../../utils/util.js');
const api = require('../../config/api.js');
const constant = require('../../config/constant.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    btnClickFlag:true
  },
  onLoad: function (options) {
    this.data.classifyId = options.classifyId
  },
  onReady:function(){
    var _this = this;
    //获取分类的商品列表
    util.request(api.goodsList, { classifyId: _this.data.classifyId }).then(function (resolve) {
      var reData = resolve.data;
      _this.setData({
        goods: reData,
        url: api.baseUrl,
        cartNum: 0
      })
    }).then(
      //获取当前用户的购物车数量
      util.request(api.cartList, { session: util.getRession() }).then(function (resolve) {
        var reData = resolve.data;
        _this.setData({
          cartNum: reData.length
        })
      })
      )
  },

  onShow: function () {

  },

  /**
   * 查看商品详情
   */
  bindGoods: function (e) {
    if (this.data.btnClickFlag){
      util.btnClickFlag(this);
      var id = e.currentTarget.dataset.id;
      wx.navigateTo({
        url: '../detail/detail?goodsId=' + id,
      })
    }
  },

  /**
   * 添加购物车 - catch 非冒泡事件
   */
  addCart(e) {
    var _this = this;
    let goodsId = e.currentTarget.dataset.goods;
    let data = {
      session : util.getRession(),
      goodsId : goodsId,
      num : 1,
    }
    util.request(api.addCart,data).then(function(resolve){
      if (resolve.code == constant.QUERY_OK){
        util.showSuccessToast("添加成功");
        _this.setData({
          cartNum: _this.data.cartNum + 1
        })
      }else{
        util.showErrorToast(resolve.data);
      }
    });
  },

  /**
 * 查看购物车事件
 */
  cart(e) {
    wx.switchTab({
      url: '../cart/cart'
    })
  },
})