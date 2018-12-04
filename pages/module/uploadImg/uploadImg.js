const http = require('../../../js/http.js')
const pubFun = require('../../../js/public.js')
const app = getApp()

Page({
  data: {
    images: [],
    img:false
  },

  onLoad: function (options) {
    JSON.parse(options.data);
    this.setData({
      licenseData: options.data
    })
    console.log(JSON.parse(options.data))
    //获取商品信息
    // pubFun.HttpRequst("loading", '/goods/web_item/info/' + id, 3, '', 'GET', function (res) {
    //   var s = res.data;
    // })

  },
  //选择图片S
  chooseImg:function(){
    var that=this;
    wx.chooseImage({
      count:1,
      sizeType: ['compressed'],  //可选择原图或压缩后的图片
      sourceType: ['camera','album' ], //可选择性开放访问相册、相机
      success: res => {
        console.log(res.tempFilePaths);
        that.setData({
          img:true,
          imgSrc: res.tempFilePaths
        });
      }
    })

  },

  //重新上传
  reupload:function(){
    var that=this;
    that.setData({
      img: false
    })
    that.chooseImg();
  },

  //提交审核
  formSubmit:function(){
    var that = this;
    console.log(app.globalData.header.Cookie, that.data.imgSrc)
    var ss = app.globalData.header.Cookie.split("=")[1];
    wx.uploadFile({
      url: app.globalData.url + '/dealerBusinessLicense/addWx',  //此处换上你的接口地址
      filePath: that.data.imgSrc[0],
      name: 'uploadFile',
      header: {
        "Content-Type": "multipart/form-data",
        'Cookie': app.globalData.header.Cookie,
        'channel': 'wx_program' 
      },
      formData: {
        'licenseData': that.data.licenseData
      },
      success: function (res) {
        var s = JSON.parse(res.data);
        console.log(s);
        if (s.code == 0){
          wx.navigateTo({
            url: '/pages/module/approved/approved?type=1',
          })
        }

        if (s.code == -1 && s.msg == "请勿重复提交审核"){
            wx.showToast({
              title: '请勿重复提交',
              duration:1000
            })
        }

        
      },
      fail: function (res) {
        console.log(res);
      },
    })

    // pubFun.HttpRequst("loading", '/dealerBusinessLicense/addPC', 3, '', 'POST', function (res) {
    //    var s = res.data;
    //    console.log(s);
    //  })
  },
  onShow: function () {

  },
})