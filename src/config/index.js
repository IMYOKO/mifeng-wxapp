// 开发环境接口
let BasicUrl = ''
if (process.env.NODE_ENV === 'development') {
  BasicUrl = 'http://x8188088.imwork.net'
  // BasicUrl = 'https://nxcx.mifengad.com/'
} else {
  BasicUrl = 'http://x8188088.imwork.net'
}

export default {
  BasicUrl
}