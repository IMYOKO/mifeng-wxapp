<template>
  <view class="myAdMachineDetail">
    <scroll-view class="sv-view" :style="{'height': windowHeight-92 + 'rpx'}" scroll-y="true">
      <view class="ct-view">
        <image
          class="status"
          src="../static/images/pic_my_advertising_machine_on_line.png"
          v-if="adInfo.onlineStatus == 0"
        />
        <image
          class="status"
          src="../static/images/pic_my_advertising_machine_off_line.png"
          v-if="adInfo.onlineStatus == 1"
        />
        <view class="ct">
          <image class="logo" :src="adInfo.logo" />
          <view class="content">
            <view class="top">
              <view class="name">{{adInfo.materialName}}</view>
              <view class="mark mark2">{{item.screenType === 1 ? '竖屏' : '横屏'}}</view>
              <view class="mark">{{adInfo.labelType}}</view>
            </view>
            <view class="middle">
              <view class="text">图片价格/天</view>
              <view class="pri">¥{{adInfo.imagePrice}}</view>
            </view>
            <view class="bottom">
              <view class="text">视频价格/天</view>
              <view class="pri">¥{{adInfo.videoPrice}}</view>
            </view>
            <view class="bottom">
              <view class="text">视频组合价格/15s/天</view>
              <view class="pri">¥{{adInfo.combinePrice}}</view>
            </view>
            <view class="bottom">
              <view class="text">霸屏/{{adInfo.bpTime}}s</view>
              <view class="pri">¥{{adInfo.bpPrice}}</view>
            </view>
          </view>
        </view>
        <view class="place">
          <image class="site-icon" src="../static/images/ic_home_location_2.png" />
          <view
            class="place"
          >{{adInfo.province}}{{adInfo.city}}{{adInfo.district}}{{adInfo.address}}</view>
        </view>
      </view>
      <view class="note">机主广告</view>
      <view class="content" :style="{height: contentHeight + 'rpx'}">
        <view
          class="ct-view"
          v-for="(item, index) in contentList"
          :key="index"
          :data-id="item.id"
          :data-index="index"
          :class="{'min': item.screenType === 2}"
          :style="{left: item.style.left, top: item.style.top}"
        >
          <video
            :src="item.video"
            v-if="item.materialType === 3 || item.materialType === 4 || item.materialType === 5"
            :class="item.materialType === 5 ? 'ct-video' : (item.screenType === 2 ? 'ct-img min' : 'ct-img')"
          />
          <image
            class="ct-img"
            v-if="item.materialType === 1 || item.materialType === 2 || item.materialType === 5"
            :class="item.materialType === 5 ? 'group' : (item.screenType === 2 ? 'min' : '')"
            :src="item.logo"
          />
          <cover-image
            v-if="item.isSelected"
            class="select-icon"
            src="../static/images/ic_home_select.png"
          ></cover-image>
          <view class="tit">{{item.materialName}}</view>
          <image class="delete" @click="deleteItem(adInfo.id, item.orderId)" src="../static/images/ic_home_search_history_delete.png" />
        </view>
      </view>
      <view class="note">客户广告</view>
      <view class="content" :style="{height: contentHeight2 + 'rpx'}">
        <view
          class="ct-view"
          v-for="(item, index) in contentList2"
          :key="index"
          :data-id="item.id"
          :data-index="index"
          :class="{'min': item.screenType === 2}"
          :style="{left: item.style.left, top: item.style.top}"
        >
          <video
            :src="item.video"
            v-if="item.materialType === 3 || item.materialType === 4 || item.materialType === 5"
            :class="item.materialType === 5 ? 'ct-video' : (item.screenType === 2 ? 'ct-img min' : 'ct-img')"
          />
          <image
            class="ct-img"
            v-if="item.materialType === 1 || item.materialType === 2 || item.materialType === 5"
            :class="item.materialType === 5 ? 'group' : (item.screenType === 2 ? 'min' : '')"
            :src="item.logo"
          />
          <cover-image
            v-if="item.isSelected"
            class="select-icon"
            src="../static/images/ic_home_select.png"
          ></cover-image>
          <view class="tit">{{item.materialName}}</view>
        </view>
      </view>
      <!--加载更多时动画-->
      <bottomLoadMore :show.sync="load_more" message="正在加载"></bottomLoadMore>
      <!--没有更多数据时动画-->
      <bottomNoMore :show.sync="no_more"></bottomNoMore>
      <!--暂无数据显示-->
      <placeholder :show.sync="is_empty"></placeholder>
    </scroll-view>
    <cover-view class="btn" @tap="clickPostAd(adInfo)">免费发布广告</cover-view>
  </view>
