// 引入SDK核心类
var QQMapWX = require('../../static/lib/qqmap-wx-jssdk.js');
var qqmapsdk;

var util = require('../../utils/util.js');
var api = require('../../config/api.js');
const constant = require("../../config/constant.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    realname: '',
    phonenumber: '',
    detail: '',
    isDefault: 1,        //默认为1 ,0则不默认
    addressType: 1,  // 1-家庭;2-公司
    region: ['四川省', '成都市', '郫县'],
    customItem: '郫县',
    addressId: -1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this = this;
    // 实例化API核心类
    qqmapsdk = new QQMapWX({
      key: 'OYRBZ-FNS35-Q6GID-Q6ZUX-EEVUO-RUFAH'
    });
    //address
    if (options.addressId) {
      _this.data.addressId = options.addressId
    }
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onReady: function () {
    var _this = this;

    if (_this.data.addressId == -1) { //新增
      //1、获取当前位置坐标
      wx.getLocation({
        type: 'gcj02',
        success: function (res) {
          //2、根据坐标获取当前位置名称，腾讯地图逆地址解析
          qqmapsdk.reverseGeocoder({
            success: function (addressRes) {
              var formatted_addresses = addressRes.result.formatted_addresses.recommend //地址描述
              var address_component = addressRes.result.address_component; //包含省/市/区,还需解析
              _this.data.region[0] = address_component.province;
              _this.data.region[1] = address_component.city;
              _this.data.region[2] = address_component.district;
              _this.data.detail = formatted_addresses;
              _this.setData({
                region: _this.data.region,
                formatted_addresses: _this.data.detail,
                addressType: 1
              })
            }
          })
        }
      });
    } else {//更新
      var data = {
        session: util.getRession(),
        addressId: _this.data.addressId
      }
      util.request(api.getAddress, data).then(function (res) {
        var address = res.data;
        _this.data.realname = address.realname;
        _this.data.phonenumber = address.phonenumber;
        _this.data.detail = address.street;
        _this.data.addressType = address.type;
        _this.data.isDefault = address.isDefault;
        _this.data.region[0] = address.province;
        _this.data.region[1] = address.city;
        _this.data.region[2] = address.district;
        _this.setData({
          addressId: _this.data.addressId,
          address: address,
          region: _this.data.region,
          addressType: _this.data.addressType
        })
      })
    }


  },

  /**
   * RaginPick
   */
  bindRegionChange: function (e) {
    this.data.region[0] = e.detail.value[0];
    this.data.region[1] = e.detail.value[1];
    this.data.region[2] = e.detail.value[2];
    this.setData({
      region: this.data.region
    })
  },
  /**
   * inputName
   */
  inputName: function (e) {
    this.data.realname = e.detail.value;
  },
  /**
   * inputPhone
   */
  inputPhone: function (e) {
    this.data.phonenumber = e.detail.value;
  },
  /**
   * inputDetail
   */
  inputDetail: function (e) {
    this.data.detail = e.detail.value;
  },
  /**
   * bindAddressType
   */
  bindAddressType: function (e) {
    var _this = this;
    _this.data.addressType = e.currentTarget.dataset.value
    _this.setData({
      'addressType': _this.data.addressType
    })
  },
  /**
   * switch
   */
  switch: function (e) {
    this.data.isDefault
    var v = e.detail.value;
    if (v) {
      this.data.isDefault = 1;
    } else {
      this.data.isDefault = 0;
    }
  },
  /**
   * save
   */
  save: function () {
    var _this = this;
    var data = {
      session: util.getRession(),
      realname: _this.data.realname,
      phonenumber: _this.data.phonenumber,
      addressType: _this.data.addressType,
      isDefault: _this.data.isDefault,
      detail: _this.data.detail,
      province: _this.data.region[0],
      city: _this.data.region[1],
      district: _this.data.region[2],
      addressId: _this.data.addressId
    };
    util.request(api.saveAddress, data).then(function (resolve) {
      if(resolve.code==constant.QUERY_OK){
        util.showSuccessToast("保存成功", 1)
      }else{
        util.showErrorToast("保存失败")
      }
    }).catch(function (reject) {
      util.showErrorToast("保存失败")
    }
      )
  }
})