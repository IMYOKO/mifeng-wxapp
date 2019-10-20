<template>
  <view class="container">
    <!-- 弹框协议 -->
    <view :if="showModal" class="modal">
      <form class="catchForm" report-submit bindsubmit="catchSubmit">
        <view class="modal_body">
          <view class="modal_header">
            用户注册协议
          </view>
          <scroll-view style="width: 640rpx;height: 642rpx;" scroll-y>
            <view class="modal_content">
              <uParse :parserName="name" :parserContent.sync="content"></uParse>
            </view>
          </scroll-view>
          <view class="modal_footer">
            <button form-type="submit" class="catchBtn">
              <view class="modal_btn">同意此协议</view>
            </button>
          </view>
        </view>
      </form>
    </view>
    <view class="section top">
      <image class="icon_logo" src="../static/images/pic_sign_in_logo_1.png"></image>
      <view class="text">蜜蜂广告</view>
      <view class="company">深圳市天青色网络科技有限公司</view>
    </view>
    <view class="section line"></view>
    <view class="section body">
      <view class="text">该程序将获取以下授权：</view>
      <view class="text_group">
        <text class="dot"></text>
        <text class="subtext">获得你的公开信息（昵称、头像等）</text>
      </view>
    </view>
    <view class="btn-view">
      <button class="login_btn btn" lang="zh_CN" open-type='getUserInfo' bindgetuserinfo="login">允许</button>
    </view>
    <view class="section body">
      <!-- <view class="text">该程序将获取以下授权：</view> -->
      <view class="text_group">
      <radio style="zoom:.5" :value="status" :checked="status" color="#FFD602" />
        <text class="subtext">登录并使用蜜蜂广告小程序默认同意</text>
        <text @tap="showModal" class="subtext" style="color:#E9C300">《注册服务协议》</text>
      </view>
    </view>
  </view>
</template>
<script>
  import tip from '../utils/tip';
  import request from '../utils/request';
  import uParse from '../components/uParse/wxParse';
  import {
    USER_TOKEN,
    USER_INFO,
    EXPIRE
  } from '../utils/constant';
  export default {
    config: {
      navigationBarTitleText: '微信授权登录',
    },
    components: {
      uParse: uParse,
    },
    data () {
      return {
        showModal: true,
        content: '',
        status:true
      }
    },
    methods: {
      async login(e) {
        if (e.detail.errMsg == 'getUserInfo:fail auth deny') {
          tip.toast('请允许授权')
        }
        let pages = getCurrentPages();
        let codeInfo = await uni.login();
        let wxUserInfo = await uni.getUserInfo({
          lang: 'zh_CN'
        });
        let encryptedData = wxUserInfo.encryptedData;
        let iv = wxUserInfo.iv;
        const json = await request({
          url: 'auth/login_mini_app',
          method: 'POST',
          loading: '登录中',
          data: {
            code: codeInfo.code,
            encrypt_data: encryptedData,
            iv: iv,
          }
        });
        uni.setStorageSync('token', json.data.access_token);
        uni.setStorageSync('userInfo', json.data.user);
        await tip.success('登录成功');
        if (pages.length > 1) {
          uni.navigateBack();
        } else {
          uni.switchTab({
            url: './index'
          })
        }

      },
      async catchSubmit(e) {
        let formId = e.detail.formId;
        // console.log('获取formId=' + formId);
        // if (formId == 'the formId is a mock one') {
        //   return;
        // }
        let res = await request({
          url: 'wxForm/store',
          method: 'post',
          data: {
            form_id: formId
          }
        }).then(() => {
          this.showModal = false

        });
      },
      showModal() {
        this.showModal = true
      }
    },
    async getServerAgreement() {
      let res = await request({
        url: 'serviceAgreement/show',
        method: "get",
        data: {
          "key": "register"
        }
      })
      this.content = res.data.content
      this.$invoke('html2wxml', 'htmlParserNotice')
    },
    onLoad() {
      this.getServerAgreement()
    }
  }

</script>
<style lang="less">
  .container {
    background-color: #fff;
  }

  .modal {
    position: fixed;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    background: rgba(20, 20, 20, 0.5);
    z-index: 999;

    form .catchForm,
    form .catchBtn {
      border: none;
      text-align: inherit;
      padding: 0;
      margin: 0;
      line-height: inherit;
      background-color: transparent;
      color: inherit;
      border-radius: 0;
      font-size: inherit;
    }

    form .catchForm,
    form .catchBtn::after {
      border: none;
    }

    .modal_body {
      width: 640rpx;
      height: 866rpx;
      background: rgba(255, 255, 255, 1);
      border-radius: 10rpx;
      position: relative;
      left: 55rpx;
      top: 108rpx;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding-top: 30rpx;
    }

    .modal_header {
      /* width:100%; */
      height: 45rpx;
      font-size: 32rpx;
      font-family: PingFangSC-Medium;
      font-weight: 500;
      color: rgba(51, 51, 51, 1);
      line-height: 45rpx;
    }

    .modal_content {
      margin-top: 30rpx;
      width: 640rpx;
      height: 642rpx;
      box-sizing: border-box;
      padding: 0rpx 46rpx 0rpx 47rpx;
    }
    .modal_footer {
      width: 100%;
      height: 110rpx;
      border-top: 1rpx solid #D8D8D8;
      line-height: 110rpx;
      text-align: center;
    }

    .modal_btn {
      display: inline-block;
      width: 240rpx;
      height: 72rpx;
      text-align: center;
      line-height: 72rpx;
      background: rgba(246, 210, 24, 1);
      border-radius: 42rpx;
      font-size: 32rpx;
      font-family: PingFangSC-Regular;
      font-weight: 400;
      color: rgba(255, 255, 255, 1);
      margin: 0 auto;
    }
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
      width: 176rpx;
      height: 176rpx;
    }

    .text {
      margin-top: 36rpx;
      font-size: 32rpx;
      color: rgba(0, 0, 0, 0.87);
      font-weight: bold;
    }

    .company {
      font-size: 24rpx;
      color: rgba(155, 155, 155, 1);
      text-align: center;
      margin-top: 25rpx;
    }

    .subtext {
      margin-top: 25rpx;
      font-size: 24rpx;
      color: rgba(155, 155, 155, 1);
    }
  }

  .line {
    margin: 47rpx auto;
    border-bottom: 4rpx solid rgba(229, 229, 229, 1);
  }

  .body {
    display: flex;
    flex-direction: column;

    .text {
      font-size: 28rpx;
      color: rgba(0, 0, 0, 0.87);
    }

    .text_group {
      display: flex;
      align-items: center;
      margin-top: 34rpx;

      .dot {
        display: inline-block;
        width: 10rpx;
        height: 10rpx;
        border-radius: 10rpx;
        background: var(--theme_color);
        ;
        margin-right: 26rpx;
      }

      .subtext {
        font-size: 22rpx;
        color: rgba(155, 155, 155, 1);
      }
    }
  }

  .btn-view {
    width: 95%;
    margin: 0 auto;
    display: flex;
    justify-content: space-around;

    .btn {
      width: 675rpx;
      height: 92rpx;
      border-radius: 5rpx;
      line-height: 92rpx;
      margin-top: 70rpx;
      font-size: 32rpx;
      border-radius: 4rpx;
    }

    .login_btn {
      background-color: var(--theme_color);
      color: #FFF;
    }

    .refuse_btn {
      background: rgba(216, 216, 216, 1);
      color: #fff;
    }
  }

</style>
