// 开发环境接口
let BasicUrl = ''
if (process.env.NODE_ENV === 'development') {
  BasicUrl = 'https://aaa.com'
} else {
  BasicUrl = 'https://bbb.com'
}

export default {
  BasicUrl
}