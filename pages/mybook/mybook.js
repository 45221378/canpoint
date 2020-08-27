var ajax = require("./../../utils/ajax.js")

Page({

  /**
   * 页面的初始数据
   */
  data: {
    industryOneId:'',
    industryTwoId:'',
    booklist:[],
  },
  getData(e) {
    let data = e.detail;
    this.setData({
      industryOneId: data.industryOneId,
      industryTwoId: data.industryTwoId
    });
    this.getBook()
  },
  getBook(){
    const {industryOneId,industryTwoId } = this.data;
    let url = wx.getStorageSync('requstURL') + 'user/use/book/list';
    let token = wx.getStorageSync('token');
    let data = {
      token: token,
      page: 1,
      pagesize: 200,
    }
    industryOneId !== ""&&industryOneId !== 10 ?  data.stage_id =  industryOneId: '';
    industryTwoId !== ""&&industryTwoId !== 110 ? data.subject_id = industryTwoId : '';
    ajax.requestLoad(url, data, 'GET').then(res => {
      if (res.code === 20000) {
        this.setData({
          booklist:res.book_list
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getBook()
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