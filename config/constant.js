//常量

module.exports={
  QUERY_OK: 2000,  //成功
  QUERY_FAIL: 5000,  //失败
  TYPE_ALL : 'all', //更新全部
  TYPE_SINGLE : 'single', //更新单个
  SELECTED_OK : 1 ,//选中
  SELECTED_FAIL : 0, //未选中
  ORDER_NO_PAY: 1, //订单待支付
  ORDER_PAY_END: 2, //订单已支付
  ORDER_DELIVER: 3, //订单未发货
  ORDER_FINISH: 4,  //订单已完成
  ORDER_APPRAISAL:5,   //订单已评价
  ORDER_CANCEL: 6, //订单已取消
  ORDER_DRAWBACKIING: 7, //订单退款中
  ORDER_DRAWBACK:8, //订单已退款 
  PAYTYPE_WECHET:3 , //微信支付
  PAYTYPE_WECHET:4, //钱包支付
}

