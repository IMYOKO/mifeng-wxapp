<template>
  <view class="myWallet">
    <view class="top">
      <image class="bg-img" src="../static/images/pic_my_wallet_background.png" />
      <view class="balance" @tap="clickBalance">
        <image class="balance-icon" src="../static/images/ic_my_wallet_remainder.png" />
        <view class="balance-text">余额明细</view>
      </view>
      <view class="money">
        <view class="num">{{userInfo.amountYe || 0}}</view>
        <view class="text">我的余额</view>
      </view>
    </view>
    <button class="btn" @tap="clickCz">充值</button>
    <button class="btn tx" @tap="clickTx">提现</button>
    <view class="href-text" @tap="clickMycard">我的银行卡</view>
    <view class="href-text" @tap="clickSetPass">设置支付密码</view>
  </view>
</template>

<script>
import { updateUserInfo, getUserInfo } from "../utils/user";
export default {
  data() {
    return {
      userInfo: null
    };
  },
  async onShow() {
    await this.getUserInfo();
    this.userInfo = getUserInfo();
  },
  methods: {
    //获取用户信息
    async getUserInfo() {
      const json = await this.$server.getUserAssets();
      updateUserInfo(json.data.data);
    },
    clickBalance() {
      this.$CommonJs.pathTo("/pages-user/balanceDetail");
    },
    clickCz() {
      this.$CommonJs.pathTo("/pages-user/recharge");
    },
    clickTx() {
      this.$CommonJs.pathTo("/pages-user/earningDetail");
    },
    clickMycard() {
      this.$CommonJs.pathTo("/pages-user/myCard");
    },
    clickSetPass() {
      this.$CommonJs.pathTo("/pages-user/setPayPass?type=2");
    }
  }
};
</script>

<style lang="less" scoped>
.top {
  width: 100%;
  height: 597rpx;
  position: relative;
  .bg-img {
    width: 100%;
    height: 597rpx;
  }
  .balance {
    width: 195rpx;
    height: 60rpx;
    background: rgba(20, 20, 20, 1);
    border-radius: 100rpx 0px 0px 100rpx;
    display: flex;
    align-items: center;
    position: absolute;
    top: 35rpx;
    right: 0;
    .balance-icon {
      width: 30rpx;
      height: 30rpx;
      margin-left: 30rpx;
      margin-right: 10rpx;
    }
    .balance-text {
      font-size: 24rpx;
      color: rgba(255, 255, 255, 1);
    }
  }
  .money {
    width: 270rpx;
    height: 270rpx;
    border-radius: 50%;
    background: rgba(255, 214, 2, 1);
    position: absolute;
    top: 164rpx;
    left: 240rpx;
    .num {
      font-size: 50rpx;
      font-weight: bold;
      color: rgba(20, 20, 20, 1);
      text-align: center;
      padding-top: 88rpx;
    }
    .text {
      margin-top: 11rpx;
      font-size: 24rpx;
      color: rgba(20, 20, 20, 1);
      text-align: center;
    }
  }
}
.btn {
  width: 675rpx;
  height: 92rpx;
  height: 92rpx;
  background: rgba(255, 214, 2, 1);
  border-radius: 5rpx;
  font-size: 36rpx;
  color: rgba(20, 20, 20, 1);
  margin-top: 32rpx;
}
.tx {
  background: rgba(255, 255, 255, 1);
}
.href-text {
  font-size: 28rpx;
  color: rgba(102, 102, 102, 1);
  text-align: center;
  margin-top: 68rpx;
  text-decoration: underline;
}
</style>
