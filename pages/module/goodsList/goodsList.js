// pages/module/goodsList/goodsList.js
const app = getApp()
const pubFun = require('../../../js/public.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    searchList: [],
    pageNum: '1',
    keywords: '',
    brandId: "",
    data: {}
  },
  onLoad: function(options) {
    var data = {};
    if (options.brandId) {
      this.data.data.brandId = options.brandId;
      this.getGoodsList(this.data.data);
      this.onReachBottom(this.data.data);
    }
    if (options.categoryName) {
      this.data.data.categoryName = encodeURIComponent(options.categoryName);
      this.getGoodsList(this.data.data);
      this.onReachBottom(this.data.data);
    }
    if (options.keywords) {
      this.data.data.keyword = encodeURIComponent(options.keywords);
      this.getGoodsList(this.data.data);
      this.onReachBottom(this.data.data);
    }

    var that = this;
    if (app.globalData.userInfo != true) {
      that.setData({showCartNu:false});
    }else{
      that.setData({showCartNu:true});
      wx.getStorage({
        key: 'cartNum',
        success: function (res) {
          that.setData({
            cartNum: res.data
          })
        }
      })
    }
   

  },
  //价格排序
  sortByPrice:function(data){
    var that=this;
    pubFun.HttpRequst("loading", '/goods/get_list/brand_selection.action/sortFields=marketPrice&sortFlags=0', 3, data, 'GET', function(res) {
      console.log(res);
    })
  },
  //购物车悬浮图标
  ToCart:function(){
    if (app.globalData.userInfo != true){
      wx.navigateTo({
        url: '/pages/module/login/login',
      })
    }else{
      wx.switchTab({
        url: '/pages/cart/cart',
      })
    }
   
  },
  //搜索
  inpclick: function() {
    wx.navigateTo({
      url: '../../module/search/search'
    })
  },
  //加入购物车
  tocart: function(e) {
    var that = this;
    if (app.globalData.userInfo != true) {
      wx.navigateTo({
        url: '/pages/module/login/login'
      })
    } else {
      var id = e.currentTarget.dataset.id;
      var num = "1";
      pubFun.addCart(id, num);

      setTimeout(function() {
        wx.getStorage({
          key: 'cartNum',
          success: function(res) {
            console.log(res.data);
            that.setData({
              cartNum: res.data
            })
          },
        });
      }, 1500)


    }

  },
  //统一获取数据
  getGoodsList: function(data) {
    var that = this;
    pubFun.HttpRequst("loading", '/goods/get_list/goods_list/' + that.data.pageNum, 3, data, 'GET', function(res) {
      if (res.code == 0 && res.data.searchList != '') {
        var arr = that.data.searchList;
        for (var i = 0; i < res.data.searchList.length; i++) {
          arr.push(res.data.searchList[i]);
        }
        that.setData({
          searchList: arr,
          haveGoods: true
        })
      } else {
        that.setData({
          haveGoods: false,
          noGoodsInfo: "商品暂未上架"
        });

      }
    })
  },
  //跳转到商品详情页
  toDetail: function(e) {
    if (app.globalData.userInfo == true){
      wx.navigateTo({
        url: '../../module/goodInfo/goodInfo?id=' + e.currentTarget.dataset.id,
      })
    }else{
      wx.navigateTo({
        url: '/pages/module/login/login',
      })
    }
    
  },
  //页面上拉触底事件的处理函数
  onReachBottom: function() {
    var pageNum = this.data.pageNum++;
    this.getGoodsList(this.data.data);
  },

})