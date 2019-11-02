<template>
  <view class="chooseAdMachine">
    <view class="search-view" @tap="clickSite">
      <image class="site-icon" src="../static/images/ic_home_location_1.png" />
      <view class="place">{{address}}</view>
      <image
        class="search-icon"
        src="../static/images/ic_home_search_1.png"
        @tap.stop="clickSearch"
      />
    </view>
    <view class="banner">
      <scroll-view class="sv" scroll-x="true">
        <view
          class="item"
          :class="advertise_machine_label_type_id==''?'selected':''"
          @tap="clickSx"
        >全部</view>
        <view
          class="item"
          :class="advertise_machine_label_type_id==item.id?'selected':''"
          v-for="(item, index) in machineType"
          :key="index"
          @tap="clickSx(item.id)"
        >{{item.name}}</view>
      </scroll-view>
      <view class="more" @tap="clickShow">
        <image class="banner-img" src="../static/images/ic_more_2.png" />
      </view>
    </view>
    <view class="banner area-picker">
      <view class="item" @tap="clickSx">全选</view>
      <picker
        class="picker"
        mode="selector"
        :range="mapFilter.provinces"
        :value="province"
        @change="provinceChange"
      >选择省</picker>
      <picker
        class="picker"
        mode="selector"
        :range="mapFilter.cities"
        :value="province"
        @change="provinceChange"
      >选择市</picker>
      <picker
        class="picker"
        mode="selector"
        :range="mapFilter.areas"
        :value="province"
        @change="provinceChange"
      >选择区</picker>
    </view>
    <view
      class="ct-view"
      v-for="(item, index) in contentList"
      :key="index"
      @tap="clickItem(item.id, index, item.my_cart)"
    >
      <view class="ct">
        <image class="logo" :src="item.logo" />
        <view class="content">
          <view class="top">
            <view class="name">{{item.name}}</view>
            <view class="mark">{{item.advertise_machine_label_type.name}}</view>
          </view>
          <view class="middle">
            <view class="text">图片价格/天</view>
            <view class="pri">¥{{item.image_price}}</view>
          </view>
          <view class="bottom">
            <view class="text">视频组合价格/15s/天</view>
            <view class="pri">¥{{item.combine_price}}</view>
          </view>
        </view>
      </view>
      <view class="place">
        <image class="site-icon" src="../static/images/ic_home_location_2.png" />
        <view class="place">{{item.province}}{{item.city}}{{item.district}}{{item.site}}</view>
        <image class="select-icon" src="../static/images/ic_home_select.png" v-if="item.my_cart" />
        <image class="select-icon" src="../static/images/ic_home_not_select.png" v-else />
      </view>
    </view>

    <!--加载更多时动画-->
    <BottomLoadMore :show.sync="load_more" message="正在加载"></BottomLoadMore>

    <!--没有更多数据时动画-->
    <BottomNoMore :show.sync="no_more"></BottomNoMore>

    <!--暂无数据显示-->
    <Placeholder :show.sync="is_empty"></Placeholder>

    <button class="btn" @tap="clickSure">确定</button>
    <view class="pop-classify" v-if="showClassify">
      <view class="top">
        <view class="tit">分类</view>
        <image
          class="xx"
          src="../static/images/ic_home_advertising_machine_close.png"
          @tap="clickHidden"
        />
      </view>
      <view class="classify-ct">
        <view
          class="classify-item"
          :class="advertise_machine_label_type_id==''?'selected':''"
          @tap="clickSx"
        >全部</view>
        <view
          class="classify-item"
          :class="advertise_machine_label_type_id==item.id?'selected':''"
          :key="index"
          v-for="(item, index) in machineType"
          @tap="clickSx(item.id)"
        >{{item.name}}</view>
      </view>
    </view>
    <view
      class="modal-mask"
      @tap="clickHidden"
      catchtouchmove="preventTouchMove"
      v-if="showClassify"
    ></view>
  </view>
</template>

