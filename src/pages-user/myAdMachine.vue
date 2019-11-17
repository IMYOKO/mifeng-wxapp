<template>
  <view class="myAdMachine">
    <view class="top-button">
      <view class="item">
        <button class="top-btn add" @tap="clickPostFreeAd">免费发布广告</button>
      </view>
    </view>
    <view class="total-wrapper">
      <ul>
        <li>
          <view class="list-item">
            <view class="h5">广告机：(台)</view>
            <view class="h3">{{machineCount}}</view>
          </view>
        </li>
        <li>
          <view class="list-item">
            <view class="h5">在播数：(个)</view>
            <view class="h3">{{playingMaterialsCount}}</view>
          </view>
        </li>
        <li>
          <view class="list-item">
            <view class="h5">在线数：(台)</view>
            <view class="h3">{{machineOnlineCount}}</view>
          </view>
        </li>
        <li>
          <view class="list-item">
            <view class="h5">广告总数：(台)</view>
            <view class="h3">{{materialsCount}}</view>
          </view>
        </li>
        <!-- <li>
          <view class="list-item">
            在播数：<span>dsdas</span> 个
          </view>
        </li>
        <li>
          <view class="list-item">
            在线数：<span>12</span> 台
          </view>
        </li>
        <li>
          <view class="list-item">
            广告总数：<span>100</span> 个
          </view>
        </li> -->
      </ul>
    </view>
    <view
      class="ct-view"
      v-for="(item, index) in contentList"
      :key="index"
      @tap="clickDetail(item.id)"
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
          <view class="bottom">
            <view class="text">霸屏/{{item.bpTime}}s</view>
            <view class="pri">¥{{item.bpPrice}}</view>
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
      contentList: [], //页面列表数据
      machineCount: 0,
      playingMaterialsCount: 0,
      machineOnlineCount: 0,
      materialsCount: 0,
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
    this.getMyMachinesTotal()
  },
  methods: {
    clickPostFreeAd() {
      uni.navigateTo({
        url: "/pages-home/postFreeAd"
      });
    },
    //广告机详情
    clickDetail(id) {
      console.log(id)
      uni.navigateTo({
        url: "/pages-user/myAdMachineDetail?id=" + id
      });
    },
    async getMyMachinesTotal () {
      const res = await this.$server.getMyMachinesTotal()
      this.machineCount = res.data.data.machineCount;
      this.playingMaterialsCount = res.data.data.playingMaterialsCount;
      this.machineOnlineCount = res.data.data.machineOnlineCount;
      this.materialsCount = res.data.data.materialsCount;
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
.myAdMachine {
  padding-top: 100rpx;
}
.total-wrapper {
  // position: fixed;
  // left: 0;
  // top: 80rpx;
  // z-index: 1000;
  background: #fff;
  margin: 0 25rpx;
  padding: 20rpx 0;
  box-shadow: 0rpx 2rpx 10rpx #e7e7e7;
  ul {
    display: flex;
    flex-wrap: wrap;
    li {
      width: 50%;
      padding: 15rpx 0;
      .list-item {
        color: #575757;
        padding: 0 25rpx;

        .h5 {
          font-size: 24rpx;
          color: #575757;
          margin-bottom: 3rpx;
        }
        .h3 {
          font-size: 30rpx;
          color: #000;
        }
      }
    }
  }
}
.top-button {
  width: 100%;
  height: 80rpx;
  background: #141414;
  position: fixed;
  top: 0rpx;
  right: 0;
  white-space: nowrap;
  justify-content: flex-end;
  align-items: center;
  overflow: hidden;
  z-index: 600;

  .item {
    height: 80rpx;
    font-size: 28rpx;
    color: rgba(153, 153, 153, 1);
    margin-right: 10rpx;
    margin-top: 16rpx;
    box-sizing: border-box;
    border-bottom: 6rpx solid #141414;
    .top-btn {
      height: 48rpx;
      line-height: 48rpx;
      text-align: center;
      font-size: 24rpx;
      color: rgba(20, 20, 20, 1);
      background: rgba(246, 246, 246, 1);
      border-radius: 0;
    }
    .add {
      background: rgba(51, 51, 51, 1);
      color: rgba(255, 214, 2, 1);
      float: right;
    }
  }
}
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
