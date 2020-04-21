let header = {
  "Content-type": "application/x-www-form-urlencoded"
}
let requestLoad = function(url,data,method){
  return new Promise((resolve,reject)=>{
    wx.hideLoading();
    wx.showLoading({
      title: '加载中...',
    })
    wx.request({
      url: url,
      data: data,
      method: method,
      header: header,
      success: function(res){
        wx.hideLoading();
        if(res.statusCode===200){
          if(res.data.code===20000){
            resolve(res.data)
          }else{
            wx.showToast({
              title: res.data.message,
              icon:'none',
              duration: 2000
            })
          }
        }else{
          wx.showToast({
            title: `网络连接错误${res.statusCode}`,
            icon:'none',
            duration: 2000
          })
        }
        resolve(res.data)
      },
      fail: function(error){
        wx.hideLoading();
        reject(error)
      }
    })
  })
}
module.exports = {
  requestLoad
}