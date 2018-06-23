// pages/appraisal/appraisal.js
const util = require('../../utils/util.js');
const api = require('../../config/api.js');
const constant = require("../../config/constant.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderId: '',
    goodsId: '',
    url: api.baseUrl,
    tmpUploadImg: [],
    mouthFell: [],
    colorFell: [],
    content: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this = this;
    for (var i = 0; i < 5; i++) {
      _this.data.mouthFell.push({ src: '../../static/icon/start-2.png', value: 1 })
      _this.data.colorFell.push({ src: '../../static/icon/start-2.png', value: 1 })
    }

     _this.data.orderId = options.orderId;
    _this.data.goodsId = options.goodsId;
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var _this = this;
    var data = {
      'orderId': _this.data.orderId,
      'goodsId': _this.data.goodsId
    };
    util.request(api.selectItem, data).then(function (resolve) {
      if (resolve.code == constant.QUERY_OK) {
        _this.setData({
          item: resolve.data,
          mouthFell: _this.data.mouthFell,
          colorFell: _this.data.colorFell
        })
      }
    });
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },
  /**
   * 当键盘输入时，触发 input 事件
   */
  bindinput: function (e) {
    this.data.content = e.detail.value
  },
  /**
   * 选择图片
   */
  chooseImg: function (e) {
    var _this = this;
    wx.chooseImage({
      count: 9, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
         _this.data.tmpUploadImg = res.tempFilePaths
        _this.setData({
          'tmpUploadImg': res.tempFilePaths
        })
      }
    })
  },
  /**
   * 预览图片
   */
  previewImage: function (e) {
    var index = e.currentTarget.dataset.index;
    wx.previewImage({
      current: this.data.tmpUploadImg[index], // 当前显示图片的http链接
      urls: [this.data.tmpUploadImg[index].toString()]// 需要预览的图片http链接列表
    })
  },
  /**
   * 删除图片
   */
  delImg: function (e) {
    console.log(e)
    var index = e.currentTarget.dataset.index;
    var tmpUploadImg = this.data.tmpUploadImg;
    tmpUploadImg.splice(index, 1);
    this.setData({
      'tmpUploadImg': tmpUploadImg
    })
  },
  /**
   * 调整口感
   */
  btn_mouthFell: function (e) {
    var _this = this;
    var index = e.currentTarget.dataset.index;
    var mouthFell = _this.data.mouthFell;
    if (mouthFell[index].value == 1) {
      mouthFell.splice(index, 5 - index)
      for (var i = 0; i < 5 - index; i++) {
        _this.data.mouthFell.push({ src: '../../static/icon/start-1.png', value: -1 })
      }
    }
    if (mouthFell[index].value == -1) {
      mouthFell.splice(0, 5)
      for (var i = 0; i < 5; i++) {
        if (i <= index) {
          _this.data.mouthFell.push({ src: '../../static/icon/start-2.png', value: 1 })
        } else {
          _this.data.mouthFell.push({ src: '../../static/icon/start-1.png', value: -1 })
        }
      }
    }
    _this.setData({
      mouthFell: _this.data.mouthFell
    })
  },
  /**
   * 调整色泽
   */
  btn_colorFell: function (e) {
    var _this = this;
    var index = e.currentTarget.dataset.index;
    var colorFell = _this.data.colorFell;
    if (colorFell[index].value == 1) {
      colorFell.splice(index, 5 - index)
      for (var i = 0; i < 5 - index; i++) {
        _this.data.colorFell.push({ src: '../../static/icon/start-1.png', value: -1 })
      }
    }
    if (colorFell[index].value == -1) {
      colorFell.splice(0, 5)
      for (var i = 0; i < 5; i++) {
        if (i <= index) {
          _this.data.colorFell.push({ src: '../../static/icon/start-2.png', value: 1 })
        } else {
          _this.data.colorFell.push({ src: '../../static/icon/start-1.png', value: -1 })
        }
      }
    }
    _this.setData({
      colorFell: _this.data.colorFell
    })
  },
  /**
   * 保存评论
   */
  saveAppraises: function (e) {
    var _this = this;
    var mouthFell = _this.data.mouthFell;
    var colorFell = _this.data.colorFell;
    var mouthScore = 5;
    var colorScore = 5;
    for (var i = 0; i < 5; i++) {
      if (mouthFell[i].value == -1) {
        mouthScore = mouthScore - 1
      }
      if (colorFell[i].value == -1) {
        colorScore = colorScore - 1
      }
    }
    var data = {
      'session': util.getRession(),
      'goodsId': _this.data.goodsId,
      'orderId': _this.data.orderId,
      'mouthScore': mouthScore,
      'colorScore': colorScore,
      'content': _this.data.content
    }
    //先保存内容
    util.request(api.appraises, data).then(function (resolve) {
      if (resolve.code == constant.QUERY_OK) {
        //保存图像
        var appraisesId = resolve.data;
        var tmpUploadImg = _this.data.tmpUploadImg;
        for (var i = 0; i < tmpUploadImg.length; i++) {
          wx.uploadFile({
            url: api.appraisesImg,
            filePath: tmpUploadImg[i].toString(),
            name: 'file',
            formData: {
              'appraisesId': appraisesId,
              'goodsId': _this.data.goodsId,
            }
          })
        }
        wx.showToast({
          title: resolve.msg,
          success: function () {
            setTimeout(function () { wx.navigateBack({ delta: 1 }) }, 1500)
          }
        })
      }
    })
  },
  
})