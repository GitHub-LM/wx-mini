const app = getApp();
const pubFun = require('../../js/public.js');

Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
  },
  ToOrderStatus: function(e) {
    var status = e.currentTarget.dataset.status;
    if (app.globalData.userInfo == true) {
      wx.navigateTo({
        url: '/pages/module/orderStatus/orderStatus' + "?status=" + status,
      })
    } else {
      wx.navigateTo({
        url: '/pages/module/login/login',
      })
    }

  },
  //退出
  loginOut: function() {
    var a = Math.random(15);
    var that = this;
    pubFun.HttpRequst("loading", '/user/saasLoginOut/', 3, "", 'POST', function(res) {
      wx.clearStorageSync();
      app.globalData.userInfo = "";
      that.setData({
        hasUserInfo: false,
        dfkNum: "",
        dfhNum: "",
        dshNum: "",
        ywcNum: "",
      })
    })
  },
  //跳转完善企业信息页面
  ToApprove:function(){
    wx.navigateTo({
      url: '/pages/module/approve/approve',
    })
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../sort/sort'
    })
  },
  //我的余额
  ToBalance: function() {
    if (app.globalData.userInfo == true) {
      wx.navigateTo({
        url: '../module/balance/balance',
      })
    }else{
      wx.navigateTo({
        url: '/pages/module/login/login',
      })
    }

  },
  //我的工币
  ToBean: function() {
    if (app.globalData.userInfo == true) {
      wx.navigateTo({
        url: '/pages/module/bean/bean',
      })
    } else {
      wx.navigateTo({
        url: '/pages/module/login/login',
      })
    }

  },
  //抵扣券
  ToRebate: function() {
    if (app.globalData.userInfo == true) {
      wx.navigateTo({
        url: '/pages/module/rebate/rebate',
      })
    } else {
      wx.navigateTo({
        url: '/pages/module/login/login',
      })
    }
  },
  onShow: function() {
    this.onLoad();
  },
  onLoad: function() {
    var that = this;
    if (app.globalData.dealerName !=""){
        that.setData({
          dealerName: app.globalData.dealerName
        })
    }

    if (app.globalData.userInfo == true) {
      that.setData({
        hasUserInfo: true
      });
      var dealerId = app.globalData.dealerId;
      pubFun.HttpRequst("loading", '/order/getOrderNum?id=' + dealerId, 3, "", 'GET', function(res) {
        var s = res;
        if (s.code == 0) {
          that.setData({
            dfkNum: s.data[1],
            dfhNum: s.data[2],
            dshNum: s.data[3],
            ywcNum: s.data[6],
          });
        }
      });
      //查看是否认证
      pubFun.HttpRequst("loading", '/order/checkUser?id=' + dealerId, 3, "", 'GET', function (res) {
        if (res.data == 1) {
          that.setData({certification:true});
        }else{
          that.setData({ certification: false });
        }
      });


    }
  },
  getUserInfo: function(e) {
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  }
})