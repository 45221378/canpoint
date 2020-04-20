// pages/login.js
var ajax = require("./../../utils/ajax.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    checked:false
  },
  checkboxChange(e){
    const {checked} = e.currentTarget.dataset;
    this.setData({
      checked: !checked
    })
  },
  wxLogin(){
    const {checked} = this.data;
    if(checked){ 
      console.log(checked)
    }else{
      wx.showToast({
        title: '请同意服务协议',
        icon:'none',
        duration: 1000
      })
    }
  },
  getPhoneNumber (e) {
    console.log(e.detail)
    if (e.detail.errMsg === 'getPhoneNumber:fail user deny') {
      console.log('点击拒绝');
    }else{
      let url = wx.getStorageSync('requstURL') +'user/auth';
      let resCode = wx.getStorageSync('resCode');
      let data = {
        method: 2,
        code: resCode,
        encryptedData:e.detail.encryptedData,
        iv:e.detail.iv,
      }
      ajax.requestLoad(url,data,'POST').then(res=>{
        if(res.code===20000){
          wx.setStorageSync('token', res.token)
          wx.switchTab({
            url: '/pages/scanWork/scanWork',
          })
        }
      })
    }
  },
  phoneReg(){
    wx.navigateTo({
      url: '/pages/phoneReg/phoneReg',
    })
  },
  agreement(){
    wx.navigateTo({
      url: '/pages/agreement/agreement',
    })
  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // wx.setStorageSync('requstURL', 'http://zywx.canpoint.net:9200/')
    wx.setStorageSync('requstURL', 'https://zyzs.canpoint.net/')


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