import qiniuUploader  from './qiniuUploader';
import configData from '../config/index'
export default async (filePath,fn) => {
  // 添加token请求头
  let header =  { 'Content-Type': 'application/json' }
  let token = uni.getStorageSync('token');
  if (token) {
    header.Authorization = token
  }

  // 发起请求
  await uni.request({
    url: configData.BasicUrl + '/api/dictData/getQiniuParam',
    method:'POST',
    header: header,
    success: res => {
      if (res.statusCode === 200 && res.data.status === 0) {
        let imgToken = res.data.data.token;
        let baseUrl  = res.data.data.baseUrl;
        qiniuUploader.upload(filePath, (res) => {
          if (fn) {
            fn(res);
          }
        }, (error) => {
          console.log('error: ' + error);
        }, {
          region: 'SCN',
          domain: baseUrl,
          uptoken: imgToken, // 由其他程序生成七牛 uptoken
        }, (res) => {
          // console.log(res);
          // console.log('上传进度', res.progress)
          // console.log('已经上传的数据长度', res.totalBytesSent)
          // console.log('预期需要上传的数据总长度', res.totalBytesExpectedToSend)
        });
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
        return Promise.reject(res)
      }
    },
    fail: err => {
      return Promise.reject(err)
    }
  })
};
