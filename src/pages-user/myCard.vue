<template>
  <view class="myCard">
    <view class = "content">
      <view class = "item" v-for="(item, index) in bankList" :key="index">
        <view class = "text">
          <view class = "name">{{item.relevance_bank}}</view>
          <view class = "card">尾号{{item.tail}}{{item.card_name}}</view>
        </view>
        <image class=  "del" data-id = "{{item.id}}" src = "../static/images/ic_home_delete.png" @tap = "clickDelCard" />
      </view>
    </view>
    <button class = "btn" @tap ="clickAddCard">添加银行卡</button>
    <view class="modal-mask"   catchtouchmove="preventTouchMove" v-if="showPay" @tap ="hideModal"></view>
    <view class = "pop-pay" v-if="showPay">
      <view class = "top">
        <view class = "name">请输入支付密码</view>
        <image class = "xx" src = "../static/images/ic_home_advertising_machine_close.png"  @tap ="hideModal" />
      </view>
      <input type="number" style="min-height: 0;max-height: 0;color: #fff;" cursor-spacing = "150rpx"  password maxlength = "{{passLength}}" value = "{{payPassValue}}" focus = "{{isFocus}}" @input ="inputPayPass" @blur ="blurPayPass" />
      <view class = "num">
        <block v-for="(item, index) in passLength" :key='index'>
          <input class = "num-item" password cursor-spacing = "150rpx" value="{{payPassValue.length>=index+1?payPassValue[index]:''}}" disabled  @tap.stop ="clickPassInput" />
        </block>
      </view>
      <view class = "forget" @tap ="clickForget">忘记支付密码？</view>
    </view>
  </view>
</template>

<script>
export default {
  methods: {
    clickAddCard () {
      this.$CommonJs.pathTo('/pages-user/addCard')
    },
    // 忘记支付密码
    clickForget () {
      this.$CommonJs.pathTo('/pages-home/updatePayPass')
    }
  }
}
</script>

<style lang="less" scoped>
.myCard {
  padding-bottom: 92px;
}
.content{
  width:100%;
  background-color: #fff;
 .item{
    width:100%;
    height:144rpx;
    background:rgba(255,255,255,1);
    display: flex;
    align-items: center;
    padding:34rpx 50rpx;
    box-sizing: border-box;

   .text{
      margin-right: auto;
     .name{
        font-size:28rpx;
        font-weight:bold;
        color:rgba(20,20,20,1);
      }
     .card{
        margin-top:8rpx;
        font-size:24rpx;
        color:rgba(102,102,102,1);
     }
   }
   .del{
      width:45rpx;
      height:45rpx;
      flex:0 0 auto;
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
  bottom:0;
  left:0;
}
.modal-mask {
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  background: #000;
  opacity: 0.5;
  overflow: hidden;
  z-index: 3;
  color: #fff;
}
.pop-pay{
  width:640rpx;
  height:500rpx;
  background:rgba(255,255,255,1);
  border-radius:20rpx;
  position: fixed;
  top:220rpx;
  left:55rpx;
  z-index:999;
  .top{
    width:100%;
    height:100rpx;
    display: flex;
    align-items: center;
    padding:0 36rpx;
    box-sizing: border-box;
    border-bottom:1rpx solid #cfcfcf;
    .name{
      width:100rpx;
      font-size:36rpx;
      font-weight:bold;
      color:rgba(51,51,51,1);
      text-align: center;
      flex:1 0 auto;
    }
    .xx{
      width:35rpx;
      height:35rpx;
      flex: 0 0 auto;
    }
  }
  .num{
    font-size:32rpx;
    color:#333;
    display: flex;
    margin-top:20rpx;
    justify-content: space-around;
    padding:0 58rpx;
    box-sizing: border-box;
    .num-item{
      height:74rpx;
      line-height:74rpx;
      width:75rpx;
      text-align: center;
      border:1rpx solid #cfcfcf;
      background:rgba(245,245,245,1);
    }
  }
  .forget{
    font-size:24rpx;
    color:rgba(48,60,66,1);
    text-align:right;
    padding:0 58rpx;
    box-sizing: border-box;
    margin-top:30rpx;
  }
}
</style>

