export function ajax({url,data,method}){
  const promise = new Promise(function(resolve,reject){
    wx.hideLoading();
    wx.showLoading({
      title: '加载中...',
    })
    wx.request({
      url: url,
      method:method,
      data:data,
      success:(res)=>{
        wx.hideLoading();
        resolve(res.data)
      },
      fail:(error)=>{
        reject(error)
      }
    })
  })
  return promise;
}