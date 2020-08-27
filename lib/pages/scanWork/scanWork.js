// pages/scanWork/scanWork.js
var ajax = require("./../../utils/ajax.js");
Page({
  /**
   * 页面的初始数据
   */
  data: {
    loginFlag: null,
    blackBlue: false,
    tips: true,
    x: 260,
    // y: 200,
    y: 460,
    showScan: true,
    title: '',
    primary: [
      { name: '语文', id: 14 },
      { name: '数学', id: 15 },
    ],
    middle: [
      { name: '语文', id: 14 },
      { name: '数学', id: 15 },
      { name: '英语', id: 17 },
      { name: '物理', id: 16 },
      { name: '化学', id: 18 },
      { name: '道法', id: 20 },
      { name: '历史', id: 21 }
    ],
    record_list: null,
    imgList: {
      14: '/images/subject/Chinese.png',
      15: '/images/subject/match.png',
      16: '/images/subject/physics.png',
      17: '/images/subject/English.png',
      18: '/images/subject/chemistry.png',
      19: '/images/subject/biology.png',
      20: '/images/subject/moralityandlaw.png',
      21: '/images/subject/history.png',
      22: '/images/subject/geography.png'
    },
    showModel: false,    //提示弹框
    showPsd: false,      //让家长输入密码的弹框
    errorCode: false,  //二维码扫描错误的弹框
    hideTableBar: false,
    showTitle: false,
    Length: 4,
    pwdVal: '',
    psdFocus: true,
    isAnimate: false,
    bannerList: [
      //   {
      //   index: 0,
      //   url: 'http://znwy.oss-cn-beijing.aliyuncs.com/zyzs/images/mine0.jpg',
      // },
      {
        index: 1,
        url: 'http://znwy.oss-cn-beijing.aliyuncs.com/zyzs/images/shucheng.jpg',
      }, 
      {
        index: 2,
        url: 'http://znwy.oss-cn-beijing.aliyuncs.com/zyzs/images/zhibo.png',
      }
    ],

  },
  getData(e) {
    let data = e.detail;
    console.log(data.industryOneId);
    console.log(data.industryTwoId);
    this.setData({
      industryOneId: data.industryOneId,
      industryTwoId: data.industryTwoId
    })
    if (data.industryOneId == 10) {
      this.getScanList(1, '', '')
    } else {
      let stageindex = data.industryOneId;
      let objectIndex = data.industryTwoId;
      this.getScanList(1, stageindex, objectIndex)
    }
  },

  //获取数据
  getScanList(page, stageindex, objectIndex) {
    // console.log(subjectId)
    let url = wx.getStorageSync('requstURL') + 'homework/list';
    let token = wx.getStorageSync('token');
    let data = {
      token: token,
      pagesize: 100,
      page: page
    };
    stageindex !== "" ? data.stage_id = parseInt(stageindex) : '';
    objectIndex !== "" ? data.subject_id = objectIndex : '';
    // console.log(data)
    ajax.requestLoad(url, data, 'GET').then(res => {
      if (res.code === 20000) {
        if (res.total_count < 1 && stageindex == '' & objectIndex == '') {
          this.setData({
            showScan: true
          })
        } else {
          res.record_list.forEach((item,index)=>{
            item.precent = ((item.question_count-item.wrong_question_count)*100/item.question_count).toFixed(0);
          })
          this.setData({
            showScan: false,
            record_list: res.record_list
          })
        }
      }
    })
  },
  scancode: function () {
    let that = this;
    const { loginFlag } = this.data;
    if (loginFlag) {
      // 允许从相机和相册扫码
      wx.scanCode({
        success(res) {
          let result = res.result;
          let section_id = res.result.split(',')[0];
          // if (result.indexOf('https://172.17.250.193') > -1) {   //正式验证
            if (result.indexOf('http://127.0.0.1:9003') > -1) {   //测试验证
            let url = wx.getStorageSync('requstURL') + 'user/third/auth';
            let token = wx.getStorageSync('token');
            let data = {
              token: token,
              redirect_url: result
            };
            ajax.requestLoad(url, data, 'POST').then(res => {
              const { code } = res;
              if (code == 20000) {
              }
            })
          } else if (section_id.length == 8) {
            let url = wx.getStorageSync('requstURL') + 'homework/info';
            let token = wx.getStorageSync('token');
            let data = {
              token: token,
              section_id: section_id
            };
            ajax.requestLoad(url, data, 'GET').then(res => {
              if (res.code === 20000) {
                let section_name = res.section_name;
                wx.navigateTo({
                  url: `/pages/uploadHomework/uploadHomework?section_id=${section_id}&section_name=${section_name}`,
                })
              }
            })
          } else {
            wx.hideTabBar({
              success: function () {
                wx.hideLoading();
                that.setData({
                  errorCode: true,
                })
              }
            })

          }
        },
        fail: (res) => {
          wx.showToast({
            title: '扫描失败',
            icon: 'none',
            duration: 2000
          })
        }
      })
    } else {
      this.setData({
        bounceInUp: "arotate",
      })
      setTimeout(() => {
        this.setData({
          bounceInUp: "",
        })
      }, 600);
    }
  },
  goList(e) {
    const { sectionid, sectionname, sectiontime, imglist } = e.currentTarget.dataset;
    wx.setStorageSync('imglist', imglist);
    wx.navigateTo({
      url: `/pages/workReport/workReport?section_id=${sectionid}&section_name=${sectionname}&section_time=${sectiontime}`,
    })
    
  },
  //查看原图 
  checkRestImg(e) {
    const { imglist } = e.currentTarget.dataset;
    // console.log(imglist.length)
    wx.setStorageSync('imglist', imglist);
    wx.navigateTo({
      url: `/pages/restImg/checkRestImg`,
    })
  },
  linkout() {
    this.setData({
      showModel: false,
      showTitle: true
    })
  },
  sureopen() {
    this.setData({
      showModel: false,
      showPsd: true
    })
  },
  backout() {
    wx.setStorageSync('first_login', 0)
    this.setData({
      showPsd: false,
      showTitle: true
    })
  },
  surepsd() {
    let { pwdVal } = this.data;
    var that = this;
    if (pwdVal.length === 4) {
      let url = wx.getStorageSync('requstURL') + 'user/monitor/password/setting';
      let token = wx.getStorageSync('token');
      let data = {
        token: token,
        monitor_password: pwdVal
      }
      ajax.requestLoad(url, data, 'POST').then(res => {
        if (res.code === 20000) {
          wx.showToast({
            title: '请您牢记您的密码哦~',
            icon: 'none',
            duration: 1000,
            success: () => {
              that.setData({
                showPsd: false,
                showModel: false
              })
              wx.showTabBar({ pwdVal: '' })
            }
          })

        } else {
          this.setData({})
        }
      })
    } else {
      wx.showToast({
        title: '请设置4为数字监管密码',
        icon: 'none',
        duration: 1000
      })
    }
  },
  yes() {
    wx.setStorageSync('first_login', 0)
    this.setData({
      showTitle: false,
    })
    wx.showTabBar({})
  },
  closeError() {
    this.setData({
      errorCode: false,
    })
    wx.showTabBar({})
  },
  getFocus: function () {
    this.setData({ psdFocus: true });
  },
  inputPwd: function (e) {
    this.setData({ pwdVal: e.detail.value });
  },
  
  gologin() {
    wx.navigateTo({
      url: `/pages/login/login`,
    })
  },
  goExplain(e) {
    const { index } = e.currentTarget.dataset;
    if (index == 1) {
      wx.navigateToMiniProgram({
        appId: 'wxa434b2c20ea3ddeb',
        path: '',
        success(res) {
          // 打开成功
        }
      })
    }
    if (index == 2) {
      wx.navigateTo({
        url: `/pages/mine/studentHelp`,
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // let showTips = wx.getStorageSync('showTips');
    // if (showTips == 0) {
    //   wx.showModal({
    //     title: '公告',
    //     content: '小助手将于2020年8月8日凌晨00:00至5:00进行临时维护(具体恢复时间以实际时间为准)，在此期间系统功能将无法使用，如此给您带来的不便，敬请谅解！',
    //     showCancel: false,
    //     success(res) {
    //       if (res.confirm) {
    //         wx.setStorageSync('showTips', 1)
    //       }
    //     }
    //   })
    // }
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
    let token = wx.getStorageSync('token');
    let monitor_moudle = wx.getStorageSync('monitor_moudle');
    let monitor_moudlePass = wx.getStorageSync('monitor_moudlePass');
    let startTime = wx.getStorageSync('startTime');
    //上次登录的时间与这次登录的时间相减，得到两次登录之间隔了多少毫秒
    let nowTimeDot = new Date().getTime() - startTime;
    //24小时过期时间的毫秒戳
    let lateTime = 1000 * 60 * 60 * 24 * 7;
    if (token && token != '') {
      this.setData({
        loginFlag: true
      })
      if (nowTimeDot > lateTime) {
        //大于了7 * 24小时
        wx.reLaunch({
          url: '/pages/login/login',
        })
      } else {
        //开通了家长监管模式，且曾经没有输入家长监管模式密码的
        if (monitor_moudle == 1 && monitor_moudlePass == 0) {
          wx.reLaunch({
            url: '/pages/login/login',
          })
        } else {
          let { industryOneId,industryTwoId } = this.data;
          if (!industryOneId) {
            this.getScanList(1, '', '')
          } else {
            if (industryOneId == 10) {
              this.getScanList(1, '', '')
            } else {
              let stageindex = industryOneId;
              let objectIndex = industryTwoId;
              this.getScanList(1, stageindex, objectIndex)
            }
          }
          //进入页面提示家长开启监管模式
          let first_login = wx.getStorageSync('first_login')
          if (first_login == 1) {
            this.setData({
              showModel: true,
            })
            wx.hideTabBar({})
          }
        }
      }
    } else {
      this.setData({
        loginFlag: false,
        showScan: true,
      })
    }
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