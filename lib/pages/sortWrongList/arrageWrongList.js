// pages/sortWrongList/arrageWrongList.js
var ajax = require("./../../utils/ajax.js")
var changeStr = require("./../../utils/replace.js")


const innerAudioContext = wx.createInnerAudioContext();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    nowid: 0,
    idList: [],
    pageData: [],
    pageChecked: '',
    showTimes: 1,
  },
  getTextareaValue(e) {
    this.setData({
      [`pageData.remarks`]: e.detail.value
    })
  },
  changeAnswer(e) {
    const { value, havethink } = e.currentTarget.dataset;
    const { pageChecked } = this.data;
    if (havethink) {
      //  如果没有进行过反思
      if (value === "") {
        wx.showToast({
          title: '请输入反思的内容',
          icon: 'none',
          duration: 2000
        })
        return;
      } else {
        let url = wx.getStorageSync('requstURL') + 'homework/wrong/question/remarks/update';
        let token = wx.getStorageSync('token');
        let data = {
          token: token,
          id: pageChecked,
          remarks: value
        };
        ajax.requestLoad(url, data, 'POST').then(res => {
          if (res.code === 20000) {
            wx.showToast({
              title: '提交成功',
              icon: 'none',
              duration: 2000
            })
            this.setData({
              [`pageData.haveThink`]: false
            })
          }
        })
      }
    } else {
      this.setData({
        [`pageData.haveThink`]: !havethink
      })
    }

  },
  // 查看答案
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
  //添加错题原因
  addImg() {
    const { section_id, section_name, source_images_list, pageChecked } = this.data;
    wx.setStorageSync("imglist", source_images_list)
    wx.redirectTo({
      url: `/pages/cropper/cropper?section_id=${section_id}&id=${pageChecked}&section_name=${section_name}&source=1`,
    })
  },
  //删除切图
  deleteImg(e) {
    const { imgurl, imglist, indeximg } = e.currentTarget.dataset;
    const { pageData, pageChecked } = this.data;
    let that = this;
    let url = wx.getStorageSync('requstURL') + 'homework/wrong/question/image/delete';
    let token = wx.getStorageSync('token');
    let data = {
      token: token,
      id: pageChecked,
      image_url: imgurl
    };
    ajax.requestLoad(url, data, 'DELETE').then(res => {
      if (res.code === 20000) {
        wx.showToast({
          title: '删除成功',
          icon: 'none',
          duration: 2000
        })
        imglist.splice(indeximg, 1);
        that.setData({
          [`pageData.image_list`]: imglist
        })
      }
    })
  },
  understand(e) {
    const { understand } = e.currentTarget.dataset;
    const { pageChecked } = this.data;
    let checkunder = understand === 0 ? 1 : 0;
    let that = this;
    let url = wx.getStorageSync('requstURL') + 'homework/wrong/question/mark';
    let token = wx.getStorageSync('token');
    let data = {
      token: token,
      id: pageChecked,
      understand: checkunder
    };
    ajax.requestLoad(url, data, 'POST').then(res => {
      if (res.code === 20000) {
        wx.showToast({
          title: `标记${checkunder == 1 ? '掌握' : '没掌握'}成功`,
          icon: 'none',
          duration: 2000
        })
        that.setData({
          [`pageData.understand`]: checkunder
        })
      }
    })
  },
  getData(checkedid) {
    let { showTimes } = this.data;
    let url = wx.getStorageSync('requstURL') + 'homework/wrong/question/info';
    let token = wx.getStorageSync('token');
    let data = {
      token: token,
      id: checkedid,
    };
    ajax.requestLoad(url, data, 'GET').then(res => {
      if (res.code === 20000) {
        //此提示只出现一次
        if (showTimes == 1) {
          wx.showToast({
            title: '左滑右滑切换题目哦~',
            icon: 'none',
            duration: 2000
          })
        }
        showTimes++

        let question_data = res.data.question_data;
        //处理大题的题干
        let indexstem
        if (question_data.stem) {
          let indexstemInt = changeStr.changeReplace(question_data.stem);
          let indexDisP = indexstemInt.indexOf('>') + 1;
          let indexP = indexstemInt.indexOf('<p');
          if (indexP == 0) {
            indexstem = indexstemInt.slice(0, indexDisP) + indexstemInt.slice(indexDisP);
          } else {
            indexstem = changeStr.changeReplace(question_data.stem);
          }
          question_data.indexstem = '<div style="white-space:pre-wrap">'+indexstem+'</div>';
        }
        //处理大题的音频地址
        if (question_data.audio) {
          let audiohttps = question_data.audio.replace('http://', 'https://')
          question_data.audio = audiohttps;
          question_data.durationTotal = '00:00';
          question_data.currentTime = '00:00';
          question_data.showaudioImg = 0;
        }
        // 是否有反思，有就需要disabled输入框，并且 字的内容为修改
        question_data.haveThink = res.data.remarks === '' ? true : false;
        question_data.image_list = res.data.image_list;
        question_data.showvideo = res.data.question_data.video != '' ? true : false;
        question_data.videoFlag = true;
        question_data.understand = res.data.understand;
        question_data.remarks = res.data.remarks;

        //给每一个答案，拼接 A B C D
        for (var i in question_data.options) {
          question_data.options[i] ='<div>'+  String.fromCodePoint(parseInt(i) + 65) + '.&nbsp;' + question_data.options[i]+'</div>'
        }
        //如果有小题
        if (question_data.children.length > 0) {
          question_data.childrenFlag = true;
          question_data.children.map((itch, idch) => {
            itch.index = `(${idch+1})`;
            //处理小题的题干
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
              itch.indexChildstem = '<div style="white-space:pre-wrap">'+indexChildstem+'</div>'; 
            } else {
              itch.indexChildstem = itch.index + '. '
            }
            //给每一个答案，拼接 A B C D
            for (var j in itch.options) {
              itch.options[j] ='<div>'+  String.fromCodePoint(parseInt(j) + 65) + '.&nbsp;' + itch.options[j]+'</div>'
            }
            //处理小题的音频地址
            if (itch.audio) {
              let audiohttps = itch.audio.replace('http://', 'https://')
              itch.audio = audiohttps;
              itch.durationTotal = '00:00';
              itch.currentTime = '00:00';
              itch.showaudioImg = 0;
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
            itch.newAnwsers = '<div style="white-space:pre-wrap">'+newAnwsers+'</div>';

            itch.myanswerFlag = false   //是否有答案解析
            // myanswerTrue  是否答题正确
            // 存在my_answer下
            if (itch.my_answer) {
              // 把判断题单独拿出来判断 因为my_answer在主观题的情况下为0 ，表示答错了。但是在判断题的情况下返回0.得去和answer进行比较，到底是否答对。
              if (itch.template == 6 || itch.template == 24) {
                //单选，多选的情况 判断是否答对此道题目
                if (itch.answers[0][0] == itch.my_answer) {
                  itch.myanswerTrue = true
                } else {
                  itch.myanswerTrue = false
                }
              } else {
                if (itch.my_answer == 0) {
                  itch.myanswerTrue = false
                } else if (itch.my_answer == 1) {
                  itch.myanswerTrue = true
                } else {
                  //单选，多选的情况 判断是否答对此道题目
                  if (itch.answers.join('') == itch.my_answer) {
                    itch.myanswerTrue = true
                  } else {
                    itch.myanswerTrue = false
                  }
                }
              }
            } else {
              itch.myanswerTrue = true
            }
            if (!itch.myanswerTrue) {
              //如果在有小题的情况下，答错了。
              //再判断，是否是选择题，是选择题，显示选择的答案。否则，显示 x
              var alltemplate = [1, 2, 3, 4, 25, 6, 19, 14, 22, 29];
              if ( alltemplate.indexOf( itch.template) > -1) {
                itch.showErrorAnswer = true;
              } else {
                itch.showErrorAnswer = false;
              }
            }

            if (itch.analysis) {
              if (itch.analysis[0] === "") {
                itch.analysisFlag = false
              }
            }
          })
        } else {
          // 无小题的情况下
          question_data.childrenFlag = false;
          question_data.myanswerFlag = false;
          //多选题的情况
          if (question_data.id === 4) {
            let newAnwser = [];
            newAnwser.push(question_data.answers.join(''));
            question_data.answers = newAnwser
          }
          //多答案的情况下
          let newAnwsers = ''
          question_data.answers.forEach(itAn => {
            // 判断题，把后端返回的正确的 
            if (question_data.template == 6 || question_data.template == 24) {
              newAnwsers = itAn.toString() == 0 ? '错' : '对'
            } else {
              newAnwsers = newAnwsers + itAn.toString() + ' &nbsp;&nbsp;';
            }
          })
          question_data.newAnwsers = '<div style="white-space:pre-wrap">'+newAnwsers+'</div>';
          //判断到底是显示错误的答案，还是在显示 X
          var alltemplate = [1, 2, 3, 4, 25, 6, 19, 14, 22, 29];
          if (
            alltemplate.indexOf(question_data.template) > -1
          ) {
            question_data.showErrorAnswer = true;
          } else {
            question_data.showErrorAnswer = false;
          }
        }
        this.setData({
          showTimes,
          pageData: question_data,
          source_images_list: res.data.source_images_list
        })
        console.log(this.data.pageData);
      }
    })
  },
  bindchange(e) {
    // console.log(e)
    const { detail: { source, current } } = e;
    const { idList } = this.data;
    let sendId = idList[current]
    if (source === 'touch') {
      this.setData({
        nowid: current,
      })
    }
    this.setData({
      pageChecked: sendId
    })
    console.log(sendId)
    //左右滑动的情况下，请求新的题目数据
    this.getData(sendId)
    // //左右滑动的情况下，把正在播放的音频状态全部重置
    innerAudioContext.stop();
  },
  previewImg(e) {
    const { imgsrc, imglist } = e.currentTarget.dataset;
    //图片预览
    wx.previewImage({
      current: imgsrc, // 当前显示图片的http链接
      urls: imglist // 需要预览的图片http链接列表
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let id = options.id;
    let idList = wx.getStorageSync('idList');
    this.setData({
      idList: idList,
      pageChecked: id
    })
    console.log(idList)
    idList.forEach((item, index) => {
      if (item == id) {
        this.setData({
          nowid: index,
        })
      }
    })
    console.log(this.data.nowid)
    // if (this.data.nowid == 0) {
      // this.getData(id)
    // }

    innerAudioContext.onPlay(() => {

    })
    innerAudioContext.onPause(() => {

    })
  },
  playaudio(e) {
    // console.log('开始')
    const { audiosrc, qid } = e.currentTarget.dataset;
    const { pageData } = this.data;
    innerAudioContext.src = audiosrc;
    console.log(audiosrc)
    innerAudioContext.play();
    var that = this
    if (pageData.children.length > 0) {
      pageData.children.map((itch, ic) => {
        if (itch.audio != null && itch.audio != "" && itch.qid == qid) {
          that.setData({
            [`pageData.children[${ic}].showaudioImg`]: 3,
          })
          setTimeout(() => {
            innerAudioContext.currentTime
            innerAudioContext.onTimeUpdate(() => {
              let durationTotal = changeStr.formatSeconds(innerAudioContext.duration)
              let currentTime = changeStr.formatSeconds(innerAudioContext.currentTime)
              that.setData({
                [`pageData.children[${ic}].durationTotal`]: durationTotal,
                [`pageData.children[${ic}].currentTime`]: currentTime,
                [`pageData.children[${ic}].showaudioImg`]: 1,
              })
            })
          }, 500)
        }
      })
    }
  },
  stopaudio(e) {
    const { audiosrc, qid } = e.currentTarget.dataset;
    const { pageData } = this.data;
    innerAudioContext.src = audiosrc;
    var that = this
    if (pageData.children.length > 0) {
      pageData.children.map((itch, ic) => {
        if (itch.audio != null && itch.audio != "" && itch.qid == qid) {
          that.setData({
            [`pageData.children[${ic}].showaudioImg`]: 0,
          })
        }
      })
    }
    innerAudioContext.pause();
  },
  playbigaudio(e) {
    const { audiosrc, id } = e.currentTarget.dataset;
    const { pageData } = this.data;
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
  // 点击获取视频地址并进行观看
  playbtn(e) {
    const { videoid } = e.currentTarget.dataset;
    let urlC = wx.getStorageSync('requstURL') + 'video/link';
    let tokenC = wx.getStorageSync('token');
    let data = {
      token: tokenC,
      video_id: videoid,
    };
    ajax.requestLoad(urlC, data, 'GET').then(res => {
      if (res.code === 20000 && res.video_link != null) {
        this.setData({
          [`pageData.videoFlag`]: false,
          [`pageData.videoSrc`]: res.video_link
        })
      }
    })
  },
  addremark(e) {
    const { value } = e.currentTarget.dataset;
    const { section_id, section_name, pageChecked } = this.data;
    wx.navigateTo({
      url: `/pages/cropper/remark?section_id=${section_id}&id=${pageChecked}&section_name=${section_name}&value=${value}&source=1`,
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
    const {pageChecked} = this.data;
    this.getData(pageChecked)
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