const app = getApp();
const pubFun = require('../../../js/public.js');
Page({
  data: {
    wechat: true,
    offline: false
  },
  onLoad: function(options) {
    var s = JSON.parse(options.data);
    this.setData({
      orderAmount: s.orderAmount,
      orderId: s.orderId
    })

  },
  radioChange: function(e) {
    var s = e.detail.value;
    if (s == "微信支付") {
      this.setData({
        wechat: true,
        offline: false
      })
    } else {
      this.setData({
        wechat: false,
        offline: true
      })
    }
  },
  //微信支付
  wechatPay: function(e) {
    var that = this;
    var orderid = e.currentTarget.dataset.orderid;
    var orderamount = e.currentTarget.dataset.orderamount;
    var timestamp = Date.parse(new Date());
    var cache = Math.random(10);
    timestamp = timestamp / 1000;
    //获取code换取openID
    wx.login({
      success: function(res) {
        console.log(res)
        that.getOpenId(res.code);
      }
    })

  },
  //线下支付
  paid: function() {
    wx.navigateTo({
      url: '/pages/module/orderStatus/orderStatus?status=0',
    })
  },
  //获取openID
  getOpenId: function(code) {
    var that = this;
    // wx.request({
    //   url: "https://api.weixin.qq.com/sns/jscode2session?appid=wx58320097c691d015&secret=d54b752620275a79efcd4189179f64e1&js_code=" + code + "&grant_type=authorization_code",
    //   data: {},
    //   method: 'GET',
    //   success: function(res) {
    //     that.generateOrder(res.data.openid);
    //   },
    //   fail: function() {
    //   },
    //   complete: function() {
    //   }
    // })

    pubFun.HttpRequst("loading", '/weixin/getOpenId?code=' + code, 3, null, 'POST', function (res) {
      console.log(res);
      that.generateOrder(res.data);
    })


  },

  //生成商户订单 
  generateOrder: function(openid) {
    var that = this;
    var data={};
    data.orderId = that.data.orderId;
    data.openId = openid;
    data.paymentType = "wxMini";
    data.isbalance="0";
    //统一支付
    pubFun.HttpRequst("loading", '/payment/payment_submit', 3, data, 'POST', function (res) {
      var s = res.data;
      that.pay(s.imgSrc);
    })

  },
  pay: function(param) {
    var param = JSON.parse(param);
    wx.requestPayment({
      'timeStamp': param.timeStamp,
      'nonceStr': param.nonceStr,
      'package': param.package,
      'signType': param.signType,
      'paySign': param.paySign,
      'success': function(res) {
        if (res.errMsg == "requestPayment:ok"){
          wx.navigateTo({
            url: '/pages/module/paySuccess/paySuccess',
          })
        }
      },
      'fail': function(res) {
        console.log(res);
      }
    })
  }
})