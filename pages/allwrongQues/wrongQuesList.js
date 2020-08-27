// pages/wrongQuesList/wrongQuesList.js
var ajax = require("./../../utils/ajax.js")

Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgList: {
      14: '/images/subject/Chinese.png',
      15: '/images/subject/match.png',
      16: '/images/subject/physics.png',
      17: '/images/subject/English.png',
      18: '/images/subject/chemistry.png',
      19: '/images/subject/biology.png',
      20: '/images/subject/moralityandlaw.png',
      21: '/images/subject/history.png',
      22: '/images/subject/geography.png'
    },
    pageSize: 1,        //页码
    contentlist: null,  //ajax请求后，所有页面的数据
    hasMoreData: true,  //接下来是否还有请求
  },

  getData() {
    let { pageSize } = this.data;
    let _this = this;
    let url = wx.getStorageSync('requstURL') + 'homework/wrong/questions/pdf/list';
    let token = wx.getStorageSync('token');
    let data = {
      token: token,
      page: pageSize,
      pagesize: 10
    };
    ajax.requestLoad(url, data, 'GET').then(res => {
      if (res.code == 20000) {
        var contentlistTem = this.data.contentlist;
        if (pageSize == 1) {
          contentlistTem = []
        }
        var contentlist = res.record_list;
        if (res.page == res.page_count) {
          contentlist = contentlistTem.concat(contentlist),
            _this.setData({
              hasMoreData: false
            })
        } else {
          contentlist = contentlistTem.concat(contentlist),
            _this.setData({
              hasMoreData: true,
              pageSize: pageSize + 1
            })
        }
        _this.setData({
          contentlist
        })
        // console.log(this.data.contentlist)
      }
    })
  },
  gotodown(e){
    let {download} = e.currentTarget.dataset;
    // console.log(download);
    wx.showLoading({
      mask:true,
      title: '正在下载...',
    })
    wx.downloadFile({
      url: download,
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
    this.getData()
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
    if (this.data.hasMoreData) {
      this.getData()
    } else {
      wx.showToast({
        title: '全部错题集已加载完成',
        icon: 'none',
        duration: 2000
      })
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})