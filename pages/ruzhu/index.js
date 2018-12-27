// pages/ruzhu/index.js
var app = getApp();
var QQMapWX = require('../../mapsdk/qqmap-wx-jssdk');
var qqmapsdk;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    files: [],
    jcfiles: [],
    mmimg:'',
    yyimg: '',
    address:'',
    ad_info:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 实例化API核心类
    qqmapsdk = new QQMapWX({
      key: '6CXBZ-QNVRU-ITIVQ-4ALSI-WV7QQ-KHFNQ' // 必填
    });

   
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  //门面
  mmchooseImage:function(e){
    var that = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        var formData={
          "dataType":"bus"
        }
        that.imgUpdate(res.tempFilePaths, formData,function(data){
          that.setData({
            mmimg: data.path
          });
        });
      }
    })
  },
  yychooseImage:function(){
    var that = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {

        var formData = {
          "dataType": "bus"
        }
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        that.imgUpdate(res.tempFilePaths, formData, function (data) {
          that.setData({
            yyimg: data.path
          });
        });
      }
    })
  },
  chooseImage: function (e) {
    var that = this;
    wx.chooseImage({
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        var formData = {
          "dataType": "bus"
        }
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        that.imgUpdate(res.tempFilePaths, formData, function (data) {
          that.setData({
            files: that.data.files.concat(data.path)
          });
        });
      }
    })
  },
  jcchooseImage: function (e) {
    var that = this;
    wx.chooseImage({
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        var formData = {
          "dataType": "bus"
        }
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        that.imgUpdate(res.tempFilePaths, formData, function (data) {
          that.setData({
            jcfiles: that.data.jcfiles.concat(data.path)
          });
        });
      }
    })
  },
  previewImage: function (e) {
    wx.previewImage({
      current: e.currentTarget.id, // 当前显示图片的http链接
      urls: this.data.files // 需要预览的图片http链接列表
    })
  },
  deleteImg: function (e){
    console.log(e.currentTarget.dataset);
    var index = e.currentTarget.dataset.index;
   
    if (e.currentTarget.dataset.imgtype =="adImages"){
      var files = this.data.files;
      files.splice(index, 1);
      this.setData({
        files: files
      });
    
    }
    if (e.currentTarget.dataset.imgtype == "jcImages") {
      var jcfiles = this.data.jcfiles;
  
      jcfiles.splice(index, 1);
      this.setData({
        jcfiles: jcfiles
      });

    }
  },
  
  chooseLocation: function (e) {
    var that = this;
    wx.chooseLocation({
      success: function (res) {

        that.setData({
          latitude: res.latitude,
          longitude: res.longitude,
        });
        // 调用接口
        qqmapsdk.reverseGeocoder({
          location: {
            latitude: res.latitude,
            longitude: res.longitude
          },
          success: function (res) {
            that.setData({
              ad_info: res.result.ad_info,
              address: res.result.address_component.street + res.result.address_component.street_number.replace(res.result.address_component.street, ""),
              pcd: res.result.address_component.province + res.result.address_component.city + res.result.address_component.district,
              city: res.result.ad_info.province + "-" + res.result.ad_info.city + "-" + res.result.ad_info.city + "-" + res.result.ad_info.district,
              cityCode: res.result.ad_info.adcode,
            });
          },
          fail: function (res) {
            console.log(res);
          },
          complete: function (res) {
            console.log(res);
          }
        });
      },
    })
  },
  formSubmit(e) {
    var that = this;
    console.log('form发生了submit事件，携带数据为：', e.detail.value)

    var goods = e.detail.value;
    goods.adImages = JSON.stringify(that.data.files);
    goods.jcImages = JSON.stringify(that.data.jcfiles);
    var msg = ""
    var reg = /^1[0-9]{10}$/;
    if (!reg.test(goods.contactsTel)){
      msg ="请输入正确的手机号"
      return that.showModal(msg);
    }
    if (!goods.contacts) {
      msg = "请输入联系人"
      return that.showModal(msg);
    }
    if (!goods.name) {
      msg = "请输入商户名称"
      return that.showModal(msg);
    }
    if (!goods.city) {
      msg = "请选择地址"
      return that.showModal(msg);
    }

    if (!goods.facadeImage) {
      msg = "请上传门面头照"
      return that.showModal(msg);
    }
    if (!goods.licenseImage) {
      msg = "请上传营业执照"
      return that.showModal(msg);
    }

    if (!goods.address) {
      msg = "请输入详细地址"
      return that.showModal(msg);
    }
    if (that.data.files.length==0) {
      msg = "请上传头部轮播图片"
      return that.showModal(msg);
    }
    var token = wx.getStorageSync('token')
    wx.request({
      url: app.globalData.serverUrl + "/wx/business/" + app.globalData.appid + "/register  ",
      method: 'POST',
      header: {
        'Authorization': token
      },
      data: goods,
      success: (res) => {
        console.log('*********************');
        console.log(res.data);
        console.log('*********************');
      }
    })
   

  },
  showModal:function(msg){
    wx.showModal({
      title: '提示',  
      content: msg,
      showCancel: false,
      confirmText: '确定',
    })
  },
  imgUpdate(tempFilePaths, formData,callBack){
    var that = this;
    wx.showLoading({
      title: '上传中...',
    })

    // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
    wx.uploadFile({
      url: app.globalData.serverUrl + "/wx/media/" + app.globalData.appid + "/uploadImg",
      filePath: tempFilePaths[0],
      name: 'img',
      formData: formData,
      success: function (res) {
        var data = JSON.parse(res.data);
        callBack(data);
        wx.hideLoading();
      }
    })

  }
})