import {USER_INFO} from './constant';
export const getUserInfo = () => uni.getStorageSync(USER_INFO);
export const setUserInfo = (info) => {
    uni.setStorageSync(USER_INFO, info);
};
export const updateUserInfo = (info) => {
    const oldInfo = getUserInfo();
    uni.setStorageSync(USER_INFO, {...oldInfo, ...info});
};
export const checkRole = (checkPhone = false) => {
    let userInfo = getUserInfo() || null;
    if(!userInfo){    //未授权登录
        uni.navigateTo({
            url: '/pages/login'
        })
        return Promise.reject('无授权信息');
    }
    if(checkPhone){
        if(!userInfo.phone){
            uni.navigateTo({
                url: '/pages-user/bindPhone'
            })
            return Promise.reject('无电话信息');
        }
    }
};