<template>
  <view>
    <image class = "img" src="../images/pic_home_payment_tips.png"></image>
    <view class = "tit">提交成功</view>
    <view class = "ct">请等待小蜜对您的素材进行审核喔</view>
    <view class = "btn-view">
      <button class = "btn see" @tap = "clickSeeMatter">查看素材</button>
      <button class = "btn" @tap = "clickBack">返回首页</button>
    </view>
  </view>
</template>
<script>
import request from '../utils/request';
import tip from '../utils/tip';
import {
  USER_TOKEN,USER_INFO,USER_SPECICAL_INFO
} from '../utils/constant';
export default {
  config: {
    navigationBarTitleText: '结果页面',
  },
  methods: {
    //查看素材
    clickSeeMatter(){
      wepy.switchTab({
        url:'./matter'
      })
    },
    //返回首页
    clickBack(){
      wepy.switchTab({
        url:'./index'
      })
    }
  }
}

</script>
<style lang="less">
page{
  background-color: #fff;
}
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