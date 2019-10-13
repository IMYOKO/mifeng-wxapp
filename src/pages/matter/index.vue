<template>
  <view>
    <view class = "top">
      <view class = "item" :class="type == 1?'selected':''"  @tap = "clickTypeItem(1)">图片素材</view>
      <view class = "item" :class="type == 2?'selected':''"  @tap = "clickTypeItem(2)">组合素材</view>
      <view class = "item">
        <button class = "top-btn" @tap = "clickManager">管理</button>
        <button class = "top-btn add" @tap = "clickAdd">添加</button>
      </view>
    </view>
    <view class = "banner">
      <view class = "b-item" :class="apply_status == 2?'selected':''" @tap = "clickStatusItem(2)">审核通过</view>
      <view class = "b-item" :class="apply_status == 1?'selected':''" @tap = "clickStatusItem(1)">审核中</view>
      <view class = "b-item" :class="apply_status == 3?'selected':''" @tap = "clickStatusItem(3)">审核拒绝</view>
    </view>
    <view class = "content">
      <view class = "ct-view" :for = "contentList" :key = "unique" :data-type = "item.type" :data-video = "item.video" :data-logo = "item.logo" :data-name = "item.name" @tap = "clickPre">
        <image src="../../static/images/pic_zhanwei_2.png" class = "ct-video" :if = "item.type == 2"></image>
        <image class = "status" src = "../../static/images/pic_material_audit.png" :if = "item.apply_status  == 1"></image>
        <image class = "status" src = "../../static/images/pic_material_audit_failed.png" :if = "item.apply_status == 3"></image>
        <image class = "ct-img" :class="item.type == 2?'group':''" :src="item.logo"></image>
        <view class = "tit">{{item.name}}</view>
      </view>
      
    </view>
      <!--加载更多时动画-->
  <bottomLoadMore :show="load_more" message="正在加载"></bottomLoadMore>
  <!--没有更多数据时动画-->
  <bottomNoMore :show="no_more" ></bottomNoMore>
  <!--暂无数据显示-->
  <placeholder :show="is_empty"></placeholder>
  </view>
</template>
<script>
import { mapState, mapMutations } from 'vuex'
import request from '../../utils/request';
import tip from '../../utils/tip';
import checkRole from '../../utils/check-role';
import {
  USER_TOKEN,USER_INFO,USER_SPECICAL_INFO
} from '../../utils/constant';
import bottomLoadMore from '../../components/common/bottomLoadMore';
import bottomNoMore from '../../components/common/bottomNoMore';
import placeholder from '../../components/common/placeholder';
export default {
  config: {
    navigationBarTitleText: '蜜蜂广告',
  },
  components: {
    bottomLoadMore:bottomLoadMore,
    bottomNoMore:bottomNoMore,
    placeholder:placeholder
  },
  data() {
    return {
      load_more: false,    //加载更多图案
      no_more: false,       //没有更多数据
      is_empty: true,     //无数据，显示空页面
      page:1,
      contentList:[],    //页面列表数据
      type:1,           //1 图片素材  2组合素材
      apply_status:2,    // 1,2,3对应未审核，已通过，已拒绝
    }
  },
  onLoad(options) {

  },
  async onShow(){
    // await checkRole();
    this.page = 1;
    this.getMatterList(1,true);
  },
  computed: {

  },
  methods: {
    //预览
    clickPre(e){
      let type = e.currentTarget.dataset.type;
      let logo = e.currentTarget.dataset.logo;
      let video = e.currentTarget.dataset.video;
      let name = e.currentTarget.dataset.name;
      uni.navigateTo({
        url:'./preMatter?type='+type+'&logo='+logo+'&video='+video+'&name='+name
      })
    },
    //点击分类筛选
    clickTypeItem(type){
      this.type = type;
      this.page = 1;
      this.getMatterList(1,true);
    },
    //点击状态筛选
    clickStatusItem(status){
      this.apply_status = status;
      this.page = 1;
      this.getMatterList(1,true);
    },
    async clickManager(){
      await checkRole(true);
      uni.navigateTo({
        url:'./manageMatter?type='+this.type
      })
    },
    async clickAdd(){
      await checkRole(true);
      uni.navigateTo({
        url:'./addMatter?type='+this.type
      })
    },
    async getMatterList(page, refresh) {
      let json;
      try {
        json = await request({
          url:'users/materials',
          method:'GET',
          data:{
            page:page || 1,
            apply_status:this.apply_status,
            type:this.type,
          }
        })
      } catch (err) {
        this.is_empty = this.page == 1 && this.contentList.length == 0;
        this.no_more = true;
        this.load_more = false;
        console.log(err)
        return;
      }
      this.load_more = false;
      if (refresh) {
        this.contentList = json.data.data;
      } else {
        this.contentList = [...this.contentList, ...json.data.data];
      }
      if(json.data.data.length < json.data.per_page && json.data.data.length != 0){
        //没有更多数据
        this.no_more = true;
      }else{			
        this.no_more = false;
      }
      if (this.page == 1 && json.data.data.length == 0) {
        //暂无数据
        this.is_empty = true;
      } else {
        this.is_empty = false;
      }
    },
  },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
  onPullDownRefresh() {
    this.page = 1;
    this.getMatterList(1,true);
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
        that.getMatterList(that.page,false);
      }
  }
}

</script>
<style lang="less">
.top{
  width:100%;
  height:80rpx;
  background-color: #141414;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: fixed;
  padding: 0 40rpx 0 60rpx;
  box-sizing: border-box;
  top:0rpx;
  left:0;
  z-index:9999;
  .item{
    height:80rpx;
    font-size:28rpx;
    color:rgba(153,153,153,1);
    display: flex;
    align-items: center;
    box-sizing: border-box;
    border-bottom:6rpx solid #141414;
    .top-btn{
      height:48rpx;
      line-height:48rpx;
      text-align: center;
      font-size:24rpx;
      color:rgba(20,20,20,1);
      background:rgba(246,246,246,1);
      border-radius: 0;
    }
    .add{
      background:rgba(51,51,51,1);
      color:rgba(255,214,2,1);
      margin-left:10rpx;
    }
  }
  .selected{
    color:rgba(255,214,2,1);
    border-bottom:6rpx solid #FFD602;
   
  }
}
.banner{
  width:100%;
  background:rgba(255,255,255,1);
  display: flex;
  align-items: center;
  justify-content: space-around;
  padding:0 45rpx;
  box-sizing: border-box;
  position: fixed;
  top:80rpx;
  left:0;
  z-index:9999;
  .b-item{
    height:80rpx;
    line-height:80rpx;
    font-size:28rpx;
    color:rgba(153,153,153,1);
  }
  .selected{
    color:rgba(20,20,20,1);
    font-weight: bold;
  }
}
.content{
  display: flex;
  flex-wrap: wrap;
  padding:0 15rpx;
  box-sizing: border-box;
  justify-content: space-around;
  margin-top:180rpx;
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
      z-index:998;
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