<script>
import Placeholder from "../component/common/placeholder";
import BottomNoMore from "../component/common/bottomNoMore";
import BottomLoadMore from "../component/common/bottomLoadMore";
export default {
  data() {
    return {
      showClassify:false,
      load_more: false,    //加载更多图案
      no_more: false,       //没有更多数据
      is_empty: false,     //无数据，显示空页面
      start:0,
      offset: 10,
      contentList:[],    //页面列表数据
      advertise_machine_label_type_id:'',
      address:'',
      longitude:'',
      latitude:'',
      adMachineId:[],     //选择的广告机id
      machineType:[],     //广告机类别
      province: 0,
      mapFilter: {
        provinces: ["请选择", "广东", "湖南", "江西"],
        cities: ["请选择", "深圳", "长沙", "南昌"],
        areas: ["请选择", "宝安", "中心"]
      }
    };
  },
  onLoad() {
    let position = uni.getStorageSync('position') || null;
    if(position){
      this.address = position.site;
      this.longitude = position.longitude;
      this.latitude = position.latitude;
    }
    //获取机器分类
    this.getMachineType();
  },
  onShow(){
    this.start = 0;
    this.getMachineList(0,true);
  },
  methods: {
    //头部筛选
    clickSx(e) {
      console.log(e);
      let id = e.currentTarget.dataset.id;
      this.advertise_machine_label_type_id = id;
      this.start = 0;
      this.getMachineList(0, true);
    },
    provinceChange(e) {
      console.log(e);
    },
    clickShow() {
      this.showClassify = true;
    },
    clickHidden() {
      this.showClassify = false;
    },
    //点击搜索
    clickSearch() {
      console.log("clickSearch");
      this.$CommonJs.pathTo("/pages-home/search");
    },
    //地图选点
    clickSite() {
      let that = this;
      wx.chooseLocation({
        success: res => {
          console.log(res);
          this.address = res.address;
          this.longitude = res.longitude;
          this.latitude = res.latitude;
           this.start = 1;
          this.getMachineList(1,true);
        }
      });
    },
    getMachineList () {
      
    }
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {
    this.start = 0;
    this.getMachineList(0, true);
    setTimeout(() => {
      uni.stopPullDownRefresh();
    }, 1000);  
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {
    if ((!this.no_more) && (!this.is_empty)) {
      this.start += 1;
      this.getMachineList(this.start, false);
    }
  },
  components: {
    Placeholder,
    BottomNoMore,
    BottomLoadMore
  }
};
</script>

<style lang="less" scoped>
.chooseAdMachine {
  padding-top: 160rpx;
  padding-bottom: 110rpx;
  box-sizing: border-box;

  .search-view {
    width: 100%;
    height: 80rpx;
    background: rgba(20, 20, 20, 1);
    display: flex;
    align-items: center;
    padding: 0 24rpx;
    box-sizing: border-box;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 999;
    .site-icon {
      width: 40rpx;
      height: 40rpx;
    }
    .place {
      word-break: break-all;
      width: 500rpx;
      font-size: 26rpx;
      font-weight: bold;
      color: rgba(255, 255, 255, 1);
      margin-left: 26rpx;
      margin-right: auto;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .search-icon {
      width: 45rpx;
      height: 45rpx;
    }
  }
  .banner {
    width: 100%;
    height: 80rpx;
    background: rgba(255, 255, 255, 1);
    position: fixed;
    top: 80rpx;
    left: 0;
    white-space: nowrap;
    overflow: hidden;
    z-index: 2;
    .sv {
      padding: 0 40rpx;
      box-sizing: border-box;
    }
    .item {
      width: 140rpx;
      height: 80rpx;
      line-height: 80rpx;
      font-size: 28rpx;
      color: rgba(102, 102, 102, 1);
      display: inline-block;
    }
    ::-webkit-scrollbar {
      width: 0;
      height: 0;
      color: transparent;
    }
    .more {
      width: 81rpx;
      height: 81rpx;
      background: rgba(255, 255, 255, 1);
      box-shadow: -7px -6px 12px 0px rgba(52, 52, 52, 0.14);
      padding: 20rpx;
      box-sizing: border-box;
      position: absolute;
      right: 0;
      top: 0;
      .banner-img {
        width: 40rpx;
        height: 40rpx;
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
  .btn {
    width: 100%;
    height: 92rpx;
    line-height: 92rpx;
    background: rgba(255, 214, 2, 1);
    font-size: 36rpx;
    color: rgba(20, 20, 20, 1);
    position: fixed;
    border-radius: 0rpx;
    bottom: 0;
    left: 0;
  }
  .pop-classify {
    width: 100%;
    min-height: 180rpx;
    background: rgba(255, 255, 255, 1);
    position: fixed;
    top: 80rpx;
    left: 0;
    z-index: 999;
    padding-bottom: 30rpx;
    box-sizing: border-box;
    .top {
      width: 100%;
      height: 80rpx;
      display: flex;
      align-items: center;
      padding: 0 24rpx;
      box-sizing: border-box;
      .tit {
        font-size: 30rpx;
        font-weight: bold;
        color: rgba(20, 20, 20, 1);
        margin-right: auto;
      }
      .xx {
        width: 30rpx;
        height: 30rpx;
      }
    }
    .classify-ct {
      display: flex;
      align-items: center;
      justify-content: space-around;
      flex-wrap: wrap;
      .classify-item {
        width: 154rpx;
        height: 70rpx;
        line-height: 70rpx;
        background: rgba(246, 246, 246, 1);
        font-size: 28rpx;
        color: rgba(102, 102, 102, 1);
        text-align: center;
        margin-top: 20rpx;
      }
    }
  }
  .modal-mask {
    width: 100%;
    height: 100%;
    position: fixed;
    top: 0;
    left: 0;
    background: #000;
    opacity: 0.5;
    overflow: hidden;
    z-index: 3;
    color: #fff;
  }
  .selected {
    font-weight: bold;
    color: rgba(20, 20, 20, 1);
  }
  .area-picker {
    top: 164rpx;
    padding: 0 40rpx;
    display: flex;
    align-items: center;
  }
  .picker {
    font-size: 28rpx;
    margin-left: 20rpx;
    flex: 1;
    flex-shrink: 0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
</style>
