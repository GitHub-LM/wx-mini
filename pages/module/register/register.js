const app = getApp();
const pubFun = require('../../../js/public.js');

Page({
  data: {
    codeMes:'获取验证码',
    registerSuc:false
  },
  onLoad: function (options) {
  },
  mobile:function(e){
    this.setData({
      mobile: e.detail.value
    })
  },
  message:function(e){
    this.setData({
      message: e.detail.value
    })
  },
  password:function(e){
    this.setData({
      password: e.detail.value
    })
  },
  rePassword:function(e){
    this.setData({
      rePassword: e.detail.value
    })
  },
  getCode:function(){

    if (this.data.mobile == undefined) {
      wx.showToast({
        title: '请先输入手机号',
        duration: 1000,
        image: '../../../img/error.png'
      })
      return false;
    }

    if (!pubFun.checkTel(this.data.mobile)) {
      wx.showToast({
        title: '手机号格式错误',
        duration: 1000,
        image: '../../../img/error.png'
      })
      return false;
    }
    this.sendCodeSuc();
    var data={};
    data.mobile = this.data.mobile;
    pubFun.HttpRequst("loading", '/sms/register', 3, data, 'GET', function (s) {
      console.log(s)
      if(s.code==0){
        
      } else if (s.code== -1){
        wx.showToast({
          title: '手机号码已存在',
          duration:1500
        })
      }
    });
   
  },
  sendCodeSuc: function () {
    var times = 60;
    var that=this;
    var m = setInterval(function () {
      times--;
      if (times == 0) {
        that.setData({
          codeMes: '获取验证码'
        })
        clearInterval(m);
      } else {
        that.setData({
          codeMes: times + "秒后重发"
        })
      }

    }, 1000);
    return m;
  },
  radioChange:function(e){
  },
  terms:function(){
    console.log("666")
  },
  register:function(){
    if ( this.data.message == undefined) {
      wx.showToast({
        title: '短信验证码必填',
        duration: 1000,
        image: '../../../img/error.png'
      })
      return false;
    }

    if (this.data.mobile == undefined) {
      wx.showToast({
        title: '请先输入手机号',
        duration: 1000,
        image: '../../../img/error.png'
      })
      return false;
    }

    if (this.data.password == undefined) {
      wx.showToast({
        title: '请先创建密码',
        duration: 1000,
        image: '../../../img/error.png'
      })
      return false;
    }

    if (this.data.rePassword == undefined) {
      wx.showToast({
        title: '请确认密码',
        duration: 1000,
        image: '../../../img/error.png'
      })
      return false;
    }

    if (this.data.password != this.data.rePassword){
      wx.showToast({
        title: '两次密码不一致',
        duration: 1000,
        image: '../../../img/error.png'
      })
      return false;
    }

    var data={};
    var that = this;
    data.mobile = this.data.mobile;
    data.password = this.data.password;
    data.verifyCode = this.data.message;
    pubFun.HttpRequst("loading", '/user/mobRegister', 3, data, 'POST',function(s){
        if(s.code == 0){
          that.setData({
            registerSuc:true
          })
          setTimeout(function(){
            wx.switchTab({
              url: '../../index/index',
            })
          },1500)
        }else{
          wx.showToast({
            title: '请重新注册',
            duration:2000
          })
        }
    })

  },
  onReady: function () {
  
  },
  onShow: function () {
  
  }
})