<template>
  <view class="chooseMatter">
    <view class = "banner" >
      <scroll-view class = "sv" scroll-x="true">
        <view v-for="(item, index) in tags" :key="index" @tap="selectTag(index)" class="b-item" :class="selectedTag == index ? 'selected' : ''">
          {{item}}
        </view>
      </scroll-view>
    </view>
    <view class="content">
      <view class="ct-view" v-for="(item, index) in contentList" :key="index" @click="clickChooseIt(item.id, item.materialName)">
        <video :src="item.video" class="ct-video" v-if="item.materialType === 3 || item.materialType === 4 || item.materialType === 5" />
        <image class="ct-img" v-if="item.materialType === 1 || item.materialType === 2 || item.materialType === 5" :class="item.materialType === 5 ? 'group' : ''" :src="item.logo" />
        <view class="tit">{{item.materialName}}</view>
      </view>
    </view>

    <!--加载更多时动画-->
    <BottomLoadMore :show.sync="load_more" message="正在加载" />

    <!--没有更多数据时动画-->
    <BottomNoMore :show="no_more" />

    <!-- 未发现更多啊数据 -->
    <Placeholder :show='is_empty' />

    <button v-if="is_empty" class="matterAddBtn" @click="clickMatterAdd">点击上传素材</button>
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
      no_more: true,       //没有更多数据
      is_empty: true,     //无数据，显示空页面
      start: 0,
      offset: 10,
      contentList: [],    //页面列表数据
      type: 0,
      selectedTag: 0,
      tags: ['全部素材', '竖屏图片', '横屏图片', '竖屏视频', '横屏视频', '组合素材']
    }
  },
  onShow() {
    this.getMatterList(0, true);
  },
  methods: {
    clickMatterAdd(e){
      this.$CommonJs.pathTo('/pages-matter/addMatter?type='+this.type)
    },
    clickHeadItem (type) {
      this.type = type
    },
    clickChooseIt (id, name) {
      let matter = {id, name}
      uni.setStorageSync('matter',matter);
      uni.navigateBack();
    },
    selectTag(index) {
      this.selectedTag = index;
      this.type = index;
      this.start = 0
      this.getMatterList(0, true);
    },
    async getMatterList(start, refresh) {
      const payload = {
        auditStatus: 1,
        materialType: this.type,
        start,
        offset: this.offset
      }
      try {
        const response = await this.$server.getMaterialsList(payload)
        this.load_more = false;
        if (refresh) {
          this.contentList = response.data.data.item;
        } else {
          this.contentList = [...this.contentList, ...response.data.data.item];
        }
        if(response.data.data.isNext === 0){
          //没有更多数据
          this.no_more = true;
        }else{			
          this.no_more = false;
        }
        if (this.start === 0 && response.data.data.isNext == 0) {
          //暂无数据
          this.is_empty = true;
        } else {
          this.is_empty = false;
        }
        console.log(res)
      } catch (error) {
        this.is_empty = this.start === 0 && this.contentList.length === 0;
        this.no_more = !this.is_empty;
        this.load_more = false;
        return;
      }
    },
  },
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
    if ((!this.no_more) && (!this.is_empty)) {
        this.start += 1;
        this.getMatterList(this.start, false);
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
.chooseMatter {
  padding-top:80rpx;
  box-sizing: border-box;

  .banner{
    width:100%;
    height:80rpx;
    background:#fff;
    position: fixed;
    top:0rpx;
    left:0;
    white-space: nowrap;
    overflow:hidden; 
    z-index: 500;
    .sv{
      padding: 0 10rpx 0  40rpx;
      box-sizing: border-box;
    }
    .b-item{
      width:140rpx;
      height:80rpx;
      line-height:80rpx;
      font-size:28rpx;
      color:rgba(153,153,153,1);
      display: inline-block;
    }
    ::-webkit-scrollbar{
      width: 0;
      height: 0;
      color: transparent;
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
}
</style>
