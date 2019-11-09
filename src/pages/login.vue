<template>
  <view class="container">
    <!-- 弹框协议 -->
    <view v-if="showModal" class="modal">
      <form class="catchForm">
        <view class="modal_body">
          <view class="modal_header">用户注册协议</view>
          <scroll-view style="width: 640rpx;height: 642rpx;" scroll-y>
            <view class="modal_content">
              <uParse :content.sync="content"></uParse>
            </view>
          </scroll-view>
          <view class="modal_footer">
            <button form-type="submit" class="catchBtn" @click="catchSubmit">
              <view class="modal_btn">同意此协议</view>
            </button>
          </view>
        </view>
      </form>
    </view>
    <view class="section top">
      <image class="icon_logo" src="../static/images/pic_sign_in_logo_1.png" />
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
      <button class="refuse_btn btn" @click="goHome">拒绝</button>
      <button class="login_btn btn" lang="zh_CN" open-type="getUserInfo" @getuserinfo="login">允许</button>
    </view>
    <view class="section body">
      <view class="text_group">
        <radio style="zoom:.5" :checked="status" @change="agreed" color="#FFD602" />
        <text class="subtext">登录并使用蜜蜂广告小程序默认同意</text>
        <text @click="showModal = true" class="subtext" style="color:#E9C300">《注册服务协议》</text>
      </view>
    </view>
  </view>
</template>
<script>
import uParse from "../components/uParse/wxParse";
export default {
  components: {
    uParse: uParse
  },
  data() {
    return {
      showModal: true,
      content: "",
      status: true,
      openid: null,
      userInfo: null
    };
  },
  methods: {
    agreed() {
      this.status = !this.status;
    },
    goHome() {
      uni.switchTab({ url: "/pages/index" });
    },
    async login(e) {
      if (e.detail.errMsg == "getUserInfo:fail auth deny") {
        this.$CommonJs.showToast("请允许授权");
        return;
      }
      try {
        const payload = {
          username: this.openid
        };
        const res = await this.$server.login(payload);
        uni.setStorageSync("token", res.header.Authorization);
        this.userInfo = e.detail.userInfo;
        await this.$server.setUserInfo(this.userInfo);
        if (res.data.data.phone != "") {
          this.userInfo.phone = res.data.data.phone;
        }
        uni.setStorageSync("userInfo", this.userInfo);
        this.$CommonJs.showToast("登录成功");
        uni.navigateBack();
      } catch (error) {
        console.log(error);
        this.$CommonJs.showToast("登录失败");
      }
    },
    async register(code) {
      try {
        const res = await this.$server.register({ code });
        console.log(res);
        this.openid = res.data.data.openid;
        console.log(this.openid);
        this.showModal = false;
      } catch (error) {
        this.showModal = false;
      }
    },
    catchSubmit() {
      uni.login({
        provider: "weixin",
        success: loginRes => {
          this.register(loginRes.code);
        },
        fail: () => {}
      });
    },
    async getServerAgreement() {
      const res = await this.$server.getArticle({
        type: 2
      });
      this.content = res.data.data.article;
    }
  },
  onLoad() {
    this.getServerAgreement();
  }
};
</script>
<style lang="less">
.container {
  min-height: 100%;
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
    border-top: 1rpx solid #d8d8d8;
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
    width: 340rpx;
    height: 92rpx;
    border-radius: 5rpx;
    line-height: 92rpx;
    margin-top: 70rpx;
    font-size: 32rpx;
    border-radius: 4rpx;
    border: none;
  }

  .login_btn {
    background-color: #e9c300;
    color: #fff;
  }

  .refuse_btn {
    background: rgba(216, 216, 216, 1);
    color: #fff;
  }
}
</style>
