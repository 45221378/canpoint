// pages/login.js
var ajax = require("./../../utils/ajax.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    checked:true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  // getUserInfos: function(e) {
  //   let self = this
  //   console.log(e.detail);
  //   if (e.detail.errMsg == "getUserInfo:ok") {
  //     let url = wx.getStorageSync('requstURL') +'user/auth';
  //     let resCode = wx.getStorageSync('resCode');
  //     let data = {
  //       method: 2,
  //       code: resCode,
  //       encryptedData:e.detail.encryptedData,
  //       iv:e.detail.iv,
  //     }
  //     ajax.requestLoad(url,data,'POST').then(res=>{
  //       console.log(res)
  //     })

  //   }
  // },
  getPhoneNumber (e) {
    console.log(e.detail.errMsg)
    console.log(e.detail.iv)
    console.log(e.detail.encryptedData)
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
        wx.switchTab({
          url: '/pages/scanWork/scanWork',
        })
      }
    })

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

  }
})