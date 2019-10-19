<template>
  <view class="balanceDetail">
    <view class = "item" v-for="(item, index) in contentList" :key="index">
      <image class = "icon"  v-if="item.name == '充值'" src = "../static/images/ic_my_fine_etail.png" />
      <image class = "icon"  v-else-if="item.name=='提成'" src = "../static/images/ic_commission.png" />
      <image class = "icon"  v-else src = "../static/images/ic_my_consumption.png" />
      <view class = "middle">
        <view class = "tit">{{item.name}}</view>
        <view class = "ct">{{item.content}}</view>
        <view class = "time">{{item.created_at}}</view>
      </view>
      <view class = "pri" v-if="item.name=='充值'">+{{item.money}}</view>
      <view class = "pri" v-else>+{{item.money}}</view>
    </view>

    <!--加载更多时动画-->
    <BottomLoadMore :show.sync="load_more" message="正在加载" />

    <!--没有更多数据时动画-->
    <BottomNoMore :show="no_more" />

    <!-- 未发现更多啊数据 -->
    <Placeholder :show='is_empty' />
  </view>
</template>

<script>
import Placeholder from '../component/common/placeholder'
import BottomNoMore from '../component/common/bottomNoMore'
import BottomLoadMore from '../component/common/bottomLoadMore'
export default {
  data () {
    return {
      load_more: false,    //加载更多图案
      no_more: false,       //没有更多数据
      is_empty: false,     //无数据，显示空页面
      page:1,
      contentList:[],    //页面列表数据
    }
  },
  components: {
    Placeholder,
    BottomNoMore,
    BottomLoadMore
  }
}
</script>

<style lang="less" scoped>

</style>
