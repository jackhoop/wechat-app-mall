// pages/authorize/index.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
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
  bindGetUserInfo: function (e) {
    if (!e.detail.userInfo){
      return;
    }
    if (app.globalData.isConnected) {
      wx.setStorageSync('userInfo', e.detail.userInfo)
      this.login();
    } else {
      wx.showToast({
        title: '当前无网络',
        icon: 'none',
      })
    }
  },
  login: function () {
    let that = this;
    let token = wx.getStorageSync('token');
    console.log(token)
    if (token) {
      wx.request({
        url: app.globalData.serverUrl + "/wx/user/"+app.globalData.appid +"/check-token",
        data: {
          token: token
        },
        success: function (res) {
          if (res.data.code != 0) {
            wx.removeStorageSync('token')
            that.login();
          } else {
            // 回到原来的地方放
            wx.navigateBack();
          }
        }
      })
      return;
    }
    wx.login({
      success: function (res) {
        console.log('code;' +res.code);
        wx.request({
          url: app.globalData.serverUrl + "/wx/user/"+app.globalData.appid +"/login",
          data: {
            code: res.code
          },
          success: function (res) {
            if (res.data.code == "10000") {
              // 去注册
              that.registerUser();
              return;
            }
            if (res.data.code != 0) {
              // 登录错误
              wx.hideLoading();
              wx.showModal({
                title: '提示',
                content: '无法登录，请重试',
                showCancel: false
              })
              return;
            }

            wx.setStorageSync('token', res.data.token);
            // 回到原来的地方放
            wx.navigateBack();
          }
        })
      }
    })
  },
  registerUser: function () {
    let that = this;
    wx.login({
      success: function (res) {
        console.log("login:");
        console.log(res);
        let code = res.code; // 微信登录接口返回的 code 参数，下面注册接口需要用到
        wx.getUserInfo({
          success: function (res) {
            console.log("UserInfo:");
            console.log(res);
            let iv = res.iv;
            let encryptedData = res.encryptedData;
            let signature = res.signature;
            let rawData = res.rawData;
            let referrer = '' // 推荐人
            let referrer_storge = wx.getStorageSync('referrer');
            if (referrer_storge) {
              referrer = referrer_storge;
            }
            // 下面开始调用注册接口
            wx.request({
              url: app.globalData.serverUrl + "/wx/user/"+app.globalData.appid +"/register",
              data: { code: code, encryptedData: encryptedData, iv: iv, signature: signature, rawData: rawData}, // 设置请求的 参数
              success: (res) => {
                wx.hideLoading();
                //that.login();
              }
            })
          }
        })
      }
    })
  }
})