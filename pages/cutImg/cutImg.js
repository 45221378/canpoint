Page({
  data: {
    image_list: [
      "https://cp-zy.oss-cn-beijing.aliyuncs.com/CanPointZY/20191205_175858_DgjuU3Qx_5bcae706725148aa8047105ff3b8648a/dee7a0d9680d4ea382501fd125cc222e.jpg",
      "https://cp-zy.oss-cn-beijing.aliyuncs.com/CanPointZY/20191205_175858_DgjuU3Qx_5bcae706725148aa8047105ff3b8648a/b1c129c6c035470ca495b37efe12db4c.jpg",
      "https://cp-zy.oss-cn-beijing.aliyuncs.com/CanPointZY/20191205_175858_DgjuU3Qx_5bcae706725148aa8047105ff3b8648a/30c6016ac2224710a13a52a0c4ad4a19.jpg",
      "https://cp-zy.oss-cn-beijing.aliyuncs.com/CanPointZY/20191205_175858_DgjuU3Qx_5bcae706725148aa8047105ff3b8648a/25c3b20da29649e7879716c50bfb8c8a.jpg"
    ],
    showImg:'https://cp-zy.oss-cn-beijing.aliyuncs.com/CanPointZY/20191205_175858_DgjuU3Qx_5bcae706725148aa8047105ff3b8648a/dee7a0d9680d4ea382501fd125cc222e.jpg',
    canvasImg:'',
    x: 0,
    y: 0,
    scale: 1,
    canvas_width: '',
    canvas_height: '',
  },
  //判断图片的宽高，短的那边变成固定，长的自适应。
  onLoad: function (options) {
    var that = this;
    wx.getSystemInfo({
      success: function(res) {
        that.setData({
          canvas_width : res.windowWidth,
          canvas_height : res.windowHeight - 72
        })
      },
    })
    
  },
  
  canvas(canvasImg){
    var ctx = wx.createCanvasContext('my_canvas', this)
    var canvas_width = this.data.canvas_width,
      canvas_height = this.data.canvas_height;
    var clip_left, clip_top, //左偏移值，上偏移值，
    clip_width, clip_height; //截取宽度，截取高度
    //把图片画入canvas

    console.log(canvasImg)
    console.log(canvas_width)
    console.log(canvas_height)

    ctx.drawImage(canvasImg, 0, 0, canvas_width,canvas_height);
    // ctx.drawImage(img,0,0,210, 60, 0,0,330, 330);

    ctx.draw();



    

  },
  showImg(e){
    const {imgsrc} =e.currentTarget.dataset;
    wx.getImageInfo({
      src: imgsrc,
      success: function(res) {
        var canvasImg = res.path
        that.canvas(canvasImg);
      }
    })
  },
  onScale(e) {
    console.log(e.detail)
  },
  onChange(e){
    console.log(e.detail)

  }
})