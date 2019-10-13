import util from './util';
import md5 from './md5';
import tip from './tip'

const API_SECRET_KEY = 'www.mall.cycle.com'
const TIMESTAMP = util.getCurrentTime()
const SIGN = md5.hex_md5((TIMESTAMP + API_SECRET_KEY).toLowerCase())
import {USER_INFO} from '../utils/constant';
const wxRequest = async(params = {}, url) => {
    let userInfo = uni.getStorageSync(USER_INFO) || null;
    let session_key = '';
    if(!userInfo){
        session_key = '';
    }else{
       session_key = userInfo.session_key
    }
    if(params.loading){
        tip.loading();
    }
    let data = params.query || {};
    data.sign = SIGN;
    data.time = TIMESTAMP;
    let res = await uni.request({
        url: url,
        method: params.method || 'GET',
        data: data,
        header: {'Content-Type': 'application/json','AUTHORIZATION':session_key,...params.header},
    });
    if(params.loading){
        tip.loaded();
    }
    if(res.data.msg =='登录超时，请重新登录！'){          //登录超时
        wx.clearStorageSync();
        setTimeout(function(){
            uni.navigateTo({
                url:'/pages/login/index'
            });
        },1200)
    }
    return res;
    
};

// 没有loading效果的
const wxRequestNoLoading= async(params = {}, url) => {
  let data = params.query || {};
  data.sign = SIGN;
  data.time = TIMESTAMP;
  let res = await uni.request({
      url: url,
      method: params.method || 'GET',
      data: data,
      header: { 'Content-Type': 'application/json' },
  });
  return res;
};

const uploadFiles = async(filePath,fn,url)=>{
    wx.uploadFile({
        url:url, //仅为示例，非真实的接口地址
        filePath: filePath,
        name: 'file',
        formData:{
          'user': 'test'
        },
        success: function(res){
            let result = JSON.parse(res.data);
            if(result.code == 0){
                if(fn){
                    fn(result.data.url)
                }
                return result.data.url;
            }else{
                tip.error(result.msg);
            }

        }
      })
}


module.exports = {
    wxRequest,
    wxRequestNoLoading,
    uploadFiles
}
