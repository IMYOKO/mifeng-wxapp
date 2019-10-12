<template>
  <view class="chooseMatter">
    <view class = "banner">
      <view class="b-item" :class="type == 1 ? 'selected' : ''"  @click="clickHeadItem(1)">图片素材</view>
      <view class="b-item" :class="type == 2 ? 'selected' : ''"  @click="clickHeadItem(2)">组合素材</view>
    </view>
    <view class="content">
      <view clas ="ct-view" v-for="(item, index) in contentList" :key="index" @click="clickChooseIt(item.id, item.name)">
        <video :src="item.video" class="ct-video" v-if="item.type == 2" />
        <image class="ct-img" :class="item.type == 2?'group' : ''" :src="item.logo" />
        <view class="tit">{{item.name}}</view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data () {
    return {
      contentList: [],    //页面列表数据
      type: 1, 
    }
  },
  methods: {
    clickHeadItem (type) {
      this.type = type
    },
    clickChooseIt (id, name) {
      console.log(id, name)
    }
  }
}
</script>

<style lang="less" scoped>
  .banner{
    width: 100%;
    height: 80rpx;
    background:rgba(255,255,255,1);
    display: flex;
    align-items: center;
    justify-content: space-around;
    padding: 0 45rpx;
    box-sizing: border-box;
    position: fixed;
    top: 0rpx;
    left: 0;
    z-index: 999;
    .b-item{
      font-size: 28rpx;
      color:rgba(153,153,153,1);
    }
    .selected{
      color:rgba(20,20,20,1);
      font-weight: bold;
    }
  }
  .matterAddHeaderBtn {
    width: 40rpx;
    height: 40rpx;
    position: fixed;
    top: 0;
    right: 0;
    z-index: 999;
    padding: 20rpx;
  }
  .matterAddBtn{
    width:675rpx;
    height:92rpx;
    background:rgba(255,214,2,1);
    border-radius:5rpx;
    font-size:36rpx;
    color:rgba(20,20,20,1);
    margin-top:80rpx;
  }
  .content{
    display: flex;
    flex-wrap: wrap;
    padding:0 15rpx;
    box-sizing: border-box;
    justify-content: space-around;
    .ct-view{
      position: relative;
      width:340rpx;
      height:680rpx;
      background:rgba(255,255,255,1);
      border-radius:3rpx;
      padding:20rpx;
      box-sizing: border-box;
      margin-top:20rpx;
      .status{
        width:162rpx;
        height:162rpx;
        position: absolute;
        top: 0;
        right:0;
      }
      .ct-video{
        width:300rpx;
        height:170rpx;
        margin-bottom: 20rpx;
      }
      .ct-img{
        width:300rpx;
        height:550rpx;
        margin:20rpx auto;
        margin-top:0;
        display: block;
      }
      .group{
        height:360rpx;
      }
      .tit{
        font-size:24rpx;
        color:rgba(51,51,51,1);
        text-overflow: -o-ellipsis-lastline;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        line-clamp: 2;
        -webkit-box-orient: vertical;
      }
    }
  }
</style>
