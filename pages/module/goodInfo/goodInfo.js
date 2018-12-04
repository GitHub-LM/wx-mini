// pages/module/goodInfo/goodInfo.js
const http = require('../../../js/http.js')
const pubFun = require('../../../js/public.js')
const app = getApp()

Page({

  data: {
    num:1,
    flag: true,
    flag2: true,
    minusStatus: 'disabled',
    phonecall: '0512-65099638'
  },

  onLoad: function (options) {
    var id = JSON.parse(options.id);
    var that = this;

    //获取商品信息
    pubFun.HttpRequst("loading", '/goods/web_item/info/' + id, 3, '', 'GET', function (res) {
      var s = res.data;
      if (s != undefined) {
        that.setData({
          attrs: s.attrs,
          imgs: s.image,
          title: s.title,
          price: s.price,
          orderNum: s.orderNum,
          model: s.model,
          brandName: s.brandName,
          stock: s.stock,
          measure: s.measure,
          series: s.series,
          sellerGoodsId: s.saleGId
        });
      }
    })
  
  },
  cart: function () {
    if (app.globalData.userInfo != true){
      wx.navigateTo({
        url: '/pages/module/login/login'
      })
    }else{
      this.setData({ flag: false })
    }
  },
  /* 数量减 */
  bindMinus: function () {
    var num = this.data.num;
    if (num > 1) {
      num--;
    }
    var minusStatus = num <= 1 ? 'disabled' : 'normal';
    this.setData({
      num: num,
      minusStatus: minusStatus
    });
  },
  /* 数量加 */
  bindPlus: function () {
    var num = this.data.num;
    num++;
    var minusStatus = num < 1 ? 'disabled' : 'normal';
    this.setData({
      num: num,
      minusStatus: minusStatus
    });
  },
  //输入框事件
  bindManual: function (e) {
    var num = e.detail.value;
    this.setData({
      num: num
    });
  },
  //拨打电话
  phoneCall:function(){
    wx.makePhoneCall({
      phoneNumber: this.data.phonecall
    })
  },
  // 联系客服
  service:function(){
    this.setData({ flag2: false })
  },
  close_service:function(){
    this.setData({ flag2: true })
  },
  close:function(){
    this.setData({ flag: true })
  },
  // 加入购物车 
  ToCart: function (e) {
    var that = this;
    var id = that.data.sellerGoodsId;
    var num = that.data.num
    pubFun.addCart(id,num);

    setTimeout(function(){
      wx.getStorage({
        key: 'cartNum',
        success: function (res) {
          that.setData({
            flag: true,
            cart_num: res.data
          })
        }
      })
    },1500)
  
  },

  cartPage:function(){
    wx.switchTab({
      url: '../../cart/cart'
    })
  },
  onShow: function () {
    var aa=wx.getStorageSync("cartNum");
    if(aa != ""){
      this.setData({
        cart_num: aa
      })
    }else{
      this.setData({
        cart_num: "空"
      })
    }
   
  },
})