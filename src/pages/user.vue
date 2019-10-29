<template>
  <view class="user">
    <image class="top-bg" src="../static/images/pic_my_background.png"/>
    <view class="user">
      <image class="tx" :src="userInfo.avatarUrl"/>
      <view class="name">{{userInfo.nickName}}</view>
      <view class="sf">{{userInfo.userLevelName}}</view>
    </view>
    <view @tap="clickMyAd">
      <formidTaker>
        <view class="item" v-if="userInfo.userLevel > 0">
          <image class="item-icon" src="../static/images/ic_my_advertising_machine.png"/>
          <view class="item-text">我的广告机</view>
        </view>
      </formidTaker>
    </view>
    <view @tap="clickMyWalllet">
      <formidTaker>
        <view class="item">
          <image class="item-icon" src="../static/images/ic_my_wallet.png"/>
          <view class="item-text">我的钱包</view>
        </view>
      </formidTaker>
    </view>
    <view @tap="clickMyPoint">
      <formidTaker>
        <view class="item">
          <image class="item-icon" src="../static/images/ic_my_integral.png"/>
          <view class="item-text">我的积分</view>
        </view>
      </formidTaker>
    </view>
    <view @tap="clickEarningDetail">
      <formidTaker>
        <view class="item" v-if="userInfo.userLevel != 'general'">
          <image class="item-icon" src="../static/images/ic_my_profit.png"/>
          <view class="item-text">收益明细</view>
        </view>
      </formidTaker>
    </view>
    <view @tap="clickFeedback">
      <formidTaker>
        <view class="item">
          <image class="item-icon" src="../static/images/ic_my_opinion.png"/>
          <view class="item-text">意见反馈</view>
        </view>
      </formidTaker>
    </view>
    <view @tap="clickAboutUs">
      <formidTaker>
        <view class="item">
          <image class="item-icon" src="../static/images/ic_my_about_us.png"/>
          <view class="item-text">关于我们</view>
        </view>
      </formidTaker>
    </view>
    <view @tap="clickXieyi">
      <formidTaker>
        <view class="item">
          <image class="item-icon" src="../static/images/fuwuxieyi.png"/>
          <view class="item-text">服务协议</view>
        </view>
      </formidTaker>
    </view>
  </view>
</template>

<script>
import {getUserInfo, updateUserInfo, checkRole} from '../utils/user';
const userMap = {
  0: '一般用户',
  1: '机主',
  2: '经销商',
  3: '区代理',
  4: '市代理',
  5: '省代理',
  6: '合伙人'
}
export default {
  data () {
    return {
      userInfo: null,
    }
  },
  async onShow () {
    await checkRole();
    await this.requestUserInfo();
    this.userInfo = getUserInfo();
  },
  methods: {
    async requestUserInfo () {
      try {
        const res = await this.$server.getUserInfo();
        const userInfo = res.data.data.userInfo;
        userInfo.userLevelName = userMap[userInfo.userLevel];
        updateUserInfo(userInfo);
      } catch (err) {}
    },
    clickMyAd() {
      this.$CommonJs.pathTo('/pages-user/myAdMachine')
    },
    async clickMyWalllet() {
      this.$CommonJs.pathTo('/pages-user/myWallet')
    },
    clickMyPoint() {
      uni.navigateTo({
        url: '/pages-user/myPoint'
      })
    },
    clickEarningDetail() {
      uni.navigateTo({
        url: '/pages-user/earningDetail'
      })
    },
    clickFeedback() {
      uni.navigateTo({
        url: '/pages-user/feedback'
      })
    },
    clickAboutUs() {
      uni.navigateTo({
        url: '/pages-user/aboutUs'
      })
    },
    clickXieyi() {
      uni.navigateTo({
        url: '/pages-matter/adRulse?adtype=1&&adxieyitype=rule'
      })
    }
  }
}
</script>

<style lang="less">
page {
	height: 100%;
	background: #fff;
}
</style>

<style lang="less" scoped>
.user {
  padding-top: 100rpx;
  box-sizing: border-box;

  .top-bg {
    width: 100%;
    height: 210rpx;
    position: fixed;
    top: 0;
    left: 0;
  }

  .user {
    margin-left: 85rpx;
    z-index: 999;
    position: relative;
    margin-bottom: 60rpx;

    .tx {
      width: 136rpx;
      height: 136rpx;
      border-radius: 50%;
    }

    .name {
      font-size: 36rpx;
      font-weight: bold;
      color: rgba(20, 20, 20, 1);
      margin-top: 20rpx;
    }

    .sf {
      font-size: 26rpx;
      color: rgba(153, 153, 153, 1);
      margin-top: 10rpx;
    }
  }

  .item {
    width: 100%;
    padding: 20rpx 85rpx;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    margin-top: 15rpx;

    .item-icon {
      width: 40rpx;
      height: 40rpx;
      margin-right: 35rpx;
    }

    .item-text {
      font-size: 26rpx;
      color: rgba(20, 20, 20, 1);
    }
  }
}
</style>
