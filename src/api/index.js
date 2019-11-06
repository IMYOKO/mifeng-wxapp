import configData from '../config/index'

const defaultheader = () => {
  const token = uni.getStorageSync("token") || null
  if (token) {
    return {
      'Authorization': token
    }
  }
  return {}
}

class BasicRequest {
  request (method, url, data = {}, headers = defaultheader()) {
    return new Promise((reslove, reject) => {
      uni.request({
        method,
        url: configData.BasicUrl + url,
        data,
        header: {...headers},
        success: res => {
          if (res.statusCode === 200 && res.data.status === 0) {
            reslove(res)
          } else {
            if (res.data.msg) {
              uni.showToast({
                title: res.data.msg,
                icon: 'none',
                duration: 2000
              });
            }
            if (res.data.status === 10003) {
              uni.removeStorageSync('token')
              uni.removeStorageSync('userInfo')
              uni.navigateTo({
                url:'/pages/login'
              })
            }
            reject(res)
          }
        },
        fail: err => {
          reject(err)
        }
      })
    })
  }
  GET (url, headers) {
    return this.request('GET', url, {}, headers)
  }
  POST (url, data, headers) {
    return this.request('POST', url, data, headers)
  }
}

export default BasicRequest