const app = getApp();

module.exports = {
  //异步请求封装
  HttpRequst(loading, url, sessionChoose, params, method, callBack) {
   // console.log(app.globalData.header.Cookie);
    var paramSession = [
      {},
      {
        'content-type': 'application/json',
        'Cookie': app.globalData.header.Cookie,
        'channel': 'wx_program'
      },
      {
        'content-type': 'application/json',
      },
      {
        'content-type': 'application/x-www-form-urlencoded',
        'Cookie': app.globalData.header.Cookie,
        'channel':'wx_program'
      },
      {
        'content-type': 'application/x-www-form-urlencoded',
        'channel': 'wx_program'
      }
    ]
    wx.request({
      url: app.globalData.url + url,
      data: params,
      dataType: "json",
      header: paramSession[sessionChoose],
      method: method,
      success: function(res) {
        if(res.data.code == 401 ){
            wx.navigateTo({
              url: '/pages/module/login/login',
            })
        }else{
          callBack(res.data);
        }
        
      }
    
    })
  },
  //加入购物车
  addCart(id, num) {
    if (app.globalData.userInfo == true){
      var data = {},
        _cache = Math.random(15);
      data.sellerGoodsId = id;
      data.num = num;
      data.activityType = "0";
      data._cache = _cache;

      wx.request({
        url: app.globalData.url + "/cart/cart_add/",
        data: data,
        method: "POST",
        header: {
          "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
          "Cookie": app.globalData.header.Cookie,
          'channel': 'wx_program'
        },
        success: function (res) {
          if (res.data.code == 0) {
            wx.showToast({
              title: '加入购物车成功',
              icon: 'success',
            });

            setTimeout(function () {
              wx.hideToast();
              wx.setStorage({
                key: "cartNum",
                data: res.data.data
              })
            }, 1000)

          }
        }
      })
      
    }else{
      wx.navigateTo({
        url: '/pages/module/login/login',
      })
    }

  },
  //电话号码检测
  checkTel: function(t) {
    var reg = /(^([0\*][0-9\*]{2,3}\s)?([2-9\*][0-9\*]{6,7})+(\-[0-9\*]{1,4})?$)|(^([0\*][0-9\*]{2,3})?([2-9\*][0-9\*]{6,7})+(\-[0-9\*]{1,4})?$)|(^([0\*][0-9\*]{2,3}[\-\*])?([2-9\*][0-9\*]{6,7})+(\-[0-9\*]{1,4})?$)|(^((\(\d{3}\))|(\d{3}\-))?([1\*][3456789\*][0-9\*]{9})$)/;

    if (reg.test(t)) {
      return true;
    } else {
      return false;
    }
  },
 //邮编检测
  checkPostcode: function(t) {
    var reg = /^[0-9][0-9]{5}$/;
    if (reg.test(t)) {
      return true;
    } else {
      return false;
    }
  },
  //检测地址
  checkAddress: function(t) {
    var reg = /^[\u4E00-\u9FA5A-Za-z\d\-\_\#\,\、\，\(\)\（\）\s]{1,60}$/;
    if (reg.test(t)) {
      return true;
    } else {
      return false;
    }
  },
  // 纳税识别号
  checkTaxpayeRno: function(t) {
    var reg = /^([A-Za-z\d]{15}|[A-Za-z\d]{18}|[A-Za-z\d]{20})$/;
    if (reg.test(t)) {
      return true;
    } else {
      return false;
    }
  },
  //检测银行名
  checkBankName: function(t) {
    var reg = /^[\u4E00-\u9FA5]{2,80}$/;
    if (reg.test(t)) {
      return true;
    } else {
      return false;
    }
  },
  //检测银行账号
  checkBankAccount: function(t) {
    var reg = /^(\d{1,25})$/;
    if (reg.test(t)) {
      return true;
    } else {
      return false;
    }
  },
  //格式化时间
  formatTime: function() {
    var d = new Date();
    var curr_date = d.getDate();
    var curr_month = d.getMonth() + 1;
    var curr_year = d.getFullYear();
    String(curr_month).length < 2 ? (curr_month = "0" + curr_month) : curr_month;
    String(curr_date).length < 2 ? (curr_date = "0" + curr_date) : curr_date;
    var yyyyMMdd = curr_year + "" + curr_month + "" + curr_date;
    return yyyyMMdd;
  },
  //格式化金钱
  moneyFormat:function(data){
    return data.toFixed(2);
  }

}