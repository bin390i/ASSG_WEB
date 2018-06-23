// pages/article/article.js
const util = require('../../utils/util.js');
const api = require('../../config/api.js');
const constant = require('../../config/constant.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    img: 'http://img02.tooopen.com/images/20150928/tooopen_sy_143912755726.jpg',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var _this = this;
    util.request(api.selectArticle, { articleId:-1}).then(function(resolve){
      if(resolve.code == constant.QUERY_OK){
        _this.setData({
          articles: resolve.data
        })
      }
    })
    
  },

  watchArticleCont:function(e){
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/articleCont/articleCont?article='+id
    })
  }
})