// pages/address/address.js
var util = require('../../utils/util.js');
var api = require('../../config/api.js');
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
   checked:false
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this;
    wx.request({
      url: api.addressList,
      data: {
        'session': util.getRession()
      },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      dataType: 'json',
      success: function (res) {
       var  address = res.data.data;
       for(var i=0;i<address.length;i++){
         var phone = address[i].phonenumber;
         var mphone = phone.substr(3, 4);
         address[i].phonenumber = phone.replace(mphone, "****");
       }
        that.setData({
          address
        })
      }
    })
  },

  /**
   * 新增收货地址
   */
  add_address:function(e){
    wx.redirectTo({
      url: '../addAddress/addAddress?addressId=-1',
    })
  },
  /**
   * 编辑
   */
  edit:function(e){
   var  id = e.currentTarget.id;
    wx.navigateTo({
      url: '../addAddress/addAddress?addressId=' + id,
    })
  },
  /**
   * 选择地址 - 设置地址默认状态
   */
  setStatus:function(e){
    var that = this;
    var addressId = e.currentTarget.id
    wx.request({
      url: app.url.updateAddressStatus,
      data: {
          'wxUserId':wx.getStorageSync('wxUserId'),
          'addressId':addressId,
          'status':true
      },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      dataType: 'json',
      success: function (res) {
          var resData = res.data;
          if(resData.code == 0){
            wx.navigateBack({
              delta:1
            })
          }
      }
    })
  }
})