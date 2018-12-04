const app = getApp();
const pubFun = require('../../../js/public.js');
const areas = require('../../../js/areas.js');
const address = require('../../../js/area.js');

Page({
  data: {
    InvoiceInfo: '',
    menuType: 0,
    begin: null,
    status: 1,
    end: null,
    isVisible: false,
    animationData: {},
    animationAddressMenu: {},
    addressMenuIsShow: false,
    value: [0, 0, 0],
    areaInfo: '',
    invTitle: '',
    taxpayeRno: '',
    regAddress: '',
    regTelphone: '',
    bank: '',
    bankAccount: '',
    recvName: '',
    recvMobile: '',
    recvProvince: '',
    recvCity: '',
    recvArea: '',
    recvAddress: '',
    isDefault: '0',
    invType: '',
  },
  onLoad: function(options) {

    var info = JSON.parse(options.info);
    this.setData({
      InvoiceInfo: info,
      taxpayeRno: info.taxpayeRno,
      regAddress: info.regAddress,
      regTelphone: info.regTelphone,
      bank: info.bank,
      bankAccount: info.bankAccount,
      recvName: info.recvName,
      recvMobile: info.recvMobile,
      recvProvince: info.recvProvince,
      recvCity: info.recvCity,
      recvArea: info.recvArea,
      recvAddress: info.recvAddress,
      isDefault: info.isDefault,
      id: info.id
    })

    for (var i = 0; i < areas.areas.length; i++) {
      if (areas.areas[i].id == info.recvProvince) {
        this.setData({
          provinceId: areas.areas[i].name
        })
      }
    }

    for (var j = 0; j < areas.areas.length; j++) {
      if (areas.areas[j].pId == info.recvProvince && areas.areas[j].id == info.recvCity) {
        this.setData({
          cityId: areas.areas[j].name
        })
      }
    }

    for (var k = 0; k < areas.areas.length; k++) {
      if (areas.areas[k].pId == info.recvCity && areas.areas[k].id == info.recvArea) {
        this.setData({
          areaId: areas.areas[k].name
        })
      }
    }

    // 初始化动画变量
    var animation = wx.createAnimation({
      duration: 500,
      transformOrigin: "50% 50%",
      timingFunction: 'ease',
    })
    this.animation = animation;
    // 默认联动显示北京
    var id = address.provinces[0].id
    this.setData({
      provinces: address.provinces,
      citys: address.citys[id],
      areas: address.areas[address.citys[id][0].id],
    })

    var that = this;
    pubFun.HttpRequst("loading", '/user/gdbmall/userDetail', 3, '', 'GET', function(data) {
      that.setData({
        invTitle: data.data.customerName
      })
    });
  },

  // 显示
  showMenuTap: function(e) {
    //获取点击菜单的类型 1点击状态 2点击时间 
    var menuType = e.currentTarget.dataset.type
    // 如果当前已经显示，再次点击时隐藏
    if (this.data.isVisible == true) {
      this.startAnimation(false, -200)
      return
    }
    this.setData({
      menuType: menuType
    })
    this.startAnimation(true, 0)
  },
  hideMenuTap: function(e) {
    this.startAnimation(false, -200)
  },
  // 执行动画
  startAnimation: function(isShow, offset) {
    var that = this
    var offsetTem
    if (offset == 0) {
      offsetTem = offset
    } else {
      offsetTem = offset + 'rpx'
    }
    this.animation.translateY(offset).step()
    this.setData({
      animationData: this.animation.export(),
      isVisible: isShow
    })
    console.log(that.data)
  },
  // 选择状态按钮
  selectState: function(e) {
    console.log('selectState1')
    this.startAnimation(false, -200)
    var status = e.currentTarget.dataset.status
    this.setData({
      status: status
    })
  },
  // 日志选择
  bindDateChange: function(e) {
    if (e.currentTarget.dataset.type == 1) {
      this.setData({
        begin: e.detail.value
      })
    } else if (e.currentTarget.dataset.type == 2) {
      this.setData({
        end: e.detail.value
      })
    }
  },
  sureDateTap: function() {
    this.data.pageNo = 1
    this.startAnimation(false, -200)
  },
  // 点击所在地区弹出选择框
  selectDistrict: function(e) {
    var that = this
    if (that.data.addressMenuIsShow) {
      return
    }
    that.startAddressAnimation(true)
  },
  // 执行动画
  startAddressAnimation: function(isShow) {
    var that = this
    if (isShow) {
      that.animation.translateY(0 + 'vh').step()
    } else {
      that.animation.translateY(40 + 'vh').step()
    }
    that.setData({
      animationAddressMenu: that.animation.export(),
      addressMenuIsShow: isShow,
    })
  },
  // 点击地区选择取消按钮
  cityCancel: function(e) {
    this.startAddressAnimation(false)
  },
  // 点击地区选择确定按钮
  citySure: function(e) {
    var that = this
    var city = that.data.city
    var value = that.data.value
    that.startAddressAnimation(false)
    // 将选择的城市信息显示到输入框
    var areaInfo = that.data.provinces[value[0]].name + ',' + that.data.citys[value[1]].name + ',' + that.data.areas[value[2]].name;
    var ids = that.data.provinces[value[0]].id + ',' + that.data.citys[value[1]].id + ',' + that.data.areas[value[2]].id;
    var provinceId = that.data.provinces[value[0]].id;
    var cityId = that.data.citys[value[1]].id;
    var areaId = that.data.areas[value[2]].id;
    that.setData({
      areaInfo: areaInfo,
      provinceId: provinceId,
      cityId: cityId,
      areaId: areaId
    });
    var addressId = ids.split(",")
    console.log(this.data.areaInfo);
    that.setData({
      recvProvince: addressId[0],
      recvCity: addressId[1],
      recvArea: addressId[2]
    });
    //console.log(that.data.recvProvince, that.data.recvCity, that.data.recvArea)
  },
  hideCitySelected: function(e) {
    //console.log(e)
    this.startAddressAnimation(false)
  },
  // 处理省市县联动逻辑
  cityChange: function(e) {
    var value = e.detail.value
    var provinces = this.data.provinces
    var citys = this.data.citys
    var areas = this.data.areas
    var provinceNum = value[0]
    var cityNum = value[1]
    var countyNum = value[2]
    if (this.data.value[0] != provinceNum) {
      var id = provinces[provinceNum].id
      this.setData({
        value: [provinceNum, 0, 0],
        citys: address.citys[id],
        areas: address.areas[address.citys[id][0].id],
      })
    } else if (this.data.value[1] != cityNum) {
      var id = citys[cityNum].id
      this.setData({
        value: [provinceNum, cityNum, 0],
        areas: address.areas[citys[cityNum].id],
      })
    } else {
      this.setData({
        value: [provinceNum, cityNum, countyNum]
      })
    }
  },
  invTitle: function(e) {
    this.setData({
      invTitle: e.detail.value
    })
  },
  taxpayeRno: function(e) {
    this.setData({
      taxpayeRno: e.detail.value
    })
  },
  regAddress: function(e) {
    this.setData({
      regAddress: e.detail.value
    })
  },
  regTelphone: function(e) {
    this.setData({
      regTelphone: e.detail.value
    })
  },
  bank: function(e) {
    this.setData({
      bank: e.detail.value
    })
  },
  bankAccount: function(e) {
    this.setData({
      bankAccount: e.detail.value
    })
  },
  recvName: function(e) {
    this.setData({
      recvName: e.detail.value
    })
  },
  recvMobile: function(e) {
    this.setData({
      recvMobile: e.detail.value
    })
  },
  recvAddress: function(e) {
    this.setData({
      recvAddress: e.detail.value
    })
  },
  switchChange: function(e) {
    if (e.detail.value == true) {
      this.setData({
        isDefault: 1
      })
    } else {
      this.setData({
        isDefault: 0
      })
    }
  },
  save: function() {
    var that = this;
    var data = {};
    data.invTitle = that.data.invTitle;
    data.taxpayeRno = that.data.taxpayeRno;
    data.regAddress = that.data.regAddress;
    data.regTelphone = that.data.regTelphone;
    data.bank = that.data.bank;
    data.bankAccount = that.data.bankAccount;
    data.recvName = that.data.recvName;
    data.recvMobile = that.data.recvMobile;
    data.recvProvince = that.data.recvProvince;
    data.recvCity = that.data.recvCity;
    data.recvArea = that.data.recvArea;
    data.recvAddress = that.data.recvAddress;
    data.isDefault = that.data.isDefault;
    data.invType = that.data.invType;
    data.id = that.data.id;
    data._cache = Math.random(15);
    data.invType = 2;

    if (that.data.invTitle == '') {
      wx.showToast({
        title: '发票抬头必填',
        duration: 1000,
        image: '../../../img/error.png'
      })
      return false;
    }

    if (that.data.taxpayeRno == '') {
      wx.showToast({
        title: '纳税号必填',
        duration: 1000,
        image: '../../../img/error.png'
      })
      return false;
    }

    if (!pubFun.checkTaxpayeRno(that.data.taxpayeRno)) {
      wx.showToast({
        title: '纳税号格式错误',
        duration: 1000,
        image: '../../../img/error.png'
      })
      return false;
    }

    if (that.data.regAddress == '') {
      wx.showToast({
        title: '开票地址必填',
        duration: 1000,
        image: '../../../img/error.png'
      })
      return false;
    }

    if (that.data.regTelphone == '') {
      wx.showToast({
        title: '开票电话必填',
        duration: 1000,
        image: '../../../img/error.png'
      })
      return false;
    }

    if (!pubFun.checkTel(that.data.regTelphone)) {
      wx.showToast({
        title: '开票电话错误',
        duration: 1000,
        image: '../../../img/error.png'
      })
      return false;
    }

    if (that.data.bank == '') {
      wx.showToast({
        title: '开户银行必填',
        duration: 1000,
        image: '../../../img/error.png'
      })
      return false;
    }

    if (!pubFun.checkBankName(that.data.bank)) {
      wx.showToast({
        title: '开票银行错误',
        duration: 1000,
        image: '../../../img/error.png'
      })
      return false;
    }

    if (that.data.bankAccount == '') {
      wx.showToast({
        title: '银行账号必填',
        duration: 1000,
        image: '../../../img/error.png'
      })
      return false;
    }

    if (!pubFun.checkBankAccount(that.data.bankAccount)) {
      wx.showToast({
        title: '银行账号错误',
        duration: 1000,
        image: '../../../img/error.png'
      })
      return false;
    }

    if (that.data.recvName == '') {
      wx.showToast({
        title: '收票人必填',
        duration: 1000,
        image: '../../../img/error.png'
      })
      return false;
    }

    if (that.data.recvMobile == '') {
      wx.showToast({
        title: '收票人手机必填',
        duration: 1000,
        image: '../../../img/error.png'
      })
      return false;
    }

    if (!pubFun.checkTel(that.data.recvMobile)) {
      wx.showToast({
        title: '收票人手机错误',
        duration: 1000,
        image: '../../../img/error.png'
      })
      return false;
    }

    if (that.data.recvAddress == '') {
      wx.showToast({
        title: '详细地址必填',
        duration: 1000,
        image: '../../../img/error.png'
      })
      return false;
    }
    // console.log(data)
    pubFun.HttpRequst("loading", '/invoice/edit/', 3, data, 'POST', that.invoice);
  },
  invoice: function(data) {
    // console.log(data);
    if (data.code == 0) {
      wx.showToast({
        title: '发票编辑成功',
      })
    }

    setTimeout(function() {
      wx.hideLoading()
      wx.navigateTo({
        url: '../../module/invoice/invoice',
      })
    }, 1500)
  },
  onShow: function() {},


})