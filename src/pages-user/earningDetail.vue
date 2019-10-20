<template>
  <view>
    <image src = "../static/images/pic_banner_1.png" class = "bg-img"></image>
    <view class = "header">
      <view class = "h-item">
        <view class = "h-text">总收益</view>
        <view class = "h-num">{{info.earnings_sum_money}}</view>
      </view>
      <view class = "h-item">
        <view class = "h-text">上周平均收益</view>
        <view class = "h-num">{{info.money_avg}}</view>
      </view>
      <view class = "h-line"></view>
    </view>   
    <view class = "tips">注：广告机每天在线时间达到10个小时才会计算当天收益</view>
    <view class="charts">
      <UchartsComponent :cHeight="uchartOpts.height" :cWidth="uchartOpts.width" :opts="uchartOpts"></UchartsComponent>
    </view>
    <view class = "item" v-for = "(item, index) in contentList" :key = "unique">
      <view class = "item-top">
        <view class ="tit">{{item.name}}</view>
        <view class = "pri">+{{item.money}}</view>
      </view>
      <view class = "time">{{item.created_at}}</view>
    </view>
    <!--加载更多时动画-->
    <bottomLoadMore :show.sync="load_more" message="正在加载"></bottomLoadMore>
    <!--没有更多数据时动画-->
    <bottomNoMore :show.sync="no_more" ></bottomNoMore>
    <!--暂无数据显示-->
    <placeholder :show.sync="is_empty"></placeholder>
  </view>
</template>
<script>
import request from '../utils/request';
import tip from '../utils/tip';
import {
  USER_TOKEN,USER_INFO,USER_SPECICAL_INFO
} from '../utils/constant';
import bottomLoadMore from '../components/common/bottomLoadMore';
import bottomNoMore from '../components/common/bottomNoMore';
import placeholder from '../components/common/placeholder';
import UchartsComponent from '../components/u-charts/component';
export default {
  config: {
    navigationBarTitleText: '收益明细',
  },
  components: {
    bottomLoadMore:bottomLoadMore,
    bottomNoMore:bottomNoMore,
    placeholder:placeholder,
    UchartsComponent
  },

  data() {
    return {
      load_more: false,    //加载更多图案
      no_more: false,       //没有更多数据
      is_empty: false,     //无数据，显示空页面
      page:1,
      contentList:[
        {
          name: '广告收益',
          money: '200.00',
          created_at: '2019-10-01 13:01:01'
        },
        {
          name: '推荐收益',
          money: '200.00',
          created_at: '2019-10-01 13:01:01'
        }
      ],    //页面列表数据
      info:{
        earnings_sum_money: 4200.00,
        money_avg: 800.00
      },
      uchartOpts: {
        width: uni.upx2px(750),
        height: uni.upx2px(200),
        categories: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
        series: [{
          name: '收益明细',
          data: [100, 200, 100, 300, 200, 100],
          color: '#ffd602'
        }]
      }
    }
  },

  onShow(){
    this.page = 1;
    this.getEarningList(1,true);
    this.getInfo();
  },
  methods: {
    async getInfo(){
      let that = this;
      const json = await request({
        url:'royalties/week_earning',
        method:'GET',
      });
      that.info = json.data;
    },
    async getEarningList(page,refresh){
      let that = this;
      const json = await request({
        url:'users/earnings',
        method:'GET',
        data:{
          page:page || 1,
        }
      });
      if (refresh) {
        that.contentList = json.data.data;
      } else {
        that.contentList = [...that.contentList, ...json.data.data];
      }
      if(json.data.data.length < json.data.per_page  && json.data.data.length != 0){
        //没有更多数据
        that.no_more = true;
      }else{			
        that.no_more = false;
      }
      if (that.page == 1 && json.data.data.length == 0) {
      //暂无数据
      that.is_empty = true;
      } else {
        that.is_empty = false;
      }
    }
  },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
  onPullDownRefresh() {
    this.page = 1;
    this.getEarningList(1,true);
    setTimeout(() => {
      uni.stopPullDownRefresh();
    }, 1000);  
  },

  /**
    * 页面上拉触底事件的处理函数
    */
  onReachBottom() {
    let that = this;
    if ((!that.no_more) && (!that.is_empty)) {
        that.page += 1;
        that.getEarningList(that.page,false);
      }
  }
}

</script>
<style lang="less">
.bg-img{
  width:100%;
  height:140rpx;
  position: fixed;
  z-index:1;
}
.header{
  width:100%;
  height:140rpx;
  padding:20rpx 0;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  position: relative;
  z-index:99;
  .h-item{
    width:50%;
    .h-text{
      text-align:center;
      font-size:28rpx;
      color:rgba(153,153,153,1);
    }
    .h-num{
      text-align:center;
      font-size:40rpx;
      font-weight:bold;
      color:rgba(255,255,255,1);
      margin-top:6rpx;
    }
  }
  .h-line{
    width:2rpx;
    height:54rpx;
    background: rgba(229,229,229,1);
    position: absolute;
    top:40rpx;
    left:374rpx;
    z-index:999;
  }
}
.tips{
  width:100%;
  height:60rpx;
  line-height:60rpx;
  font-size:24rpx;
  color:rgba(139,92,47,1);
  text-align: center;
  background:linear-gradient(136deg,rgba(242,224,206,1) 0%,rgba(233,207,182,1) 100%);
}
.item{
  width:710rpx;
  height:126rpx;
  background:rgba(255,255,255,1);
  border-radius:10rpx;
  margin:0 auto;
  margin-top:23rpx;
  padding:20rpx;
  box-sizing: border-box;
  .item-top{
    width:100%;
    display: flex;
    align-items: center;
    .tit{
      font-size:30rpx;
      font-weight:bold;
      color:rgba(51,51,51,1);
      margin-right: auto;
    }
    .pri{  
      font-size:36rpx;
      font-weight:bold;
      color:rgba(51,51,51,1);
    }
  }
  .time{
    margin-top:10rpx;
    font-size:26rpx;
    color:rgba(193,193,193,1);
  }
}
.charts {
  background: #ffffff;
}
</style>