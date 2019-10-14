import tip from './tip'

// const base_url = 'https://mifeng.mvp45.com/api/frontend/'
const base_url = 'https://xcx.mifengad.com/api/frontend/'

/**
 * obj = {
 *  url: '',
 *  method: '',
 *  data: {},
 *  loading: '',
 * }
 */
export const request = (params) => {
  return new Promise(res => {
    uni.request({
      ...params,
      success: (result) => {
        res(result);
      },
      fail: () => {
        res();
      }
    })
  })
}
export default async (param) => {
  // 加载效果
  if (param.loading !== undefined) {
    tip.loading(param.loading);
  }
  // 添加token请求头
  let header =  { 'Content-Type': 'application/json' }
  let token = uni.getStorageSync('token');
  if (token) {
    // header.Authorization = 'Bearer ' + token
    header.Authorization =token
  }
  // 发起请求
  let response = await request({
      url: base_url + param.url,
      method: param.method || 'GET',
      data: param.data,
      header: header,
  })
  if (param.loading !== undefined) {
    tip.loaded();
  }
  // 响应数据
  const res = response.data
  if (res.code !== 0) {
    tip.toast(res.msg || '请求失败，请重试')
    // 401清除登录信息
    if (res.code === 401) {
      uni.removeStorageSync('userInfo')
    }
    // 抛出异常，阻止调用者继续执行，调用者可通过.catch抓取该异常后继续执行
    return Promise.reject(res);
  }
  return res;
};

