const app = getApp();
const pubFun = require('../../../js/public.js');
const areas = require('../../../js/areas.js');


Page({
  data: {
    addShow: true,
    chooseNoInvoice: false,
    chooseInvoice: true
  },
  onLoad: function(options) {
    if (options.info == "undefined") {
      this.setData({
        chooseInvoice: false,
        chooseNoInvoice: true
      })
    } else {
      this.setData({
        chooseInvoice: true,
        chooseNoInvoice: false
      })
    }
    pubFun.HttpRequst("loading", '/invoice/buyerid', 3, '', 'GET', this.afteIinvoice);
  },
  afteIinvoice: function(data) {
    for (var i = 0; i < data.data.length; i++) {
      if (data.data[i].invType == 2) {
        this.setData({
          zpInvoiceList: data.data,
          addShow: false
        })
      }
    }
  },
  toAddInvoice: function() {
    wx.navigateTo({
      url: '../../module/addInvoice/addInvoice',
    })
  },

  deleteZp: function(e) {
    var id = e.currentTarget.dataset.id;
    var data = {};
    data.id = id;
    pubFun.HttpRequst("loading", '/invoice/del/', 3, data, 'POST', this.afterDelete);
  },
  edit: function(e) {
    console.log(e.currentTarget.dataset.info)
    wx.navigateTo({
      url: '../../module/editInvoice/editInvoice?info=' + JSON.stringify(e.currentTarget.dataset.info),
    })
  },
  afterDelete: function(data) {
    var that = this;
    if (data.code == 0) {
      wx.showToast({
        title: '删除成功',
        duration: 1500
      })

      that.setData({
        zpInvoiceList: ""
      })
    }
  },
  select: function(e) {
    var mes = e.currentTarget.dataset.mes;
    var that = this;
    if (mes == "invoice") {
      that.setData({
        chooseInvoice: true,
        chooseNoInvoice: false
      })

      setTimeout(function() {
        for (var i = 0; i < that.data.zpInvoiceList.length; i++) {
          if (that.data.zpInvoiceList[i].invType == 2) {
            var zpInvoiceList = that.data.zpInvoiceList[i];
            var pages = getCurrentPages();
            //console.log(pages, pages[pages.length - 2])
            for (var i = 0; i < pages.length; i++) {
              if (pages[i].route.indexOf("confirm") != -1) {
                pages[i].changeData(zpInvoiceList);
                wx.navigateTo({
                  url: '../../module/confirm/confirm',
                })
              }
            }
         
          }
        }

      }, 1500);

    } else {
      that.setData({
        chooseNoInvoice: true,
        chooseInvoice: false
      })
      setTimeout(function() {
        var pages = getCurrentPages();
        if (pages.length > 1) {
          var prePage = pages[pages.length - 2];
          prePage.changeData("");
        }

        wx.navigateBack({
          delta: 1
        })
      }, 1500)

    }
  },
  onShow: function() {
    // this.onLoad();
  },


})