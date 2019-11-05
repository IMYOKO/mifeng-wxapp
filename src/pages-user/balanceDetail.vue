<template>
  <view class="balanceDetail">
    <view class="item" v-for="(item, index) in contentList" :key="index">
      <image class="icon" v-if="item.name == '充值'" src="../static/images/ic_my_fine_etail.png" />
      <image class="icon" v-else-if="item.name=='提成'" src="../static/images/ic_commission.png" />
      <image class="icon" v-else src="../static/images/ic_my_consumption.png" />
      <view class="middle">
        <view class="tit">{{item.name}}</view>
        <view class="ct">{{item.content}}</view>
        <view class="time">{{item.created_at}}</view>
      </view>
      <view class="pri" v-if="item.name=='充值'">+{{item.money}}</view>
      <view class="pri" v-else>+{{item.money}}</view>
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
      list.forEach(item => {
        item.add = parseFloat(list[i].amount) > 0;
      });
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

<style lang="less" scoped>
</style>
