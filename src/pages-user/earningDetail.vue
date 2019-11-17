<template>
  <view>
    <!-- <image src="../static/images/pic_banner_1.png" class="bg-img" /> -->
    <!-- <view class="header">
      <view class="h-item">
        <view class="h-text">总收益</view>
        <view class="h-num">{{info.earnings_sum_money}}</view>
      </view>
      <view class="h-item">
        <view class="h-text">上周平均收益</view>
        <view class="h-num">{{info.money_avg}}</view>
      </view>
      <view class="h-line"></view>
    </view> -->
    <view class="new-header">
      <view class="header-bg"></view>
      <view class="header-wrapper">
        <view class="header-inner">
          <image class="ca" src="../static/images/ca.png" />
          <view class="line"></view>
          <view class="shouyi-box">
            <view class="shouyi-item">
              <view class="h1">{{info.earnings_sum_money}}</view>
              <view class="h5">总收益</view>
            </view>
            <view class="shouyi-item">
              <view class="h1">{{info.money_avg}}</view>
              <view class="h5">上周平均收益/台</view>
            </view>
          </view>
      </view>
      </view>
    </view>
    <!-- <view class="tips">注：广告机每天在线时间达到10个小时才会计算当天收益</view> -->
    <view class="charts" v-if="contentList.length">
      <UchartsComponent :cHeight="uchartOpts.height" :cWidth="uchartOpts.width" :opts="uchartOpts"></UchartsComponent>
    </view>
    <view class="item" v-for="(item, index) in contentList" :key="index">
      <view class="item-top">
        <view class="tit">{{item.bussType}}</view>
        <view class="pri">+{{item.amount}}</view>
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
import bottomLoadMore from "../components/common/bottomLoadMore";
import bottomNoMore from "../components/common/bottomNoMore";
import placeholder from "../components/common/placeholder";
import UchartsComponent from "../components/u-charts/component";
export default {
  config: {
    navigationBarTitleText: "收益明细"
  },
  components: {
    bottomLoadMore: bottomLoadMore,
    bottomNoMore: bottomNoMore,
    placeholder: placeholder,
    UchartsComponent
  },

  data() {
    return {
      load_more: false, //加载更多图案
      no_more: false, //没有更多数据
      is_empty: false, //无数据，显示空页面
      page: 0,
      contentList: [], //页面列表数据
      info: {
        earnings_sum_money: 0,
        money_avg: 0
      },
      uchartOpts: {
        width: uni.upx2px(750),
        height: uni.upx2px(200),
        categories: [],
        series: []
      }
    };
  },

  onShow() {
    this.page = 0;
    this.getEarningList(this.page, true);
    this.getInfo();
  },
  methods: {
    async getInfo() {
      let that = this;
      const res = await this.$server.getUserAdIncome();
      this.info = {
        earnings_sum_money: res.data.data.zsy,
        money_avg: res.data.data.avgAmount
      };
    },
    async getEarningList(page, refresh) {
      const res = await this.$server.getUserAdIncomeList({
        start: page || 0,
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
      if (this.page == 0 && list.length == 0) {
        //暂无数据
        this.is_empty = true;
      } else {
        this.is_empty = false;
      }
      this.updateChart();
    },
    updateChart() {
      const categories = [];
      const data = [];
      (this.contentList || []).forEach(item => {
        categories.push(item.opTime);
        data.push(item.amount);
      });
      this.uchartOpts = {
        width: uni.upx2px(750),
        height: uni.upx2px(200),
        categories,
        series: [
          {
            name: "收益明细",
            color: "#ffd602",
            data
          }
        ]
      };
    }
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {
    this.page = 0;
    this.getEarningList(0, true);
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
      that.getEarningList(that.page, false);
    }
  }
};
</script>
<style lang="less">
.bg-img {
  width: 100%;
  height: 140rpx;
  position: fixed;
  z-index: 1;
}
.new-header {
  padding: 40rpx 0 20rpx;

  .header-bg {
    position: absolute;
    left: 0;
    top: 0;
    z-index: -1;
    width: 100%;
    height: 240rpx;
    background: url('../static/images/shouyibg.png') center center no-repeat;
    background-size: 750rpx 240rpx;
  }

  .header-wrapper {
    padding: 0 20rpx;

    .header-inner {
      height: 240rpx;
      overflow: hidden;
      background-color: #ffd602;
      border-radius: 10rpx;
      box-shadow: 1rpx 0 5rpx rgba(255, 214, 2, .5);
      position: relative;

      .ca {
        position: absolute;
        bottom: 0;
        right: 0;
        z-index: 0;
        width: 408rpx;
        height: 206rpx;
      }
      .line {
        width: 1px;
        height: 50rpx;
        background: #000;
        position: absolute;
        top: 50%;
        left: 50%;
        z-index: 0;
        transform: translate(-50%, -50%);
      }
      .shouyi-box {
        position: relative;
        z-index: 10;
        display: flex;
        height: 240rpx;
        align-items: center;
        justify-content: center;
        z-index: 10;

        .shouyi-item {
          width: 50%;
          text-align: center;
          .h1 {
            font-size: 38rpx;
            font-weight: bold;
            margin-bottom: 32rpx;
          }
          .h5 {
            font-size: 24rpx;
          }
        }
      }
    }
  }
}
.header {
  width: 100%;
  height: 140rpx;
  padding: 20rpx 0;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  position: relative;
  z-index: 99;
  .h-item {
    width: 50%;
    .h-text {
      text-align: center;
      font-size: 28rpx;
      color: rgba(153, 153, 153, 1);
    }
    .h-num {
      text-align: center;
      font-size: 40rpx;
      font-weight: bold;
      color: rgba(255, 255, 255, 1);
      margin-top: 6rpx;
    }
  }
  .h-line {
    width: 2rpx;
    height: 54rpx;
    background: rgba(229, 229, 229, 1);
    position: absolute;
    top: 40rpx;
    left: 374rpx;
    z-index: 999;
  }
}
.tips {
  width: 100%;
  height: 60rpx;
  line-height: 60rpx;
  font-size: 24rpx;
  color: rgba(139, 92, 47, 1);
  text-align: center;
  background: linear-gradient(
    136deg,
    rgba(242, 224, 206, 1) 0%,
    rgba(233, 207, 182, 1) 100%
  );
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
.charts {
  background: #ffffff;
}
</style>