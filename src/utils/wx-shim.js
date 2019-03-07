// wx.api 转 promise
const wxApis = [
  'request',
  'showToast',
  'login',
  'checkSession',
  'chooseImage',
  'canvasToTempFilePath',
  'previewImage',
  'getImageInfo',
  'showLoading',
  'getSystemInfo',
  'uploadFile',
  'downloadFile',
  'requestPayment',
  'hideShareMenu',
  'getUserInfo',
  'showModal',
]

wx.pro = {}

wxApis.forEach(name => {
  if (typeof wx[name] !== 'function') {
    throw new Error(`wx.${name} is not a function`)
  }
  wx.pro[name] = function(options) {
    return new Promise((resolve, reject) => {
      const { success, fail, complete } = options
      wx[name]({
        ...options,
        success: res => {
          resolve(res)
          success && success(res)
        },
        fail: err => {
          reject(new Error(err.errMsg))
          fail && fail(err)
        },
        complete,
      })
    })
  }
})
