// pages/module/confirm/confirm.js
const app = getApp();
const pubFun = require('../../../js/public.js');
const areas = require('../../../js/areas.js');
Page({

  data: {
    getConsigner: false,
    consignerInfo: '',
    province: '',
    city: '',
    area: '',
    goodsList: '',
    addrId: '',
    totalPayPrice: '',
    useIcon: false
  },
  onLoad: function(options) {

    var that = this;
    wx.getStorage({
      key: 'idArr',
      success: function(res) {
        that.setData({
          ids: res.data
        })
        var s = res.data.split("[")[1].split("]")[0];
        var data = {};
        data.ids = s;
        pubFun.HttpRequst("loading", '/order_detail/mall/confirmOrder', 3, data, 'GET', function(data) {
          that.setData({
            totalCash: data.data.totalCash,
            totalFreight: data.data.totalFreight,
            totalGoodsPrice: data.data.totalGoodsPrice,
            totalPayPrice: data.data.totalPayPrice,
            userCoin: data.data.userCoin,
            goodsList: data.data.goods[0].list
          })
        });
      },
    })
    pubFun.HttpRequst("loading", '/receive_address/', 3, '', 'GET', that.afterAddress);
    pubFun.HttpRequst("loading", '/invoice/buyerid', 3, '', 'GET', that.AfterInvoice);

  },
  consignerInfo: function(name) {
    this.setData({
      consignerInfo: name,
      getConsigner: true
    })
  },
  toAddressAdmin: function() {
    wx.navigateTo({
      url: '../../module/addressAdmin/addressAdmin',
    })
  },
  afterAddress: function(data) {
    //console.log(data);
    var that = this;
    if (data.data != '') {
      for (var i = 0; i < data.data.length; i++) {
        if (data.data[i].isDefault == "1") {
          that.setData({
            consignerInfo: data.data[i],
            addrId: data.data[i].id,
            getConsigner: true
          })

          // 匹配省市区
          for (var m = 0; m < areas.areas.length; m++) {
            if (areas.areas[m].id == that.data.consignerInfo.provinceId) {
              that.setData({
                province: areas.areas[m].name
              })
            }

            if (areas.areas[m].pId == that.data.consignerInfo.provinceId &&
              areas.areas[m].id == that.data.consignerInfo.cityId) {
              that.setData({
                city: areas.areas[m].name
              })
            }

            if (areas.areas[m].pId == that.data.consignerInfo.cityId &&
              areas.areas[m].id == that.data.consignerInfo.areaId) {
              that.setData({
                area: areas.areas[m].name
              })
            }
          }
        }
      }
    }
  },
  AfterInvoice: function(data) {
    for (var i = 0; i < data.data.length; i++) {
      if (data.data[i].invType == 2) {
        this.setData({
          invoiceList: data.data[i]
        })
      }
    }

  },
  changeData: function(invoiceList) {
    this.setData({
      invoiceList: invoiceList
    })
  },
  toInvoice: function(e) {
    var info = e.currentTarget.dataset.info;
    wx.navigateTo({
      url: '../../module/invoice/invoice?info=' + info,
    })
  },
  //是否选择工币抵扣
  coinSwitch: function(e) {
    if (e.detail.value == true) {
      this.setData({
        useIcon: true
      })
    } else {
      this.setData({
        useIcon: false
      })
    }
  },
  subOrder: function() {
    var that = this;
    var data = {};
    if (that.data.useIcon) {
      data.isBean = 1;
    } else {
      data.isBean = 0;
    }

    if (that.data.consignerInfo.id == undefined){
      wx.showToast({
        title: '请先选择地址',
        duration:1000,
        image:"/img/error.png"
      })
      return false;
    }

    data.consignAddressId = that.data.consignerInfo.id;
    data.invoiceId = that.data.invoiceList.id;
    data.cartIds = that.data.ids.split("[")[1].split("]")[0];
    data.isCash = 1;

    pubFun.HttpRequst("loading", '/order/', 3, data, 'POST', function(res) {
      //console.log(res.code);
      if(res.code == 0){
        var data={};
        data.orderAmount = res.data.orderAmount;
        data.orderId = res.data.orderId;
        wx.navigateTo({
          url: '/pages/module/pay/pay?data=' + JSON.stringify(data),
        })
      }

      if (res.code == -1 && res.msg == "未审核完成"){
        wx.navigateTo({
          url: '/pages/module/approved/approved?type=1',
        })
      }

      if (res.code == -1 && res.msg == "审核不通过" || res.code == -1 && res.msg == "未完善资料") {
        wx.navigateTo({
          url: '/pages/module/approved/approved?type=2',
        })
      }

    });
  },
  onShow: function() {

  },
})