// pages/pointTrain/exportError.js
var ajax = require("./../../utils/ajax.js")

Page({

  /**
   * 页面的初始数据
   */
  data: {
    section_name:"",
    downNet:'',
    showNet:'',
    showDownFlag:null
  },
  copyText(e){
    const {content} = e.currentTarget.dataset;
    wx.setClipboardData({
      data: content,
      success: function (res) {
        // console.log(res)
        wx.showToast({
          title: '复制成功',
          icon: 'none',
          duration: 2000
        })
      }
    })
  },
  downNet(e){
    const {type} = e.currentTarget.dataset;
    let {downNet} = this.data;
    wx.showLoading({
      mask:true,
      title: '正在下载...',
    })
    wx.downloadFile({
      url: downNet,
      header: {},
      success: function(res) {
        wx.hideLoading();
        if(res.errMsg=="downloadFile:ok"){
          wx.showToast({
            title: '文件下载成功',
            icon:'none',
            duration: 2000
          })
        }else{
          wx.showToast({
            title: '下载文件失败',
            icon:'none',
            duration: 2000
          })
        }
        var filePath = res.tempFilePath;
        wx.openDocument({
            filePath: filePath,
            success: function(res) {
            },
            fail: function(res) {
            },
            complete: function(res) {
            }
        })
      },
      fail: function(res) {
        wx.hideLoading();
        wx.showToast({
          title: '下载文件失败',
          icon:'none',
          duration: 2000
        })
      },
      complete: function(res) {},
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let nowTimeDot = new Date()
    let section_name = `${nowTimeDot.getFullYear()}年${nowTimeDot.getMonth()+1}月${nowTimeDot.getDate()}日定制错题集`;
    const {subjectid,stageid} = options;
    wx.showLoading({
      mask:true,
      title: '正在生成下载文件，请稍后...',
    })
    let token = wx.getStorageSync('token');
    let url =  wx.getStorageSync('requstURL') + 'homework/wrong/questions/download';
    let data = {
      subject_id: subjectid,
      stage_id:stageid,
      token:token
    };
    ajax.requestLoad(url, data, 'GET').then(res => {
      if(res.code===20000){
        this.setData({
          section_name:section_name,
          downNet: res.download_link,
          showDownFlag : 1
        })
      }
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