// pages/main/main.js
const util = require('../../utils/util.js');
const api = require('../../config/api.js');
const constant = require("../../config/constant.js");
Page({
  data: {
    btnClickFlag :true
  },
  onLoad: function (options) {
    this.setData({
      windowHeight: wx.getStorageSync('windowHeight')
    });
  },
  onReady: function () {
   

/*
    //倒计时
    var totalSecond = Date.parse(new Date('2018-06-01 23:59:59')) / 1000 - Date.parse(new Date()) / 1000;
    console.log(totalSecond)
    var interval = setInterval(function () {
      var countdown = util.formatCountdown(totalSecond);
      totalSecond--;
      this.setData({
        countdown: countdown
      })
      if (totalSecond < 0) {
        clearInterval(interval);
        wx.showToast({
          title: '活动已结束',
        });
        this.setData({
          countdown: '00:00:00'
        });
      }
    }.bind(this), 1000);
*/
    
  },
  onShow:function(){
    var _this = this;
    //获取topicList
    util.request(api.selectTopicList, {}).then(function (resolve) {
      if (resolve.code == constant.QUERY_OK) {
        _this.setData({
          topic: resolve.data
        })
      }
    })
    //获取goods
    util.request(api.goodsList, {}).then(function (resolve) {
      var reData = resolve.data;
      _this.setData({
        goods: reData
      })
    })
  },
  onShareAppMessage:function(){
    return{
      title:'你的便利店',
      path:'/pages/login/login'
    }
  },
  clickTopic: function (e) {
    var _this = this;
    var topicId = e.currentTarget.dataset.id;
    util.request(api.selectTopic, { 'topicId': topicId }).then(function (resolve) {
      if (resolve.code == constant.QUERY_OK) {
        var topic = resolve.data;
        if (topic.displayModel == "web") {
          wx.navigateTo({
            url: '../topic/topic_1/topic_1?webValue=' + topic.topicSrc,
          })
        }
        if (topic.displayModel == "list") {
          wx.navigateTo({
            url: '../topic/topic_2/topic_2?topic=' + JSON.stringify(topic),
          })
        }
        if (topic.displayModel == "single") {
          util.request(api.selectGoodsByTopic, { 'topicId': topic.id }).then(function (resolve) {
            if (resolve.code == constant.QUERY_OK) {
              wx.navigateTo({
                url: '../detail/detail?goodsId=' + resolve.data[0].id,
              })
            }
          });
        }
      }
    })
  },
  /**
   * 添加到购物车
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
        util.showSuccessToast("添加成功")
      } else {
        util.showErrorToast(resolve.data);
      }
    });
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
})