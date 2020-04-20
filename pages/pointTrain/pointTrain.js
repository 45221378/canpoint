// pages/pointTrain/pointTrain.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    section_name:"",
    downNet:''
  },
  copyText(e){
    const {content} = e.currentTarget.dataset;
    wx.setClipboardData({
      data: content,
      success: function (res) {
        console.log(res)
        wx.showModal({
          title: '复制成功',
          icon:'none',
          duration: 2000
        });
      }
    })
  },
  downNet(e){
    const {type} = e.currentTarget.dataset;
    let {downNet} = this.data;
    // switch (type) {
    //   case "pdf":
    //     downNet += 'pdf';
    //       break;
    //   case "word":
    //     downNet += 'docx';
    //     break;
    //   case "excel":
    //     downNet += 'xlsx';
    //     break;
    //   default:
    //     downNet += 'pptx';
    //     break;
    // }
    wx.showLoading({
      mask:true,
      title: '正在下载...',
    })
    wx.downloadFile({
      url: downNet,
      header: {},
      success: function(res) {
        wx.hideLoading();
        console.log(res);
        var filePath = res.tempFilePath;
        wx.openDocument({
            filePath: filePath,
            success: function(res) {
                console.log('打开文档成功')
            },
            fail: function(res) {
                console.log(res);
            },
            complete: function(res) {
                console.log(res);
            }
        })
      },
      fail: function(res) {
          console.log('文件下载失败');
      },
      complete: function(res) {},
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const {section_name,section_id} = options;
    // const downNet = `http://zywx.canpoint.net:9200/homework/wrong/question/download?section_id=${section_id}`;
    const downNet = wx.getStorageSync('requstURL')+`homework/wrong/question/download?section_id=${section_id}`;
    this.setData({
      section_name:section_name,
      downNet:downNet
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