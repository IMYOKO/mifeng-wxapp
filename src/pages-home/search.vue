<template>
  <view class="search">
    <view class  ="top">
      <view class  ="icon">
        <image class = "search-icon" src = "../static/images/ic_home_search_2.png" />
      </view>
      <!-- <input type="text"  placeholder="请输入广告机名称"  placeholder-class = "input-placeholder" @input="inputSearch"/> -->
      <input type="text"  placeholder="请输入广告机名称"  placeholder-class = "input-placeholder" v-model="name"/>
      <view class = "search" @tap="clickSearch">搜索</view>
    </view>
    <block v-if="isSearch">
      <view class = "grey">
        <view class = "tit">热门搜索</view>
      </view>
      <view class = "hot">
        <view class = "item" v-for="(item, index) in hotList" :key="index" @tap ="clickHotItem(item.name)">{{item.name}}</view>
      </view>
      <view class = "grey">
        <view class = "tit">搜索历史</view>
        <image class = "del-icon" src= "../static/images/ic_home_search_history_delete.png"  @tap="clickClearHistory" />
      </view>
      <view class = "history">
        <view class = "item" v-for="(item, index) in history" :key="index" @tap="clickHistoryItem(item)">{{item}}</view>
      </view>
    </block>
    <view class = "ct-view" v-for="(item, index) in contentList" :key="index" @tap ="clickItem(item.id, index, item.my_cart)">
      <view class = "ct">
        <image class = "logo" :src='item.logo' />
        <view class = "content">
          <view class = "top">
            <view class = "name">{{item.machineName}}</view>
            <view class = "mark">{{item.labelType}}</view>
          </view>
          <view class = "middle">
            <view class = "text">图片价格/天</view>
            <view class = "pri">¥{{item.imagePrice}}</view>
          </view>
          <view class ="bottom">
            <view class = "text">视频组合价格/15s/天</view>
            <view class = "pri">¥{{item.videoPrice}}</view>
          </view>
        </view>
      </view>
      <view class = "place">
        <image class  = "site-icon" src = "../static/images/ic_home_location_2.png" />
        <view class = "place">{{item.province}}{{item.city}}{{item.district}}{{item.address}}</view>
        <image class = "select-icon" src = "../static/images/ic_home_select.png" v-if="item.my_cart" />
        <image class = "select-icon" src = "../static/images/ic_home_not_select.png" v-else />
      </view>
    </view>

    <button class = "btn" v-if="isSearch" @tap="clickSure">确定</button>
    <!--加载更多时动画-->
    <BottomLoadMore :show.sync="load_more" message="正在加载"></BottomLoadMore>
    <!--没有更多数据时动画-->
    <BottomNoMore :show.sync="no_more" ></BottomNoMore>
    <!--暂无数据显示-->
    <Placeholder :show.sync="is_empty"></Placeholder>
  </view>
</template>

