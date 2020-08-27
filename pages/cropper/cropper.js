//获取应用实例
var ajax = require("./../../utils/ajax.js")

const app = getApp()
Page({
  data: {
    image_list: [],
    src: '',
    width: 150,//宽度
    height: 80,//高度
    max_width: 800,
    max_height: 800,
    imgwidth: 350,
    imgheight: 500,
    disable_rotate: false,//是否禁用旋转
    disable_ratio: false,//锁定比例
    limit_move: false,//是否限制移动
    ossInfo: ''
  },
  onLoad: function (options) {
    let imglist = wx.getStorageSync('imglist');
    this.cropper = this.selectComponent("#image-cropper");
    // 从后端拉取图片的数据，非上传。得到图片，进行排列，然后进行区域性的裁剪
    this.setData({
      src: imglist[0],
      image_list: imglist,
      id: options.id,
      section_id: options.section_id,
      section_name: options.section_name,
      source: options.source
    });
    wx.showLoading({
      title: '加载中'
    })
    //发送请求调取上传图片所需要的数据
    let url = wx.getStorageSync('requstURL') + 'common/ali/signature';
    let token = wx.getStorageSync('token');
    ajax.requestLoad(url, { token: token }, 'GET').then(res => {
      if (res.code === 20000) {
        this.setData({
          ossInfo: res.kwargs
        })
      }
    })
  },
  cropperload(e) {
    // console.log('cropper加载完成');
  },
  loadimage(e) {
    // console.log('图片');
    wx.hideLoading();
    this.cropper.imgReset();
  },
  clickcut(e) {
    // console.log(e.detail);
    //图片预览
    wx.previewImage({
      current: e.detail.url, // 当前显示图片的http链接
      urls: [e.detail.url] // 需要预览的图片http链接列表
    })
  },
  showImg(e) {
    const { imgsrc } = e.currentTarget.dataset;
    let that = this;
    wx.showLoading({
      title: '加载中',
    })
    //重置图片角度、缩放、位置

    that.setData({
      src: imgsrc
    });
    that.cropper.imgReset();
  },


  submit() {
    let nowTimeDot = new Date().getTime()
    const { ossInfo, section_id, id, section_name, source } = this.data;
    this.cropper.getImg((obj) => {
      this.setData({
        src: obj.url
      });
      // console.log(this.data.src)
      wx.showLoading({
        title: '正在上传中...'
      })
      wx.uploadFile({
        url: ossInfo.endpoint,
        filePath: obj.url,
        name: 'file',
        header: {
          "Content-Type": 'multipart/form-data'
        },
        formData: {
          "name": `${ossInfo.dir_prefix}/${section_id}/${id}/${nowTimeDot}.png`,
          "key": `${ossInfo.dir_prefix}/${section_id}/${id}/${nowTimeDot}.png`,
          "policy": ossInfo.policy,
          "OSSAccessKeyId": ossInfo.OSSAccessKeyId,
          "success_action_status": '200',
          "signature": ossInfo.signature,
        },
        success: (result) => {
          let url = wx.getStorageSync('requstURL') + 'homework/wrong/question/image/add';
          let token = wx.getStorageSync('token');
          let data = {
            token: token,
            image_url: `${ossInfo.endpoint}/${ossInfo.dir_prefix}/${section_id}/${id}/${nowTimeDot}.png`,
            id: id
          }
          ajax.requestLoad(url, data, 'POST').then(res => {
            if (res.code === 20000) {
              wx.showToast({
                title: '图片上传成功',
                icon: 'none',
                duration: 1000,
                success: () => {
                  if (source == 0) {
                    wx.redirectTo({
                      url: `/pages/sortWrongList/sortWrongList?section_id=${section_id}&section_name=${section_name}&id=${id}`,
                    })
                  } else {
                    wx.redirectTo({
                      url: `/pages/sortWrongList/arrageWrongList?id=${id}`,
                    })
                  }
                }
              })
            }
          })
        },
        fail: () => {
          wx.hideLoading();
          wx.showToast({
            title: '图片上传失败',
            icon: 'none',
            duration: 2000
          })
        },
        complete: () => { }
      });

    });
  },
})

