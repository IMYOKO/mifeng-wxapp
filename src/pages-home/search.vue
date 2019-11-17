<template>
  <view class="search search-page">
    <view class="top top-search">
      <view class="icon">
        <image class="search-icon" src="../static/images/ic_home_search_2.png" />
      </view>
      <input
        type="text"
        placeholder="请输入广告机名称"
        placeholder-class="input-placeholder"
        v-model="name"
      />
      <view class="search" @tap="clickSearch">搜索</view>
    </view>
    <view class="banner">
      <scroll-view class="sv" scroll-x="true">
        <view
          class="item"
          :class="advertise_machine_label_type_index === -1 ?'selected':''"
          @tap="clickSx(-1)"
        >全部</view>
        <view
          class="item"
          :class="advertise_machine_label_type_index === index?'selected':''"
          v-for="(item, index) in machineType"
          :key="index"
          @tap="clickSx(index)"
        >{{item}}</view>
      </scroll-view>
      <view class="more" @tap="clickShow">
        <image class="banner-img" src="../static/images/ic_more_2.png" />
      </view>
    </view>
    <view class="banner area-picker">
      <view
        class="addresss"
        @click="showMulLinkageThreePicker"
      >{{provincesCitiesDistrict === '' ? '请选择 省 市 区' : provincesCitiesDistrict }}</view>
      <view
        class="item select"
        @tap="clickAllNot"
        v-if="selectItemlength === contentList.length && contentList.length > 0"
      ><image class="select-icon" src="../static/images/ic_home_select.png" />全选</view>
      <view class="item select" @tap="clickAll" v-else>
        <image class="select-icon" src="../static/images/ic_home_not_select.png" />全选
      </view>
    </view>
    <block v-if="isSearch">
      <view class="grey" v-if="false">
        <view class="tit">热门搜索</view>
      </view>
      <view class="hot" v-if="false">
        <view
          class="item"
          v-for="(item, index) in hotList"
          :key="index"
          @tap="clickHotItem(item.name)"
        >{{item.name}}</view>
      </view>
      <view class="grey">
        <view class="tit">搜索历史</view>
        <image
          class="del-icon"
          src="../static/images/ic_home_search_history_delete.png"
          @tap="clickClearHistory"
        />
      </view>
      <view class="history">
        <view
          class="item"
          v-for="(item, index) in history"
          :key="index"
          @tap="clickHistoryItem(item)"
        >{{item}}</view>
      </view>
    </block>
    <view
      class="ct-view"
      v-for="(item, index) in contentList"
      :key="index"
      @tap="clickItem(item.id, index, item.my_cart, item)"
    >
      <view class="ct">
        <image class="logo" :src="item.logo" />
        <view class="content">
          <view class="top">
            <view class="name">{{item.machineName}}</view>
            <view class="mark">{{item.labelType}}</view>
          </view>
          <view class="middle">
            <view class="text">图片价格/天</view>
            <view class="pri">¥{{item.imagePrice}}</view>
          </view>
          <view class="bottom">
            <view class="text">视频组合价格/15s/天</view>
            <view class="pri">¥{{item.videoPrice}}</view>
          </view>
          <view class="bottom">
            <view class="text">霸屏/60s</view>
            <view class="pri">¥{{item.bpPrice || 10}}</view>
          </view>
        </view>
      </view>
      <view class="place">
        <image class="site-icon" src="../static/images/ic_home_location_2.png" />
        <view class="place">{{item.province}}{{item.city}}{{item.district}}{{item.address}}</view>
        <image class="select-icon" src="../static/images/ic_home_select.png" v-if="item.my_cart" />
        <image class="select-icon" src="../static/images/ic_home_not_select.png" v-else />
      </view>
    </view>

    <button class="btn" v-if="isSearch" @tap="clickSure">确定</button>
    <!--加载更多时动画-->
    <BottomLoadMore :show.sync="load_more" message="正在加载"></BottomLoadMore>
    <!--没有更多数据时动画-->
    <BottomNoMore :show.sync="no_more"></BottomNoMore>
    <!--暂无数据显示-->
    <Placeholder :show.sync="is_empty"></Placeholder>

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
          :class="advertise_machine_label_type_index=== -1?'selected':''"
          @tap="clickSx"
        >全部</view>
        <view
          class="classify-item"
          :class="advertise_machine_label_type_index===index?'selected':''"
          :key="index"
          v-for="(item, index) in machineType"
          @tap="clickSx(index)"
        >{{item}}</view>
      </view>
    </view>
    <view
      class="modal-mask"
      @tap="clickHidden"
      catchtouchmove="preventTouchMove"
      v-if="showClassify"
    ></view>

    <mpvue-city-picker
      :themeColor="themeColor"
      ref="mpvueCityPicker"
      :pickerValueDefault="cityPickerValueDefault"
      @onCancel="onCancel"
      @onConfirm="onConfirm"
    ></mpvue-city-picker>
  </view>
</template>

