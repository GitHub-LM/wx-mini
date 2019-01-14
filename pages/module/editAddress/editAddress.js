// pages/module/editAddress.js
const app = getApp();
const pubFun = require('../../../js/public.js');
const areas = require('../../../js/areas.js');
const address = require('../../../js/area.js')

Page({
  /**
   * 页面的初始数据
   */
  data: {
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
    consigner: '',
    mobile: '',
    provinces: [],
    citys: [],
    areas: [],
    provinceId: '',
    cityId: '',
    areaId: '',
    address: '',
    postCode: '',
    isDefault: '',
    addressInfo: '',
    id: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

    var addressInfo = JSON.parse(options.info),
      that = this;
    var that = this;
    console.log(addressInfo);

    for (var i = 0; i < areas.areas.length; i++) {
      if (areas.areas[i].name == addressInfo.province) {
        //console.log(areas.areas[i].id);
        that.setData({
          provinceId: areas.areas[i].id
        })
      }
    }

    for (var j = 0; j < areas.areas.length; j++) {
      if (areas.areas[j].pId == that.data.provinceId && areas.areas[j].name == addressInfo.city) {
        //console.log(areas.areas[j].id);
        that.setData({
          cityId: areas.areas[j].id
        })
      }
    }

    for (var k = 0; k < areas.areas.length; k++) {
      if (areas.areas[k].pId == that.data.cityId && areas.areas[k].name == addressInfo.area) {
        //console.log(areas.areas[k].id);
        that.setData({
          areaId: areas.areas[k].id
        })
      }
    }

    that.setData({
      addressInfo: addressInfo,
      consigner: addressInfo.consignee,
      mobile: addressInfo.mobile,
      address: addressInfo.address,
      postCode: addressInfo.postCode,
      id: addressInfo.id
    })

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
  },

  /*
  收货人
  */
  consigner: function(e) {
    this.setData({
      consigner: e.detail.value
    })
  },
  /*
  手机号
  */
  mobile: function(e) {
    this.setData({
      mobile: e.detail.value
    })
  },
  /*
  详细地址
  */
  address: function(e) {
    this.setData({
      address: e.detail.value
    })
  },
  /*
  邮编
  */
  postCode: function(e) {
    this.setData({
      postCode: e.detail.value
    })
  },
  /*
    切换默认状态
  */
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
    //console.log(this.data.isDefault);
  },
  /*
   保存新增地址
   */
  savaAddress: function(e) {
    var that = this;
    if (that.data.consigner == '') {
      wx.showToast({
        title: '收货人必填',
        duration: 1000,
        image: '../../../img/error.png'
      })
      return false;
    };

    if (that.data.mobile == '') {
      wx.showToast({
        title: '手机号必填',
        duration: 1000,
        image: '../../../img/error.png'
      })
      return false;
    } else if (!pubFun.checkTel(that.data.mobile)) {
      wx.showToast({
        title: '手机格式错误',
        duration: 1000,
        image: '../../../img/error.png'
      })
      return false;
    };

    if (that.data.address == '') {
      wx.showToast({
        title: '详细地址必填',
        duration: 1000,
        image: '../../../img/error.png'
      })
      return false;
    } else if (!pubFun.checkAddress(that.data.address)) {
      wx.showToast({
        title: '详细地址格式',
        duration: 1000,
        image: '../../../img/error.png'
      })
      return false;
    }

    if (that.data.postCode == '') {
      wx.showToast({
        title: '邮编必填',
        duration: 1000,
        image: '../../../img/error.png'
      })
      return false;
    } else if (!pubFun.checkPostcode(that.data.postCode)) {
      wx.showToast({
        title: '邮编长度6位',
        duration: 1000,
        image: '../../../img/error.png'
      })
      return false;
    }

    var data = {};
    var _cache = Math.random(15);
    data.provinceId = that.data.provinceId;
    data.cityId = that.data.cityId;
    data.areaId = that.data.areaId;
    data.address = that.data.address;
    data.postCode = that.data.postCode;
    data.consignee = that.data.consigner;
    data.mobile = that.data.mobile;
    data.isDefault = that.data.isDefault;
    data.id = that.data.id;
    data._cache = _cache;

    pubFun.HttpRequst("loading", '/receive_address/edit/', 3, data, 'POST', function(res) {
      if (res.code == 0) {
        wx.showToast({
          title: '编辑成功',
          duration: 1000
        })
      };
      wx.navigateBack({
        delta: 1
      })
    });

  },
  deleteAddress: function() {
    var that = this;
    var data = {};
    data.id = that.data.id;

    wx.showModal({
      title: '提示',
      content: '确认删除吗',
      success: function (res) {
        if (res.confirm) {
          pubFun.HttpRequst("loading", '/receive_address/saas/del/', 3, data, 'POST', function (data) {
            if (data.code == 0) {
              wx.navigateBack({ delta: 1 })
              // wx.navigateTo({
              //   url: '/pages/module/addressAdmin/addressAdmin',
              // })
            }
          });
        }
      }
    })

  },
  onShow: function() {

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
    //console.log(this.data.areaInfo, ids);

  },
  hideCitySelected: function(e) {
    this.startAddressAnimation(false);
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
})