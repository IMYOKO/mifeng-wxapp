<template>
  <view class="prew-img">
    <view class = "img" v-if="(type === 1 || type === 2) && screenType === 1">
      <image class = "images" :src="logo" />
    </view>
    <view class = "img min" v-if="(type === 1 || type === 2) && screenType === 2">
      <image class = "images min" :src="logo" />
    </view>
    <view class = "group" v-if="type === 5">
      <video :src="video"></video>
      <image class = "images" :src="logo" />
    </view>
    <view class = "video" v-if="(type === 3 || type === 4)  && screenType === 1">
      <video :src="video" class="videos"></video>
    </view>
    <view class = "video min" v-if="(type === 3 || type === 4)  && screenType === 2">
      <video :src="video" class="videos min"></video>
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
    navigationBarTitleText: '素材预览',
  },
  data() {
    return {
      type:'',
      logo:'',
      video:'',
      name:'',
      interval: null,
      pace: 1.2, //滚动速度
      interval: 20, //时间间隔
      size:32, //字体大小in px
      length: 0, //字体宽度
      offsetLeft: 0, //
      windowWidth: 0,
      windowHeight:0,
      logoImg:'',
      codeImg:'',
      screenType: null
    }
  },
  async onLoad(options) {
    let systemInfo = uni.getSystemInfoSync();
    this.windowHeight = `height:${Math.ceil(systemInfo.windowHeight/(systemInfo.windowWidth/750))}rpx`
    this.type = Number(options.type);
    if(this.type === 5){
      this.pace = 0.8; //滚动速度
    }
    this.logo = options.logo;
    this.video = options.video;
    this.screenType = Number(options.screenType);
  }
}

</script>
<style lang="less">
page{
  background-color: #fff;
}
.prew-img {
  padding: 15rpx;
  .img,
  .video {
    width: 715rpx;
    height: 1272rpx;
    display: flex;
    justify-content: center;
    .images,
    .videos {
      width: 715rpx;
      height: 1272rpx;
    }
    &.min {
      height: 402rpx;
      .min {
        height: 402rpx;
      }
    }
  }
}
.images{
  position: relative;
}
.img-logo{
    width:60rpx;
    height:60rpx;
    position: absolute;
    top:10rpx;
    left:10rpx;
  }
  .img-code{
    width:60rpx;
    height:60rpx;
    position: absolute;
    top:10rpx;
    right:10rpx;
  }
.img{
  position: relative;
  .images{
    width:100%;
    /*height:1100rpx;*/
    display: block;
  }
}
.video {
  video{
    width:662rpx;
    height:350rpx;
    background:rgba(20,20,20,1);
    border-radius:7rpx 7rpx 0px 0px;
    display: block;
    margin:0 auto;
    margin-top:20rpx;
    position: relative;
    z-index:999;
  }
}
.group{
  video{
    width:662rpx;
    height:350rpx;
    background:rgba(20,20,20,1);
    border-radius:7rpx 7rpx 0px 0px;
    display: block;
    margin:0 auto;
    margin-top:20rpx;
    position: relative;
    z-index:999;
  }
  .img-logo{
    top:30rpx;
    left:55rpx;
  }
  .img-code{
    top:30rpx;
    right:55rpx;
  }
  .images{
    width:662rpx;
    height:780rpx;
    display: block;
    margin:0 auto;
    margin-top:20rpx;
  }
}
.sv{
  width:100%;
  height:100rpx;
  line-height:100rpx;
  font-size:30rpx;
  font-weight:bold;
  color:rgba(20,20,20,1);
  white-space: nowrap;
}
.rollCon {
  width: 100%;
  height: 60rpx;
  z-index: 100;
  font-size: 34rpx;
  line-height: 60rpx;
  background:rgba(20,20,20,0.6);
  position: absolute;
  bottom:0;
  left:0;
}
.box {
  width: 100%;
  position: relative;
}

.text {
  white-space: nowrap;
  position: absolute;
  top: 0;
  font-size:34rpx;
}
</style>
