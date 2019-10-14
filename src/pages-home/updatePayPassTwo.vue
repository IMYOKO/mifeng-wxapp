<template>
  <view class="updatePayPassTwo">
    <form bindsubmit="formSubmit" bindreset="formReset">
      <view class  ="item">
        <view class = "tit">密码</view>
        <input type="password" name = "pass" maxlength = "16" placeholder="请输入密码" placeholder-class = "input-placeholder" password = "true" />
      </view>
      <view class  ="item">
        <view class = "tit">确认密码</view>
        <input type="password" name = "repass" maxlength = "16" placeholder="请输入确认密码" placeholder-class = "input-placeholder" password = "true" />
      </view>
      <button class = "btn" form-type="submit">确认</button>
    </form>
  </view>
</template>

<script>
export default {
  
}
</script>

<style lang="less" scoped>
.item{
  width:100%;
  margin-top:50rpx;
  padding:0 40rpx;
  box-sizing: border-box;
  .tit{
    font-size:32rpx;
    font-weight:bold;
    color:rgba(20,20,20,1);
  }
  input{
    font-size:28rpx;
    color:rgba(20,20,20,1);
    border:0;
    border-bottom:1rpx solid #cfcfcf;
    margin-top:30rpx;
    padding-bottom: 30rpx;
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
