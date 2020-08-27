// pages/findPsd/findPsd.js
var ajax = require("./../../utils/ajax.js")

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userPhone: '',
    userCode: '',
    codename: '发送验证码',
    phoneCode: false,   //发送验证码的按钮是否可以点击
    timer: null,
    lookpsd:'',
    Length:4,
    pwdVal: '',
    psdFocus: true,
    findPsd: false,
  },
  getPhoneValue(e){
    this.setData({
      userPhone:e.detail.value
    })
  },
  getuserCode(e){
    this.setData({
      userCode:e.detail.value
    })
  },
  getFocus: function(){
    this.setData({ psdFocus: true });
  },
  inputPwd: function(e){
    this.setData({ pwdVal: e.detail.value });
  },
  resetpsd(e){
    this.setData({
      lookpsd:e.detail.value
    })
  },
  getCode() {
    const phoneReg = /^1[0-9]{10}$/;
    if (this.data.userPhone === "") {
      wx.showToast({
        title: '请输入手机号',
        icon: 'none',
        duration: 2000
      })
      return;
    } else if (!(phoneReg.test(this.data.userPhone))) {
      wx.showToast({
        title: '请输入正确的手机号',
        icon: 'none',
        duration: 2000
      })
      return;
    } else {
      let url = wx.getStorageSync('requstURL') + 'sms/code/send';
      let data = {
        mobile: this.data.userPhone
      }
      ajax.requestLoad(url, data, 'POST').then(res => {
        if (res.code === 20000) {
          var _this = this;
          wx.showToast({
            title: '发送成功',
            icon: 'none',
            duration: 2000
          })
          var num = 60;
          _this.data.timer = setInterval(function () {
            num--;
            if (num <= 0) {
              clearInterval(_this.data.timer);
              _this.setData({
                codename: '重新发送',
                phoneCode: false
              })
            } else {
              _this.setData({
                codename: num + '秒',
                phoneCode: true
              })
            }
          }, 1000)
        } else {
          wx.showToast({
            title: res.message,
            icon: 'none',
            duration: 2000
          })
        }
      }), function (error) {
        // console.log(error)
      }
    }
  },
  findPsd() {
    let { userPhone, userCode, pwdVal } = this.data;
    const phoneReg = /^1[0-9]{10}$/;
    if (userPhone === "") {
      wx.showToast({
        title: '请输入手机号',
        icon: 'none',
        duration: 2000
      })
      return;
    } else if (!(phoneReg.test(userPhone))) {
      wx.showToast({
        title: '请输入正确的手机号',
        icon: 'none',
        duration: 2000
      })
      return;
    } else if (userCode === '') {
      wx.showToast({
        title: '请输入短信验证码',
        icon: 'none',
        duration: 2000
      })
      return;
    } else {
      let url = wx.getStorageSync('requstURL') + 'user/monitor/password/update';
      let token = wx.getStorageSync('token');
      let data = {
        token: token,
        mobile: userPhone,
        sms_code: userCode,
        monitor_password:pwdVal
      };
      ajax.requestLoad(url, data, 'PUT').then(res => {
        if (res.code === 20000) {
          wx.showToast({
            title: '已重置监管密码',
            icon: 'none',
            duration: 1000,
            complete: ()=>{
              wx.switchTab({
                url: '/pages/scanWork/scanWork',
              })
            }
          })
        }
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let userphone = wx.getStorageSync('userPhone');
    this.setData({
      userPhone:userphone,
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