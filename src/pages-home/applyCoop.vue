<template>
  <view class="applyCoop">
    <view class="banner-wrapper">
			<swiper class="swiper"
				:indicator-dots="indicatorDots"
				:indicator-active-color="'#FFD602'"
				:autoplay="autoplay"
				:interval="interval"
				:duration="duration"
			>
				<swiper-item class="swiper-item" v-for="(item, index) in bannerItem" :key='index' @click="goWebView(item.img_path)">
					<image :src="item.img_path" class="image" />
				</swiper-item>
			</swiper>
		</view>
    <view class="item">
      <view class="tit">联系人</view>
      <input type="text" maxlength="6" name="linkman"/>
    </view>
    <view class="item">
      <view class="tit">联系电话</view>
      <input type="number"  maxlength="11" name="phone"/>
    </view>
    <button class="btn"  @click="submit">提交申请</button>
  </view>
</template>

<script>
export default {
  data () {
		return {
			weixinCode: '',
			indicatorDots: true,
			autoplay: true,
			interval: 3000,
			duration: 500,
			bannerItem: [
				{
					img_path: 'http://howtos.makeblock.com/945d9a60ca4411e9a54effa3ca0c4aa7'
				},
				{
					img_path: 'http://howtos.makeblock.com/9a37bd60ca4111e9a54effa3ca0c4aa7'
				}
			]
		}
  },
  methods: {
    submit () {
      this.$CommonJs.pathTo('/pages-home/applySuccess')
    }
  }
}
</script>

<style lang="less" scoped>
.applyCoop {
  .banner-wrapper {
		height: 600upx;
		overflow: hidden;
		.swiper {
			height: 600upx;
			overflow: hidden;
			background: #dbdbdb;
		}

		.swiper-item {
			height: 100%;
			.image {
				width: 100%;
				height: 600upx;
				display: block;
			}
		}
  }
  .item{
    width: 80%;
    display: flex;
    align-items: center;
    margin: 0 auto;
    margin-top: 30rpx;
    .tit{
      width: 200rpx;
      font-size: 36rpx;
      font-weight: bold;
      color:rgba(20,20,20,1);
      margin-right: 15rpx;
      flex: 0 0 auto;
    }
    input{
      width: 495rpx;
      height: 84rpx;
      background:rgba(246,246,246,1);
      border-radius: 3rpx;
      border: 2rpx solid #CFCFCF;
      font-size: 36rpx;
      font-weight: bold;
      color:rgba(51,51,51,1);
      padding-left: 37rpx;
      box-sizing: border-box;
    }
  }
  .btn{
    width: 675rpx;
    height: 92rpx;
    line-height: 92rpx;
    background:rgba(255,214,2,1);
    border-radius: 5rpx;
    font-size: 36rpx;
    color:rgba(20,20,20,1);
    margin-top: 50rpx;
  }
}
</style>
