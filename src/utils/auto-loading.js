const ignoreErrors = []

async function loading(promise, title = '加载中', successMessage, failMessage, showLoading = true) {
  const mask = process.env.__DEV__
  try {
    showLoading && await wx.pro.showLoading({ title, mask })
    const res = await promise
    wx.pro.hideLoading()
    if (successMessage) wx.pro.showToast({ title: successMessage, icon: 'success' })
    return res
  } catch (err) {
    wx.pro.hideLoading()
    if (!ignoreErrors.includes(err.message))
      wx.pro.showModal({
        title: '错误',
        content: failMessage || err.message,
        showCancel: false,
        confirmColor: '#E0B44F',
        confirmText: '知道了',
      })
    throw err
  }
}

function loadingDecorator({ title, successMessage, failMessage, showLoading } = {}) {
  return function (target, name, descriptor) {
    const func = descriptor.value
    descriptor.value = function () {
      return loading(func.apply(this, arguments), title, successMessage, failMessage, showLoading)
    }
    descriptor.enumerable = true
    return descriptor
  }
}

export default function autoLoading(...args) {
  if (args[0] instanceof Promise) {
    return loading(...args)
  } else if (args.length === 3) {
    return loadingDecorator()(...args)
  } else {
    return loadingDecorator(args[0])
  }
}
