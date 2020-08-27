var ajax = require("./../../utils/ajax.js")
var changeStr = require("./../../utils/replace.js")
const innerAudioContext = wx.createInnerAudioContext();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    subjectid: '',
    stageid: '',
    section_id: '',
    cache_question_count: 0,
    alreadyAdd: false,
    image_list: [],
    pageChecked: '',
    pageData: null,
    precent: 0,
    showcontentFlag: false,
  },
  getWrongCount() {
    const { subjectid, stageid, section_id } = this.data;
    let url = wx.getStorageSync('requstURL') + 'homework/wrong/question/list';
    let token = wx.getStorageSync('token');
    let data = {
      token: token,
      subject_id: subjectid,
      stage_id: stageid,
      time_interval: 1,
      order_method: 1,
      pagesize: 10,
      page: 1,
    };
    ajax.requestLoad(url, data, 'GET').then(res => {
      if (res.code === 20000) {
        this.setData({
          cache_question_count: res.cache_question_count
        })
      }
    })
  },
  addWrongQues() {
    const { subjectid, stageid, section_id, alreadyAdd } = this.data;
    if (alreadyAdd) {
      return
    } else {
      let token = wx.getStorageSync('token');
      let url = wx.getStorageSync('requstURL') + 'homework/section/wrong/question/add';
      const data = {
        token: token,
        subject_id: subjectid,
        stage_id: stageid,
        section_id: section_id
      }
      ajax.requestLoad(url, data, 'POST').then(res => {
        if (res.code === 20000) {
          this.setData({
            alreadyAdd: true,
            cache_question_count: res.cache_question_count
          })
          wx.showToast({
            title: '加入错题集完成',
            icon: 'success',
            duration: 2000
          })
        }
      })
    }

  },
  seeAdd() {
    const { subjectid, stageid, cache_question_count } = this.data;
    if (cache_question_count > 0) {
      wx.navigateTo({
        url: `/pages/allwrongQues/checkReadyQues?subjectid=${subjectid}&stageid=${stageid}`,
      })
    }
  },
  return() {
    wx.switchTab({
      url: '/pages/scanWork/scanWork',
    })
  },
  clickcut(e) {
    const { imgsrc, imglist } = e.currentTarget.dataset;
    //图片预览
    wx.previewImage({
      current: imgsrc, // 当前显示图片的http链接
      urls: imglist // 需要预览的图片http链接列表
    })
  },
  remarkQues() {
    const { section_id } = this.data;
    wx.navigateTo({
      url: `/pages/markWrongList/markWrongList?section_id=${section_id}`,
    })
  },
  //点击头部，显示不同的题目结构
  changeChecked(e) {
    innerAudioContext.stop();
    const { checkedid, checkednum, showcontent } = e.currentTarget.dataset;
    const { question_list } = this.data;
    let deepquestion_list = JSON.parse(JSON.stringify(question_list));
    deepquestion_list.forEach(qitem => {
      if (qitem.qid == checkedid) {
        let pageData = [];
        pageData = qitem
        let indexstem
        if (pageData.stem) {
          let indexstemInt = changeStr.changeReplace(pageData.stem);
          let indexDisP = indexstemInt.indexOf('>') + 1;
          let indexP = indexstemInt.indexOf('<p');
          if (indexP == 0) {
            indexstem = indexstemInt.slice(0, indexDisP) + checkednum + '. ' + indexstemInt.slice(indexDisP);
          } else {
            indexstem = checkednum + '. ' + changeStr.changeReplace(pageData.stem);
          }
          pageData.indexstem = '<div style="white-space:pre-wrap">' + indexstem + '</div>';
        }
        for (var i in pageData.options) {
          pageData.options[i] = '<div>' + String.fromCodePoint(parseInt(i) + 65) + '.&nbsp;' + pageData.options[i] + '</div>'
        }
        //处理大题的音频地址
        if (pageData.audio) {
          let audiohttps = pageData.audio.replace('http://', 'https://')
          pageData.audio = audiohttps;
          pageData.durationTotal = '00:00';
          pageData.currentTime = '00:00';
          pageData.showaudioImg = 0;
        }
        //上面的情况是因为，无论是否有小题，都要对其进行处理。
        if (pageData.children.length > 0) {

          pageData.children.forEach((itch, itdex) => {
            itch.index = `(${itdex + 1})`;
            itch.myanswerFlag = false;
            pageData.childrenFlag = true;
            for (var j in itch.options) {
              itch.options[j] = '<div>' + String.fromCodePoint(parseInt(j) + 65) + '.&nbsp;' + itch.options[j] + '</div>'
            }
            //处理小题的题干
            if (itch.stem) {
              let indexChildstemInt = changeStr.changeReplace(itch.stem);
              let indexChildP = indexChildstemInt.indexOf('<p>');
              let indexChildstem
              //有的题号带了括号，有的题号没有带括号
              if (indexChildP == 0) {
                indexChildstem = indexChildstemInt.slice(0, 3) + (itdex + 1) + '. ' + indexChildstemInt.slice(3)
              } else {
                indexChildstem = (itdex + 1) + '. ' + changeStr.changeReplace(itch.stem);
              }
              itch.indexChildstem = '<div style="white-space:pre-wrap">' + indexChildstem + '</div>';
            } else {
              itch.indexChildstem = (itdex + 1) + '. '
            }
            //小题多答案的情况下, 把答案拼接，用逗号分开
            let newAnwsers = ''
            itch.answers.forEach(itAn => {
              // 判断题，把后端返回的正确的 
              if (itch.template == 6 || itch.template == 24) {
                newAnwsers = itAn.toString() == 0 ? '错' : '对'
              } else {
                newAnwsers = newAnwsers + itAn.toString() + ' &nbsp;&nbsp;';
              }
            })
            itch.newAnwsers = '<div style="white-space:pre-wrap">' + newAnwsers + '</div>';
            // 打错了的情况下，客观题显示错误答案，主观题显示x
            if (itch.right == 0) {
              //如果在有小题的情况下，答错了。
              //判断到底是显示错误的答案，还是在显示 X
              var alltemplate = [1, 2, 3, 4, 25, 6, 19, 14, 22, 29];
              if (alltemplate.indexOf(itch.template) > -1) {
                itch.showErrorAnswer = true;
              } else {
                itch.showErrorAnswer = false;
              }
            }
          })
        } else {
          pageData.childrenFlag = false;
          pageData.myanswerFlag = false;
          //多答案的情况下
          let newAnwsers = ''
          pageData.answers.forEach(itAn => {
            // 判断题，把后端返回的正确的 
            if (pageData.template == 6 || pageData.template == 24) {
              newAnwsers = itAn.toString() == 0 ? '错' : '对'
            } else {
              newAnwsers = newAnwsers + itAn.toString() + ' &nbsp;&nbsp;';
            }
          })
          pageData.newAnwsers = '<div style="white-space:pre-wrap">' + newAnwsers + '</div>';
          //判断到底是显示错误的答案，还是在显示 X
          var alltemplate = [1, 2, 3, 4, 25, 6, 19, 14, 22, 29];
          if (
            alltemplate.indexOf(pageData.template) > -1
          ) {
            pageData.showErrorAnswer = true;
          } else {
            pageData.showErrorAnswer = false;
          }
        }
        this.setData({
          pageData,
          pageChecked: checkednum,
          showcontent,
          showcontentFlag: true
        })
      }
    })
  },
  // 答案解析进行展开的按钮情况
  seeAnswer(e) {
    const { id, childrenflag, iid } = e.currentTarget.dataset;
    const { pageData } = this.data;
    if (childrenflag) {
      if (pageData.id === id) {
        pageData.children.map((itch, j) => {
          if (itch.index == iid) {
            this.setData({
              [`pageData.children[${j}].myanswerFlag`]: !itch.myanswerFlag
            })
          }
        })
      }
    } else {
      if (pageData.id === id) {
        this.setData({
          [`pageData.myanswerFlag`]: !pageData.myanswerFlag
        })
      }
    }
  },
  getData() {
    const { section_id } = this.data;
    let url = wx.getStorageSync('requstURL') + 'homework/info';
    let token = wx.getStorageSync('token');
    let data = {
      token: token,
      section_id: section_id,
      paper_status: 1
    };
    ajax.requestLoad(url, data, 'GET').then(res => {
      if (res.code === 20000) {
        let page = []
        let paperStruct = res.paper.paperStruct;
        paperStruct.forEach((paper, paperi) => {
          page.push({
            name: paper.name,
            content: []
          })
          paper.content.forEach((con, coni) => {
            page[paperi].content.push({
              name: con.name,
              content: []
            })
            con.content.forEach((items, index) => {
              //有小题的情况下，判断是否是半对，全对，全错
              if (items.question_data.children.length > 0) {
                items.question_data.rightlength = 0
                items.question_data.wronglength = 0
                items.question_data.children.forEach(chil => {
                  if (chil.right == 0) {
                    items.question_data.wronglength++
                  } else if (chil.right == 1) {
                    items.question_data.rightlength++
                  }
                })
                if (items.question_data.wronglength == items.question_data.children.length) {
                  items.question_data.right = 0
                } else if (items.question_data.rightlength == items.question_data.children.length) {
                  items.question_data.right = 1
                } else {
                  items.question_data.right = 2
                }
              }
              page[paperi].content[coni].content[index] = items;
            })
          })
        })
        let precent = ((res.question_count - res.wrong_question_count) * 100 / res.question_count).toFixed(0);
        this.setData({
          section_name: res.section_name,
          page,
          precent,
          precentFlag: true,
          section_id: section_id,
          question_count: res.question_count,
          image_list: res.image_list,
          subjectid: res.subject_id,
          stageid: res.stage_id,
          question_list: res.question_list
        })
        this.getWrongCount();
      }
    })
  },
  closeQues() {
    this.setData({
      showcontentFlag: false
    })
  },
  stopcloseQues() {

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    const { section_id, section_name, section_time } = options;
    this.setData({
      section_id,
      section_name,
      section_time,
    })
    this.getData();
    innerAudioContext.onPlay(() => {

    })
    innerAudioContext.onPause(() => {

    })

  },
  playbigaudio(e) {
    console.log(e)
    const { audiosrc, id } = e.currentTarget.dataset;
    const { pageData } = this.data;
    console.log(pageData)
    innerAudioContext.src = audiosrc;
    innerAudioContext.play();
    var that = this
    if (pageData.id == id && pageData.audio != null && pageData.audio != "") {
      that.setData({
        [`pageData.showaudioImg`]: 3,
      })
      setTimeout(() => {
        innerAudioContext.currentTime
        innerAudioContext.onTimeUpdate(() => {
          let durationTotal = changeStr.formatSeconds(innerAudioContext.duration)
          let currentTime = changeStr.formatSeconds(innerAudioContext.currentTime)
          that.setData({
            [`pageData.durationTotal`]: durationTotal,
            [`pageData.currentTime`]: currentTime,
            [`pageData.showaudioImg`]: 1,
          })
        })
      }, 500)
    }
  },
  stopbigaudio() {
    const { pageData } = this.data;
    var that = this
    if (pageData.audio != null && pageData.audio != "") {
      that.setData({
        [`pageData.showaudioImg`]: 0,
      })
    }
    innerAudioContext.pause();
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
    innerAudioContext.stop();
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