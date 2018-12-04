//index.js
const app = getApp()
const http = require('../../../js/http.js')
const pubFun = require('../../../js/public.js')

Page({
  data: {

  },
  onShow: function() {

  },
  onLoad: function(option) {
    var that = this;
    pubFun.HttpRequst("loading", '/order_detail/order_logistics?orderId=161542610656797', 3, '', 'GET', function(res) {
      if (res.code == 0) {
        that.setData({
          logicInfo: res.data.list,
          GdbOrderId: res.data.GdbOrderId
        })
        that.selPackage(0, res.data.list[0].nu);
      }
    })
  },
  selPackage: function(e,numb) {
    var index;
    var nu;
    
    if(e==0){
      index = 0;
    }else{
      index = e.currentTarget.dataset.index;
    }

    if (typeof numb == "string"){
      nu = numb;
    }else{
      nu = e.currentTarget.dataset.nu;
    }
  
    this.setData({
      currentIndex: index
    })
    this.showLogistics(this.data.logicInfo, index);

  },
  showLogistics: function(p, index) {
    var that = this;
    if (p[index].com == "顺丰速运") { //顺丰快递
      if (p[index].logisticsData != undefined) {
        that.setData({
          shunfeng: true,
          noLogistic: false,
          unshunfeng: false,
          info: p[index].logisticsData.data
        });
      } else {
        that.setData({
          shunfeng: false,
          unshunfeng: false,
          noLogistic: true
        });
      }

    } else { //非顺丰快递
      if (p[index].logisticsData.message == "ok") {
        that.setData({
          unshunfeng: true,
          noLogistic: false,
          info: p[index].logisticsData.data
        });
      } else {
        that.setData({
          noLogistic: true,
          unshunfeng: false,
          shunfeng: false
        });
      }
    }
  }
});