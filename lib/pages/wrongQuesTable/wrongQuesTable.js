// pages/wrongQuesTable/wrongQuesTable.js
var ajax = require("./../../utils/ajax.js")
var changeStr = require("./../../utils/replace.js")

const innerAudioContext = wx.createInnerAudioContext();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    type: 1,
    timeIndexOne: 1,
    timeOne: ['今天', '最近一周', '最近一月', '最近三个月', '最近六个月'],
    //搬入错题整理页面
    subjectid: '',
    stageid: '',
    record_list: [],

    timeIndex: 1,
    time: ['今天', '最近一周', '最近一月', '最近三个月', '最近六个月'],

    rankIndex: 0,
    rank: ['日期由近到远', '日期由远到近', '按下载次数由大到小', '按下载次数由小到大'],

    pageSize: 1,
    contentlist: null,
    hasMoreData: true,
    filteFlag: false,
    fliterUnderstand: null,
    failFlag: false,
    QuesType: null,
    QuesTypeCode: null,
    addContent: 0,
  },
  chapter(e) {
    const { type } = e.currentTarget.dataset;
    this.setData({
      type: type,
    })
  },
  timeChangeone(e) {
    this.setData({
      timeIndexOne: e.detail.value,
    })
    this.homeworkList()
  },
  // 按作业选题的情况
  homeworkList() {
    const { subjectid, stageid, timeIndexOne } = this.data;
    let url = wx.getStorageSync('requstURL') + 'homework/list';
    let token = wx.getStorageSync('token');
    const data = {
      token: token,
      subject_id: subjectid,
      stage_id: stageid,
      time_interval: parseInt(timeIndexOne)+1,
      cache_wrong: 1,
      subject_id: subjectid,
      pagesize: 200,
      page: 1,
    }
    ajax.requestLoad(url, data, 'GET').then(res => {
      if (res.code === 20000) {
        let record_list = []
        res.record_list.map(item => {
          record_list.push({
            section_id: item.section_id,
            hadleType: item.add_status,
            section_name: item.section_name,
            wrong_question_count: item.wrong_question_count,
          })
        })
        this.setData({
          record_list
        })
        console.log(this.data.record_list)
      }
    })
  },
  //按章节的情况加入错题集
  handleSectionList(e) {
    const { sectionid, hadletype } = e.currentTarget.dataset;
    const { subjectid, stageid, record_list } = this.data;
    let token = wx.getStorageSync('token');
    console.log(hadletype)
    if (hadletype == 0) {
      let url = wx.getStorageSync('requstURL') + 'homework/section/wrong/question/add';
      const data = {
        token: token,
        subject_id: subjectid,
        stage_id: stageid,
        section_id: sectionid
      }
      ajax.requestLoad(url, data, 'POST').then(res => {
        if (res.code === 20000) {
          record_list.forEach((item, index) => {
            if (sectionid === item.section_id) {
              this.setData({
                [`record_list[${index}]hadleType`]: 1,
                addContent: res.cache_question_count
              })
            }
          })
        }
      })
    } else {
      let url = wx.getStorageSync('requstURL') + 'homework/section/wrong/question/delete';
      const data = {
        token: token,
        subject_id: subjectid,
        stage_id: stageid,
        section_id: sectionid
      }
      ajax.requestLoad(url, data, 'DELETE').then(res => {
        if (res.code === 20000) {
          record_list.forEach((item, index) => {
            if (sectionid === item.section_id) {
              console.log(item)
              this.setData({
                [`record_list[${index}]hadleType`]: 0,
                addContent: res.cache_question_count
              })
            }
          })
        }
      })
    }
  },
  goBookWrongQues(e) {
    const { sectionid, sectionname } = e.currentTarget.dataset;
    const { subjectid, stageid } = this.data;
    wx.navigateTo({
      url: `/pages/wrongQuesTable/bookWrongQues?subjectid=${subjectid}&stageid=${stageid}&sectionid=${sectionid}&sectionname=${sectionname}`,
    })
  },
  //搬入错题整理页面
  bindtimeChange(e) {
    this.setData({
      timeIndex: e.detail.value,
      pageSize: 1,
    })
    this.getQuesList()
  },
  bindRankChange(e) {
    this.setData({
      rankIndex: e.detail.value,
      pageSize: 1,
    })
    this.getQuesList()
  },
  filteResult() {
    this.setData({
      filteFlag: true
    })
  },
  closeFlag() {
    this.setData({
      filteFlag: false
    })
  },
  else() {
    // console.log('阻止点击白色区域，关闭掉了遮罩层')
  },
  chooseQues() {
    // console.log('点击进行选择')
  },
  addAll() {
    const { subjectid, stageid, timeIndex, rankIndex, fliterUnderstand, addContent, contentlist, QuesTypeCode } = this.data;
    if (addContent >= 50) {
      this.setData({
        failFlag: true
      })
    } else {
      let _this = this;
      let url = wx.getStorageSync('requstURL') + 'homework/report/question/bulk/add';
      let token = wx.getStorageSync('token');
      let data = {
        token: token,
        subject_id: subjectid,
        stage_id: stageid,
      };
      timeIndex !== "" ? data.time_interval = parseInt(timeIndex) + 1 : '';
      rankIndex !== "" ? data.order_method = parseInt(rankIndex) + 1 : '';
      fliterUnderstand === null ? '' : data.understand = fliterUnderstand;
      QuesTypeCode === null ? "" : data.question_type_id = QuesTypeCode;
      ajax.requestLoad(url, data, 'POST').then(res => {
        if (res.code == 20000) {
          wx.showToast({
            title: '所有错题添加成功',
            icon: 'none',
            duration: 2000
          })
          contentlist.forEach((item, i) => {
            _this.setData({
              [`contentlist[${i}]add_status`]: 1,
            })
          })
          if (res.question_count) {
            _this.setData({
              addContent: addContent + res.question_count
            })
          }
        }
      })
    }
  },
  iknow() {
    this.setData({
      failFlag: false
    })
  },
  getQuesList() {
    const { pageSize, subjectid, stageid, timeIndex, rankIndex, fliterUnderstand, QuesTypeCode } = this.data;
    let _this = this;
    let url = wx.getStorageSync('requstURL') + 'homework/wrong/question/list';
    let token = wx.getStorageSync('token');
    let data = {
      token: token,
      subject_id: subjectid,
      stage_id: stageid,
      pagesize: 10,
      page: pageSize,
    };
    timeIndex !== "" ? data.time_interval = parseInt(timeIndex) + 1 : '';
    rankIndex !== "" ? data.order_method = parseInt(rankIndex) + 1 : '';
    fliterUnderstand === null ? '' : data.understand = fliterUnderstand;
    QuesTypeCode === null ? '' : data.question_type_id = QuesTypeCode;
    ajax.requestLoad(url, data, 'GET').then(res => {
      if (res.code === 20000) {
        var contentlistTem = this.data.contentlist;
        if (pageSize == 1) {
          contentlistTem = []
        }
        var contentlist = res.record_list;
        contentlist.map(item => {
          // 处理大题的题干
          if (item.question_data.stem) {
            let indexstemInt = changeStr.changeReplace(item.question_data.stem);
            item.indexstem = '<div style="white-space:pre-wrap">' + indexstemInt + '</div>';
          }
          //处理大题的音频地址
          if (item.question_data.audio) {
            let audiohttps = item.question_data.audio.replace('http://', 'https://')
            item.question_data.audio = audiohttps;
            item.question_data.durationTotal = '00:00';
            item.question_data.currentTime = '00:00';
            item.question_data.showaudioImg = 0;
          }
          //不管是否有小题都给大题的每一个答案，拼接 A B C D
          for (var i in item.question_data.options) {
            item.question_data.options[i] = '<div>' + String.fromCodePoint(parseInt(i) + 65) + '.&nbsp;' + item.question_data.options[i] + '</div>'
          }
          //如果里面有小题
          if (item.question_data.children.length > 0 && item.question_data.template != 14) {
            item.childrenFlag = true;
            item.question_data.children.map((itch, idch) => {
              itch.index = `(${idch + 1})`;
              // 处理小题的题干
              if (itch.stem) {
                let indexChildstemInt = changeStr.changeReplace(itch.stem);
                let indexChildP = indexChildstemInt.indexOf('<p>');
                let indexChildstem
                //有的题号带了括号，有的题号没有带括号
                if (indexChildP == 0) {
                  indexChildstem = indexChildstemInt.slice(0, 3) + itch.index + '. ' + indexChildstemInt.slice(3)
                } else {
                  indexChildstem = itch.index + '. ' + changeStr.changeReplace(itch.stem);
                }
                itch.indexChildstem = '<div style="white-space:pre-wrap">' + indexChildstem + '</div>';
              } else {
                itch.indexChildstem = itch.index + '. '
              }
              //给小题每一个答案，拼接 A B C D
              for (var j in itch.options) {
                itch.options[j] = '<div>' + String.fromCodePoint(parseInt(j) + 65) + '.&nbsp;' + itch.options[j] + '</div>'
              }
            })
          }

        })
        if (res.page == res.page_count) {
          contentlist = contentlistTem.concat(contentlist),
            _this.setData({
              hasMoreData: false
            })
        } else {
          contentlist = contentlistTem.concat(contentlist),
            _this.setData({
              hasMoreData: true,
              pageSize: pageSize + 1
            })
        }
        var idList = [];
        contentlist.forEach(ic => {
          idList.push(ic.id)
        })
        _this.setData({
          total_count: res.total_count,
          addContent: res.cache_question_count,
          contentlist
        })
        wx.setStorageSync('idList', idList);
      }
    })
  },
  understand(e) {
    const { id, understand } = e.currentTarget.dataset;
    const { contentlist } = this.data;
    let checkunder = understand === 0 ? 1 : 0;
    let _this = this;
    let url = wx.getStorageSync('requstURL') + 'homework/wrong/question/mark';
    let token = wx.getStorageSync('token');
    let data = {
      token: token,
      id: id,
      understand: checkunder
    };
    ajax.requestLoad(url, data, 'POST').then(res => {
      if (res.code == 20000) {
        wx.showToast({
          title: `标记${checkunder == 1 ? '掌握' : '没掌握'}成功`,
          icon: 'none',
          duration: 2000
        })
        contentlist.forEach((item, i) => {
          if (item.id === id) {
            _this.setData({
              [`contentlist[${i}]understand`]: checkunder,
            })
          }
        })
      }
    })
  },
  addques(e) {
    const { id } = e.currentTarget.dataset;
    const { contentlist, subjectid, stageid, addContent } = this.data;
    if (addContent >= 50) {
      this.setData({
        failFlag: true
      })
    } else {
      let _this = this;
      let url = wx.getStorageSync('requstURL') + 'homework/report/question/add';
      let token = wx.getStorageSync('token');
      let data = {
        token: token,
        id: id,
        subject_id: subjectid,
        stage_id: stageid
      };
      ajax.requestLoad(url, data, 'POST').then(res => {
        if (res.code == 20000) {
          wx.showToast({
            title: '添加成功',
            icon: 'none',
            duration: 2000
          })
          contentlist.forEach((item, i) => {
            if (item.id === id) {
              _this.setData({
                [`contentlist[${i}]add_status`]: 1,
                addContent: addContent + 1
              })
            }
          })
        }
      })
    }

  },
  deleteques(e) {
    const { id } = e.currentTarget.dataset;
    const { contentlist, subjectid, stageid, addContent } = this.data;
    let _this = this;
    let url = wx.getStorageSync('requstURL') + 'homework/report/question/delete';
    let token = wx.getStorageSync('token');
    let data = {
      token: token,
      id: id,
      subject_id: subjectid,
      stage_id: stageid
    };
    ajax.requestLoad(url, data, 'DELETE').then(res => {
      if (res.code == 20000) {
        wx.showToast({
          title: '删除成功',
          icon: 'none',
          duration: 2000
        })
        contentlist.forEach((item, i) => {
          if (item.id === id) {
            _this.setData({
              [`contentlist[${i}]add_status`]: 0,
              addContent: addContent - 1
            })
          }
        })
      }
    })
  },
  seeAdd() {
    const { subjectid, stageid, addContent } = this.data;
    if (addContent > 0) {
      wx.navigateTo({
        url: `/pages/allwrongQues/checkReadyQues?subjectid=${subjectid}&stageid=${stageid}`,
      })
    }
  },
  goQuesDetail(e) {
    let { id } = e.currentTarget.dataset;
    wx.navigateTo({
      url: `/pages/sortWrongList/arrageWrongList?id=${id}`
    })
  },
  // 查询该错题集下共有多少种题型
  // 
  checkQuesType(subjectid, stageid) {
    let _this = this;
    let url = wx.getStorageSync('requstURL') + 'common/subject/question/type';
    let token = wx.getStorageSync('token');
    let data = {
      token: token,
      subject_id: subjectid,
      stage_id: stageid
    };
    ajax.requestLoad(url, data, 'GET').then(res => {
      if (res.code == 20000) {
        _this.setData({
          QuesType: res.question_list
        })
      }
    })
  },
  bindUnder(e) {
    const { checked } = e.currentTarget.dataset;
    const { fliterUnderstand } = this.data;
    if (fliterUnderstand === checked) {
      this.setData({
        fliterUnderstand: null,
      })
    } else {
      this.setData({
        fliterUnderstand: checked,
      })
    }
  },
  bindType(e) {
    let { typecode } = e.currentTarget.dataset;
    const { QuesTypeCode } = this.data;
    typecode === QuesTypeCode ? this.setData({
      QuesTypeCode: null,
    }) : this.setData({
      QuesTypeCode: typecode,
    })

  },
  bindRest() {
    this.setData({
      fliterUnderstand: null,
      QuesTypeCode: null,
    })
  },
  bindSure() {
    this.setData({
      pageSize: 1,
      filteFlag: false
    })
    this.getQuesList()
  },
  playbigaudio(e) {
    const { audiosrc, id } = e.currentTarget.dataset;
    const { contentlist } = this.data;
    innerAudioContext.src = audiosrc;
    innerAudioContext.play();
    var that = this;
    contentlist.forEach((item, i) => {
      if (item.id == id && item.question_data.audio != null && item.question_data.audio != "") {
        that.setData({
          [`contentlist[${i}]question_data.showaudioImg`]: 3,
        })
        setTimeout(() => {
          innerAudioContext.currentTime
          innerAudioContext.onTimeUpdate(() => {
            let durationTotal = changeStr.formatSeconds(innerAudioContext.duration)
            let currentTime = changeStr.formatSeconds(innerAudioContext.currentTime)
            that.setData({
              [`contentlist[${i}]question_data.durationTotal`]: durationTotal,
              [`contentlist[${i}]question_data.currentTime`]: currentTime,
              [`contentlist[${i}]question_data.showaudioImg`]: 1,
            })
          })
        }, 500)
      } else {
        that.setData({
          [`contentlist[${i}]question_data.showaudioImg`]: 0,
          [`contentlist[${i}]question_data.currentTime`]: '00:00',
        })
      }
    })
  },
  stopbigaudio(e) {
    const { id } = e.currentTarget.dataset;
    const { contentlist } = this.data;
    var that = this
    contentlist.forEach((item, i) => {
      if (item.id == id && item.question_data.audio != null && item.question_data.audio != "") {
        that.setData({
          [`contentlist[${i}]question_data.showaudioImg`]: 0,
        })
      }
    })
    innerAudioContext.pause();
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const { subjectid, stageid } = options;
    this.setData({
      subjectid,
      stageid
    })
    this.checkQuesType(subjectid, stageid);
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
    this.getQuesList();
    this.homeworkList()
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
    if (this.data.hasMoreData) {
      this.getQuesList()
    } else {
      wx.showToast({
        title: '全部错题已经加载完成',
        icon: 'none',
        duration: 2000
      })
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})