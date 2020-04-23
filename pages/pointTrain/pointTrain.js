// pages/pointTrain/pointTrain.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    section_name:"",
    downNet:'',
    showNet:''
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
    const {section_name,section_id} = options;
    let token = wx.getStorageSync('token');
    // const downNet = `http://zywx.canpoint.net:9200/homework/wrong/question/download?section_id=${section_id}`;
    const downNet = wx.getStorageSync('requstURL')+`homework/wrong/question/download?section_id=${section_id}&token=${token}`;
    const showNet = wx.getStorageSync('requstURL')+`homework/wrong/question/download?section_id=${section_id}&token=${token}&html`;
    this.setData({
      section_name:section_name,
      downNet:downNet,
      showNet:showNet
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