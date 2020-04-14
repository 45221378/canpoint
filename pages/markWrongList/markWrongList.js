// pages/markWrongList/markWrongList.js
var ajax = require("./../../utils/ajax.js")
Page({
  /**
   * 页面的初始数据
   */
  data: {
    section_id:'',
    section_name: '',
    question_count:0,
    pageIntData:[],
    pageData:[],
    testTitle:'',
  },
  onechecked(e){
    const {it,idx} = e.currentTarget.dataset;
    const {pageData: changelist,pageIntData} = this.data;
    changelist[idx-1].checked  = it;
    pageIntData[idx-1].my_answer  = it;
    this.setData({
      pageData: changelist,
      pageIntData:pageIntData
    });
  },
  doublechecked(e){
    const {it,idx} = e.currentTarget.dataset;
    const {pageData: changelist,pageIntData} = this.data;
    let dataRowArray = changelist[idx-1].checked;
    if (dataRowArray === "" || dataRowArray.indexOf(it) == -1) {
      dataRowArray = changelist[idx-1].checked += it;
      dataRowArray = dataRowArray.split("").sort();
      dataRowArray = Array.from(new Set(dataRowArray)).join("");
    } else {
      dataRowArray = dataRowArray.split(it).join("");
    }
    changelist[idx-1].checked  = dataRowArray;
    pageIntData[idx-1].my_answer  = dataRowArray;

    this.setData({
      pageData: changelist,
      pageIntData:pageIntData
    });
  },
  bindAllchecked(e){
    const {it,idx} = e.currentTarget.dataset;
    const {pageData: changelist,pageIntData} = this.data;
    changelist[idx-1].checked = it;
    pageIntData[idx-1].my_answer = it;
    this.setData({
      pageData: changelist,
      pageIntData:pageIntData

    });
  },
  bindchecked(e){
    const {it,idx,i} = e.currentTarget.dataset;
    const {pageData: changelist,pageIntData} = this.data;
    // changelist[idx-1].checked = it;
    changelist.map((item,itemIndex)=>{
      if(item.index ===idx){
        item.children.map((childIt,childItIndex)=>{
          if(childIt.index==i){
            console.log(changelist[itemIndex].children[childItIndex])
            changelist[itemIndex].children[childItIndex].checked = it
            pageIntData[itemIndex].children[childItIndex].my_answer = it
          }
        })
      }
    })
    this.setData({
      pageData: changelist,
      pageIntData:pageIntData
    });
  },
  subTip(){
    const {pageIntData,section_id,section_name} = this.data;
    let url = wx.getStorageSync('requstURL') +'homework/update';
    let token = wx.getStorageSync('token');
    let data  = {
      token: token,
      section_id: section_id,
      question_list:JSON.stringify(pageIntData)
    };
    ajax.requestLoad(url,data,'POST').then(res=>{
      console.log(res)
      if(res.code===20000){
        wx.navigateTo({
          url: `/pages/sortWrongList/sortWrongList?section_id=${section_id}&section_name=${section_name}&question_count=${question_count}`,
        })
      }
    })
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
          let options ,quesType ,answers,child,checked
          child = item.children.length>0?1:0;

          if(item.questionType.id===1||item.questionType.id===4){
            options = 'ABCDEFGHIJKLMN'.substr(0,item.options.length);
            quesType = 1;
            answers = item.answers;
            checked = item.answers.toString();
          }else if(item.questionType.id===2){
            options = 'ABCDEFGHIJKLMN'.substr(0,item.options.length);
            quesType = 2;
          }else{
            quesType = 12;
            answers = item.answers;
            if(item.my_answer===1){
              checked = 1;
            }else if(item.my_answer===0){
              checked = 0;
            }else{
              checked = 1;
            }
          }
          item.children.map(item=>{
            if(item.my_answer===1){
              item.checked = 1;
            }else if(item.my_answer===0){
              item.checked = 0;
            }else{
              item.checked = 1;
            }
          })
          pageData.push({
            answers: answers,
            index:item.index,
            options:options,
            quesType:quesType,
            checked:checked,
            child:child,
            stem:item.index+'，'+item.stem,
            children:item.children
          })
        })

        this.setData({
          section_name  :res.section_name,
          pageData:pageData,
          pageIntData: res.question_list,
          section_id:section_id,
          question_count:res.question_count
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