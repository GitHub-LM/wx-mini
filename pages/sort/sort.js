const http = require('../../js/http.js')
const pubFun = require('../../js/public.js');
const app = getApp()

Page({
  data: {
    notnow: "",
    isChecked: false,
    hasUserInfo: false,
    num:50
  },
  onLoad: function () {
    var that = this;
    pubFun.HttpRequst("loading", '/category/getCates?type=1', 3, '', 'GET', function (res) {
      that.setData({
        sortObj: res.data
      });
    });
    that.meaus(50);

  },
  //切换左侧菜单
  meaus: function(e) {
    var that = this
    if (e != "50") {
      that.setData({ num: e.currentTarget.dataset.id })
    } 
    pubFun.HttpRequst("loading", '/category/getCates?type=1', 3, '', 'GET', function(res) {
      var datas = res.data;
      for (var i = 0; i < datas.length; i++) {
        if (that.data.num == datas[i].id) {
          that.setData({sortInfo: datas[i]})
        }
      }
    })
    that.goTop();

  },
  ToGoodsList:function(e){
    
    if (e.currentTarget.dataset.brandid){
      var brandId = e.currentTarget.dataset.brandid;
    }else{
      var brandId ='';
    }

    if (e.currentTarget.dataset.categoryname){
      var categoryName = e.currentTarget.dataset.categoryname;
    }else{
      var categoryName='';
    }
    
    wx.navigateTo({
      url: '../module/goodsList/goodsList?brandId=' + brandId + "&categoryName=" + categoryName
    })
    
  },
  //回到顶部
  goTop: function(e) { 
    if (wx.pageScrollTo) {
      wx.pageScrollTo({
        scrollTop: 0,
        duration:0
      })
    } 
  },
  inpclick: function () {
    wx.navigateTo({
      url: '../module/search/search'
    })
  },
})