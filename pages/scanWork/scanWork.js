// pages/scanWork/scanWork.js
var ajax = require("./../../utils/ajax.js")
var that
var list = []
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showScan: false,
    title:'',
    isShow_09: false,
    isShow_09Flage:true,
    listData_09:[
      {
        name:'全部',
        id:10,
        children:[
          {
            name:'全部',
            id:110
          }
        ]
      },
      {
        name:'小学',
        id:1,
        children:[
          {
            name:'语文',
            id:14
          },
          {
            name:'数学',
            id:15
          },
          {
            name:'英语',
            id:17
          }
        ]
      },
      {
        name:'初中',
        id:2,
        children:[
          {
            id: 14,
            name: '语文'
          },
          {
            id: 15,
            name: '数学'
          },
          {
            id: 17,
            name: '英语'
          },
          {
            id: 16,
            name: '物理'
          },
          {
            id: 18,
            name: '化学'
          },
          {
            id: 20,
            name: '道德与法制'
          },
          {
            id: 21,
            name: '历史'
          }
        ]
      }
    ],
    picker_09_data:[],
    record_list:[],
    imgList :{
      14:'/images/subject/Chinese.png',
      15:'/images/subject/match.png',
      16:'/images/subject/physics.png',
      17:'/images/subject/English.png',
      18:'/images/subject/chemistry.png',
      19:'/images/subject/biology.png',
      20:'/images/subject/moralityandlaw.png',
      21:'/images/subject/history.png',
      22:'/images/subject/geography.png'
    }
  },
  showPicker_09: function () {
    this.setData({
      isShow_09: true
    })
  },
  sureCallBack_09 (e) {
    let {choosedData} = e.detail
    if(choosedData[0].id==10){
      this.getScanList(1,'','')
    }else{
      let stageindex = choosedData[0].id;
      let objectIndex = choosedData[1].id;
      this.getScanList(1,stageindex,objectIndex)
    }
    this.setData({
      isShow_09: false,
      picker_09_data: choosedData,
    })
  },
  cancleCallBack_09 () {
    this.setData({
      isShow_09: false,
    })
  },

  //获取数据
  getScanList(page,stageindex,objectIndex){
    // console.log(subjectId)
    let url = wx.getStorageSync('requstURL') +'homework/list';
    let token = wx.getStorageSync('token');
    let data  = {
      token: token,
      pagesize: 100,
      page:page
    };
    stageindex!==""?data.stage_id=parseInt(stageindex):'';
    objectIndex!==""?data.subject_id = objectIndex:'';
    // console.log(data)
    ajax.requestLoad(url,data,'GET').then(res=>{
      if(res.code===20000){
        if(res.total_count<1&&stageindex==''&objectIndex==''){
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
    const {sectionid,sectionname} = e.currentTarget.dataset;
    wx.navigateTo({
      url: `/pages/sortWrongList/sortWrongList?section_id=${sectionid}&section_name=${sectionname}`,
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
    let {picker_09_data:choosedData} = this.data
    // console.log(choosedData)
    if(choosedData.length==0){
      this.getScanList(1,'','')
    }else{
      if(choosedData[0].id==10){
        this.getScanList(1,'','')
      }else{
        let stageindex = choosedData[0].id;
        let objectIndex = choosedData[1].id;
        this.getScanList(1,stageindex,objectIndex)
      }
    }
    
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    // this.setData({
    //   picker_09_data:[]
    // })
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
    wx.showNavigationBarLoading();

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