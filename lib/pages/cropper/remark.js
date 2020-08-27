// pages/cropper/remark.js
var ajax = require("./../../utils/ajax.js")

Page({

  /**
   * 页面的初始数据
   */
  data: {
    remarks: ''
  },
  getTextareaValue(e) {
    this.setData({
      remarks: e.detail.value
    })
  },
  changeAnswer() {
    const { id, section_id, section_name, remarks,source } = this.data;
    //  如果没有进行过反思
    if (remarks === "") {
      wx.showToast({
        title: '请输入反思的内容',
        icon: 'none',
        duration: 2000
      })
      return;
    } else {
      let url = wx.getStorageSync('requstURL') + 'homework/wrong/question/remarks/update';
      let token = wx.getStorageSync('token');
      let data = {
        token: token,
        id: id,
        remarks: remarks
      };
      ajax.requestLoad(url, data, 'POST').then(res => {
        if (res.code === 20000) {
          wx.showToast({
            title: '提交成功',
            icon: 'none',
            duration: 2000
          })
          if (source == 0) {
            wx.redirectTo({
              url: `/pages/sortWrongList/sortWrongList?section_id=${section_id}&section_name=${section_name}&id=${id}`,
            })
          } else {
            // wx.redirectTo({
            //   url: `/pages/sortWrongList/arrageWrongList?id=${id}`,
            // })
            wx.navigateBack({
              delta: 1
            })
          }
        }
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      section_id: options.section_id,
      section_name: options.section_name,
      id: options.id,
      source: options.source
    })
    console.log(options.value)
    if(options.value!='undefined'){
      this.setData({
        remarks:options.value
      })
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