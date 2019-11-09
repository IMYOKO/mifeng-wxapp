<template>
  <view class="myAdMachine">
    <view
      class="ct-view"
      v-for="(item, index) in contentList"
      :key="index"
      :data-id="item.id"
      @tap="clickDetail"
    >
      <image
        class="status"
        src="../static/images/pic_my_advertising_machine_on_line.png"
        v-if="item.onlineStatus === 0"
      />
      <image
        class="status"
        src="../static/images/pic_my_advertising_machine_off_line.png"
        v-else-if="item.onlineStatus === 1"
      />
      <view class="ct">
        <image class="logo" :src="item.logo" />
        <view class="content">
          <view class="top">
            <view class="name">{{item.machineName}}</view>
            <view class="mark mark2">{{item.screenType === 1 ? '竖屏' : '横屏'}}</view>
            <view class="mark">{{item.labelType}}</view>
          </view>
          <view class="middle">
            <view class="text">图片价格/天</view>
            <view class="pri">¥{{item.imagePrice}}</view>
          </view>
          <view class="bottom">
            <view class="text">视频价格/天</view>
            <view class="pri">¥{{item.videoPrice}}</view>
          </view>
          <view class="bottom">
            <view class="text">视频组合价格/15s/天</view>
            <view class="pri">¥{{item.combinePrice}}</view>
          </view>
        </view>
      </view>
      <view class="place">
        <image class="site-icon" src="../static/images/ic_home_location_2.png" />
        <view class="place">{{item.province}}{{item.city}}{{item.district}}{{item.address}}</view>
      </view>
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
      start: 0,
      offset: 10,
      contentList: [] //页面列表数据
    };
  },
  components: {
    Placeholder,
    BottomNoMore,
    BottomLoadMore
  },
  onShow() {
    this.page = 0;
    this.getAdMachineList(0, true);
  },
  methods: {
    //广告机详情
    clickDetail(e) {
      let id = e.currentTarget.dataset.id;
      uni.navigateTo({
        url: "/pages-user/myAdMachineDetail?id=" + id
      });
    },
    async getAdMachineList(start, refresh) {
      try {
        const payload = {
          start,
          offset: this.offset
        };
        const res = await this.$server.getMyMachinesList(payload);

        if (refresh) {
          this.contentList = res.data.data.item;
        } else {
          this.contentList = [...this.contentList, ...res.data.data.item];
        }
        if (res.data.data.isNext === 0) {
          //没有更多数据
          this.no_more = true;
        } else {
          this.no_more = false;
        }
        if (
          this.start === 0 &&
          res.data.data.isNext === 0 &&
          response.data.data.item.length === 0
        ) {
          //暂无数据
          this.is_empty = true;
        } else {
          this.is_empty = false;
        }
      } catch (error) {}
    },
    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh() {
      this.start = 0;
      this.getAdMachineList(0, true);
      setTimeout(() => {
        uni.stopPullDownRefresh();
      }, 1000);
    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom() {
      if (!this.no_more && !this.is_empty) {
        this.start += 1;
        this.getAdMachineList(this.start, false);
      }
    }
  }
};
</script>

<style lang="less" scoped>
.ct-view {
  width: 702rpx;
  min-height: 280rpx;
  background: rgba(255, 255, 255, 1);
  border-radius: 3rpx;
  margin: 0 auto;
  margin-top: 24rpx;
  padding: 25rpx 25rpx 0 25rpx;
  box-sizing: border-box;
  position: relative;
  .status {
    position: absolute;
    width: 161rpx;
    height: 162rpx;
    top: 0;
    left: 0;
  }
  .ct {
    display: flex;
    border-bottom: 1rpx solid #e5e5e5;
    padding-bottom: 24rpx;
    .logo {
      width: 160rpx;
      height: 160rpx;
      margin-right: 24rpx;
      flex: 0 0 auto;
    }
    .content {
      width: 100%;
      .top {
        width: 100%;
        display: flex;
        align-items: center;
        .name {
          width: 340rpx;
          word-wrap: break-word;
          font-size: 28rpx;
          font-weight: bold;
          color: rgba(20, 20, 20, 1);
          margin-right: auto;
        }
        .mark {
          height: 30rpx;
          line-height: 30rpx;
          font-size: 22rpx;
          color: rgba(195, 83, 1, 1);
          background: rgba(255, 242, 225, 1);
          padding: 0 10rpx;
          box-sizing: border-box;
          flex: 0 0 auto;

          &.mark2 {
            margin-right: 2px;
            background: #575757;
            color: #f6e186;
          }
        }
      }
      .middle {
        width: 100%;
        display: flex;
        align-items: center;
        margin-top: 34rpx;
      }
      .bottom {
        width: 100%;
        display: flex;
        align-items: center;
        margin-top: 10rpx;
      }
      .text {
        font-size: 24rpx;
        color: rgba(102, 102, 102, 1);
        margin-right: auto;
      }
      .pri {
        font-size: 24rpx;
        font-weight: bold;
        color: rgba(20, 20, 20, 1);
      }
    }
  }
  .place {
    width: 100%;
    min-height: 50rpx;
    display: flex;
    align-items: center;
    padding: 15rpx 0;
    box-sizing: border-box;
    word-break: break-all;
    .site-icon {
      width: 40rpx;
      height: 40rpx;
      margin-right: 10rpx;
    }
    .place {
      font-size: 24rpx;
      color: rgba(102, 102, 102, 1);
      margin-right: auto;
      word-break: break-all;
    }
    .select-icon {
      width: 40rpx;
      height: 40rpx;
      margin-left: 20rpx;
      flex: 0 0 auto;
    }
  }
}
</style>
