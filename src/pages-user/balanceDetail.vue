<template>
  <view class="balanceDetail">
    <view class="item" v-for="(item, index) in contentList" :key="index">
      <image class="icon" v-if="item.bussType == '充值'" src="../static/images/ic_my_fine_etail.png" />
      <image class="icon" v-else-if="item.bussType=='提成'" src="../static/images/ic_commission.png" />
      <image class="icon" v-else src="../static/images/ic_my_consumption.png" />
      <view class="middle">
        <view class="tit">{{item.bussType}}</view>
        <view class="ct">{{item.remark}}</view>
        <view class="time">{{item.opTime}}</view>
      </view>
      <view class="pri">+{{item.amount}}</view>
    </view>

    <!--加载更多时动画-->
    <BottomLoadMore :show.sync="load_more" message="正在加载" />

    <!--没有更多数据时动画-->
    <BottomNoMore :show="no_more" />

    <!-- 未发现更多啊数据 -->
    <Placeholder :show="is_empty" />
  </view>
</template>

<script>
import Placeholder from "../component/common/placeholder";
import BottomNoMore from "../component/common/bottomNoMore";
import BottomLoadMore from "../component/common/bottomLoadMore";
export default {
  data() {
    return {
      load_more: false, //加载更多图案
      no_more: false, //没有更多数据
      is_empty: false, //无数据，显示空页面
      page: 0,
      contentList: [] //页面列表数据
    };
  },
  components: {
    Placeholder,
    BottomNoMore,
    BottomLoadMore
  },
  onShow() {
    this.getBalanceList(0, true);
  },
  methods: {
    async getBalanceList(page, refresh) {
      let list = [];
      try {
        const json = await this.$server.getUserAssetsBillList({
          start: page || 0,
          offset: 20
        });
        list = json.data.data.item;
      } catch (err) {
        list = [];
      }
      if (refresh) {
        this.contentList = list;
      } else {
        this.contentList = [...this.contentList, ...list];
      }
      if (list.length < 20 && list.length != 0) {
        //没有更多数据
        this.no_more = true;
      } else {
        this.no_more = false;
      }
      if (this.page == 0 && list.length == 0) {
        //暂无数据
        this.is_empty = true;
      } else {
        this.is_empty = false;
      }
    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh() {
      this.page = 0;
      this.getBalanceList(0, true);
      setTimeout(() => {
        uni.stopPullDownRefresh();
      }, 1000);
    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom() {
      if (!this.no_more && !this.is_empty) {
        this.page += 1;
        this.getBalanceList(this.page, false);
      }
    }
  }
};
</script>

<style lang="less">
.item {
  width: 710rpx;
  height: 179rpx;
  background: rgba(255, 255, 255, 1);
  box-shadow: 0rpx 2rpx 10rpx 0rpx rgba(33, 90, 121, 0.08);
  border-radius: 10rpx;
  margin: 0 auto;
  margin-top: 24rpx;
  padding: 24rpx;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  .icon {
    width: 88rpx;
    height: 88rpx;
    flex: 0 0 auto;
    margin-right: 33rpx;
  }
  .middle {
    margin-right: auto;
    .tit {
      font-size: 30rpx;
      font-weight: bold;
      color: rgba(51, 51, 51, 1);
    }
    .ct {
      font-size: 28rpx;
      color: rgba(102, 102, 102, 1);
      margin: 10rpx 0;
    }
    .time {
      font-size: 26rpx;
      color: rgba(193, 193, 193, 1);
    }
  }
  .pri {
    font-size: 36rpx;
    font-weight: bold;
    color: rgba(51, 51, 51, 1);
  }
}
</style>