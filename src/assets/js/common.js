import configData from '../../config/index'

// 路由跳转
const pathTo = url => {
  uni.navigateTo({url});
}

// 公共提示
const showToast = (title, duration = 2000) => {
  uni.showToast({
    title,
    icon: 'none',
    duration
  });
}

// 时间戳转换成时间
const timestampToTime = (timestamp, timeType, showType) => {
  if (timeType) timestamp = timestamp * 1000
  var date = new Date(timestamp) // 时间戳为10位需*1000，时间戳为13位的话不需乘1000
  var Y, M, D, h, m, s
  Y = date.getFullYear() + '-'
  M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-'
  D = date.getDate() + ' '
  if (D < 10) D = `0${D}`
    h = date.getHours()
  if (h < 10) h = `0${h}`
    m = date.getMinutes()
  if (m < 10) m = `0${m}`
    s = date.getSeconds()
  if (s < 10) s = `0${s}`
  if (showType === 'YMD') {
    return Y + M + D
  } else if (showType === 'HMS') {
    return h + ':' + m + ':' + s
  } else if (showType === 'MS') {
    return m + ':' + s
  } else {
    return Y + M + D + h + ':' + m + ':' + s
  }
}

export default {
  pathTo,
  showToast,
  timestampToTime
}