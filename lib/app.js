//app.js 
App({
  onLaunch: function() {
    wx.setStorageSync('requstURL', 'https://zycs.canpoint.net/v2/')  //测试环境
    // wx.setStorageSync('requstURL', 'https://zyzs.canpoint.net/v2/')   //正式环境，扫一扫的扫描判断也要改

    wx.setStorageSync('showTips', 0)   //进入小程序的时候存储0，弹过弹框提示后，变为1，保证其他的页面不弹

  },
  globalData: {
    userInfo: null
  }
})