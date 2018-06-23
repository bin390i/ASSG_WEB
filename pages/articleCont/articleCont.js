// pages/articleCont/articleCont.js
const util = require('../../utils/util.js');
const api = require('../../config/api.js');
const constant = require('../../config/constant.js')
const WxParse = require('../../wxParse/wxParse.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    articleId : null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.data.articleId = options.article
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    console.log("解析")
    var _this = this;
    util.request(api.selectArticle, {'articleId':_this.data.articleId}).then(function(resolve){
      if(resolve.code == constant.QUERY_OK){
        var cont = resolve.data.scontent
        var temp = WxParse.wxParse('article', 'html', cont, _this, 5);
        _this.setData({
          article: temp
        })
      }
    })
  },

})