<template>
	<view class="home">
		<view class="banner-wrapper">
			<swiper class="swiper"
				:indicator-dots="indicatorDots"
				:indicator-active-color="'#FFD602'"
				:autoplay="autoplay"
				:interval="interval"
				:duration="duration"
			>
				<swiper-item class="swiper-item" v-for="(item, index) in bannerItem" :key='index' @click="goWebView(item)">
					<image :src="item.imageUrl" class="image" />
				</swiper-item>
			</swiper>
		</view>
		<view class="midder">
			<image class = "img1" src = "../static/images/pic_post_1.png" @click="clickPostAd" />
      <image class = "img2" src = "../static/images/pic_application_24.png" @click="clickAddMatter" />
		</view>
		<image class = "img3" src = "../static/images/pic_findus_3.png" @click="clickFindUs" />
	</view>
</template>

<script>
import {checkRole} from '../utils/user';
export default {
	data () {
		return {
			url: './../static/images/pic_addmatter_group_placeholder.png',
			weixinCode: '',
			indicatorDots: true,
			autoplay: true,
			interval: 3000,
			duration: 500,
			bannerItem: [],
			logo: ''
		}
	},
	onLoad () {
		uni.getLocation({
      type: 'wgs84',
      success: res => {
        let latitude = res.latitude;
        let longitude = res.longitude;
        this.loadCity(longitude, latitude);
      }
  	})
	},
	onShow () {
		this.getBanner({type: 1})
	},
	methods: {
		loadCity (longitude, latitude) {
			wx.request({
        url: 'https://restapi.amap.com/v3/geocode/regeo',
        data: {
          key: 'b37e43d28e9ad29f4784eabbc6598b86',
          location: longitude + "," + latitude,
          extensions: "all",
          s: "rsx",
          sdkversion: "sdkversion",
          logversion: "logversion"
        },
        success: res => {
					let position  = {
						latitude:latitude,
						longitude:longitude,
						site:res.data.regeocode.addressComponent.province+res.data.regeocode.addressComponent.city+res.data.regeocode.addressComponent.district+res.data.regeocode.addressComponent.township,
					}
          uni.setStorageSync('position', position);
        },
        fail: function (res) {
          console.log('获取地理位置失败')
        }
      })
		},
		goWebView (item) {
			if (item.linkType === 0) {
				return
			}
			if (item.linkType === 1) {
				this.$CommonJs.pathTo('/pages-home/webView?src=' + item.linkUrl)
				return
			}
			if (item.linkType === 2) {
				return
			}
			if (item.linkType === 3) {
				return
			}
		},
		async getBanner (payload) {
			const res = await this.$server.getBanner(payload)
			this.bannerItem = res.data.data.banner
		},
		async clickPostAd () {
			await checkRole(true);
			this.$CommonJs.pathTo('/pages-home/postAd')
		},
		async clickAddMatter () {
			await checkRole(true);
			this.$CommonJs.pathTo('/pages-matter/addMatter')
		},
		clickFindUs () {
			this.$CommonJs.pathTo('/pages-home/fxUs')
		},
	}
}
</script>

<style lang="less" scoped>
.home {
	height: 100%;
	background: #fff;

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
	.midder {
		width: 702upx;
		display: flex;
		margin: 0 auto;
		margin-top: 25upx;
		.img1{
			width: 340upx;
			height: 180upx;
			margin-right: auto;
		}
		.img2{
			width: 340rpx;
			height: 180rpx;
		}
	}
	.img3{
		width: 702rpx;
		height: 252rpx;
		border-radius: 3rpx;
		display: block;
		margin: 0 auto;
		margin-top: 25rpx;
	}
}
</style>

