<template>
  <view class="myAdMachineDetail">
    <scroll-view class = "sv-view" :style="{'height': windowHeight-92 + 'rpx'}" scroll-y = "true">
      <view class = "ct-view">
        <image class = "status" src=  "../static/images/pic_my_advertising_machine_on_line.png" v-if="adInfo.online_status == 'online'" />
        <image class = "status" src=  "../static/images/pic_my_advertising_machine_off_line.png" v-else-if="adInfo.online_status == 'offline'" />
        <view class = "ct">
          <image class = "logo" :src="adInfo.logo" />
          <view class = "content">
            <view class = "top">
              <view class = "name">{{adInfo.name}}</view>
              <view class = "mark">{{adInfo.advertise_machine_label_type.name}}</view>
            </view>
            <view class = "middle">
              <view class = "text">图片价格/天</view>
              <view class = "pri">¥{{adInfo.image_price}}</view>
            </view>
            <view class ="bottom">
              <view class = "text">视频组合价格/15s/天</view>
              <view class = "pri">¥{{adInfo.combine_price}}</view>
            </view>
          </view>
        </view>
        <view class = "place">
          <image class  = "site-icon" src = "../static/images/ic_home_location_2.png" />
          <view class = "place">{{adInfo.province}}{{adInfo.city}}{{adInfo.district}}{{adInfo.site}}</view>
        </view>
      </view>
      <view class = "note">在播广告</view>
      <view class = "content">
        <view class = "ct-view" wx:for = "{{adInfo.materials}}" wx:key = "unqiue">
          <video :src="item.video" class = "ct-video" v-if="item.type == 2"></video>
          <image class = "ct-img" :class="item.type == 2 ? 'group' : ''" :src="item.logo" />
          <view class = "tit">{{item.name}}</view>
        </view>
      </view>
    </scroll-view>
    <cover-view class = "btn" @tap="clickPostAd">免费发布广告</cover-view>
  </view>
</template>

<script>
export default {
  data () {
    return {
      id: '',
      adInfo: null,
      windowHeight: '',
    }
  }
}
</script>

<style lang="less" scoped>
.myAdMachineDetail {
  padding-bottom: 92px;
}
.ct-view{
  width:100%;
  min-height:280rpx;
  background:rgba(255,255,255,1);
  border-radius:3rpx;
  padding:25rpx 25rpx 0 25rpx;
  box-sizing: border-box;
  position: relative;
  .status{
    position: absolute;
    width:161rpx;
    height:162rpx;
    top:0;
    left:0;
  }
  .ct{
    display: flex;
    align-items: center;
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
.note{
  width:100%;
  height:88rpx;
  line-height:88rpx;
  font-size:28rpx;
  font-weight:bold;
  color:rgba(20,20,20,1);
  padding-left:33rpx;
  box-sizing: border-box;
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
    .select-icon{
      width:45rpx;
      height:45rpx;
      border-radius: 50%;
      border:2rpx solid #fff;
      position: absolute;
      top:35rpx;
      right:35rpx;
      flex:0 0 auto;
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
      height:350rpx;
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
.blank{
  width:100%;
  height:92rpx;
}
.btn{
  width:100%;
  height:92rpx;
  line-height:92rpx;
  background:rgba(255,214,2,1);
  font-size:36rpx;
  color:rgba(20,20,20,1);
  position: fixed;
  bottom:0;
  left:0;
  border-radius: 0;
  text-align: center;
  z-index:999999999;
}
</style>
