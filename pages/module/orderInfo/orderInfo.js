//获取应用实例
const app = getApp()
const http = require('../../../js/http.js')
const pubFun = require('../../../js/public.js')
const storage = require('../../../js/storage.js');


Page({
  data: {

  },
  onLoad: function (options) {
    console.log(options.id)
    var that=this;
    var orderId = options.id;
    pubFun.HttpRequst("loading", '/order_detail/web/detail?orderId=' + orderId, 3, null, 'GET', function (res) {
      console.log(res);
      var orderTime = pubFun.timeFormat(res.data.orderTime);
      that.setData({
        status: res.data.status,
        orderId: res.data.orderId,
        orderId: res.data.orderId,
        orderTime: orderTime,
        payTime: res.data.payTime,
        recvName: res.data.recvName,
        consignee: res.data.consignee,
        cityMap: res.data.cityMap,
        mobile: res.data.mobile,
        regAddress: res.data.regAddress,
        recvMobile: res.data.recvMobile,
        orderGoods: res.data.orderGoods[0].list,
        invType: res.data.invType,
        invTitle: res.data.invTitle,
        invType: res.data.invType,
        realAmount: res.data.realAmount,
        freightAmount: res.data.freightAmount,
        scoreDeductionAmout: res.data.scoreDeductionAmout,
        amount: res.data.amount,
        goodsAmount: res.data.goodsAmount
      })
    })
  },
  toGoodInfo:function(e){
    console.log(e.currentTarget.dataset.id)
    wx.navigateTo({
      url: '/pages/module/goodInfo/goodInfo?id=' + e.currentTarget.dataset.id,
    })
  }

})