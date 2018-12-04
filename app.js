//app.js
App({
  globalData: {
    //url:"https://gdbmro.com/gdbmro_serviceApi",//线上环境
    //url: "http://localhost:8080/gdbmro_serviceApi",//本地PC端环境
    url:"http://localhost:8080/ios_serviceApi",//本地小程序环境
    //url: "http://192.168.1.179:8088/gdbmro_serviceApi",
    header: {'Cookie': ''},
    userInfo: ""
  } 
})