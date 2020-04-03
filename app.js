//app.js
App({
  onLaunch: function() {
    // wx.setStorageSync('requstURL', 'https://xcx.goobye.cn/fresh/')
    // wx.setStorageSync('requstURL', 'http://192.168.1.53:8080/')
    wx.setStorageSync('requstURL', 'http://zywx.canpoint.net:9200/')

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        if (res.code) {
          wx.setStorageSync('resCode', res.code)
        }
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        console.log(res)
        if (res.authSetting['scope.userInfo'] == true) {
          console.log('appjs已经授权')
          //用户授权过可直接进入首页
          // wx.reLaunch({
          //   url: '/pages/tabView1/tabView1',
          // })
        }
      }
    })
  },
  globalData: {
    userInfo: null
  }
})