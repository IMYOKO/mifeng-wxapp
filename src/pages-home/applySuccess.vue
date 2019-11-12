<template>
  <view class="applySuccess">
    <image class="img" src="../static/images/pic_home_payment_tips.png" />
    <view class="tit">提交成功</view>
    <view class="ct">请等待小蜜联系您喔～</view>
    <button class="btn" @click="clickBack">返回首页</button>
  </view>
</template>

<script>
export default {
  data() {
    return {};
  },
  methods: {
    clickBack() {
      uni.switchTab({
        url:'/pages/index'
      })
    }
  }
};
</script>

<style lang="less" scoped>
.applySuccess {
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
  .btn {
    width: 178rpx;
    height: 88rpx;
    line-height: 88rpx;
    background: rgba(255, 255, 255, 1);
    border-radius: 10rpx;
    border: 1rpx solid #979797;
    font-size: 30rpx;
    color: rgba(102, 102, 102, 1);
    margin-top: 108rpx;
  }
}
</style>
