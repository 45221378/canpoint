// pages/login.js
var ajax = require("./../../utils/ajax.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    checked: true
  },
  checkboxChange(e) {
    const { checked } = e.currentTarget.dataset;
    this.setData({
      checked: !checked
    })
  },
  wxLogin() {
    const { checked } = this.data;
    if (checked) {
      // console.log(checked)
    } else {
      wx.showToast({
        title: '请同意服务协议',
        icon: 'none',
        duration: 1000
      })
    }
  }, 

  getPhoneNumber(e) {
    wx.showLoading({
      title: '授权中...',
      mask: true,
    })
    if (e.detail.errMsg === 'getPhoneNumber:fail user deny') {
      wx.hideLoading();
      // console.log('点击拒绝');
    } else {
      wx.hideLoading();
      let url = wx.getStorageSync('requstURL') + 'user/auth';
      let resCode = wx.getStorageSync('resCode');
      let startTime = new Date().getTime();
      let data = {
        method: 2,
        code: resCode,
        encryptedData: e.detail.encryptedData,
        iv: e.detail.iv,
      }
      ajax.requestLoad(url, data, 'POST').then(res => {
        if (res.code === 20000) {
          wx.setStorageSync('token', res.token)
          wx.setStorageSync('startTime', startTime)
          wx.setStorageSync('first_login', res.first_login)
          wx.setStorageSync('monitor_moudle', res.monitor_moudle)
          wx.setStorageSync('userPhone', res.mobile)
          wx.setStorageSync('formType', 0)
          if (res.monitor_moudle == 1) {
            wx.setStorageSync('monitor_moudlePass', 0);
            wx.navigateTo({
              url: '/pages/resetPsd/resetPsd',
            })
          } else {
            wx.switchTab({
              url: '/pages/scanWork/scanWork',
            })
          }
        }
      })
    }
  },

  phoneReg() {
    const { checked } = this.data;
    if (checked) {
      wx.navigateTo({
        url: '/pages/phoneReg/phoneReg',
      })
    } else {
      wx.showToast({
        title: '请同意服务协议',
        icon: 'none',
        duration: 1000
      })
    }
  },
  agreement() {
    wx.navigateTo({
      url: '/pages/agreement/agreement',
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // let showTips = wx.getStorageSync('showTips');
    // if(showTips==0){
    //   wx.showModal({
    //     title: '公告',
    //     content: '小助手将于2020年7月18日（本周六）进行维护，预计时间1:00至5:00，具体恢复时间以实际时间为准，在此期间系统功能将无法使用，如此给您带来的不便，敬请谅解！',
    //     showCancel:false,
    //     success (res) {
    //       if (res.confirm) {
    //         wx.setStorageSync('showTips', 1)
    //       } 
    //     }
    //   }) 
    // }
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
    wx.login({
      success: res => {
        // console.log(res)
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        if (res.code) {
          wx.setStorageSync('resCode', res.code)
        }
      }
    })
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

  }
})