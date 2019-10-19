<template>
  <view class="recharge">
    <view class = "content">
      <view class = "tit">充值金额</view>
      <view class = "input-view">
        <view class = "icon">￥</view>
        <input type="digit" placeholder = "请填写您的充值金额"  placeholder-style = "font-size:30rpx;color:##CFCFCF;" @input = "inputMoney"/>
      </view>
      <view class = "text-view">
        <view class = "text">可用余额{{userInfo.money}}元</view>
        <view class = "sm" @tap="clickExplain">充值说明</view>
      </view>
    </view> 
    <button class = "btn" @tap="clickSubmit">下一步</button>
  </view>
</template>

<script>
export default {
  data () {
    return {
      userInfo: null,
      money: '',
    }
  },
  clickExplain () {
    this.CommonJs.pathTo('/pages-user/explain')
  },
  clickSubmit () {
    
  }
}
</script>

<style lang="less" scoped>
.content{
  width:100%;
  height:250rpx;
  background:rgba(255,255,255,1);
  padding:22rpx 50rpx;
  box-sizing: border-box;
  .tit{
    font-size:32rpx;
    color:rgba(20,20,20,1);
  }
  .input-view{
    width:100%;
    display: flex;
    align-items: center;
    margin-top:30rpx;
    padding-bottom: 30rpx;
    border-bottom:1rpx solid #CFCFCF;
    .icon{
      color:#141414;
      font-size: 30rpx;
      margin-right: 20rpx;
    }
    input{
      font-size: 30rpx;
      background:rgba(255,255,255,1);
      border:0rpx;
    }
  }
  .text-view{
    width:100%;
    display: flex;
    align-items: center;
    margin-top:10rpx;
    .text{
      font-size:24rpx;
      color:rgba(102,102,102,1);
      margin-right:36rpx;
    }
    .sm{
      font-size:28rpx;
      color:rgba(74,144,226,1);
    }
  }
}
.btn{
  width:675rpx;
  height:92rpx;
  line-height:92rpx;
  background:rgba(255,214,2,1);
  border-radius:5rpx;
  font-size:32rpx;
  color:rgba(20,20,20,1);
  margin-top:50rpx;
}
</style>

