const util = require('../../utils/util.js');
const api = require('../../config/api.js');
const constant = require('../../config/constant.js');

Page({
    data: {
        curIndex: 0,
        isScroll: false,
        url: api.baseUrl
    },
    onReady(){
        var _this = this;
        wx.request({
          url:api.classify,
            success(res){
              _this.setData({
                    classify : res.data.data,
                })
            }
        });
        
    },
    switchTab(e){
      const self = this;
      this.setData({
        isScroll: true
      })
      setTimeout(function(){
        self.setData({
          toView: e.target.dataset.id,
          curIndex: e.target.dataset.index
        })
      },0)
      setTimeout(function () {
        self.setData({
          isScroll: false
        })
      },1)
        
    }
    
})