//app.js 
App({
  onLaunch: function() {
    wx.setStorageSync('requstURL', 'https://zycs.canpoint.net/')  //测试环境
    // wx.setStorageSync('requstURL', 'https://zyzs.canpoint.net/')   //正式环境
  },
  globalData: {
    userInfo: null
  }
})