<template>
  <view>
    <view class="top-button">
      <view class="item">
        <button class="top-btn add" @tap="clickAdd">添加素材</button>
      </view>
    </view>
    <view class="banner">
      <!-- <scroll-view class="sv" scroll-x="true">
        <view
          v-for="(item, index) in tags"
          :key="index"
          @tap="selectTag(index)"
          class="b-item"
          :class="selectedTag == index ? 'selected' : ''"
        >{{item}}</view>
      </scroll-view> -->
    </view>
    <view class="banner-click">
      <view class="banner-item" v-for="(item, index) in tags" :key="index">
        <view class="item-inner">
          <view
            class="item"
            @tap="selectTag(index)"
            :class="{'selected': selectedTag == index}"
          >
            {{item}}
          </view>
        </view>
      </view>
    </view>
    <view class="content" :style="{height: contentHeight + 'rpx'}">
      <view
        class="ct-view"
        v-for="(item, index) in contentList"
        :key="index"
        @tap="clickPre(item)"
        :class="{'min': item.screenType === 2}"
        :style="{left: item.style.left, top: item.style.top}"
      >
        <view class="inner-wrapper">
          <!-- <image
            src="../static/images/pic_zhanwei_2.png"
            class="ct-video"
            v-if="item.materialType === 5"
          /> -->
          <video
            :src="item.video"
            class="ct-video"
            v-if="item.materialType === 5"
          ></video>
          <image
            class="status"
            src="../static/images/pic_material_audit.png"
            v-if="item.auditStatus  === 0"
          />
          <image
            class="status"
            src="../static/images/pic_material_audit_failed.png"
            v-if="item.auditStatus === 2"
          />
          <image
            class="ct-img"
            :class="item.materialType === 5 ? 'group' : ''"
            v-if="(item.materialType === 5 || item.materialType === 1 || item.materialType === 2) && item.screenType === 1"
            :src="item.logo"
          />
          <image
            class="ct-img min"
            :class="item.materialType === 5 ? 'group' : ''"
            v-if="(item.materialType === 5 || item.materialType === 1 || item.materialType === 2) && item.screenType === 2"
            :src="item.logo"
          />
          <video
            class="ct-img"
            v-if="(item.materialType === 3 || item.materialType === 4) && item.screenType === 1"
            :src="item.video"
          ></video>
          <video
            class="ct-img min"
            v-if="(item.materialType === 3 || item.materialType === 4) && item.screenType === 2"
            :src="item.video"
          ></video>
          <view class="tit">{{item.id}}</view>
          <view class="tit min">{{item.createTime}}</view>
          <image @click.stop="clickDel(item.id)" class="delete" src="../static/images/ic_home_search_history_delete.png" />
        </view>
      </view>
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
import tip from "../utils/tip";
import { checkRole } from "../utils/user";
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
      load_more: false, //加载更多图案
      no_more: false, //没有更多数据
      is_empty: false, //无数据，显示空页面
      start: 0,
      //页面列表数据
      contentList: [],
      contentHeight: 0,
      offset: 10,
      type: 0, //0 全部素材 1-竖屏图片、2-横屏图片、3-竖屏视频、4-横屏视频、5-组合素材
      apply_status: 2, // 1,2,3对应未审核，已通过，已拒绝  0-待审核，1-审核通过，2-审核拒绝
      selectedTag: 0,
      tags: [
        "全部素材",
        "横屏图片",
        "横屏视频",
        "竖屏图片",
        "竖屏视频",
        "组合素材"
      ]
    };
  },
  async onShow() {
    await checkRole(true);
    this.getMatterList(0, true);
  },
  methods: {
    //预览
    clickPre(item) {
      this.$CommonJs.pathTo(
        `/pages-matter/preMatter?type=${item.materialType}&logo=${item.logo}&video=${item.video}&name=${item.name}&screenType=${item.screenType}`
      );
    },
    //点击分类筛选
    clickTypeItem(type) {
      this.type = type;
      this.page = 1;
      this.getMatterList(1, true);
    },
    selectTag(index) {
      this.selectedTag = index;
      if (index === 1) {
        this.type = 2
      } else if (index == 2) {
        this.type = 4
      } else if (index == 3) {
        this.type = 1
      } else if (index == 4) {
        this.type = 3
      } else {
        this.type = index;
      }
      this.start = 0;
      this.getMatterList(0, true);
    },
    //点击状态筛选
    clickStatusItem(status) {
      this.apply_status = status;
      this.page = 1;
      this.getMatterList(1, true);
    },
    async clickManager() {
      // await checkRole(true);
      uni.navigateTo({
        url: "/pages-matter/manageMatter?type=" + this.type
      });
    },
    async clickAdd() {
      await checkRole(true);
      uni.navigateTo({
        url: "/pages-matter/addMatter?type=" + this.type
      });
    },
    async getMatterList(start, refresh) {
      const payload = {
        materialType: this.type,
        start,
        offset: this.offset
      };
      try {
        const response = await this.$server.getMaterialsList(payload);
        this.load_more = false;
        if (refresh) {
          this.contentList = response.data.data.item;
        } else {
          this.contentList = [...this.contentList, ...response.data.data.item];
        }
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
        } else {
          this.is_empty = false;
        }
        const tops = [0, 0];
        if (this.contentList.length) {
          this.contentList = this.contentList.map(item => {
            this.computeLeftAndTop(item, tops);
            return item;
          });
        }
        this.contentHeight = Math.max(tops[0], tops[1]);
      } catch (error) {
        this.is_empty = this.start === 0 && this.contentList.length === 0;
        this.no_more = !this.is_empty;
        this.load_more = false;
        return;
      }
    },
    computeLeftAndTop(item, tops) {
      const itemHeight =
        item.materialType === 2 || item.materialType === 4 ? 359 : 724; // 295 660 323 : 688
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
    },
    async clickDel(id) {
      await tip.confirm("确定删除该素材？");
      const payload = { ids: `${id}` };
      console.log(payload);
      try {
        await this.$server.delMaterials(payload);
        tip.success("删除成功");
        this.start = 0;
        this.isAll = false;
        this.getMatterList(0, true);
      } catch (error) {}
    },
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {
    this.start = 0;
    this.getMatterList(0, true);
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
      this.getMatterList(this.start, false);
    }
  }
};
</script>
<style lang="less" scoped>
.top {
  width: 100%;
  height: 80rpx;
  background-color: #141414;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: fixed;
  padding: 0 40rpx 0 60rpx;
  box-sizing: border-box;
  top: 0rpx;
  left: 0;
  z-index: 9999;
  .item {
    height: 80rpx;
    font-size: 28rpx;
    color: rgba(153, 153, 153, 1);
    display: flex;
    align-items: center;
    justify-content: flex-end;
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
      margin-left: 10rpx;
    }
  }
  .selected {
    color: rgba(255, 214, 2, 1);
    border-bottom: 6rpx solid #ffd602;
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
      // margin-left: 10rpx;
      float: right;
    }
  }
}
.banner {
  width: 66%;
  height: 80rpx;
  background: #141414;
  position: fixed;
  top: 0rpx;
  left: 0;
  white-space: nowrap;
  overflow: hidden;
  z-index: 1000;
  .sv {
    padding: 0 10rpx 0 40rpx;
    box-sizing: border-box;
  }
  .b-item {
    width: 140rpx;
    height: 80rpx;
    line-height: 80rpx;
    font-size: 28rpx;
    color: rgba(153, 153, 153, 1);
    display: inline-block;
  }
  ::-webkit-scrollbar {
    width: 0;
    height: 0;
    color: transparent;
  }
  .selected {
    color: rgba(255, 214, 2, 1);
    font-weight: bold;
  }
}
.banner-click {
  width: 100%;
  display: flex;
  background: #fff;
  flex-wrap: wrap;
  position: fixed;
  left: 0;
  top: 80rpx;
  z-index: 1000;

  .banner-item {
    width: 33.33%;

    .item-inner {
      padding: 10rpx;
      .item {
        color: #666;
        height: 68rpx;
        line-height: 68rpx;
        font-size: 24rpx;
        border-radius: 5rpx;
        text-align: center;
        box-shadow: 0px 0px 5px rgba(153, 153, 153, .5);
        &.selected {
          color: rgba(255, 214, 2, 1);
          background: rgba(51, 51, 51, 1);
          font-weight: bold;
        }
      }
    }
  }
}
.content {
  position: relative;
  flex-wrap: wrap;
  padding: 0 15rpx;
  box-sizing: border-box;
  margin-top: 276rpx;
  .ct-view {
    position: absolute;
    width: 340rpx;
    font-size: 0;
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
      z-index: 98;
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
      height: 28rpx;
      color: rgba(51, 51, 51, 1);
      text-overflow: -o-ellipsis-lastline;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      line-clamp: 1;
      -webkit-box-orient: vertical;
      margin-top: 20rpx;
      &.min {
        font-size: 20rpx;
      }
    }
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
</style>