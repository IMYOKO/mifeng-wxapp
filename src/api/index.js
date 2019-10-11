import configData from '../config/index'

class BasicRequest {
  request (method, url, data = {}, headers = {}) {
    return new Promise((reslove, reject) => {
      uni.request({
        method,
        url: configData.BasicUrl + url,
        data,
        header: {...headers},
        success: res => {
          if (res.statusCode === 200) {
            reslove(res)
          } else {
            // uni.showToast({
            //   title: '失败',
            //   icon: 'none',
            //   duration: 2000
            // });
            reject(res)
          }
        },
        fail: err => {
          // uni.showToast({
          //   title: '失败',
          //   icon: 'none',
          //   duration: 2000
          // });
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