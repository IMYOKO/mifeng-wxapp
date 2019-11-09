<template>
  <view>
    <image class="img" src="../static/images/pic_home_payment_tips.png" />
    <view class="tit">设置密码成功</view>
    <view class="btn-view">
      <button class="btn see" @tap="clickSee">{{operateStr}}</button>
      <button class="btn" @tap="clickBack">返回首页</button>
    </view>
  </view>
</template>
<script>
import request from "../utils/request";
import tip from "../utils/tip";
import { USER_TOKEN, USER_INFO, USER_SPECICAL_INFO } from "../utils/constant";
export default {
  config: {
    navigationBarTitleText: "结果页面"
  },

  data() {
    return {
      type: 1, //1支付时设置密码，2主动设置密码
      operateStr: "查看订单"
    };
  },
  onLoad(options) {
    this.type = options.type || 1;
    this.operateStr = options.type == 1 ? "查看订单" : "查看钱包";
  },
  methods: {
    clickSee() {
      if (this.type == 1) {
        //跳转我的订单
        uni.switchTab({
          url: "/pages/advertise"
        });
      } else {
        //跳转我的钱包
        wx.switchTab({
          url: "/pages/user",
          success: function() {
            setTimeout(() => {
              wx.navigateTo({
                url: "/pages-user/myWallet"
              });
            }, 2000);
          }
        });
      }
    },
    clickBack() {
      uni.switchTab({
        url: "/pages/index"
      });
    }
  }
};
</script>
<style lang="less">
page {
  background-color: #fff;
}
.img {
  width: 390rpx;
  height: 390rpx;
  display: block;
  margin: 0 auto;
  margin-top: 170rpx;
}
.tit {
  font-size: 66rpx;
  color: rgba(51, 51, 51, 1);
  margin-top: 80rpx;
  text-align: center;
}
.ct {
  font-size: 30rpx;
  color: rgba(51, 51, 51, 1);
  margin-top: 16rpx;
  text-align: center;
}
.btn-view {
  width: 65%;
  display: flex;
  align-items: center;
  margin: 0 auto;
  margin-top: 108rpx;
}
.btn {
  min-width: 178rpx;
  height: 88rpx;
  line-height: 88rpx;
  background: rgba(255, 255, 255, 1);
  border-radius: 10rpx;
  border: 1rpx solid #979797;
  font-size: 30rpx;
  color: rgba(102, 102, 102, 1);
}
.see {
  background: rgba(255, 214, 2, 1);
  border: 1rpx solid rgba(255, 214, 2, 1);
  color: rgba(20, 20, 20, 1);
}
</style>
