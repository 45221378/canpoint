let header = {
  "Content-type": "application/x-www-form-urlencoded"
}
let requestLoad = function (url, data, method) {
  return new Promise((resolve, reject) => {
    wx.showLoading({
      title: '加载中...',
      mask: true,
    })
    wx.request({
      url: url,
      data: data,
      method: method,
      header: header,
      success: function (res) {
        wx.hideLoading();
        if (res.statusCode === 200) {
          const { code } = res.data;
          if (code === 20000) {
            resolve(res.data)
          } else if (code === 300201 || code === 300202 || code === 300203 || code === 300301 || code === 300401 || code === 400201 || code === 400202 || code === 400203 || code === 400204) {
            wx.removeStorageSync('token');
            wx.removeStorageSync('userPhone');
            wx.removeStorageSync('startTime');
            wx.removeStorageSync('formType');
            wx.removeStorageSync('userPhone');
            wx.removeStorageSync('monitor_moudle');
            wx.removeStorageSync('first_login');
            wx.reLaunch({
              url: '/pages/scanWork/scanWork',
            })
          } else {
            wx.showToast({
              title: res.data.message,
              icon: 'none',
              duration: 2000
            })
          }
        } else {
          wx.showToast({
            title: `网络连接错误${res.statusCode}`,
            icon: 'none',
            duration: 2000
          })
        }
        resolve(res.data)
      },
      fail: function (error) {
        wx.hideLoading();
        reject(error)
      }
    })
  })
}
module.exports = {
  requestLoad
}