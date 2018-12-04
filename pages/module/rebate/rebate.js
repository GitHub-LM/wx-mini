const app = getApp();
const pubFun = require('../../../js/public.js');

Page({
  data: {
    pageNum: '1',
    rebataList:[]
  },
  onLoad: function () {
    this.getRabate()
  },
  getRabate:function(){
    var that = this;
    pubFun.HttpRequst("loading", '/voucher/saas/' + that.data.pageNum, 3, "", 'GET', function (s) {
      if (s.code == 0 && s.data.rows != '') {
        var arr = that.data.rebataList;
        for (var i = 0; i <s.data.rows.length; i++) {
          arr.push(s.data.rows[i]);
        }
        that.setData({
          cash: s.data.cash,
          rebataList: arr,
          haveList:true
        })
      }else{
        if (that.data.rebataList == ''){
          that.setData({ haveList: false })
        }
      }
    })
  },
  //页面上拉触底事件的处理函数
  onReachBottom: function () {
    this.data.pageNum++;
    this.getRabate();
  }
})