<template>
  <view class="prew-img">
    <view class = "img" v-if="(type === 1 || type === 2) && screenType === 1">
      <image class = "images" :src="logo" @click="previewImage(logo)"/>
    </view>
    <view class = "img min" v-if="(type === 1 || type === 2) && screenType === 2">
      <image class = "images min" :src="logo" @click="previewImage(logo)" />
    </view>
    <view class = "group" v-if="type === 5">
      <video :src="video"></video>
      <image class = "images" :src="logo" @click="previewImage(logo)" />
    </view>
    <view class = "video" v-if="(type === 3 || type === 4)  && screenType === 1">
      <video :src="video" class="videos"></video>
    </view>
    <view class = "video min" v-if="(type === 3 || type === 4)  && screenType === 2">
      <video :src="video" class="videos min"></video>
    </view>

    <view class="shenhe" v-if="auditStatus === 0">
      <view class="input-box">
        <input type="text" placeholder="请输入审核备注" v-model="auditRemark" />
      </view>
      <view class="btn-view">
        <button class="refuse_btn btn" @click="sumbit(2)">不通过</button>
        <button class="login_btn btn" @click="sumbit(1)">通过</button>
      </view>
    </view>
    <view class="shenhe shenhe2" v-if="auditStatus === 1">审核通过</view>
    <view class="shenhe shenhe2" v-if="auditStatus === 2">审核不通过</view>
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
      screenType: null,
      id: null,
      auditStatus: 0,
      auditRemark: ''
    }
  },
  async onLoad(options) {
    let systemInfo = uni.getSystemInfoSync();
    this.windowHeight = `height:${Math.ceil(systemInfo.windowHeight/(systemInfo.windowWidth/750))}rpx`
    this.type = Number(options.type);
    if(this.type === 5){
      this.pace = 0.8; //滚动速度
    }
    this.id = Number(options.id);
    this.getMaterialsForAudit()
  },
  methods: {
    previewImage(url) {
      uni.previewImage({
        urls: [url]
      });
    },
    async getMaterialsForAudit() {
      const payload = {
        id: this.id
      }
      const res = await this.$server.getMaterialsForAudit(payload)
      console.log(res)
      const item = res.data.data.material
      console.log(item)
      this.type = item.materialType
      this.logo = item.logo
      this.video = item.video
      this.screenType = item.screenType
      this.auditStatus = item.auditStatus
    },
    async sumbit (auditStatus) {
      if (this.auditRemark == '') {
        tip.error('请输入审核备注')
        return;
      }
      const payload = {
        id: this.id,
        auditStatus,
        auditRemark: this.auditRemark
      }
      await this.$server.materialAudit(payload)
      tip.success('操作成功')
    }
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

.shenhe {
  padding: 20rpx 0;
  &.shenhe2 {
    text-align: center;
    font-size: 24rpx;
    line-height: 24rpx;
    padding-top: 30px;
  }
}

.input-box {
  width: 95%;
  margin: 0 auto;
  display: flex;
  padding-top: 30rpx;
  input {
    padding: 20rpx;
    width: 100%;
    height: 24rpx;
    line-height: 24rpx;
    border: 1rpx solid #e3e3e4;
    border-radius: 5px;
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
    margin-top: 40rpx;
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
