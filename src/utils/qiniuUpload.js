import wepy from 'wepy';
import qiniuUploader  from './qiniuUploader';

export default async (filePath,fn) => {
  // 添加token请求头
  let header =  { 'Content-Type': 'application/json' }
  let token = wepy.getStorageSync('token');
  if (token) {
    header.Authorization =token
  }
  // 发起请求
  let response = await wepy.request({
      url: 'https://xcx.mifengad.com/api/common/upload/token',
      method:'GET',
      header: header,
  })
  // 响应数据
  const json = response.data
  if (json.code !== 0) {
    tip.toast(json.msg || '请求失败，请重试')
    // 401清除登录信息
    if (json.code === 401) {
      wepy.removeStorageSync('token')
    }
    // 抛出异常，阻止调用者继续执行，调用者可通过.catch抓取该异常后继续执行
    return Promise.reject(json);
  }
  let imgToken = json.data.token;
  let baseUrl  = json.data.baseUrl;
  qiniuUploader.upload(filePath, (res) => {
    console.log('res:',res);
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
};
