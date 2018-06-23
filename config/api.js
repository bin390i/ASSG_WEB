const ApiUrl="http://192.168.1.104:8080/";
module.exports={
  baseUrl:ApiUrl,
  login: ApiUrl + 'loginByWeixin.do',//用户登录相关
  classify: ApiUrl + 'web/classify/classify.do', //分类接口
  goodsList: ApiUrl + 'selectGoodsByClassify.do', //获取当前分类下的所有商品
  saveAddress : ApiUrl + 'saveAddress.do', //保存地址
  addressList: ApiUrl + 'addressList.do', //查询地址列表
  getAddress: ApiUrl + 'getAddress.do', //获取地址详情
  getGoodsInfo: ApiUrl + 'getGoodsInfo.do', //获取商品信息
  addCart : ApiUrl + 'addCart.do', //添加或更新购物车
  cartList: ApiUrl + 'cartList.do', //获取用户的购物车列表
  deleteCart: ApiUrl + 'deleteCart.do', //购物车删除
  updateCartStatus: ApiUrl + 'updateCartStatus.do', //更新购物车状态
  creatOrder : ApiUrl + 'creatOrder.do',  //创建订单
  payForAccount: ApiUrl + 'payForAccount.do',  //账户余额支付 
  getDefaultAddress: ApiUrl + 'getDefaultAddress.do', //获取用户默认的收货地址
  getOrderList: ApiUrl + 'order.do', //获取对应状态的订单列表
  getAccount: ApiUrl + 'balance.do', //获取账户余额
  selectItem: ApiUrl + 'selectItem.do', //查询item  -- 评价晒单页面使用
  appraises :ApiUrl + 'web_appraises.do',//保存评论
  appraisesImg: ApiUrl + 'web_uploadImg.do', //保存评论图像
  queryAppraises: ApiUrl + 'queryAppraises.do', //获取商品评论
  selectCouponForWxUser: ApiUrl + 'selectCouponForWxUser.do',//获取优惠券列表
  selectEnableCouponForWxUser: ApiUrl +'selectEnableCouponForWxUser.do', //获取可用优惠券和不可用优惠券分组,支付订单时
  selectArticle: ApiUrl +'selectArticle.do', //获取文章列表
  selectTopicList: ApiUrl + 'selectTopicList.do', //获取频道列表
  selectTopic: ApiUrl + 'selectTopic.do', //获取频道信息
  selectGoodsByTopic: ApiUrl + 'selectGoodsByTopic.do', //获取关联商品
  saveSystemInfo: ApiUrl +'saveSystemInfo.do', //保存用户系统信息
  sendMsg: ApiUrl + "sendMsg.do", //用户下单后发送模板消息给商户
};
