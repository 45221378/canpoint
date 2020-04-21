// pages/sortWrongList/sortWrongList.js
var ajax = require("./../../utils/ajax.js")
var changeStr = require("./../../utils/replace.js")
Page({
  /**
   * 页面的初始数据
   */
  data: {
    noData:false,
    section_id:'',
    section_name:'',
    question_count:0,
    wrong_question_count:0,
    pageData: [],
    pageHandleData:[],
    pageChecked: '',
    textareaValue:'',
  },
  renderStem(str) {
    if (str) {
        var str1 = str;
        if(str1.indexOf('<blank/>')>0){
          str1.replace('<blank/>','');
          console.log(str1)
        }
        return str1
    }
    console.log(111)
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
          let pageHandleData = [];
          let dotArr = ['A.','B.','C.','D.','E.','F.','G.','H.','I.'];
          res.wrong_question_list.map((item,index)=>{
            item.indexstem = item.question_data.index+'，'+changeStr.changeReplace(item.question_data.stem);
            // this.selectComponent("'#545").setContent(item.indexstem);
            for(var i in item.question_data.options){
              item.question_data.options[i] = dotArr[i]+item.question_data.options[i]
            }
            // pageHandleData.push({})
            if(item.question_data.children.length>0){
              item.childrenFlag = true;
              item.question_data.children.map(itch=>{
                itch.myanswerFlag = false   //是否有答案解析
                // myanswerTrue  是否答题正确
                if(itch.my_answer){
                  // 存在my_answer下
                  if(itch.my_answer==0){
                    itch.myanswerTrue = false
                  }else if(itch.my_answer==1){
                    itch.myanswerTrue = true
                  }else{
                    //单选，多选的情况 判断是否答对此道题目
                    if(itch.answers[0][0]==itch.my_answer){
                      itch.myanswerTrue = true
                    }else if(itch.my_answer==0){
                      itch.myanswerTrue = false
                    }else{
                      itch.myanswerTrue = true
                    }
                  }
                }else{
                  itch.myanswerTrue = true
                }
                if(itch.analysis){
                  if(itch.analysis[0]===""){
                    itch.analysisFlag = false
                  }
                }
              })
            }else{
              // 无小题的情况下
              item.childrenFlag = false;
              item.myanswerFlag = false
              if(item.question_data.questionType.id===4){
                console.log(item.question_data.answers.join(','))
                let newAnwser = [];
                newAnwser.push(item.question_data.answers.join(''));
                item.question_data.answers = newAnwser
              }
            }
            // var that = this;
            // item.question_data.answers[0] = changeStr.changeReplace(item.question_data.answers[0]);
            // item.question_data.analysis = changeStr.changeReplace(item.question_data.analysis[0]);

          })
          this.setData({
            pageData:res.wrong_question_list,
            pageHandleData:pageHandleData,
            pageChecked:pageChecked,
            question_count:res.question_count,
            wrong_question_count:res.wrong_question_count,
          })
          // console.log(this.data.pageData);
        }
      }
    })
  },
  remark(){
    const {section_id} = this.data;
    wx.navigateTo({
      url: `/pages/markWrongList/markWrongList?section_id=${section_id}`,
    })
  },
  changeChecked(e){
    const {checked} = e.currentTarget.dataset;
    this.setData({
      pageChecked:checked,
    })
  },
  downTip(){
    const {section_name,section_id} = this.data;
    wx.navigateTo({
      url: `/pages/pointTrain/pointTrain?section_name=${section_name}&section_id=${section_id}`,
    })
  },
  getTextareaValue(e){
    this.setData({
      textareaValue:e.detail.value
    })
  },
  changeAnswer(e){
    const {id} = e.currentTarget.dataset;
    console.log(e.currentTarget.dataset)
    const {textareaValue} = this.data;
    if(textareaValue===""){
      wx.showToast({
        title: '请输入反思的内容',
        icon:'none',
        duration: 2000
      })
      return;
    }else{
      let url = wx.getStorageSync('requstURL') +'homework/wrong/question/remarks/update';
      let token = wx.getStorageSync('token');
      let data  = {
        token: token,
        id: id,
        remarks: textareaValue
      };
      ajax.requestLoad(url,data,'POST').then(res=>{
        if(res.code===20000){
          wx.showToast({
            title: '提交成功',
            icon:'none',
            duration: 2000
          })
        }
      })
    }
  },
  seeAnswer(e){
    const {id,childrenflag,iid} = e.currentTarget.dataset;
    const {pageData} = this.data;
    if(childrenflag){
      pageData.forEach((item,i)=>{
        if(item.id===id){
          item.question_data.children.map((itch,j)=>{
            if(itch.index==iid){
              this.setData({
                [`pageData[${i}]question_data.children[${j}].myanswerFlag`]: !itch.myanswerFlag
              })
            }
          })
        }
      })
    }else{
      pageData.forEach((item,i)=>{
        if(item.id===id){
          this.setData({
            [`pageData[${i}]myanswerFlag`]: !item.myanswerFlag
          })
        }
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const {section_id,section_name} = options;
    // const section_id = 'LYLcvMie'; 
    // const section_id = 'RQA3TmwB'; 
    // const section_id = "Ng3DSoGX"
    // const section_id = "FQ0Xk28F"
    // const section_id = "ixxuu99T"
    // const section_id = "Ng3DSoGX"
    // const section_name = '三角形'
    this.setData({
      section_id:section_id,
      section_name:section_name,
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