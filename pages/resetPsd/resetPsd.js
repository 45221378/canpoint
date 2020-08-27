// pages/resetPsd/resetPsd.js
var ajax = require("./../../utils/ajax.js")

Page({

  /**
   * 页面的初始数据
   */
  data: {
    Length:4,
    pwdVal: '',
    psdFocus: true,
    inputDis: true
  },
  getFocus: function(){
    console.log(11)
    this.setData({ psdFocus: true });
  },
  inputPwd: function(e){
    console.log(e)
    this.setData({ pwdVal: e.detail.value });
    if(e.detail.value.length==4){
      this.setData({
        inputDis:false
      })
    }else{
      this.setData({
        inputDis:true
      })
    }
  },
  resetPsdSubmit(){
    let url = wx.getStorageSync('requstURL') + 'user/monitor/password/check';
    let token = wx.getStorageSync('token');
    let data = {
      token:token,
      monitor_password:this.data.pwdVal
    }
    ajax.requestLoad(url, data, 'POST').then(res => {
      if(res.code===20000){
        wx.setStorageSync('first_login', 0);
        wx.setStorageSync('monitor_moudlePass', 1);
        wx.switchTab({
          url: '/pages/scanWork/scanWork',
        })
      }else{
        this.setData({ pwdVal: '' });
      }
    })
  },
  findPsd(){
    wx.navigateTo({
      url: '/pages/findPsd/findPsd',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // this.getFocus()
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