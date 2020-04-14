// pages/sortWrongList/sortWrongList.js
var ajax = require("./../../utils/ajax.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    noData:false,
    section_id:'',
    section_name:'',
    question_count:'',
    pageData: [],
    pageChecked: '',
  },
  getData(){
    const {section_id} = this.data;
    let url = wx.getStorageSync('requstURL') +'homework/section/wrong/question/list';
    let token = wx.getStorageSync('token');
    let data  = {
      token: token,
      section_id: section_id,
    };
    ajax.requestLoad(url,data,'GET').then(res=>{
      if(res.code===20000){
        if(res.wrong_question_list.length===0){
          this.setData({
            noData:true
          })
        }else{
          let pageChecked = res.wrong_question_list[0].question_num;
          let pageData = [];
          let dotArr = ['A.','B.','C.','D.']
          res.wrong_question_list.map((item,index)=>{
            item.indexstem = item.question_data.index+'，'+item.question_data.stem;
            for(var i in item.question_data.options){
              item.question_data.options[i] = dotArr[i]+item.question_data.options[i]
            }
            if(item.question_data.children.length>0){
              item.childrenFlag = true;
            }else{
              // 无小题的情况下
              item.childrenFlag = false;

            }
          })
          this.setData({
            pageData:res.wrong_question_list,
            pageChecked:pageChecked
          })
          console.log(this.data.pageData)
        }
      }
    })
  },
  remark(){
    // const {section_id,question_count,section_name} = options;
    const section_id = 'Ng3DSoGX';
    wx.navigateTo({
      url: `/pages/markWrongList/markWrongList?section_id=${section_id}`,
    })
  },
  changeChecked(e){
    const {checked} = e.currentTarget.dataset;
    this.setData({
      pageChecked:checked
    })
  },
  downTip(){
    wx.navigateTo({
      url: `/pages/pointTrain/pointTrain`,
    })
  },
  changeAnswer(){
    
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // const {section_id,question_count,section_name} = options;
    const section_id = 'Ng3DSoGX';
    const section_name = '期末综合测试卷';
    const question_count = '24'
    this.setData({
      section_id:section_id,
      section_name:section_name,
      question_count:question_count
    })
    this.getData();
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