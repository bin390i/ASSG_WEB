const util = require('../../utils/util.js');
const api = require('../../config/api.js');
const constant = require('../../config/constant.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    img: 'http://img02.tooopen.com/images/20150928/tooopen_sy_143912755726.jpg',
    items: [],
    selected: false,
    startX: 0, //开始坐标
    startY: 0,
    selectAll: true,
    empty: true, //购物车空
    baoyouPrice: 100,
    btnClickFlag: true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var _this = this;
    //清空数据
    _this.data.items.splice(0, _this.data.items.length);
    util.request(api.cartList, { session: util.getRession() }).then(function (resolve) {
      var resData = resolve.data;
      if (resolve.code == constant.QUERY_OK) {
        if (resData.length != 0) {
          _this.data.empty = false
        }
        for (var i = 0; i < resData.length; i++) {
          //添加当前列表是否选中状态
          if (resData[i].isCheck == 0) { //若未选中
            _this.data.selectAll = false; //设置全选
            resData[i].selected = false; //设置单个状态
          } else {
            resData[i].selected = true;
          }
          resData[i].isTouchMove = false //默认全隐藏删除
          _this.data.items.push(resData[i])
        }
        _this.setData({
          carts: _this.data.items,
          url: api.baseUrl,
          selectAll: _this.data.selectAll,
          totalPrice: _this.getTotalPrice(_this.data.items),
          empty: _this.data.empty
        })
      } else {
        util.showErrorToast(reData);
      }
    });

  },

  /**
   * 选择列表
   */
  selectList: function (e) {
    var _this = this;
    var index = e.currentTarget.dataset.index;
    var currentSelected = _this.data.items[index].selected;
    if (currentSelected) { //改为未选中
      var data = {
        'isCheck': constant.SELECTED_FAIL,
        'type': constant.TYPE_SINGLE,
        'cartId': _this.data.items[index].id,
        'session': util.getRession(),
      }
      util.request(api.updateCartStatus, data).then(function (resolve) {
        if (resolve.code == constant.QUERY_OK) {
          _this.data.items[index].selected = false;
          _this.data.selectAll = false;
          _this.setData({
            carts: _this.data.items,
            selectAll: _this.data.selectAll,
            totalPrice: _this.getTotalPrice(_this.data.items)
          })
        }
      });
    }
    if (!currentSelected) {//改为选中
      var data = {
        'isCheck': constant.SELECTED_OK,
        'type': constant.TYPE_SINGLE,
        'cartId': _this.data.items[index].id,
        'session': util.getRession(),
      }
      util.request(api.updateCartStatus, data).then(function (resolve) {
        if (resolve.code == constant.QUERY_OK) {
          _this.data.items[index].selected = true;
          for (var i = 0; i < _this.data.items.length; i++) {
            if (!_this.data.items[i].selected) {
              _this.data.selectAll = false;
            } else {
              _this.data.selectAll = true;
            }
          }
          _this.setData({
            carts: _this.data.items,
            selectAll: _this.data.selectAll,
            totalPrice: _this.getTotalPrice(_this.data.items)
          })
        }
      });
    }
  },

  /**
   * 全选
   */
  selectAll: function (e) {
    var _this = this
    var status = e.currentTarget.dataset.status;
    var items = _this.data.items;
    var isCheck = 0;
    if (status) { //已处于全选状态
      status = false;
      isCheck = constant.SELECTED_FAIL;
    } else { //未处于全选状态
      status = true;
      isCheck = constant.SELECTED_OK;
    }
    var data = {
      'session': util.getRession(),
      'type': constant.TYPE_ALL,
      'isCheck': isCheck,
    }
    util.request(api.updateCartStatus, data).then(function (resolve) {
      if (resolve.code == constant.QUERY_OK) {
        for (var i = 0; i < items.length; i++) {
          items[i].selected = status;
          items[i].isCheck = 0;
        }
        _this.setData({
          carts: items,
          selectAll: status,
          totalPrice: _this.getTotalPrice(_this.data.items)
        })
      }
    });
  },


  /**
     * 绑定加数量事件
     */
  addCount(e) {
    var _this = this;
    var index = e.currentTarget.dataset.index;
    var items = _this.data.items;
    var data = {
      'goodsId': items[index].goods.id,
      'num': 1,
      'session': util.getRession(),
    }
    util.request(api.addCart, data).then(function (resolve) {
      if (resolve.code == constant.QUERY_OK) {
        items[index].num = items[index].num + 1
        _this.setData({
          carts: _this.data.items,
          totalPrice: _this.getTotalPrice(_this.data.items)
        });
      }
    });
  },

  /**
   * 绑定减数量事件
   */
  minusCount(e) {
    var _this = this;
    var index = e.currentTarget.dataset.index;
    var items = _this.data.items;
    if (items[index].num > 1) {
      var data = {
        'goodsId': items[index].goods.id,
        'num': -1,
        'session': util.getRession(),
      }
      util.request(api.addCart, data).then(function (resolve) {
        if (resolve.code == constant.QUERY_OK) {
          items[index].num = items[index].num - 1
          _this.setData({
            carts: _this.data.items,
            totalPrice: _this.getTotalPrice(_this.data.items)
          });
        }
      });
    }
  },

  /**
   * 去结算
   */
  pay: function (e) {
    if (this.getTotalPrice(this.data.items) > 0) {
      if (this.data.btnClickFlag) {
        util.btnClickFlag(this)
        wx.navigateTo({
          url: '../confirm/confirm',
        })
      }
    } else {
      wx.showModal({
        title: '提示',
        content: '你还没有选择商品额',
        showCancel: false
      })
    }
  },
  /**
   * 计算价格
   */
  getTotalPrice: function (items) {
    let totalPrice = 0;
    for (var i = 0; i < items.length; i++) {
      if (items[i].selected) {
        totalPrice = totalPrice + items[i].num * items[i].goods.shopPrice;
      }
    }
    return totalPrice;
  },

  /**
   * 手指触摸动作开始 记录起点X坐标
   */
  touchstart: function (e) {
    //开始触摸时 重置所有删除
    this.data.items.forEach(function (v, i) {
      if (v.isTouchMove)//只操作为true的
        v.isTouchMove = false;
    })
    this.setData({
      startX: e.changedTouches[0].clientX,
      startY: e.changedTouches[0].clientY,
      carts: this.data.items
    })
  },
  /**
   * 滑动事件处理
   */
  touchmove: function (e) {
    var that = this,
      index = e.currentTarget.dataset.index,//当前索引
      startX = that.data.startX,//开始X坐标
      startY = that.data.startY,//开始Y坐标
      touchMoveX = e.changedTouches[0].clientX,//滑动变化坐标
      touchMoveY = e.changedTouches[0].clientY,//滑动变化坐标
      //获取滑动角度
      angle = that.angle({ X: startX, Y: startY }, { X: touchMoveX, Y: touchMoveY });
    that.data.items.forEach(function (v, i) {
      v.isTouchMove = false
      //滑动超过30度角 return
      if (Math.abs(angle) > 30) return;
      if (i == index) {
        if (touchMoveX > startX) //右滑
          v.isTouchMove = false
        else //左滑
          v.isTouchMove = true
      }
    })
    //更新数据
    that.setData({
      carts: that.data.items
    })
  },
  /**
   * 计算滑动角度
   * @param {Object} start 起点坐标
   * @param {Object} end 终点坐标
   */
  angle: function (start, end) {
    var _X = end.X - start.X,
      _Y = end.Y - start.Y
    //返回角度 /Math.atan()返回数字的反正切值
    return 360 * Math.atan(_Y / _X) / (2 * Math.PI);
  },
  //删除事件
  del: function (e) {
    var _this = this;
    console.log(e)
    util.request(api.deleteCart, { cartId: e.currentTarget.dataset.id }).then(function (resolve) {
      if (resolve.code == constant.QUERY_OK) {
        var items = _this.data.items;
        items.splice(e.currentTarget.dataset.index, 1)
        if (items.length == 0) {
          _this.data.empty = true;
        }
        _this.setData({
          carts: items,
          empty: _this.data.empty,
          totalPrice: _this.getTotalPrice(_this.data.items)
        })
      }
    });
  },
})