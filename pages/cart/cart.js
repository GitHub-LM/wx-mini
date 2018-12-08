// pages/cart/cart.js
const app = getApp();
const http = require('../../js/http.js');
const pubFun = require('../../js/public.js');

Page({
  data: {
    carts: [], // 购物车列表
    haveGoods: false, // 列表是否有数据
    totalPrice: 0, // 总价，初始为0
    selectAllStatus: true, // 全选状态，默认全选
    deleteAllStatus: false,
    name: '',
    id: '',
    edit: true
  },
  onLoad: function(options) {
    var that = this;
    pubFun.HttpRequst("loading", '/cart/list', 3, '', 'GET', function(res) {
      console.log(res);
      if (res.code == 0 && res.data != "") {
        var s = res.data[0];
        that.setData({
          haveGoods: true, // 有数据了，那设为true
          carts: s.list,
          name: s.name,
          selectAllStatus: true
        })
        that.getTotalPrice();
      } else {
        that.setData({
          haveGoods: false
        })
      }

    });
  },
  GetList: function(data) {
    var that = this;
    if (data.data != "") {
      var s = data.data[0];
      that.setData({
        haveGoods: true, // 有数据了，那设为true
        carts: s.list,
        name: s.name,
        selectAllStatus: true
      })
      that.getTotalPrice();
    } else {
      that.setData({
        haveGoods: false
      })
    }
  },
  //编辑
  edit: function(e) {
    console.log(this.data.carts)
    
    this.setData({
      cut: true,
      selectAllStatus: false,
      deleteAllStatus: true,
      edit: false
    })
    this.selectAll();
  },
  //完成
  done: function() {
    let carts = this.data.carts;
    for (let i = 0; i < carts.length; i++) {
      carts[i].selected = false;
    }
    this.setData({
      cut: false,
      edit: true,
      selectAllStatus: true,
      deleteAllStatus: false
    })
    this.selectAll()
  },
  //单选
  selectList: function(e) {
    var index = e.currentTarget.dataset.index;
    var carts = this.data.carts;
    carts[index].selected = !carts[index].selected;
    // 默认全选
    this.data.selectAllStatus = true;
    for (var i = 0; i < carts.length; i++) {
      if (!carts[i].selected) {
        this.data.selectAllStatus = false;
        break;
      }
    }

    this.setData({
      carts: carts,
      selectAllStatus: this.data.selectAllStatus
    });
    this.getTotalPrice();
  },
  selectDel:function(e){
      console.log(e)
  },
  //删除商品
  deleteGoods:function(e){
    var that=this;
    wx.showModal({
      title: '提示',
      content: '确认删除吗',
      success:function(res){
        if (res.confirm){
          var data={};
          data.cartId=e.currentTarget.dataset.id;
          pubFun.HttpRequst("loading", '/cart/del/', 3, data, 'POST', function (res) {
            if (res.code == 0){
              that.getTotalPrice();
              that.onShow();
            }
          });
        }
      }
    })

  },
  //删除购物车当前商品
  // deleteList(e) {
  //   const index = e.currentTarget.dataset.index;
  //   let carts = this.data.carts;
  //   carts.splice(index, 1);
  //   this.setData({
  //     carts: carts
  //   });
  //   if (!carts.length) {
  //     this.setData({
  //       haveGoods: false
  //     });
  //   } else {
  //     this.getTotalPrice();
  //   }
  // },
  //删除选中
  deleteCarts: function(e) {
    var that = this
    var s = this.data.carts;
    var arr = [];
    for (var i = 0; i < s.length; i++) {
      if (s[i].selected) {
        arr.push(s[i].id)
      }
    }
    wx.request({
      url: app.globalData.url + '/cart/del/',
      method: 'POST',
      header: {
        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
        "Cookie": "cookieId=" + wx.getStorageSync("cookieId")
      },
      data: {
        cookieId: wx.getStorageSync("cookieId"),
        cartId: arr
      },
      success: function(res) {
        that.GetList();
      }
    })
    console.log(arr);
  },
  //全选删除
  Alldelete: function() {
    let deleteAllStatus = this.data.deleteAllStatus;
    deleteAllStatus = !deleteAllStatus;
    let carts = this.data.carts;
    for (let i = 0; i < carts.length; i++) {
      carts[i].selected = deleteAllStatus;
    }
    this.setData({
      deleteAllStatus: deleteAllStatus,
      selectAllStatus: deleteAllStatus,
      carts: carts,
    });
  },
  //全选
  selectAll(e) {
    //console.log(this.data)
    let selectAllStatus = this.data.selectAllStatus;
    selectAllStatus = !selectAllStatus;
    let carts = this.data.carts;
    for (let i = 0; i < carts.length; i++) {
      carts[i].selected = selectAllStatus;
    }
    this.setData({
      selectAllStatus: selectAllStatus,
      carts: carts
    });
    this.getTotalPrice();
  },
  // 改变数量
  changeNum: function(e) {
    var types = e.currentTarget.dataset.type;
    var index = e.currentTarget.dataset.index;
    var obj = e.currentTarget.dataset.obj;
    var id = this.data.carts[index].id;
    var carts = this.data.carts;
    var num = carts[index].num;
    var data = {};
    data.activityType = 0;
    data.id = id;

    if (types == "-1") {
      if (num <= 1) {
        return false;
      }
      num = num - 1;
      carts[index].num = num;
      data.num = num;
      data.uNum = num;

      pubFun.HttpRequst("loading", '/cart/cart_add/', 3, data, 'POST', function(res) {
        wx.setStorageSync("cartNum", res.data)
      });
    } else {
      var num = carts[index].num + 1;
      carts[index].num = num;
      pubFun.HttpRequst("loading", '/cart/cart_add/', 3, data, 'POST', function(res) {
        wx.setStorageSync("cartNum", res.data)
      });
    }

    this.setData({
      carts: carts
    });
    this.getTotalPrice();
  },
  //计算总价
  getTotalPrice() {
    let carts = this.data.carts; // 获取购物车列表
    let total = 0;
    for (let i = 0; i < carts.length; i++) { // 循环列表得到每个数据
      if (carts[i].selected) { // 判断选中才会计算价格
        total += carts[i].num * carts[i].price; // 所有价格加起来
      }
    }
    this.setData({ // 最后赋值到data中渲染到页面
      carts: carts,
      totalPrice: total.toFixed(2)
    });
  },

  //结算
  toConfirm: function() {
    var idArr = [];
    for (var i = 0; i < this.data.carts.length; i++) {
      if (this.data.carts[i].selected){
        idArr.push(this.data.carts[i].id);
      }
    }
    if (idArr != ""){
      wx.setStorage({
        key: 'idArr',
        data: JSON.stringify(idArr),
      })
      wx.navigateTo({
        url: '../module/confirm/confirm',
      })
    }else{
      wx.showToast({
        title: '请选择商品',
        duration:1000,
        image:"/img/error.png"
      })
    }
   
  },
  toBuy:function(){
    wx.switchTab({
      url: '/pages/index/index',
    })
  },
  onShow: function() {
    this.onLoad();
  }
})