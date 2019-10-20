<template>
  <view class="setPayPass">
    <view class = "tit">请输入手机号{{userInfo.phone}}收到的验证码</view>
    <view class ="tit">验证码</view>
    <view class ="item">
      <input type="number" @input = "inputCode"  maxlength = "6" placeholder="请输入验证码" placeholder-class = "input-placeholder"/>
      <!-- <view class = "yzm" :class="isSend?'disabled':''" @tap="{{isSend?'':'clickYzm'}}">{{yzmContent}}</view> -->
    </view>
    <button class= "btn" @tap="clickNext">下一步</button>
  </view>
</template>

<script>
export default {
  data () {
    return {
      userInfo:null,
      request_code:'',
      yzmContent:'获取验证码',
      isSend:false,
      count_task:null,
      type:1, //1支付时设置密码，2主动设置密码
    }
  }
}
</script>

<style lang="less">
page {
  background-color: #fff; 
}
</style>


<style lang="less" scoped>
.tit{
  width:100%;
  padding-left:40rpx;
  box-sizing: border-box;
  margin-top:50rpx;
  font-size:32rpx;
  font-weight:bold;
  color:rgba(20,20,20,1);
}
.item{
  width:100%;
  padding:0 40rpx;
  box-sizing: border-box;
  margin-top:16rpx;
  display:flex;
  align-items: center;
  input{
    width:450rpx;
    height:80rpx;
    border:0;
    border-bottom:1rpx solid #cfcfcf;
    font-size: 28rpx;
    margin-right: auto;
  }
  .yzm{
    width:200rpx;
    height:81rpx;
    line-height:81rpx;
    background:rgba(255,214,2,1);
    border-radius:5rpx;
    font-size:26rpx;
    color:rgba(20,20,20,1);
    text-align: center;
    flex:0 0 auto;
  }
  .disabled{
    background:#ccc;
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
  margin:0 auto;
  margin-top:50rpx;
}
</style>
