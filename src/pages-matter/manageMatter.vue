<template>
  <view>
    <view class="content" :style="{height: contentHeight + 'rpx'}">
      <view
        class="ct-view"
        v-for="(item, index) in contentList"
        :key="index"
        :data-id="item.id"
        :data-index="index"
        @tap="clickItem"
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
    <view class="btm">
      <image
        class="all-icon"
        src="../static/images/ic_home_select.png"
        v-if="isAll"
        @tap="clickAll"
      />
      <image class="all-icon" src="../static/images/ic_home_not_select.png" v-else @tap="clickAll" />
      <view class="text" @tap="clickAll">全选</view>
      <view class="del" @tap="clickDel">删除</view>
    </view>
  </view>
</template>
<script>
import request from "../utils/request";
import tip from "../utils/tip";
import { USER_TOKEN, USER_INFO, USER_SPECICAL_INFO } from "../utils/constant";
import bottomLoadMore from "../components/common/bottomLoadMore";
import bottomNoMore from "../components/common/bottomNoMore";
import placeholder from "../components/common/placeholder";
export default {
  config: {
    navigationBarTitleText: "管理素材"
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
      start: 0,
      contentList: [], //页面列表数据
      type: "", //1 图片素材  2组合素材
      idArr: [], //选择的id
      isAll: false, //全选
      offset: 10,
      contentHeight: 0
    };
  },
  onLoad(options) {
    this.type = Number(options.type);
    if (this.type === 0) {
      uni.setNavigationBarTitle({
        title: "管理全部素材"
      });
    }
    if (this.type === 1) {
      uni.setNavigationBarTitle({
        title: "管理竖屏图片素材"
      });
    }
    if (this.type === 2) {
      uni.setNavigationBarTitle({
        title: "管理横屏图片素材"
      });
    }
    if (this.type === 3) {
      uni.setNavigationBarTitle({
        title: "管理竖屏视频素材"
      });
    }
    if (this.type === 4) {
      uni.setNavigationBarTitle({
        title: "管理横屏视频素材"
      });
    }
    if (this.type === 5) {
      uni.setNavigationBarTitle({
        title: "管理组合素材"
      });
    }
  },
  onShow() {
    this.start = 0;
    this.getMatterList(0, true);
  },

  methods: {
    //点击素材
    clickItem(e) {
      let id = e.currentTarget.dataset.id;
      let index = e.currentTarget.dataset.index;
      let flag = this.idArr.indexOf(id);
      if (flag == -1) {
        //不存在  之前未选择
        this.idArr.push(id);
        this.contentList[index].isSelected = true;
      } else {
        this.idArr.splice(flag);
        this.contentList[index].isSelected = false;
      }
    },
    //全选
    clickAll() {
      this.isAll = !this.isAll;
      this.idArr = [];
      if (this.isAll) {
        //全选
        for (var i in this.contentList) {
          this.contentList[i].isSelected = true;
          this.idArr.push(this.contentList[i].id);
        }
      } else {
        //全不选
        for (var i in this.contentList) {
          this.contentList[i].isSelected = false;
        }
      }
    },
    async clickDel() {
      if (this.idArr.length <= 0) {
        tip.toast("请选择素材");
        return;
      }
      await tip.confirm("确定删除该素材？");
      const payload = { ids: this.idArr.join(",") };
      console.log(payload);
      try {
        await this.$server.delMaterials(payload);
        tip.success("删除成功");
        this.start = 0;
        this.isAll = false;
        this.getMatterList(0, true);
      } catch (error) {}
    },
    async getMatterList(start, refresh) {
      const payload = {
        auditStatus: 1,
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
        if (this.start === 0 && response.data.data.isNext == 0) {
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
    this.getMatterList(0, true);
    setTimeout(() => {
      wepy.stopPullDownRefresh();
    }, 1000);
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {
    if (!this.no_more && !this.is_empty) {
      this.isAll = false;
      this.start += 1;
      this.getMatterList(this.start, false);
    }
  }
};
</script>
<style lang="less">
page {
  padding-bottom: 100rpx;
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
  }
}
.btm {
  width: 100%;
  height: 100rpx;
  background: rgba(255, 255, 255, 1);
  box-shadow: 0px 2px 7px 0px rgba(182, 182, 182, 0.68);
  padding: 0 45rpx;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  position: fixed;
  bottom: 0;
  left: 0;
  .all-icon {
    width: 45rpx;
    height: 45rpx;
    flex: 0 0 auto;
  }
  .text {
    width: 120rpx;
    height: 100rpx;
    line-height: 100rpx;
    font-size: 24rpx;
    color: rgba(20, 20, 20, 1);
    margin-left: 20rpx;
    margin-right: auto;
  }
  .del {
    width: 90rpx;
    height: 48rpx;
    line-height: 48rpx;
    background: rgba(254, 56, 36, 1);
    font-size: 24rpx;
    color: rgba(255, 255, 255, 1);
    text-align: center;
  }
}
</style>