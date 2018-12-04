const app = getApp();
const pubFun = require('../../../js/public.js');

Page({
  data:{

  },
  onLoad:function(){
    var that=this;
    pubFun.HttpRequst("loading", '/bean/getDealerBeanList/1', 3, "", 'GET', function (s) {
      //console.log(s);
      if(s.code==0){
        that.setData({
          freeze: s.data.freeze,
          available: s.data.available,
          count: s.data.count,
          list:s.data.list
        })
        //console.log(that.data.list)
      }
    })
  },
  onShow:function(){

  }
})