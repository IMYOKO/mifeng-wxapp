<template>
  <view>
    <view class = "img" v-if="type === 1 || type === 2">
      <image class = "images" :src="logo" :style = "windowHeight" />
    </view>
    <view class = "group" v-if="type === 5">
      <video :src="video"></video>
      <image class = "images" :src="logo" />
    </view>
    <view class = "video" v-if="type === 3 || type === 4">
      <video :src="video"></video>
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
    }
  },
  async onLoad(options) {
    let systemInfo = uni.getSystemInfoSync();
    this.windowHeight = `height:${Math.ceil(systemInfo.windowHeight/(systemInfo.windowWidth/750))}rpx`
    this.type = options.type;
    if(this.type == 2){
      this.pace = 0.8; //滚动速度
    }
    this.logo = options.logo;
    this.video = options.video;
    const json = await request({
      url:'scrolling_text',
      method:'GET',
    });
    this.name = json.data.content;
    this.logoImg = json.data.picture.logo;
    this.codeImg = json.data.picture.qr_code;
    // this.startMarquee()
  },
//根据viewId查询view的宽度
  queryViewWidth(viewId) {
    //创建节点选择器
    return new Promise(function(resolve) {
      var query = uni.createSelectorQuery();
      var that = this;
      query.select('.' + viewId).boundingClientRect(function(rect) {
        resolve(rect.width);
      }).exec();
    });
  },
  //停止跑马灯
  stopMarquee() {
    var that = this;
    //清除旧的定时器
    if (that != null) {
      clearInterval(that.interval);
    }
  },
  //执行跑马灯动画
  excuseAnimation() {
    var that = this;
    // if (that.length > that.windowWidth) {
    //   //设置循环
      let interval = setInterval(function() {
        if (that.offsetLeft <= 0) {
          if (that.offsetLeft >= -that.length) {
            that.offsetLeft = that.offsetLeft - that.pace
          } else {
            that.offsetLeft = that.windowWidth
          }
        } else {
          that.offsetLeft = that.offsetLeft - that.pace
        }
      }, that.interval);
    // }
  },
  //开始跑马灯
  startMarquee() {
    var that = this;
    that.stopMarquee();
    //初始化数据
    that.windowWidth = uni.getSystemInfoSync().windowWidth;
    that.queryViewWidth('text').then(function(resolve) {
      that.length = resolve;
      that.excuseAnimation();
    });
  }
}

</script>
<style lang="less">
page{
  background-color: #fff;
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
    opacity:0.6;
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
    opacity:0.6;
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
