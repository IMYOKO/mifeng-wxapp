<template>
  <view class="paySuccess">
    <image class = "img" src= "../static/images/pic_home_payment_tips.png" />
    <view class = "tit">支付成功</view>
    <view class = "ct">请等待小蜜对您的广告进行投放喔</view>
    <view class = "btn-view">
      <button class = "btn see" @click="clickSee">查看订单</button>
      <button class = "btn" @click="clickBack">返回首页</button>
    </view>
  </view>
</template>

<script>
export default {
  data () {
    return {
      id: -1
    }
  },
  onLoad(options) {
    this.id = options.id;
  },
  methods: {
    //查看订单
    clickSee(){
      uni.navigateTo({
        url:'/pages-advert/adDetail?id='+this.id
      })
    },
    //返回首页
    clickBack(){
      uni.switchTab({
        url:'/pages/index'
      })
    }
  }
}
</script>

<style lang="less" scoped>
.img{
  width:390rpx;
  height:390rpx;
  display: block;
  margin:0 auto;
  margin-top:170rpx;
}
.tit{
  font-size:66rpx;
  color:rgba(51,51,51,1);
  margin-top:80rpx;
  text-align: center;
}
.ct{
  font-size:30rpx;
  color:rgba(51,51,51,1);
  margin-top:16rpx;
  text-align: center;
}
.btn-view{
  width:65%;
  display: flex;
  align-items: center;
  margin:0 auto;
  margin-top:108rpx;
}
.btn{
  width:178rpx;
  height:88rpx;
  line-height:88rpx;
  background:rgba(255,255,255,1);
  border-radius:10rpx;
  border:1rpx solid #979797;
  font-size:30rpx;
  color:rgba(102,102,102,1);
}
.see{
  background:rgba(255,214,2,1);
  border:1rpx solid rgba(255,214,2,1);
  color:rgba(20,20,20,1);
}
</style>
