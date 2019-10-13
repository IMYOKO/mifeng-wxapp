import {USER_INFO} from './constant';
const checkRole = async (checkPhone = false) => {
    let userInfo = uni.getStorageSync(USER_INFO) || null;
    if(!userInfo){    //未授权登录
        uni.navigateTo({
            url: '/pages/login/index'
        })
        return Promise.reject('无授权信息');
    }
    if(checkPhone){
        if(!userInfo.phone){
            uni.navigateTo({
                url: '/pages/bindPhone'
            })
            return Promise.reject('无电话信息');
        }
    }
};

export default checkRole;