//login.js
//获取应用实例
const app = getApp()
const http = require('../../../js/http.js')
const storage = require('../../../js/storage.js');

Page({
  data: {
    hiddenName: false,
    forgetName:true,
    username: "",
    password: "",
    mobile: '',
    userInfo: {},
    prePage:"",
    hasUserInfo: false,
  },
  register: function () {
  },
  mobileInput:function(e){
    this.setData({
      mobile: e.detail.value
    })  
  },
  psInput:function(e){
    this.setData({
      password: e.detail.value
    }) 
  },
  login:function(e){
    var that=this;
    var mobile = this.data.mobile;
    var password = this.data.password;
    var _cache = Math.random(15);
    var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(16[0-9]{1})|(17[0-9]{1}))+\d{8})$/;

    if (mobile == '') {
      wx.showToast({
        title: '手机号不能为空',
        image: "/img/error.png",
        duration: 1500
      })
      return false; 
    } else if (mobile.length != 11 && !myreg.test(mobile)) {
      wx.showToast({
        title: '手机号格式有误！',
        image: "/img/error.png",
        duration: 1500
      })
      return false;
    } else if (!myreg.test(mobile)){
      wx.showToast({
        title: '手机号格式有误！',
        image: "/img/error.png",
        duration: 1500
      })
      return false;  
    } else if (password == ''){    
        wx.showToast({
          title: '密码不能为空！',
          image: "/img/error.png",
          duration: 1500
        })
        return false;  
    }else
    {
      wx.request({
        url: app.globalData.url +"/user/wx/saasLogin",
        data: {
          // "loginName":"13584803457",
          // "password":"zyyzyy3457",
          "loginName": "18574161943",
          "password": "abc123456"
          // "loginName": mobile,
          // "password": password
        },
        method: 'POST',
        header: {
          'content-type': 'application/x-www-form-urlencoded',
          'channel': 'wx_program'
        },
        success: function (res) {
          var s = res.data
          if(s.code==0){
            if (s.data.dealerType != 1){
              app.globalData.header.Cookie = 'cookieId=' + s.data.cookieId;
              app.globalData.userInfo=true;
              app.globalData.dealerId = s.data.dealerId;
              storage.put("cartNum", s.data.cartNum);
              var cc = that.data.prePage.split("/")[2];
              if (cc == "my" || cc == "sort" || cc == "cart" || cc == "index"){
                wx.switchTab({
                  url: "../../../" + that.data.prePage
                })
              }else{
                wx.navigateBack({ delta: 2 })
              }
            }
          }else{
            wx.showToast({
              title: "账户或密码不正确",
              image: "/img/error.png",
              duration: 1500,
              width:120
            })
          }
        },
        fail: function () {
          console.log('登录时网络错误')
        }
      })

    }
    return true;  
  },
  onLoad: function (options) {
    let pages = getCurrentPages();
    let prevpage = pages[pages.length - 2];
    this.setData({
      prePage: prevpage.route
    })
  },
 
})