</template>

<script>
import tip from "../utils/tip";
import bottomLoadMore from "../components/common/bottomLoadMore";
import bottomNoMore from "../components/common/bottomNoMore";
import placeholder from "../components/common/placeholder";
export default {
  components: {
    bottomLoadMore: bottomLoadMore,
    bottomNoMore: bottomNoMore,
    placeholder: placeholder
  },
  data() {
    return {
      id: "",
      start: 0,
      offset: 10,
      adInfo: null,
      windowHeight: "",
      contentHeight: 0,
      contentHeight2: 0,
      contentList: [],
      contentList2: [],
      load_more: false, //加载更多图案
      no_more: false, //没有更多数据
      is_empty: false //无数据，显示空页面
    };
  },
  onLoad(options) {
    this.start = 0;
    this.id = Number(options.id);
    this.item;
    this.getAdInfo();
    let systemInfo = uni.getSystemInfoSync();
    this.windowHeight = Math.ceil(
      systemInfo.windowHeight / (systemInfo.windowWidth / 750)
    );
    this.id = Number(options.id);
    this.getAdInfo();
    this.getMyMachineMaterialList(1, 0, true);
    this.getMyMachineMaterialList(0, this.start, true);
  },
  methods: {
    async deleteItem (id, orderId) {
      await tip.confirm("确定删除该广告？");
      const payload = {
        machineId: id,
        orderId
      }
      const res = await this.$server.delMyAd(payload)
      if (res.data.status === 0) {
        this.$CommonJs.showToast('删除成功！')
        this.getMyMachineMaterialList(1, 0, true);
      }
    },
    clickPostAd(item) {
      const newItem = { ...item, notDel: true };
      const adMachineId = [newItem];
      uni.setStorageSync("adMachineId", adMachineId);
      uni.navigateTo({
        url:
          "/pages-home/postFreeAd?id=" +
          this.id +
          "&material_screenType=" +
          newItem.screenType
      });
    },
    async getAdInfo() {
      const res = await this.$server.getMyMachineDetail({ id: this.id });
      this.adInfo = res.data.data.machine;
    },
    async getMyMachineMaterialList(isme, start, refresh) {
      const payload = {
        id: this.id,
        isme,
        start,
        offset: 10
      };
      if (isme === 1) {
        payload.start = 0
        payload.offset = 10000
      }
      try {
        const response = await this.$server.getMyMachineMaterialList(payload);
        this.load_more = false;
        if (refresh) {
          if (isme === 1) {
            this.contentList = response.data.data.item;
          } else {
            this.contentList2 = response.data.data.item;
          }
        } else {
          if (isme === 1) {
            this.contentList = [...this.contentList, ...response.data.data.item];
          } else {
            this.contentList2 = [...this.contentList, ...response.data.data.item];
          }
        }
        if (isme === 0) {
          if (response.data.data.isNext === 0) {
            //没有更多数据
            this.no_more = true;
          } else {
            this.no_more = false;
          }
          if (
            this.start === 0 &&
            response.data.data.isNext === 0 &&
            response.data.data.item.length === 0
          ) {
            //暂无数据
            this.is_empty = true;
            this.no_more = false;
          } else {
            this.is_empty = false;
          }
        }
        let tops = [0, 0];
        if (isme === 1) {
          if (this.contentList.length) {
            this.contentList = this.contentList.map(item => {
              this.computeLeftAndTop(item, tops);
              return item;
            });
          }
          this.contentHeight = Math.max(tops[0], tops[1]);
        } else {
          if (this.contentList2.length) {
            this.contentList2 = this.contentList2.map(item => {
              this.computeLeftAndTop(item, tops);
              return item;
            });
          }
          this.contentHeight2 = Math.max(tops[0], tops[1]);
        }
      } catch (error) {
        if (isme === 0) {
          this.is_empty = this.start === 0 && this.contentList.length === 0;
          this.no_more = !this.is_empty;
          this.load_more = false;
          return;
        }
      }
    },
    computeLeftAndTop(item, tops) {
      const itemHeight =
        item.materialType === 2 || item.materialType === 4 ? 295 : 660;
      if (tops[0] <= tops[1]) {
        item.style = {
          top: tops[0] + "rpx",
          left: 10
        };
        tops[0] = tops[0] + itemHeight;
      } else {
        item.style = {
          top: tops[1] + "rpx",
          left: 370 + "rpx"
        };
        tops[1] = tops[1] + itemHeight;
      }
    }
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {
    this.start = 0;
    this.getMyMachineMaterialList(1, 0, true);
    this.getMyMachineMaterialList(0, 0, true);
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
      this.getMyMachineMaterialList(1, 0, false);
      this.getMyMachineMaterialList(0, this.start, false);
    }
  }
};
</script>

