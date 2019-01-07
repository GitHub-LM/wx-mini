//login.js
//获取应用实例
const app = getApp()
const http = require('../../../js/http.js')
const storage = require('../../../js/storage.js');

Page({
  data: {
  },
  onLoad: function (options) {
  },
  toOrder:function(){
    wx.navigateTo({
      url: '/pages/module/orderStatus/orderStatus?status=2',
    })
  },
  buyAgain:function(){
    wx.switchTab({
      url: '/pages/index/index',
    })
  }
})
