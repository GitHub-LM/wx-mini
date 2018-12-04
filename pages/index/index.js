//index.js
const app = getApp()
const http = require('../../js/http.js')
const pubFun = require('../../js/public.js');

Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
  },
  onLoad: function() {
    var that = this;
    //精选品牌
    pubFun.HttpRequst("loading", '/brand/hotBrand', 3, '', 'GET', function(res) {
      var datas = res.data;
      that.setData({
        HotBrand: datas
      });
    });
    //轮播图
    pubFun.HttpRequst("loading", '/adverBanner/home_index/index', 3, '', 'GET', function(res) {
      var datas = res.data;
      that.setData({
        bannerimgs: datas
      });
    });

    //获取楼层信息
    pubFun.HttpRequst("loading", '/index/getFloorInfoForIos', 3, '', 'GET', function(res) {
      //console.log(res.data);
      that.setData({
        floorInfo: res.data
      })
    })
  },

  onShow: function() {},
  // 跳转信息详情页
  ToGoodInfo: function(e) {
    var p = JSON.stringify(e.currentTarget.dataset.id);
    if (app.globalData.userInfo != "" || app.globalData.userInfo !=false){
      wx.navigateTo({
        url: '/pages/module/goodInfo/goodInfo?id=' + p
      })
    }else{
      wx.navigateTo({
        url: '/pages/module/login/login'
      })
    }
   
  },
  inpclick: function() {
    wx.navigateTo({
      url: '../module/search/search'
    })
  },
  ToBrandList: function(e) {
    var brandId = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../module/goodsList/goodsList?brandId=' + brandId
    })
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../sort/sort'
    })
  },

  getUserInfo: function(e) {
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  }
})