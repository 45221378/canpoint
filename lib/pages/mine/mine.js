// pages/mine/mine.js
var ajax = require("./../../utils/ajax.js")

Page({
  /**
   * 页面的初始数据
   */
  data: {
    loginFlag: true,
    showPsd: false,
    isChecked: '',
    pwdVal: '',
    psdFocus: true,
    closePsd: false,
    findPsd: false,
    userPhone: '',
    userCode: '',
    codename: '发送验证码',
    phoneCode: false, //发送验证码的按钮是否可以点击
    inputDis: true, //点击确定按钮是否可以点击
    timer: null,
    bannerList: [
      {
        index: 1,
        url: 'http://znwy.oss-cn-beijing.aliyuncs.com/zyzs/images/shucheng.jpg',
      },
      {
        index: 2,
        url: 'http://znwy.oss-cn-beijing.aliyuncs.com/zyzs/images/zhibo.png',
      }
    ]
  },
  loginout() {
    wx.removeStorageSync('token');
    wx.removeStorageSync('userPhone');
    wx.removeStorageSync('startTime');
    wx.removeStorageSync('formType');
    wx.removeStorageSync('userPhone');
    wx.removeStorageSync('monitor_moudle');
    wx.removeStorageSync('first_login');
    this.setData({
      loginFlag: false,
      formType: null
    })
  },
  mybook() {
    const { loginFlag } = this.data;
    if (loginFlag) {
      wx.navigateTo({
        url: '/pages/mybook/mybook',
      })
    }else{
      this.setData({
        bounceInUp: "arotate",
      })
      setTimeout(() => {
        this.setData({
          bounceInUp: "",
        })
      }, 600);
    }
  },
  // 去 我的班级
  myclass() {
    wx.navigateTo({
      url: '/pages/myclass/myclass',
    })
  },
  agreement() {
    wx.navigateTo({
      url: '/pages/agreement/agreement',
    })
  },
  userLenge() {
    wx.navigateTo({
      url: '/pages/mine/userLenge',
    })
  },
  goExplain(e) {
    const { index } = e.currentTarget.dataset;
    if (index == 1) {
      wx.navigateToMiniProgram({
        appId: 'wxa434b2c20ea3ddeb',
        path: '',
        success(res) {
          // 打开成功
        }
      })
    }
    if (index == 2) {
      wx.navigateTo({
        url: `/pages/mine/studentHelp`,
      })
    }
  },
  userExplain() {
    wx.navigateTo({
      url: `/pages/mine/explain`,
    })
  },
  getUserInfo() {
    let url = wx.getStorageSync('requstURL') + 'user/info';
    let token = wx.getStorageSync('token');
    let that = this;
    ajax.requestLoad(url, {
      token: token
    }, 'GET').then(res => {
      if (res.code === 20000) {
        that.setData({
          isChecked: res.monitor_moudle == 0 ? false : true
        })
      }
    })
  },
  changeSwitch(e) {
    // console.log(e.detail.value)
    this.setData({
      showPsd: e.detail.value,
      closePsd: !e.detail.value,
      isChecked: !e.detail.value
    })
    wx.hideTabBar({})
  },
  backout() {
    this.setData({
      showPsd: false,
      pwdVal: ''
    })
    wx.showTabBar({})
  },
  backclose() {
    this.setData({
      closePsd: false,
      pwdVal: ''
    })
    wx.showTabBar({})
  },
  inputPwd: function (e) {
    this.setData({
      pwdVal: e.detail.value
    });
    if (e.detail.value.length == 4) {
      this.setData({
        inputDis: false
      })
    } else {
      this.setData({
        inputDis: true
      })
    }
  },
  getFocus: function () {
    this.setData({
      psdFocus: true
    });
  },
  findHintPsd: function () {
    this.setData({
      findPsd: true,
      closePsd: false,
      pwdVal: ''
    });
  },
  closefindPsd() {
    this.setData({
      findPsd: false,
      pwdVal: '',
      userPhone: '',
      userCode: '',
      codename: '发送验证码',
      phoneCode: false
    })
    clearInterval(this.data.timer);
    wx.showTabBar({})
  },
  //开启监管密码
  surepsd() {
    const {
      pwdVal
    } = this.data;
    if (pwdVal.length == 4) {
      let url = wx.getStorageSync('requstURL') + 'user/monitor/password/setting';
      let token = wx.getStorageSync('token');
      let data = {
        monitor_password: pwdVal,
        token: token
      }
      let that = this;
      ajax.requestLoad(url, data, 'POST').then(res => {
        if (res.code === 20000) {
          wx.setStorageSync('monitor_moudle', 1)
          wx.showToast({
            title: '已开启监管模式',
            icon: 'none',
            duration: 1000
          })
          that.setData({
            showPsd: false,
            pwdVal: '',
            isChecked: true
          })
          wx.showTabBar({})
        }
      })
    } else {
      wx.showToast({
        title: '请设置4位数字监管密码',
        icon: 'none',
        duration: 1000
      })
    }
  },
  //关闭监管密码
  closePsd() {
    const {
      pwdVal
    } = this.data;
    if (pwdVal.length == 4) {
      let url = wx.getStorageSync('requstURL') + 'user/monitor/password/close';
      let token = wx.getStorageSync('token');
      let data = {
        token: token,
        method: 1,
        monitor_password: pwdVal
      }
      let that = this;
      ajax.requestLoad(url, data, 'DELETE').then(res => {
        if (res.code === 20000) {
          wx.setStorageSync('monitor_moudle', 0)
          wx.showToast({
            title: '已关闭监管模式',
            icon: 'none',
            duration: 1000
          })
          that.setData({
            closePsd: false,
            pwdVal: '',
            isChecked: false
          })
          wx.showTabBar({})
        }
      })
    } else {
      wx.showToast({
        title: '请输入4位数字监管密码',
        icon: 'none',
        duration: 1000
      })
    }

  },
  getPhoneValue(e) {
    this.setData({
      userPhone: e.detail.value
    })
  },
  getuserCode(e) {
    this.setData({
      userCode: e.detail.value
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
      }),
        function (error) {
          // console.log(error)
        }
    }
  },
  findPsd() {
    let {
      userPhone,
      userCode
    } = this.data;
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
      let url = wx.getStorageSync('requstURL') + 'user/monitor/password/close';
      let token = wx.getStorageSync('token');
      let data = {
        token: token,
        method: 2,
        mobile: userPhone,
        sms_code: userCode,
      };
      ajax.requestLoad(url, data, 'DELETE').then(res => {
        if (res.code === 20000) {
          wx.setStorageSync('monitor_moudle', 0)
          wx.showToast({
            title: '已关闭监管模式',
            icon: 'none',
            duration: 1000
          })
          this.setData({
            isChecked: false,
            findPsd: false
          })
          wx.showTabBar({})
        }
      })
    }
  },
  gologin() {
    wx.navigateTo({
      url: `/pages/login/login`,
    })
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
    let token = wx.getStorageSync('token');
    if (token && token != '') {
      this.getUserInfo();
      let formType = wx.getStorageSync('formType');
      let userphone = wx.getStorageSync('userPhone');
      this.setData({
        formType,
        userPhone: userphone,
        loginFlag: true
      })
    } else {
      this.setData({
        loginFlag: false
      })
    }
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