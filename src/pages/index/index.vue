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
				<swiper-item class="swiper-item" v-for="(item, index) in bannerItem" :key='index' @click="goWebView(item.img_path)">
					<image :src="item.img_path" class="image" />
				</swiper-item>
			</swiper>
		</view>
		<view class="midder">
			<image class = "img1" src = "../../static/images/pic_post_1.png" @click="clickPostAd" />
      <image class = "img2" src = "../../static/images/pic_application_2.png" @click="clickApplyCoop" />
		</view>
		<image class = "img3" src = "../../static/images/pic_findus_3.png" @click="clickFindUs" />
	</view>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
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
	onShow () {
		// this.wexinlogin()
	},
	computed: {
		...mapState('User/User', ['isLogin']),
		...mapState('User/User', {
			login2: state => state.isLogin
		})
	},
	methods: {
		...mapMutations('User/User', ['LOGIN']),
		goWebView (url) {
			console.log(url)
		},
		clickPostAd () {
			console.log('clickPostAd')
		},
		clickApplyCoop () {
			console.log('clickApplyCoop')
		},
		clickFindUs () {
			this.$CommonJs.pathTo('/pages-home/fxUs')
		},
		wexinlogin () {
			uni.login({
				provider: 'weixin',
				success: (loginRes) => {
					this.weixinCode = loginRes.code
					this.login()
				},
				fail: () => {
				}
			})
		},
		async login () {
			uni.showLoading({
        title: '请求中...'
			});
			try {
				const data = await this.$server.login({})
				console.log(data)
			} catch (error) {
				console.log(error)
			}
		}
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

