//获取应用实例
const app = getApp()
const http = require('../../../js/http.js')
const pubFun = require('../../../js/public.js')
const storage = require('../../../js/storage.js');

Page({
  data: {
    dialogContent: [],
    pageNum:"1",
    searchList: [],
    noMore:false
  },
  onReady: function() {
    // 获得dialog组件
    this.dialog = this.selectComponent("#dialog");
  },
  onLoad: function(options) {
    var data = {};
    var that = this;
    data.status = options.status;
    that.setData({
      sel_status: options.status
    });
    that.getOrderByStatus(data);
  },
  //获取订单状态
  getOrderByStatus: function(data) {
    var that = this;
    var arr = that.data.searchList;
    pubFun.HttpRequst("loading", '/order/list/' + that.data.pageNum, 3, data, 'GET', function(res) {
      if (res.data.rows != []) {
        for (var i = 0; i < res.data.rows.length; i++) {
          arr.push(res.data.rows[i]);
        }
        that.setData({
          orderList: arr
        })
      }

      if (res.data.rows == [] && res.data.total == 0){
        that.setData({
          orderList: "",
          orderList: ''
        })
      }

      if (res.data.rows == [] && res.data.total != 0){
        that.setData({
          noMore:true
        })
      }

    });
  },
  //切换订单状态
  changeSta: function(e) {
    this.setData({
      sel_status: e.currentTarget.dataset.status,
      pageNum:"1",
      searchList:[]
      
    });
    var data = {};
    var that = this;
    data.status = e.currentTarget.dataset.status;
    that.getOrderByStatus(data);
  },
  toOrderInfo:function(e){
    wx.navigateTo({
      url: '/pages/module/orderInfo/orderInfo?id=' + e.currentTarget.dataset.orderid,
    })

    // wx.navigateTo({
    //   url: '/pages/module/goodInfo/goodInfo?id=' + e.currentTarget.dataset.id,
    // })
  },
  //查看物流
  checkLogic:function(e){
    var orderid=e.currentTarget.dataset.orderid;
    wx.navigateTo({
      url: '/pagesmodule/logistic/logistic?orderid=' + orderid,
    })
  },
  //确认收货
  confirmGain:function(e){
    var orderid = e.currentTarget.dataset.orderid;
    var data={};
    var that=this;
    data.orderId = orderid;
  
    pubFun.HttpRequst("loading", '/order/receipt/', 3, data, 'POST', function (res) {

        if(res.code == 0){
          wx.showToast({
            title: '确认收货成功',
          })

          setTimeout(function(){
            wx.hideToast();
            var data={};
            data.status=3;
            that.getOrderByStatus(data);
          },1000)

        }
    })

  },
  //再次购买
  buyAgain: function (e){
    console.log(e.currentTarget.dataset.orderid)
    var data={};
    data.orderId = e.currentTarget.dataset.orderid;
    pubFun.HttpRequst("loading", '/order/buyJudge', 3, data, 'POST', function (s) {
      if(s.code == 0){
        pubFun.HttpRequst("loading", '/order/againToBuy', 3, data, 'POST', function (s){
          console.log(s)
          if (s.code == 0) {
            wx.switchTab({
              url: '/pages/cart/cart',
            })
          }	
        })
      }

      if (s.code == 1) {
        wx.showToast({
          title: '订单商品已下架',
          duration: 1000
        })
      }

      if (s.code == 2) {
        wx.showToast({
          title: '部分商品已下架',
          duration: 1000
        })
      }

    })
  },
  //去付款
  toPay:function(e){
    var  data={};
    data.orderId = e.currentTarget.dataset.orderid;
    data.orderAmount = e.currentTarget.dataset.orderamount;
    //console.log(data)
    wx.navigateTo({
      url: '/pages/module/pay/pay?data='+JSON.stringify(data),
    })    
  },
  //删除订单
  deleteOrder: function(e) {
    this.setData({
      orderid: e.currentTarget.dataset.orderid
    });
    const dialogContent = [{
      label: '',
      value: ''
    }]
    this.setData({
      dialogContent: dialogContent
    })
    this.dialog.show();
  },
  //取消订单
  cancelOrder: function(e) {
    var data = {};
    var that = this;
    data.orderId = e.currentTarget.dataset.orderid;
    pubFun.HttpRequst("loading", '/order/cancel/', 3, data, 'POST', function(res) {
      if (res.code == 0) {
        wx.showToast({
          title: '订单取消成功',
          duration:1000
        });

        var data = {};
        data.status = that.data.sel_status;
        pubFun.HttpRequst("loading", '/order/list/1', 3, data, 'GET', function (res) {
          console.log(res.data.rows);
          that.setData({
            orderList: res.data.rows
          })

        });

      }
    });
  },
  handleCancelDialog: function() {
    this.dialog.hide();
  },
  handleConfirmDialog: function() {
    var data = {};
    var that = this;
    data.orderId = that.data.orderid;
    pubFun.HttpRequst("loading", '/order/delete', 3, data, 'GET', function(res) {
      if (res.code == 0) {
        that.dialog.hide();
        var data = {};
        data.status = 6;
        that.getOrderByStatus(data);
      }
    });
  },
  onShow: function() {

  },
  onReachBottom: function () {
    var that=this;
    var pageNum = this.data.pageNum++;
    var data={};
    data.status = that.data.sel_status;
    if (that.data.noMore != true){
      that.getOrderByStatus(data);
    }
  }
})