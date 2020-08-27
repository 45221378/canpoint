// pages/mine/userLenge.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    downNet: "https://fudao.canpoint.net"
  },
  copyText(e) {
    console.log(e)
    const { content } = e.currentTarget.dataset;
    wx.setClipboardData({
      data: content,
      success: function (res) {
        wx.showToast({
          title: '复制成功',
          icon: 'none',
          duration: 2000
        })
      }
    })
  },
  // 去图书商城
  bookshop() {
    wx.navigateToMiniProgram({
      appId: 'wxa434b2c20ea3ddeb',
      path: '',
      success(res) {
        // 打开成功
      }
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