<script>
import Placeholder from "../component/common/placeholder";
import BottomNoMore from "../component/common/bottomNoMore";
import BottomLoadMore from "../component/common/bottomLoadMore";
import mpvueCityPicker from "../component/mpvue-citypicker/mpvueCityPicker.vue";
import tip from "../utils/tip";
export default {
  data() {
    return {
      load_more: false, //加载更多图案
      no_more: false, //没有更多数据
      is_empty: false, //无数据，显示空页面
      start: 0,
      offset: 10,
      contentList: [], //页面列表数据
      hotList: [],
      name: "",
      history: [], //搜索历史
      isSearch: false, //点击搜索后改变  是否显示搜索历史
      historyLength: 8, //搜索历史个数
      adMachineId: [], //选择的广告机id
      material_screenType: null,
      isFree: "",
      machineType: [],
      themeColor: "#007AFF",
      cityPickerValueDefault: [0, 0, 1],
      provincesCitiesDistrict: "",
      province: "",
      city: "",
      district: "",
      showClassify: false,
      advertise_machine_label_type_index: -1,
      ongitude: "",
      latitude: "",
      address: "",
      selectItemlength: 0
    };
  },
  onLoad(option) {
    this.isFree = option.isFree || "";
    this.material_screenType = Number(option.material_screenType);
    let position = uni.getStorageSync("position") || null;
    if (position) {
      this.address = position.site;
      this.longitude = position.longitude;
      this.latitude = position.latitude;
    }
    this.getCartList();
    //获取机器分类
    this.getMachineType();
  },
  methods: {
    //头部筛选
    clickSx(index) {
      this.advertise_machine_label_type_index = index;
      this.isSearch = true;
      this.start = 0;
      this.getMachineList(0, true);
    },
    clickShow() {
      this.showClassify = true;
    },
    clickHidden() {
      this.showClassify = false;
    },
    onCancel(e) {},
    showMulLinkageThreePicker() {
      this.$refs.mpvueCityPicker.show();
    },
    onConfirm(e) {
      // this.provincesCitiesDistrict = e.label;
      this.cityPickerValueDefault = e.value;
      if (this.cityPickerValueDefault[0] > 0) {
        const cityArr = e.label.split("-");
        this.province = cityArr[0];
        this.city = this.cityPickerValueDefault[1] === 0 ? '' : cityArr[1];
        this.district = this.cityPickerValueDefault[2] === 0 ? '' : cityArr[2];
        let provincesCitiesDistrict = this.province
        if (this.city) {
          provincesCitiesDistrict += '-' + this.city
        }
        if (this.district) {
          provincesCitiesDistrict += '-' + this.district
        }
        this.provincesCitiesDistrict = provincesCitiesDistrict

      } else {
        this.province = '';
        this.city = '';
        this.district = '';
        this.provincesCitiesDistrict = '全国'
      }
      this.start = 0;
      this.getMachineList(0, true);
    },
    clickAll() {
      this.adMachineId = this.contentList.filter(item => (item.my_cart = 1));
      this.selectItemlength = this.adMachineId.length;
    },
    clickAllNot() {
      this.contentList.map(item => (item.my_cart = 0));
      this.adMachineId = [];
      this.selectItemlength = 0;
    },
    async getMachineType() {
      try {
        const res = await this.$server.getMachineLabels();
        this.machineType = res.data.data.machineLabels;
      } catch (error) {}
    },
    //点击广告机
    clickItem(id, index, my_cart, item) {
      let mycart = my_cart;
      if (mycart === 1) {
        //已选取
        let flagIndex = this.adMachineId.indexOf(id);
        this.adMachineId.splice(flagIndex, 1);
        this.contentList[index].my_cart = 0;
        this.selectItemlength -= 1;
      } else {
        this.adMachineId.push(item);
        this.contentList[index].my_cart = 1;
        this.selectItemlength += 1;
      }
    },
    //点击热门
    clickHotItem(e) {
      this.name = e.currentTarget.dataset.name;
      this.start = 0;
      this.isSearch = true;
      this.getMachineList(0, true);
    },
    //输入搜索内容
    inputSearch(e) {
      this.name = e.detail.value;
    },
    //点击搜索
    clickSearch() {
      if (!this.name) {
        return;
      }
      this.isSearch = true;
      let history = uni.getStorageSync("history") || [];
      let isRepeat = false;
      for (var i in history) {
        if (this.name === history[i]) {
          //已有搜索历史
          history.splice(i, 1);
          history.unshift(this.name);
          isRepeat = true;
          break;
        }
      }
      if (!isRepeat) {
        if (history.length >= this.historyLength) {
          history.splice(0, 1);
        }
        history.unshift(this.name);
      }
      this.history = history
      this.start = 0;
      this.getMachineList(0, true);
    },
    //清空搜索历史
    clickClearHistory() {
      let history = [];
      this.history = [];
      wx.setStorageSync('history', history);
    },
    //点击搜索历史列表
    clickHistoryItem(name) {
      this.isSearch = true;
      this.name = name;
      this.getMachineList(0, true);
    },
    //确定
    async clickSure() {
      if (this.adMachineId.length <= 0) {
        tip.toast("请选择广告机");
        return;
      }
      uni.setStorageSync("adMachineId", this.adMachineId);
      uni.setStorageSync("selectDate", []);
      await tip.success("添加成功");
      uni.redirectTo({
        url: "/pages-home/postAd"
      });
    },
    //获取购物车的广告机
    async getCartList() {
      const contentList = uni.getStorageSync("adMachineId") || [];
      this.contentList = contentList;

      contentList.map(item => {
        if (this.adMachineId.indexOf(item.id) == -1) {
          this.adMachineId.push(item.id);
        }
      });
    },
    //获取广告机列表
    async getMachineList(start, refresh) {
      try {
        let payload;
        if (this.isFree == "") {
          payload = {
            longitude: this.longitude,
            latitude: this.latitude,
            labelType:
              this.advertise_machine_label_type_index >= 0
                ? this.machineType[this.advertise_machine_label_type_index]
                : "",
            machineName: this.name,
            screenType: this.material_screenType,
            province: this.province,
            city: this.city,
            district: this.district,
            start,
            offset: this.offset
          };
        } else {
          payload = {
            screenType: this.material_screenType,
            start,
            offset: this.offset
          };
        }
        console.log(payload);
        let res;
        if (this.isFree == "") {
          res = await this.$server.getMachinesList(payload);
        } else {
          res = await this.$server.getMyMachinesList(payload);
        }
        if (refresh) {
          this.contentList = res.data.data.item;
        } else {
          this.contentList = [...this.contentList, ...res.data.data.item];
        }
        if (this.isFree != "") {
          this.contentList.map(item => (item.notDel = true));
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
    //获取热门
    async getHostList() {
      this.hotList = [];
    }
  },
  components: {
    Placeholder,
    BottomNoMore,
    BottomLoadMore,
    mpvueCityPicker
  }
};
</script>

<style lang="less" scoped>
page {
  padding-bottom: 92rpx;
  box-sizing: border-box;
}
.search-page {
  padding-top: 244rpx;
  padding-bottom: 94rpx;
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
      &.select {
        width: 178rpx;
        display: flex;
        align-items: center;
        .select-icon{
          width: 40rpx;
          height: 40rpx;
          margin-right: 10rpx;
        }
      }
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
  .area-picker {
    border-top: 1rpx solid #e5e5e5;
    top: 161rpx;
    padding: 0 40rpx;
    display: flex;
    align-items: center;
    .addresss {
      flex: 1;
      height: 80rpx;
      line-height: 80rpx;
      font-size: 28rpx;
      color: #666666;
    }
  }
.top {
  width: 100%;
  height: 85rpx;
  background: rgba(255, 255, 255, 1);
  box-shadow: 0px 1px 0px 0px rgba(229, 229, 229, 1);
  display: flex;
  align-items: center;
  padding-left: 20rpx;
  box-sizing: border-box;
  border-bottom: 1rpx solid #e5e5e5;
  &.top-search {
    position: fixed;
    left: 0;
    top: 0;
    z-index: 1000;
  }
  .icon {
    height: 60rpx;
    background: rgba(242, 242, 242, 1);
    border-top-left-radius: 10rpx;
    border-bottom-left-radius: 10rpx;
    .search-icon {
      width: 45rpx;
      height: 45rpx;
      padding: 8rpx 5rpx 0 18rpx;
    }
  }
  input {
    height: 60rpx;
    background: rgba(242, 242, 242, 1);
    border-top-right-radius: 10rpx;
    border-bottom-right-radius: 10rpx;
    font-size: 28rpx;
    color: rgba(20, 20, 20, 1);
    flex: 1 0 auto;
  }
  .search {
    width: 100rpx;
    height: 77rpx;
    line-height: 77rpx;
    background-color: #fff;
    text-align: center;
    font-size: 28rpx;
    color: rgba(20, 20, 20, 1);
    flex: 0 0 auto;
  }
}
.grey {
  width: 100%;
  height: 84rpx;
  padding-left: 20rpx;
  padding-right: 30rpx;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  background: rgba(242, 242, 242, 1);
  .tit {
    font-size: 28rpx;
    font-weight: bold;
    color: rgba(102, 102, 102, 1);
    margin-right: auto;
  }
  .del-icon {
    width: 45rpx;
    height: 45rpx;
  }
}
.hot {
  width: 100%;
  min-height: 100rpx;
  background: rgba(255, 255, 255, 1);
  display: flex;
  align-items: center;
  padding: 0rpx 30rpx 15rpx 30rpx;
  flex-wrap: wrap;
  .item {
    height: 50rpx;
    line-height: 50rpx;
    background: rgba(245, 245, 245, 1);
    padding: 0 16rpx;
    box-sizing: border-box;
    text-align: center;
    margin-top: 20rpx;
    font-size: 26rpx;
    color: rgba(153, 153, 153, 1);
    margin-right: 30rpx;
  }
}
.history {
  width: 100%;
  padding-left: 20rpx;
  box-sizing: border-box;
  background-color: #fff;
  .item {
    width: 100%;
    height: 87rpx;
    line-height: 87rpx;
    font-size: 28rpx;
    color: rgba(153, 153, 153, 1);
    border-bottom: 1rpx solid #e5e5e5;
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
</style>
