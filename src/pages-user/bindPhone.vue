<template>
  <view class = "container">
    <view class="section top">
      <image class="icon_logo" src="../static/images/pic_sign_in_logo_1.png" />
      <view class="text">蜜蜂广告</view>
      <view class = "company">深圳市天青色网络科技有限公司</view>
    </view>
    <view class="section line"></view>
    <view class="section body">
      <view class="text">该程序将获取以下授权：</view>
      <view class="text_group">
        <text class="dot"></text>
        <text class="subtext">获得你的公开信息（手机号码）</text>
      </view>
    </view>
    <view class = "btn-view">
      <button class="login_btn btn" open-type="getPhoneNumber" @getphonenumber="getPhoneNumber">允许</button>
    </view>
  </view>
</template>
<script>
import tip from '../utils/tip';
import {
  USER_TOKEN,USER_INFO,EXPIRE
} from '../utils/constant';
export default {
  config: {
    navigationBarTitleText: '绑定手机号码',
  },
  methods: {
    async login () {
      return new Promise((reslove, reject) => {
        uni.login({
          provider: 'weixin',
          success: (loginRes) => {
            reslove({code: loginRes.code})
          },
          fail: () => {
            reject({ code: null})
          }
        })
      })
    },
    async getPhoneNumber(e) {
      // 调用一次注册
      try {
        const loginRes = await this.login();
        if(loginRes){
            const { code } = loginRes
            await this.$server.register({code})
            const payload = {
                encryptedData: e.detail.encryptedData,
                iv: e.detail.iv,
            }
            const setUserPhoneRes = await this.$server.setUserPhone(payload);
            const userInfo = uni.getStorageSync('userInfo')
            userInfo.phone = setUserPhoneRes.data.data.phoneNumber;
            console.log(setUserPhoneRes.data.data.phoneNumber);
            console.log(userInfo);
            uni.setStorageSync('userInfo', userInfo)
            // console.log(uni.getStorageSync('userInfo'))
            tip.success('绑定成功');
            uni.navigateBack();
        }
      } catch (error) {
        tip.error('绑定失败')
      }
    }
  }
}

</script>
<style lang="less">
.container{
  min-height: 100%;
  background-color: #fff;
}
.section {
  width: 88%;
  margin: 0 auto;
}
.top {
  display: flex;
  align-items: center;
  flex-direction: column;
  padding-top: 91rpx;
  .icon_logo {
    width:176rpx;
    height:176rpx;
  }
  .text{
    margin-top: 36rpx;
    font-size:32rpx;
    color:rgba(0,0,0,0.87);
    font-weight: bold;
  }
  .company{
    font-size:24rpx;
    color:rgba(155,155,155,1);
    text-align: center;
    margin-top: 25rpx;
  }
  .subtext {
    margin-top: 25rpx;
    font-size: 24rpx;
    color:rgba(155,155,155,1);
  }
}
.line {
  margin: 47rpx auto;
  border-bottom: 4rpx solid rgba(229,229,229,1);
}
.body {
  display: flex;
  flex-direction: column;
  .text {
    font-size: 28rpx;
    color:rgba(0,0,0,0.87);
  }
  .text_group {
    display: flex;
    align-items: center;
    margin-top: 34rpx;
    .dot{
      display: inline-block;
      width: 10rpx;
      height:10rpx;
      border-radius: 10rpx;
      background:rgba(246, 210, 24, 1);
      margin-right: 26rpx;
    }
    .subtext {
      font-size: 22rpx;
      color:rgba(155,155,155,1);
    }
  }
}
.btn-view{
  width:95%;
  margin: 0 auto;
  display: flex;
  justify-content: space-around;
  .btn{
    width:675rpx;
    height:92rpx;
    border-radius:5rpx;
    line-height: 92rpx;
    margin-top: 70rpx;
    font-size:32rpx;
    border-radius:4rpx;
  }
  .login_btn{
    background-color: rgba(246, 210, 24, 1);
    color: #FFF;
  }
  .refuse_btn{
    background:rgba(216,216,216,1);
    color:#fff;
  }
}

</style>
