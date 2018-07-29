// pages/shopList/shopList.js
var QQMapWX = require('../../static/lib/qqmap-wx-jssdk.js');
var util = require('../../utils/util.js');
var api = require('../../config/api.js');
var qqmapsdk;
var latitude;
var longitude;
const constant = require("../../config/constant.js");
Page({
  data: {
    inputShowed: false,
    inputVal: "",
    array: ['附近1 km', '附近3 km', '附近5 km', '附近10 km'],
    index: 0,
    array_1: [1, 3, 5, 10],
    searchPageNum: 1,   // 设置加载的第几次，默认是第一次
    callbackcount: 10,      //返回数据的个数
    searchLoadingComplete: false,  //“没有数据”的变量，默认false，隐藏
    isFromSearch: true,   // 用于判断是否数据返回为空
    shopList: [] //放置返回数据的数组
  },
  showInput: function () {
    this.setData({
      inputShowed: true
    });
  },
  hideInput: function () {
    this.setData({
      inputVal: "",
      inputShowed: false
    });
    this.data.shopList.splice(0, this.data.shopList.length);
    this.data.searchPageNum = 1;
    this.data.searchLoadingComplete = false;
    searchShopList(this)
  },
  clearInput: function () {
    this.setData({
      inputVal: ""
    });
    this.data.shopList.splice(0, this.data.shopList.length);
    this.data.searchPageNum = 1;
    this.data.searchLoadingComplete = false;
    searchShopList(this)
  },
  inputTyping: function (e) {
    this.setData({
      inputVal: e.detail.value
    });
  },
  inputConfirm: function () {
    this.data.shopList.splice(0, this.data.shopList.length);
    this.data.searchPageNum = 1;
    this.data.searchLoadingComplete = false;
    this.setData({
      'shopList': this.data.shopList
    })
    searchShopList(this)
  },
  bindPickerChange: function (e) {
    this.data.shopList.splice(0, this.data.shopList.length);
    this.data.searchPageNum = 1;
    this.data.searchLoadingComplete = false;
    this.setData({
      index: e.detail.value,
      searchLoadingComplete: this.data.searchLoadingComplete
    })
    searchShopList(this);
  },
  //滚动到底部触发事件
  searchScrollLower: function () {
    console.log("当前页==>" + this.data.searchPageNum)
    let that = this;
    if (!that.data.searchLoadingComplete) {
      that.setData({
        searchPageNum: that.data.searchPageNum + 1,  //每次触发上拉事件，把searchPageNum+1
      });
      searchShopList(that);
    }
  },
  onLoad: function (options) {
    var _this = this;
    // 实例化API核心类
    qqmapsdk = new QQMapWX({
      key: 'OYRBZ-FNS35-Q6GID-Q6ZUX-EEVUO-RUFAH'
    });
    wx.getSystemInfo({
      success: (res) => {
        this.setData({
          height: res.windowHeight
        })
      }
    })
  },
  goToShop :function(e){
    wx.setStorageSync('shopNo', e.currentTarget.dataset.shopNo)
    wx.navigateTo({
      url: '/pages/main/main',
    })
  },

  onShow: function () {
    this.data.shopList.splice(0, this.data.shopList.length);
    this.data.searchPageNum = 1;
    this.data.searchLoadingComplete = false;
    var _this = this;
    wx.getLocation({
      type: 'gcj02',
      success: function (res) {
        latitude = res.latitude
        longitude = res.longitude
        //获取店铺列表
        searchShopList(_this);
        qqmapsdk.reverseGeocoder({
          location: {
            latitude: latitude,
            longitude: longitude
          },
          success: function (addressRes) {
            var formatted_addresses = addressRes.result.formatted_addresses.recommend //地址描述
            _this.setData({
              'currentAddress': formatted_addresses
            })
          }
        })
      }
    });
  },
  onReady:function(){
   
  }

})


function searchShopList(_this) {
  wx.showLoading({
    title: '加载中...',
  })
  var data = {
    lat: latitude,
    lon: longitude,
    distance: _this.data.array_1[_this.data.index],
    currentPage: _this.data.searchPageNum,
    pageSize: _this.data.callbackcount,
    searchValue: _this.data.inputVal
  }
  util.request(api.queryShop, data).then(function (resolve) {
    wx.hideLoading();
    if (resolve.code == constant.QUERY_OK) {
      if (resolve.data.length > 0) {
        if (_this.data.shopList.length > 0) {
          _this.data.shopList = _this.data.shopList.concat(resolve.data)
        } else {
          _this.data.shopList = resolve.data
        }
      } else {
        _this.data.searchLoadingComplete = true
      }
      _this.setData({
        'shopList': _this.data.shopList,
        'searchLoadingComplete': _this.data.searchLoadingComplete
      })
    } else {
      wx.showModal({
        title: '提示',
        content: '查询超时...',
        showCancel: false
      })
    }
  })
}