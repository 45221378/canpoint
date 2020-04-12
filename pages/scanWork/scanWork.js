// pages/scanWork/scanWork.js
var ajax = require("./../../utils/ajax.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showScan: false,
    title:'',
    array: ['一年级', '二年级', '三年级', '四年级','五年级','六年级','七年级','八年级','九年级 ','高一','高二','高三'],
    index:'',
    objectArrayInt:[],
    objectArray:[],
    objectIndex:'',
    record_list:[],
    imgList :{
      14:'/images/subject/Chinese.png',
      15:'/images/subject/match.png',
      16:'/images/subject/physics.png',
      17:'/images/subject/English.png',
      18:'/images/subject/chemistry.png',
      19:'/images/subject/biology.png',
      20:'/images/subject/morality andlaw.png',
      21:'/images/subject/history.png',
      22:'/images/subject/geography.png'
    }
  },
  //获取学科列表
  getObject(){
    let url = wx.getStorageSync('requstURL') +'common/enum';
    let token = wx.getStorageSync('token');
    let data  = {
      token: token,
      enum_name: 'subject'
    };
    ajax.requestLoad(url,data,'GET').then(res=>{
      if(res.code===20000){
        let arrayObj = [] //数组对象
        let arrayInt = [] //单独的数组
        Object.keys(res.enum).map((item,index)=>{
          arrayInt.push(res.enum[item])
          arrayObj.push(item)
        })
        this.setData({
          objectArray : arrayObj,
          objectArrayInt:arrayInt
        })
      }
    })
  },
  bindPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index: e.detail.value
    })
  },
  changeObject: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    // if(this.data.index===""){
    //   wx.showToast({
    //     title: '请先筛选学段',
    //     icon: 'none',
    //     duration: 2000
    //   })
    // }else{
      this.setData({
        objectIndex: e.detail.value
      })
      //选择成功后给后台发送请求
      console.log(this.data.objectArray[e.detail.value])
    // }
  },
  //获取数据
  getScanList(subjectId){
    // console.log(subjectId)
    let url = wx.getStorageSync('requstURL') +'homework/list';
    let token = wx.getStorageSync('token');
    let data  = {
      token: token,
      pagesize: 100,
      page:1
    };
    subjectId!==""?data.subjectId = subjectId:'';
    ajax.requestLoad(url,data,'GET').then(res=>{
      if(res.code===20000){
        if(res.total_count<1){
          this.setData({
            showScan:true
          })
        }else{
          this.setData({
            record_list : res.record_list
          })
        }
      }
    })
  },
  scancode: function(){
    // 允许从相机和相册扫码
    wx.scanCode({
      success(res) {
        let section_id = res.result.split(',')[0];
        wx.navigateTo({
          url: `/pages/markWrongList/markWrongList?section_id=${section_id}`,
        })
      },
      fail: (res) =>{
        wx.showToast({
          title: '扫描失败',
          icon: 'none',
          duration: 2000
        })
      }
    })
  },
  goList(e){
    const section_id = e.currentTarget.dataset.sectionId;
    wx.navigateTo({
      url: `/pages/markWrongList/markWrongList?section_id=${section_id}`,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getObject();

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
    this.getScanList('');

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