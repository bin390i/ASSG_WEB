// pages/topic/topic_2/topic_2.js
const util = require('../../../utils/util.js');
const api = require('../../../config/api.js');
const constant = require("../../../config/constant.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    topicBackground: '#8B4789',
    buttonBackground: '#8B3A3A',
    topic: null,
    btnClickFlag: true,
    cartNum: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.data.topic = JSON.parse(options.topic);
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var _this = this;
    if (_this.data.topic != null) {
      util.request(api.selectGoodsByTopic, { 'topicId': _this.data.topic.id }).then(function (resolve) {
        if (resolve.code == constant.QUERY_OK) {
          _this.setData({
            'goods': resolve.data,
            'topic': _this.data.topic
          })
        }
      });
      //获取当前用户的购物车数量
      util.request(api.cartList, { session: util.getRession() }).then(function (resolve) {
        if (resolve.code == constant.QUERY_OK) {
          var reData = resolve.data;
          _this.data.cartNum = reData.length;
          _this.setData({
            cartNum: _this.data.cartNum
          })
        }
      })
    }
  },
  /**
   * 查看商品详情
   */
  bindGoods: function (e) {
    if (this.data.btnClickFlag) {
      util.btnClickFlag(this);
      var id = e.currentTarget.dataset.id;
      wx.navigateTo({
        url: '/pages/detail/detail?goodsId=' + id,
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
      session: util.getRession(),
      goodsId: goodsId,
      num: 1,
    }
    util.request(api.addCart, data).then(function (resolve) {
      if (resolve.code == constant.QUERY_OK) {
        _this.data.cartNum = _this.data.cartNum + 1;
        _this.setData({
          cartNum: _this.data.cartNum
        })
        util.showSuccessToast("添加成功")
      } else {
        util.showErrorToast("添加失败");
      }
    });
  },
  /**
 * 查看购物车事件
 */
  cart(e) {
    wx.switchTab({
      url: '/pages/cart/cart'
    })
  },
})