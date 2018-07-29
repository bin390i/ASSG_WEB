// pages/detail/detail.js
const util = require('../../utils/util.js');
const api = require('../../config/api.js');
const constant = require('../../config/constant.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    img: 'http://img02.tooopen.com/images/20150928/tooopen_sy_143912755726.jpg',
    num: 1,
    goodsId :''
  },
  onLoad: function (options) {
    var _this = this;
    _this.data.goodsId = options.goodsId;
  },
  onReady: function () {
   
  },
  onShow: function () {
    wx.showLoading({
      title: '加载中',
    })
    var _this = this;
    var data = {
      goodsId: _this.data.goodsId
    };
    util.request(api.getGoodsInfo, data).then(function (resolve) {
      if (resolve.code == constant.QUERY_OK) {
        _this.setData({
          url: api.baseUrl,
          goods: resolve.data,
          disabled: true
        })
      }
    }).then(function () {
      var data = {
        goodsId: _this.data.goodsId,
        page: 1,
        limit: 5
      }
      util.request(api.queryAppraises, data).then(function (resolve) {
        if (resolve.code == constant.QUERY_OK) {
          var appraises = resolve.data
          for (var i = 0; i < appraises.length; i++) {
            var formatTime = util.formatTime(appraises[i].creatTime)
            appraises[i].creatTime = formatTime
          }
          _this.setData({
            appraises: resolve.data
          })
        }
      })
    }).then(function(){
      wx.hideLoading();
    });
  },

  /**
   * 预览图片
   */
  previewImage: function (e) {
    var imgPath = e.currentTarget.dataset.src
    wx.previewImage({
      urls: [imgPath],
    })
  },

  /**
     * 绑定加数量事件
     */
  addCount(e) {
    this.data.num = this.data.num + 1
    this.setData({
      num: this.data.num,
      disabled: false
    })
  },

  /**
   * 绑定减数量事件
   */
  minusCount(e) {
    if (this.data.num == 1) {
      this.setData({
        disabled: true
      })
    } else {
      this.data.num = this.data.num - 1
      this.setData({
        num: this.data.num
      })
    }
  },

  /**
* 查看购物车事件
*/
  cart(e) {
    wx.switchTab({
      url: '../cart/cart'
    })
  },

  /**
   * 添加购物车事件
   */
  addCart(e) {
    var _this = this;
    let goodsId = _this.data.goodsId;
    let num = _this.data.num;
    let data = {
      session: util.getRession(),
      goodsId: goodsId,
      num: num,
      cartId: -1
    }
    util.request(api.addCart, data).then(function (resolve) {
      if (resolve.code == constant.QUERY_OK) {
        util.showSuccessToast(resolve.data);
      } else {
        util.showErrorToast(resolve.data);
      }
    });
  },
  /**
   * 查看全部评论
   */
  watchAllAppraisal(e){
    wx.navigateTo({
      url: '/pages/goodsAppraisal/goodsAppraisal?goodsId=' + this.data.goodsId,
    })
  }
})