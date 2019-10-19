<template>
  <view class="addCard">
    <form bindsubmit="formSubmit" bindreset="formReset">
      <view class = "tip">填写卡号</view>
      <view class = "content">
        <view class = "item none">
          <view class = "tit">卡号</view>
          <input type="text" placeholder="请输入开户银行卡号" name = "bank_card_numbers" placeholder-class = "input-placeholder"   @input ="inputCard"/>
        </view>
      </view>
      <view class = "tip">信息验证</view>
      <view class = "content">
        <view class = "item">
          <view class = "tit">姓名</view>
          <input type="text" maxlength = "6" placeholder="请输入您的真实姓名" name = "name" placeholder-class = "input-placeholder"  />
        </view>
        <view class = "item">
          <view class = "tit">身份证</view>
          <input type="idcard" placeholder="请输入身份证号码" maxlength = "18" name = "identity_card_number" placeholder-class = "input-placeholder" />
        </view>
        <view class = "item">
          <view class = "tit">手机号</view>
          <input type="number" placeholder="请输入银行预留手机号" name = "phone"  maxlength = "11" placeholder-class = "input-placeholder" @input = "inputPhone" />
        </view>
        <view class = "item none">
          <view class = "tit">验证码</view>
          <input type="text" placeholder="请输入验证码" name = "request_code" maxlength = "6" placeholder-class = "input-placeholder"  />
          <view class = "yzm {{isSend?'disabled':''}}" @tap ="{{isSend?'':'clickYzm'}}">{{yzmContent}}</view>
        </view>
      </view>
      <button class = "btn" form-type="submit">下一步</button>
    </form>
  </view>
</template>

<script>
export default {
  
}
</script>

<style lang="less" scoped>
.tip{
  width:100%;
  height:68rpx;
  line-height:68rpx;
  font-size:24rpx;
  color:rgba(155,155,155,1);
  padding-left:45rpx;
  box-sizing: border-box;
}
.content{
  width:720rpx;
  min-height:95rpx;
  background:rgba(255,255,255,1);
  margin:0 auto;
  padding:0 30rpx;
  box-sizing: border-box;
  .item{
    width:100%;
    height:90rpx;
    display: flex;
    align-items: center;
    border-bottom:1rpx solid #E3E3E4; 
    .tit{
      width:160rpx;
      font-size:30rpx;
      color:rgba(0,0,0,1);
      margin-right:20rpx;
    }
    input{
      width:320rpx;
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
  .none{
    border:0;
  }
}
.btn{
  width:675rpx;
  height:92rpx;
  line-height:92rpx;
  background:rgba(255,214,2,1);
  border-radius:5rpx;
  font-size:36rpx;
  color:rgba(20,20,20,1);
  margin-top:50rpx; 
} 
</style>
