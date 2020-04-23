// pages/scanWork/scanWork.js
var ajax = require("./../../utils/ajax.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showScan: false,
    title:'',
    arraystage:['小学','初中','高中'],
    stageindex:'',
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
        console.log(this.data.objectArray)
        console.log(this.data.objectArrayInt)

      }
    })
  },
  bindPickerChange: function (e) {
    const {objectIndex} = this.data;
    this.setData({
      stageindex: parseInt(e.detail.value)
    })
    const stageindex = parseInt(e.detail.value) ;
    this.getScanList(stageindex,objectIndex);
  },
  changeObject: function (e) {
    const {objectArray,stageindex} = this.data;
    this.setData({
      objectIndex: e.detail.value
    })
    const sendobject = objectArray[e.detail.value]
    this.getScanList(stageindex,sendobject);
  },
  //获取数据
  getScanList(stageindex,objectIndex){
    // console.log(subjectId)
    let url = wx.getStorageSync('requstURL') +'homework/list';
    let token = wx.getStorageSync('token');
    let data  = {
      token: token,
      pagesize: 100,
      page:1
    };
    stageindex!==""?data.stage_id=parseInt(stageindex)+1:'';
    objectIndex!==""?data.subjectId = objectIndex:'';
    // console.log(data)
    ajax.requestLoad(url,data,'GET').then(res=>{
      if(res.code===20000){
        if(res.total_count<1){
          this.setData({
            showScan:true
          })
        }else{
          this.setData({
            showScan:false,
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
        let url = wx.getStorageSync('requstURL') +'homework/info';
        let token = wx.getStorageSync('token');
        let data  = {
          token: token,
          section_id: section_id
        };
        ajax.requestLoad(url,data,'GET').then(res=>{
          if(res.code===20000){
            let section_name = res.section_name;
            if(res.source==2){
              wx.navigateTo({
                url: `/pages/markWrongList/markWrongList?section_id=${section_id}`,
              })
            }else{
              wx.navigateTo({
                url: `/pages/sortWrongList/sortWrongList?section_id=${section_id}&section_name=${section_name}`,
              })
            }
          }
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
    const {section_id,section_name} = e.currentTarget.dataset;
    wx.navigateTo({
      url: `/pages/sortWrongList/sortWrongList?section_id=${section_id}&section_name=${section_name}`,
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
    this.getScanList('','');

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