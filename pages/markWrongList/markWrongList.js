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
  speonechecked(e){
    const {it,idx,iidx} = e.currentTarget.dataset;
    const {pageData,pageIntData} = this.data;
    pageData.forEach((items,i)=>{
      if(items.index===idx){
        items.children.map((item,j)=>{
          if(item.index===iidx){
            // item.my_answer = it;
            this.setData({
              [`pageData[${i}]children[${j}].my_answer`] :it
            })
          }
        }) 
      }
    })
    pageIntData.forEach(items=>{
      if(items.index===idx){
        items.children.map(item=>{
          if(item.index===iidx){
            item.my_answer = it;
          }
        })
      }
    })
    this.setData({
      pageIntData:pageIntData
    })
  },
  onechecked(e){
    const {it,idx} = e.currentTarget.dataset;
    const {pageData,pageIntData} = this.data;
    pageData.forEach((items,i)=>{
      if(items.index===idx){
        this.setData({
          [`pageData[${i}]checked`]:it
        })
      }
    })
    pageIntData.forEach(items=>{
      if(items.index===idx){
        items.my_answer  = it;
      }
    })
    this.setData({
      pageIntData:pageIntData
    });
    console.log(this.data.pageIntData)
  },
  onechildchecked(e){
    const {it,idx,iidx} = e.currentTarget.dataset;
    const {pageData,pageIntData} = this.data;
    pageData.map((items,i)=>{
      if(items.index===idx){
        items.children.map((item,j)=>{
          if(item.index===iidx){
            this.setData({
              [`pageData[${i}]children[${j}].checked`]:it
            })
          }
        })
      }
    })
    pageIntData.map(items=>{
      if(items.index===idx){
        items.children.map(item=>{
          if(item.index===iidx){
            item.my_answer = it;
          }
        })
      }
    })
    this.setData({
      pageIntData:pageIntData
    })
  },
  doublechecked(e){
    const {it,idx} = e.currentTarget.dataset;
    const {pageData} = this.data;
    pageData.forEach((items,i)=>{
      if(items.index===idx){
        let dataRowArray = items.checked;
        if (dataRowArray === "" || dataRowArray.indexOf(it) == -1) {
          dataRowArray = items.checked += it;
          dataRowArray = dataRowArray.split("").sort();
          dataRowArray = Array.from(new Set(dataRowArray)).join("");
        } else {
          dataRowArray = dataRowArray.split(it).join("");
        }
        this.setData({
          [`pageData[${i}]checked`] :dataRowArray,
          [`pageIntData[${i}]my_answer`] :dataRowArray
        })
      }
    })
  },
  doublechildchecked(e){
    const {it,idx,iidx} = e.currentTarget.dataset;
    const {pageData} = this.data;
    pageData.map((items,i)=>{
      if(items.index===idx){
        items.children.map((item,j)=>{
          if(item.index===iidx){
            let dataRowArray = item.checked;
            if (dataRowArray === "" || dataRowArray.indexOf(it) == -1) {
              dataRowArray = item.checked += it;
              dataRowArray = dataRowArray.split("").sort();
              dataRowArray = Array.from(new Set(dataRowArray)).join("");
            } else {
              dataRowArray = dataRowArray.split(it).join("");
            }
            this.setData({
              [`pageData[${i}]children[${j}].checked`] :dataRowArray,
              [`pageIntData[${i}]children[${j}].my_answer`] :dataRowArray
            })
          }
        })
      }
    })
  },
  bindAllchecked(e){
    const {it,idx} = e.currentTarget.dataset;
    const {pageData,pageIntData} = this.data;
    pageData.forEach((items,i)=>{
      if(items.index===idx){
        this.setData({
          [`pageData[${i}]checked`]:it
        })
      }
    })
    pageIntData.forEach(items=>{
      if(items.index===idx){
        items.my_answer = it;
      }
    })
    this.setData({
      pageIntData:pageIntData
    });
  },
  subTip(){
    const {pageIntData,section_id,section_name} = this.data;
    //把判断题用户选择的T F，转化成0 ，1发送给后端
    pageIntData.forEach(item=>{
      if(item.template==6){
        if(item.my_answer){
          item.my_answer = item.my_answer=='错'?'0':item.my_answer=='对'?'1': item.my_answer
        }
      }
      item.children.map(it=>{
        if(it.template==6){
          it.my_answer = it.my_answer=='错'?'0':it.my_answer=='对'?'1': it.my_answer
        }
      })
    })

    let url = wx.getStorageSync('requstURL') +'homework/update';
    let token = wx.getStorageSync('token');
    let data  = {
      token: token, 
      section_id: section_id,
      question_list:JSON.stringify(pageIntData)
    };
    ajax.requestLoad(url,data,'POST').then(res=>{
      if(res.code===20000){
        wx.reLaunch({
          url: `/pages/sortWrongList/sortWrongList?section_id=${section_id}&section_name=${section_name}`,
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const {section_id} = options;
    // const section_id = "LYLcvMie"  // 有特殊标签
    // const section_id = "Ng3DSoGX"  // 有特殊题型
    // const section_id = "FQ0Xk28F"  //含多选
    let url = wx.getStorageSync('requstURL') +'homework/info';
    let token = wx.getStorageSync('token');
    let data  = {
      token: token,
      section_id: section_id
    };
    ajax.requestLoad(url,data,'GET').then(res=>{
      if(res.code===20000){
        let pageData = [];
        let countArray = JSON.parse(JSON.stringify(res.question_list));
        countArray.map(item=>{
          let options,quesType,answers,child,checked;
          let specicalOption = [];
          let newAnwsers = "";
          child = item.children.length>0?1:0;
          // 自己定义的 quesType  1为单选题  2为多选题 300为客观题  400为特殊题型，7选5  1  2  3 6 25 
          if(child==0){
            if(item.template===1||item.template===25){
              options = 'ABCDEFGHIJKLMN'.substr(0,item.options.length);
              quesType = 1;
              answers = item.answers;
              checked = item.my_answer?item.my_answer:item.answers.toString();
            }else if(item.template===2||item.template===3||item.template===4){
              options = 'ABCDEFGHIJKLMN'.substr(0,item.options.length);
              quesType = 2;
              answers = item.answers;
              checked = item.my_answer?item.my_answer:item.answers.join('');
            }else if(item.template===6){
              options = '对错';
              quesType = 6;
              answers = item.answers[0][0]=='0'?"错":"对";
              let smy_answer
              smy_answer = item.my_answer=='0'?'错':'对';
              checked = item.my_answer?smy_answer:answers;
            }else{
              quesType = 300;
              answers = item.answers;
              if(item.my_answer==1){
                checked = 1;
              }else if(item.my_answer==0){
                checked = 0;
              }else{
                checked = 1;
              }
            }
            //多答案的情况下
            item.answers.forEach(item=>{
              newAnwsers =  newAnwsers + item.toString()  + ' &nbsp;&nbsp;' ;
            })
           
          }else{
            //大题里面含有小题的情况
            //特殊题型 7选5
            if(item.template===14||item.questionType.id===22||item.questionType.id===29){
              item.template=14; 
              options = 'ABCDEFG';
              item.options.map((it,id)=>{
                specicalOption.push(
                  options[id]+'.'+it
                )
              })
              item.children.map((child)=>{
                child.my_answer = child.answers[0][0];
              })
            }
            item.children.map(itch=>{
              if(itch.template===1 ||itch.template===25){
                itch.options = 'ABCDEFGHIJKLMN'.substr(0,itch.options.length);
                itch.templateType = 1;
                if(!itch.my_answer){
                  itch.my_answer = itch.answers[0][0];
                }
                itch.checked = itch.my_answer
              }else if(itch.template===2||itch.template===3||itch.template===4){
                itch.options = 'ABCDEFGHIJKLMN'.substr(0,itch.options.length);
                itch.templateType = 2
                if(!itch.my_answer){
                  itch.my_answer = itch.answers[0][0];
                }
                itch.checked = itch.my_answer?itch.my_answer:itch.answers.join('');
              }else if(itch.template===6){
                //小题里面含有判断题
                itch.options = '对错';
                itch.templateType = 6
                answers = itch.answers[0][0]=='0'?"错":"对";
                itch.answersPan = answers; 
                let smy_answer
                smy_answer = itch.my_answer=='0'?'错':'对';
                itch.checked = itch.my_answer?smy_answer:answers;
              }else{
                itch.options = '10';
                itch.templateType = 300;
                // console.log(itch.answers)
                // itch.answers = itch.answers[0]
                // 为此小题标记是否曾经存在标记的问题
                if(!itch.my_answer){
                  // console.log('没有标记过错题的情况下')
                  itch.checked = 1;
                  itch.my_answer = 1;
                }else{
                  // console.log('有标记过错题的情况下')
                  if(itch.my_answer==1){
                    itch.checked = 1;
                  }else if(itch.my_answer==0){
                    itch.checked = 0;
                  }else{
                    itch.checked = 1;
                  }
                }
              }
              //小题多答案的情况下
              itch.newAnwsers = "";
              itch.answers.forEach(iit=>{
                itch.newAnwsers =  itch.newAnwsers + iit.toString()  + ' &nbsp;&nbsp;' ;
              })
            })
          }
          pageData.push({
            specicalOption:specicalOption,
            answers: answers,
            index:item.index,
            options:options,
            quesType:quesType,
            checked:checked,
            child:child,
            stem:item.index,
            children:item.children,
            newAnwsers:newAnwsers
          })
        })

        this.setData({
          section_name  :res.section_name,
          pageData:pageData,
          pageIntData: res.question_list,
          section_id:section_id,
          question_count:res.question_count
        })
        console.log(this.data.pageData)
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