<style lang="less" scoped>
.myAdMachineDetail {
  padding-bottom: 92px;
}
.ct-view {
  width: 100%;
  min-height: 280rpx;
  background: rgba(255, 255, 255, 1);
  border-radius: 3rpx;
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
    align-items: center;
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
.note {
  width: 100%;
  height: 88rpx;
  line-height: 88rpx;
  font-size: 28rpx;
  font-weight: bold;
  color: rgba(20, 20, 20, 1);
  padding-left: 33rpx;
  box-sizing: border-box;
}
.content {
  position: relative;
  display: flex;
  flex-wrap: wrap;
  padding: 0 15rpx 20rpx;
  box-sizing: border-box;
  .ct-view {
    position: absolute;
    width: 340rpx;
    // height:680rpx;
    background: rgba(255, 255, 255, 1);
    border-radius: 3rpx;
    padding: 20rpx;
    box-sizing: border-box;
    margin: 10rpx;
    .status {
      width: 162rpx;
      height: 162rpx;
      position: absolute;
      top: 0;
      right: 0;
    }
    .select-icon {
      width: 45rpx;
      height: 45rpx;
      border-radius: 50%;
      border: 2rpx solid #fff;
      position: absolute;
      top: 35rpx;
      right: 35rpx;
      flex: 0 0 auto;
    }
    .ct-video {
      width: 300rpx;
      height: 169rpx;
    }
    .ct-img {
      width: 300rpx;
      height: 534rpx;
      margin-top: 0;
      display: block;

      &.min {
        height: 169rpx;
      }
    }
    .group {
      height: 365rpx;
    }
    .tit {
      font-size: 24rpx;
      line-height: 28rpx;
      height: 56rpx;
      color: rgba(51, 51, 51, 1);
      text-overflow: -o-ellipsis-lastline;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      line-clamp: 2;
      -webkit-box-orient: vertical;
      margin-top: 20rpx;
    }
    .delete {
      position: absolute;
      bottom: 15rpx;
      right: 15rpx;
      z-index: 100;
      width: 48rpx;
      height: 48rpx;
    }
  }
}
.blank {
  width: 100%;
  height: 92rpx;
}
.btn {
  width: 100%;
  height: 92rpx;
  line-height: 92rpx;
  background: rgba(255, 214, 2, 1);
  font-size: 36rpx;
  color: rgba(20, 20, 20, 1);
  position: fixed;
  bottom: 0;
  left: 0;
  border-radius: 0;
  text-align: center;
  z-index: 999999999;
}
</style>
