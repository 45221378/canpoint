//app.js 
App({
  onLaunch: function() {
    // wx.setStorageSync('requstURL', 'http://zywx.canpoint.net:9200/')

    wx.setStorageSync('requstURL', 'https://zyzs.canpoint.net/')
  },
  globalData: {
    userInfo: null
  }
})