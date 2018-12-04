const http = require('../../../js/http.js')
const pubFun = require('../../../js/public.js')
const address = require('../../../js/area.js')
const app = getApp()

Page({
  data: {
    region: ['江苏省', '苏州市', '吴中区'],
    customItem: '全部',
    operateScope:50,
    provinceId: 320000,
    cityId: 320500
  },

  onLoad: function(options) {
    var that = this;
    that.setData({
      provinces: address.provinces,
      citys: address.citys
    });
    
    pubFun.HttpRequst("loading", '/brandlibrary/cate', 3, '', 'GET', function(res) {
      if (res.code == 0) {
        that.setData({
          operateType: res.data,
          Index: 0,
          typeId: res.data[0].id
        })
      }
    })

  },
  //公司名称
  companyName: function(e) {
    this.setData({
      dealerName: e.detail.value
    })
  },

  //经营类别选择
  bindPickerChange: function(e) {
    var that = this;
    var typeId = that.data.operateType[e.detail.value].id;

    that.setData({
      Index: e.detail.value,
      operateScope: typeId
    })
  },
  //公司地址
  bindRegionChange: function (e){
    var that=this;
    var p = e.detail.value[0];
    var c = e.detail.value[1];
    //省
    for (var i = 0; i < that.data.provinces.length;i++){
      if (p == that.data.provinces[i].name){
        that.setData({
          provinceId: that.data.provinces[i].id
        })
        }
    };
    
    //市
    var provinceId = that.data.provinceId;
    for (var j = 0; j < that.data.citys[provinceId].length; j++) {
      if (c == that.data.citys[provinceId][j].name) {
        that.setData({
          cityId: that.data.citys[provinceId][j].id
        })
      }
    };

    that.setData({
      region: e.detail.value
    })

  },

  //联系人
  linkMan: function (e){
    this.setData({
      linkMan: e.detail.value
    })
  },

  //下一步
  submit:function(){
    var that = this;
    if (that.data.dealerName == "" || that.data.dealerName == undefined){
        wx.showToast({
          title: '公司名称必填',
          duration: 1000
        })
        return false;
    }

    if (that.data.linkMan == "" || that.data.linkMan == undefined) {
      wx.showToast({
        title: '联系人必填',
        duration: 1000
      })
      return false;
    }
    
    console.log(that.data.dealerName, that.data.operateScope, that.data.provinceId, that.data.cityId, that.data.linkMan);
    var data={};
    data.dealerName = that.data.dealerName;
    data.operateScope = that.data.operateScope;
    data.provinceId = that.data.provinceId;
    data.cityId = that.data.cityId;
    data.linkMan = that.data.linkMan;

    wx.navigateTo({
      url: '/pages/module/uploadImg/uploadImg?data=' + JSON.stringify(data),
    })

  }
})