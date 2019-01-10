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
      url: '/pages/module/addInvoice/addInvoice',
    })
  },

  deleteZp: function(e) {
    var id = e.currentTarget.dataset.id;
    var data = {};
    var that = this;
    data.id = id;

    wx.showModal({
      title: '提示',
      content: '确认删除吗？',
      success:function(res){
        if (res.confirm) {
          pubFun.HttpRequst("loading", '/invoice/del/', 3, data, 'POST', function (data) {
            
            if (data.code == 0) {
              wx.showToast({
                title: '删除成功',
                duration: 1500
              })

              that.setData({
                zpInvoiceList: ""
              })
            }
          });
        }
        
      }

    })
   
  },
  edit: function(e) {
    console.log(e.currentTarget.dataset.info)
    wx.navigateTo({
      url: '/pages/module/editInvoice/editInvoice?info=' + JSON.stringify(e.currentTarget.dataset.info),
    })
  },
  select: function(e) {
    var mes = e.currentTarget.dataset.mes;
    var that = this;
    // 选择增值税发票
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
            console.log(zpInvoiceList)
            for (var i = 0; i < pages.length; i++) {
              if (pages[i].route.indexOf("confirm") != -1) {
                pages[i].changeData(zpInvoiceList);
                wx.navigateTo({
                  url: '/pages/module/confirm/confirm',
                })
              }
            }
         
          }
        }

      }, 1000);

    } else {
      that.setData({
        chooseNoInvoice: true,
        chooseInvoice: false
      })

      setTimeout(function(){
        var pages = getCurrentPages();
        if (pages.length > 1) {
          var prePage = pages[pages.length - 2];
          prePage.changeData("");
        }

        wx.navigateBack({
          delta: 1
        })
      }, 1000)

    }

  },
  onShow: function() {
    // this.onLoad();
  },


})