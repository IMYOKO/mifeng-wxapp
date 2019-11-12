<template>
  <view class="user">
    <image class="top-bg" src="../static/images/pic_my_background.png" />
    <view class="user">
      <image class="tx" :src="userInfo.avatarUrl" />
      <view class="name">{{userInfo.nickName}}</view>
      <view class="sf">{{userInfo.userLevelName}}</view>
      <button class="dingyue" @click="sendMsg">订阅</button>
    </view>
    <view @tap="clickMyAd">
      <formidTaker>
        <view class="item" v-if="userInfo.userLevel === 1 ||  userInfo.partnerLevel === 1">
          <image class="item-icon" src="../static/images/ic_my_advertising_machine.png" />
          <view class="item-text">我的广告机</view>
        </view>
      </formidTaker>
    </view>
    <view @tap="clickMyWalllet">
      <formidTaker>
        <view class="item">
          <image class="item-icon" src="../static/images/ic_my_wallet.png" />
          <view class="item-text">我的钱包</view>
        </view>
      </formidTaker>
    </view>
    <view @tap="clickMyPoint">
      <formidTaker>
        <view class="item">
          <image class="item-icon" src="../static/images/ic_my_integral.png" />
          <view class="item-text">我的积分</view>
        </view>
      </formidTaker>
    </view>
    <view @tap="clickEarningDetail">
      <formidTaker>
        <view class="item" v-if="userInfo.userLevel !== 0">
          <image class="item-icon" src="../static/images/ic_my_profit.png" />
          <view class="item-text">收益明细</view>
        </view>
      </formidTaker>
    </view>
    <view @tap="clickApplyCoop">
      <formidTaker>
        <view class="item">
          <image class="item-icon hezuo" src="../static/images/ic_my_hezuo.png" />
          <view class="item-text">申请合作</view>
        </view>
      </formidTaker>
    </view>
    <view @tap="clickFeedback">
      <formidTaker>
        <view class="item">
          <image class="item-icon" src="../static/images/ic_my_opinion.png" />
          <view class="item-text">意见反馈</view>
        </view>
      </formidTaker>
    </view>
    <view @tap="clickAboutUs">
      <formidTaker>
        <view class="item">
          <image class="item-icon" src="../static/images/ic_my_about_us.png" />
          <view class="item-text">关于我们</view>
        </view>
      </formidTaker>
    </view>
    <view @tap="clickXieyi">
      <formidTaker>
        <view class="item">
          <image class="item-icon" src="../static/images/fuwuxieyi.png" />
          <view class="item-text">服务协议</view>
        </view>
      </formidTaker>
    </view>
  </view>
</template>

<script>
import tip from "../utils/tip";
import { getUserInfo, updateUserInfo, checkRole } from "../utils/user";
const userMap = {
  0: "一般用户",
  1: "机主",
  2: "经销商",
  3: "区代理",
  4: "市代理",
  5: "省代理",
  6: "合伙人"
};
export default {
  data() {
    return {
      userInfo: null,
      versionOk: false,
      tmplIds: []
    };
  },
  async onShow() {
    await checkRole();
    await this.requestUserInfo();
    this.userInfo = getUserInfo();
    const version = wx.getSystemInfoSync().SDKVersion;
    if (this.$CommonJs.compareVersion(version, '2.8.2') >= 0) {
      this.versionOk = true
    }
    await this.getUserWxTemplate()
    console.log(this.versionOk)
  },
  methods: {
    async getUserWxTemplate () {
      try {
        const res = await this.$server.getUserWxTemplate()
        const templateList = res.data.data.templateList || []
        let tmplIds = []
        templateList.forEach(item => {
          if (item.sfdy === 0) {
            tmplIds.push(item.templateId)
          }
        })
        this.tmplIds = tmplIds
      } catch (error) {
        
      }
    },
    async wxxxdy (result) {
      const payload = { result }
      console.log(payload)
      const res = await this.$server.wxxxdy(payload)
      tip.success('操作成功')
    },
    async requestSubscribeMessage () {
			return new Promise((reslove, reject) => {
				wx.requestSubscribeMessage({
					tmplIds: this.tmplIds,
					success: async res => {
						if (res.errMsg === 'requestSubscribeMessage:ok') {
              await this.wxxxdy(JSON.stringify(res))
							reslove({
								status: 0
							})
						} else {
							reslove({
								status: 0
							})
            }
					},
					fail() {
						reslove({
							status: 0
						})
					}
				})
			})
    },
    async sendMsg () {
      await this.getUserWxTemplate()
      if (this.versionOk) {
        if (this.tmplIds.length > 0) {
          await this.requestSubscribeMessage()
        } else {
          tip.error('您没有新的信息订阅拉！')
        }
      } else {
        tip.error('当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试')
      }
    },
    async requestUserInfo() {
      try {
        const res = await this.$server.getUserInfo();
        const userInfo = res.data.data.userInfo;
        userInfo.userLevelName = userMap[userInfo.userLevel];
        updateUserInfo(userInfo);
      } catch (err) {}
    },
    clickMyAd() {
      this.$CommonJs.pathTo("/pages-user/myAdMachine");
    },
    async clickMyWalllet() {
      await checkRole(true);
      this.$CommonJs.pathTo("/pages-user/myWallet");
    },
    clickApplyCoop() {
      uni.navigateTo({
        url: "/pages-home/applyCoop"
      });
    },
    clickMyPoint() {
      uni.navigateTo({
        url: "/pages-user/myPoint"
      });
    },
    clickEarningDetail() {
      uni.navigateTo({
        url: "/pages-user/earningDetail"
      });
    },
    clickFeedback() {
      uni.navigateTo({
        url: "/pages-user/feedback"
      });
    },
    clickAboutUs() {
      uni.navigateTo({
        url: "/pages-user/aboutUs"
      });
    },
    clickXieyi() {
      uni.navigateTo({
        url: "/pages-user/serveRule"
      });
    }
  }
};
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

    .dingyue {
      padding: 0;
      border: none;
      background: #575757;
      position: absolute;
      top: 142rpx;
      left: 170rpx;
      font-size: 24rpx;
      padding: 0 10px;
      background: ;
      line-height: 48rpx;
      border-radius: 5rpx;
      color: #f6e186;

      &::after {
        border: none;
      }
    }

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
      &.hezuo {
        height: 34rpx;
      }
    }

    .item-text {
      font-size: 26rpx;
      color: rgba(20, 20, 20, 1);
    }
  }
}
</style>
