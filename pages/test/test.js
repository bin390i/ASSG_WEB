// pages/test/test.js
const util = require('../../utils/util.js');
const api = require('../../config/api.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    array : ['1km','3km','5km','10km'],
    index :0
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
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var _this = this;
    wx.getLocation({
      type: 'wgs84',
      success: function (res) {
        var latitude = res.latitude
        var longitude = res.longitude
        var speed = res.speed
        var accuracy = res.accuracy
        _this.setData({
          latitude: latitude,
          longitude: longitude,
          speed: speed,
          accuracy: accuracy
        })
      }
    })
  },
  bindPickerChange :function(e){
    this.setData({
      index: e.detail.value
    })
  },
  refresh :function(){
    var _this = this;
    var latitude ;
    var longitude;
    var speed 
    var accuracy ;
    var shopList ;
    wx.getLocation({
      type: 'wgs84',
      success: function (res) {
         latitude = res.latitude
         longitude = res.longitude
         speed = res.speed
         accuracy = res.accuracy
        
         var data = {
           lat: latitude,
           lon: longitude,
           distance: _this.data.array[_this.data.index]
         }
         util.request(api.queryShop, data).then(function (resolve) {
           shopList = resolve.data
         }).then(function(){
           _this.setData({
             latitude: latitude,
             longitude: longitude,
             speed: speed,
             accuracy: accuracy,
             shopList: shopList
           })
         })

        
      }
    })
    
    
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})