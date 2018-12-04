// pages/module/confirm/confirm.js
const app = getApp();
const pubFun = require('../../../js/public.js');
const areas = require('../../../js/areas.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {},
  onLoad: function(options) {
    var that = this;
    pubFun.HttpRequst("loading", '/balance/getDealerBalance/1', 3, '', 'GET', function(res) {
      if (res.code == 0) {
        that.setData({
          balance: res.data.balance
        })
      }
    });
    // pubFun.HttpRequst("loading", '/invoice/buyerid', 3, '', 'GET', that.AfterInvoice);

  },

  onShow: function() {

  },
})