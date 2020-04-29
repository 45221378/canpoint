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
    // console.log(e.detail)
    if (e.detail.errMsg === 'getPhoneNumber:fail user deny') {
      console.log('点击拒绝');
    }else{
      wx.login({
        success: res => {
          // 发送 res.code 到后台换取 openId, sessionKey, unionId
          if (res.code) {
            let url = wx.getStorageSync('requstURL') +'user/auth';
            let resCode = res.code;
            let startTime = new Date().getTime();
            let data = {
              method: 2,
              code: resCode,
              encryptedData:e.detail.encryptedData,
              iv:e.detail.iv,
            }
            ajax.requestLoad(url,data,'POST').then(res=>{
              if(res.code===20000){
                wx.setStorageSync('token', res.token)
                wx.setStorageSync('startTime', startTime)
                wx.switchTab({
                  url: '/pages/scanWork/scanWork',
                })
              }
            })
          }
        }
      })
      
    }
  },
  phoneReg(){
    const {checked} = this.data;
    if(checked){ 
      wx.navigateTo({
        url: '/pages/phoneReg/phoneReg',
      })
    }else{
      wx.showToast({
        title: '请同意服务协议',
        icon:'none',
        duration: 1000
      })
    }
    
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
    let token = wx.getStorageSync('token');
    let startTime = wx.getStorageSync('startTime', startTime)
    //上次登录的时间与这次登录的时间相减，得到两次登录之间隔了多少毫秒
    let nowTimeDot = new Date().getTime()-startTime;
    //24小时过期时间的毫秒戳
    let lateTime = 1000*60*60*24;
    //如果小于24小时，就可以直接登录
    if(nowTimeDot<lateTime){
      if(token){
        wx.switchTab({
          url: '/pages/scanWork/scanWork',
        })
      }
    }
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