<script>
import Placeholder from '../component/common/placeholder'
import BottomNoMore from '../component/common/bottomNoMore'
import BottomLoadMore from '../component/common/bottomLoadMore'
import tip from '../utils/tip';
export default {
  data () {
    return {
      load_more: false,    //加载更多图案
      no_more: false,       //没有更多数据
      is_empty: false,     //无数据，显示空页面
      start:0,
      offset: 10,
      contentList:[],    //页面列表数据
      hotList:[],
      name:'',
      history:[],   //搜索历史
      isSearch:false,   //点击搜索后改变  是否显示搜索历史
      historyLength:8,         //搜索历史个数
      adMachineId:[],     //选择的广告机id
    }
  },
  onShow() {
    this.getCartList();
  },
  methods: {
    //点击广告机
    clickItem(id, index, my_cart){
      let mycart = my_cart;
      if(mycart === 1){
        //已选取
        let flagIndex = this.adMachineId.indexOf(id);
        this.adMachineId.splice(flagIndex,1);
        this.contentList[index].my_cart = 0;
      }else{
        this.adMachineId.push(id);
        this.contentList[index].my_cart = 1;
      }
    },
    //点击热门
    clickHotItem(e){
      this.name = e.currentTarget.dataset.name;
      this.start = 0;
      this.isSearch = true;
      this.getMachineList(0,true);
    },
    //输入搜索内容
    inputSearch(e){
      this.name = e.detail.value;
    },
    //点击搜索
    clickSearch(){
      if(!this.name){
        return;
      }
      this.isSearch = true;
      let history = uni.getStorageSync('history') || [];
      let isRepeat = false;
      for(var i in history){
        if(this.name === history[i]){
          //已有搜索历史
          history.splice(i,1);
          history.unshift(this.name);
          isRepeat = true;
          break;
        }
      }
      if(!isRepeat){
        if(history.length >= this.historyLength){
          history.splice(0,1);
        }
        history.unshift(this.name);
      }
      uni.setStorageSync('history',history);
      this.start = 0;
      this.getMachineList(0,true);
    },
    //清空搜索历史
    clickClearHistory(){
      let history = [];
      this.history = [];
      // wx.setStorageSync('history',history);
    },
    //点击搜索历史列表
    clickHistoryItem(item){
      console.log(e)
      this.isSearch = true;
      this.name = item.machineName;
      this.getMachineList(0,true);
    },
    //确定
    async clickSure(){
      if(this.adMachineId.length <= 0){
        tip.toast('请选择广告机');
        return;
      }
      // const json = await request({
      //   url:'advertise_machine_cart_items/store',
      //   method:'POST',
      //   data:{ids:this.adMachineId}
      // })
      uni.setStorageSync('adMachineId', this.adMachineId);
      uni.setStorageSync('selectDate',[]); 
      await tip.success('添加成功');
      uni.navigateBack();
    },
    //获取购物车的广告机
    async getCartList(){
      const contentList = uni.getStorageSync('adMachineId') || [];
      this.contentList = contentList;

      contentList.map(item => {
        if(this.adMachineId.indexOf(item.id) == -1) {
          this.adMachineId.push(item.id);
        }
      })
      // const json = await request({
      //   url:'users/advertise_machine_cart_items',
      //   method:'GET',
      // })
      // for(var i in json.data){
      //   if(this.adMachineId.indexOf(json.data[i].id) == -1){
      //       this.adMachineId.push(json.data[i].id);
      //     }
      // }
      // this.$apply();
    },
    //获取广告机列表
    async getMachineList (start, refresh) {
      try {
        const payload = {
          longitude: '',
          latitude: '',
          labelType: '',
          machineName: this.name,
          screenType: '',
          province: '',
          city: '',
          district: '',
          start,
          offset: this.offset,
        }
        console.log(payload)
        const res = await this.$server.getMachinesList(payload)
        if (refresh) {
          this.contentList = res.data.data.item;
        } else {
          this.contentList = [...this.contentList, ...res.data.data.item];
        }
        if(res.data.data.isNext === 0){
          //没有更多数据
          this.no_more = true;
        }else{			
          this.no_more = false;
        }
        if (this.start === 0 && res.data.data.isNext === 0 && response.data.data.item.length === 0) {
          //暂无数据
          this.is_empty = true;
        } else {
          this.is_empty = false;
        }
      } catch (error) {
        
      }
    },
    //获取热门
    async getHostList(){
      this.hotList = []
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
page{
  padding-bottom: 92rpx;
  box-sizing:border-box; 
}
.top{
  width:100%;
  height:85rpx;
  background:rgba(255,255,255,1);
  box-shadow:0px 1px 0px 0px rgba(229,229,229,1);
  display: flex;
  align-items: center;
  padding-left:20rpx;
  box-sizing: border-box;
  border-bottom:1rpx solid #E5E5E5;
  .icon{
    height:60rpx;
    background:rgba(242,242,242,1);
    border-top-left-radius: 10rpx;
    border-bottom-left-radius: 10rpx;
    .search-icon{
      width:45rpx;
      height:45rpx;
      padding:8rpx 5rpx 0 18rpx;
    }
  }
  input{
    height:60rpx;
    background:rgba(242,242,242,1);
    border-top-right-radius: 10rpx;
    border-bottom-right-radius: 10rpx;
    font-size:28rpx;
    color:rgba(20,20,20,1);
    flex:1 0 auto;
  }
  .search{
    width:100rpx;
    height:77rpx;
    line-height:77rpx;
    background-color: #fff;
    text-align: center;
    font-size:28rpx;
    color:rgba(20,20,20,1);
    flex:0 0 auto;
  }
}
.grey{
  width:100%;
  height:84rpx;
  padding-left:20rpx;
  padding-right:30rpx;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  background:rgba(242,242,242,1);
  .tit{
    font-size:28rpx;
    font-weight:bold;
    color:rgba(102,102,102,1);
    margin-right: auto;
  }
  .del-icon{
    width:45rpx;
    height:45rpx;
  }
}
.hot{
  width:100%;
  min-height:100rpx;
  background:rgba(255,255,255,1);
  display: flex;
  align-items: center;
  padding:0rpx 30rpx 15rpx 30rpx;
  flex-wrap: wrap;
  .item{
    height:50rpx;
    line-height:50rpx;
    background:rgba(245,245,245,1);
    padding:0 16rpx;
    box-sizing: border-box;
    text-align: center;
    margin-top:20rpx;
    font-size:26rpx;
    color:rgba(153,153,153,1);
    margin-right: 30rpx;
  }
}
.history{
  width:100%;
  padding-left:20rpx;
  box-sizing: border-box;
  background-color: #fff;
  .item{
    width:100%;
    height:87rpx;
    line-height:87rpx;
    font-size:28rpx;
    color:rgba(153,153,153,1);
    border-bottom:1rpx solid #E5E5E5;
  }
}
.ct-view{
  width:702rpx;
  min-height:280rpx;
  background:rgba(255,255,255,1);
  border-radius:3rpx;
  margin:0 auto;
  margin-top:24rpx;
  padding:25rpx 25rpx 0 25rpx;
  box-sizing: border-box;
  .ct{
    display: flex;
    border-bottom:1rpx solid #E5E5E5;
    padding-bottom: 24rpx;
    .logo{
      width:160rpx;
      height:160rpx;
      margin-right: 24rpx;
      flex:0 0 auto;
    }
    .content{
      width:100%;
      .top{
        width:100%;
        display: flex;
        align-items: center;
        .name{
          width:340rpx;
          word-wrap:break-word;
          font-size:28rpx;
          font-weight:bold;
          color:rgba(20,20,20,1);
          margin-right: auto;
        }
        .mark{
          height:30rpx;
          line-height:30rpx;
          font-size:22rpx;
          color:rgba(195,83,1,1);
          background:rgba(255,242,225,1);
          padding:0 10rpx;
          box-sizing: border-box;
          flex:0 0 auto;
        }
      }
      .middle{
        width:100%;
        display: flex;
        align-items: center;
        margin-top:34rpx;
      }
      .bottom{
        width:100%;
        display: flex;
        align-items: center;
        margin-top:10rpx;
      }
      .text{
        font-size:24rpx;
        color:rgba(102,102,102,1);
        margin-right: auto;
      }
      .pri{
        font-size:24rpx;
        font-weight:bold;
        color:rgba(20,20,20,1);
      }
    }
  }
  .place{
    width:100%;
    min-height:50rpx;
    display: flex;
    align-items: center;
    padding:15rpx 0;
    box-sizing: border-box;
    word-break: break-all;
    .site-icon{
      width:40rpx;
      height:40rpx;
      margin-right:10rpx;
    }
    .place{
      font-size:24rpx;
      color:rgba(102,102,102,1);
      margin-right: auto;
      word-break: break-all;
    }
    .select-icon{
      width:40rpx;
      height:40rpx;
      margin-left:20rpx;
      flex:0 0 auto;
    }
  }
}
.btn{
  width:100%;
  height:92rpx;
  line-height:92rpx;
  background:rgba(255,214,2,1);
  font-size:36rpx;
  color:rgba(20,20,20,1);
  position: fixed;
  border-radius:0rpx;
  bottom: 0;
  left:0;
}
</style>
