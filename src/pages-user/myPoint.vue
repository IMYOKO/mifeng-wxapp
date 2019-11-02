<template>
  <view>
    <view class="top">
      <image class="bg-img" src="../static/images/pic_my_integral_background.png" />
      <view class="money">
        <view class="num">{{integral || 0}}</view>
        <view class="text">我的积分</view>
      </view>
    </view>
    <view class="item" v-for="(item, index) in contentList" :key="index">
      <view class="item-top">
        <view class="tit">{{item.bussType}}</view>
        <view class="pri">{{item.amount}}</view>
      </view>
      <view class="time">{{item.opTime}}</view>
    </view>
    <!--加载更多时动画-->
    <bottomLoadMore :show.sync="load_more" message="正在加载"></bottomLoadMore>
    <!--没有更多数据时动画-->
    <bottomNoMore :show.sync="no_more"></bottomNoMore>
    <!--暂无数据显示-->
    <placeholder :show.sync="is_empty"></placeholder>
  </view>
</template>
<script>
import { updateUserInfo, getUserInfo } from "../utils/user";
import tip from "../utils/tip";
import bottomLoadMore from "../components/common/bottomLoadMore";
import bottomNoMore from "../components/common/bottomNoMore";
import placeholder from "../components/common/placeholder";
export default {
  config: {
    navigationBarTitleText: "我的积分"
  },
  components: {
    bottomLoadMore: bottomLoadMore,
    bottomNoMore: bottomNoMore,
    placeholder: placeholder
  },
  data() {
    return {
      load_more: false, //加载更多图案
      no_more: false, //没有更多数据
      is_empty: false, //无数据，显示空页面
      page: 1,
      contentList: [], //页面列表数据
      integral: 0
    };
  },
  async onShow() {
    this.page = 1;
    this.getPointList(1, true);
    await this.getUserInfo();
  },
  methods: {
    async getPointList(page, refresh) {
      const res = await this.$server.getUserIntegralBillList({
        start: Number(page) || 0,
        offset: 10
      });
      const list = res.data.data.item;
      if (refresh) {
        this.contentList = list;
      } else {
        this.contentList = [...this.contentList, ...list];
      }
      if (list.length < 10 && list.length != 0) {
        //没有更多数据
        this.no_more = true;
      } else {
        this.no_more = false;
      }
      if (this.page == 1 && list.length == 0) {
        //暂无数据
        this.is_empty = true;
      } else {
        this.is_empty = false;
      }
    },
    //获取用户信息
    async getUserInfo() {
      const res = await this.$server.getUserIntegral();
      this.integral = res.data.data.amountKy;
    }
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {
    this.page = 1;
    this.getPointList(1, true);
    setTimeout(() => {
      uni.stopPullDownRefresh();
    }, 1000);
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {
    let that = this;
    if (!that.no_more && !that.is_empty) {
      that.page += 1;
      that.getPointList(that.page, false);
    }
  }
};
</script>
<style lang="less">
.top {
  width: 100%;
  height: 597rpx;
  position: relative;
  .bg-img {
    width: 100%;
    height: 597rpx;
  }
  .money {
    width: 270rpx;
    height: 270rpx;
    border-radius: 50%;
    background: rgba(255, 214, 2, 1);
    position: absolute;
    top: 164rpx;
    left: 240rpx;
    .num {
      font-size: 50rpx;
      font-weight: bold;
      color: rgba(20, 20, 20, 1);
      text-align: center;
      padding-top: 88rpx;
    }
    .text {
      margin-top: 11rpx;
      font-size: 24rpx;
      color: rgba(20, 20, 20, 1);
      text-align: center;
    }
  }
}
.item {
  width: 710rpx;
  height: 126rpx;
  background: rgba(255, 255, 255, 1);
  border-radius: 10rpx;
  margin: 0 auto;
  margin-top: 23rpx;
  padding: 20rpx;
  box-sizing: border-box;
  .item-top {
    width: 100%;
    display: flex;
    align-items: center;
    .tit {
      font-size: 30rpx;
      font-weight: bold;
      color: rgba(51, 51, 51, 1);
      margin-right: auto;
    }
    .pri {
      font-size: 36rpx;
      font-weight: bold;
      color: rgba(51, 51, 51, 1);
    }
  }
  .time {
    margin-top: 10rpx;
    font-size: 26rpx;
    color: rgba(193, 193, 193, 1);
  }
}
</style>