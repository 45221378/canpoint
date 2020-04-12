// pages/markWrongList/markWrongList.js
var ajax = require("./../../utils/ajax.js")
const WxParse = require('./../../wxParse/wxParse');
Page({
  /**
   * 页面的初始数据
   */
  data: {
    section_name: '',
    pageIntData:[],
    pageData:[],
    testTitle:'',
  },
  inputchecked(e){
    const {it,idx} = e.currentTarget.dataset;
    const {pageData: changelist} = this.data;
    let dataRowArray = changelist[idx-1].checked;
    if (dataRowArray === "" || dataRowArray.indexOf(it) == -1) {
      dataRowArray = changelist[idx-1].checked += it;
      dataRowArray = dataRowArray.split("").sort();
      dataRowArray = Array.from(new Set(dataRowArray)).join("");
    } else {
      dataRowArray = dataRowArray.split(it).join("");
    }
    changelist[idx-1].checked  = dataRowArray;
    this.setData({
      pageData: changelist,
    });
  },
  bindchecked(e){
    const {it,idx} = e.currentTarget.dataset;
    const {pageData: changelist} = this.data;
    changelist[idx-1].checked = it;
    this.setData({
      pageData: changelist,
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // const {section_id} = options;
    const section_id = "Ng3DSoGX"
    let url = wx.getStorageSync('requstURL') +'homework/info';
    let token = wx.getStorageSync('token');
    let data  = {
      token: token,
      section_id: section_id
    };
    ajax.requestLoad(url,data,'GET').then(res=>{
      if(res.code===20000){
        let pageData = [];
        res.question_list.map(item=>{
          //主观题 quesType=0 暂时没有做判断题
          //客观题 quesType=1
          let options ,quesType ,answers,child
          child = item.children.length>0?1:0;
          if(item.questionType.id===1||item.questionType.id===2||item.questionType.id===4){
            options = 'ABCDEFGHIJKLMN'.substr(0,item.options.length);
            quesType = 0;
            answers = item.answers
          }else{
            quesType = 1
            answers = item.answers
          }
          pageData.push({
            answers: answers,
            index:item.index,
            options:options,
            quesType:quesType,
            checked:'',
            child:child,
            stem:item.stem  
          })
        })

        var replyArr = [];
        for(var i in pageData){
          replyArr.push(pageData[i].stem)
        }
        var that = this;
        for (let i = 0; i < replyArr.length; i++) {
          WxParse.wxParse('reply' + i, 'html', replyArr[i], that);
          if (i === replyArr.length - 1) {
            WxParse.wxParseTemArray("replyTemArray",'reply', replyArr.length, that)
          }
        }
        this.setData({
          section_name  :res.section_name,
          pageData:pageData,
          pageIntData: res.question_list
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
      // 
      // 

  }
})