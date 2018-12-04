const app = getApp();
const pubFun = require('../../../js/public.js');

Page({
  data: {

  },
  onLoad: function (option){
    var that = this;
    console.log(option)
    if (option.type == 1){
      that.setData({
        approving: true
      })
    }

    if (option.type == 2){
      that.setData({
        approed: true
      })
      
    }
  },
  toComplete:function(){
    wx.navigateTo({
      url: '/pages/module/approve/approve',
    })
  }
})