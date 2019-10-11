import configData from '../config/index'

class BasicApi {
  get (url, config) {
    return uni.request({
      url: configData.BasicUrl + url,
      header: {...config}
    })
  }
  post (url, data, config) {
    return uni.request({
      method: 'POST',
      url: configData.BasicUrl + url,
      data,
      header: {...config}
    })
  }
  postWifi (url, data, config) {
    console.log(configData.WifiUrl + url)
    return uni.request({
      // method: 'GET',
      url: configData.WifiUrl + url,
      // data,
      header: {...config}
    })
  }
  resultCallback (data, sucssCallbak, errorCallbak) {
    var [error, res] = data;
    if (error) {
      console.log(error)
      uni.showToast({
        title: '请求失败',
        icon: 'none',
        duration: 2000
      });
      errorCallbak && errorCallbak();
    } else {
      console.log(data);
      let resultDdata = res.data;
      // console.log("返回数据" + JSON.stringify(resultDdata));
      if (res.statusCode === 200 && resultDdata.flag === 0) {
        sucssCallbak && sucssCallbak(resultDdata)
      } else {
        let title = ''
        if (resultDdata.errmsg) {
          title = resultDdata.errmsg
        } else {
          title = '请求失败！'
        }
        uni.showToast({
          title,
          icon: 'none',
          duration: 2000
        });
        errorCallbak && errorCallbak(resultDdata);
      }
    }
  }
}

export default BasicApi