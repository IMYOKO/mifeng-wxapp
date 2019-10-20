<template>
  <view class="earningWithdraw">
    <view class = "top">
      <view class = "item" @tap ="clickAddCard" v-if="bankList.length <= 0">
        <image class = "add-icon" src = "../static/images/ic_my_bank_card_add.png" />
        <view class = "add-text">添加银行卡</view>
        <image class=  "del" src = "../static/images/ic_home_open_1.png" />
      </view>
      <view class = "item" wx:else @tap ="clickChooseCard">
        <view class = "text">
          <view class = "name">{{chooseBank.relevance_bank}}</view>
          <view class = "card">尾号{{chooseBank.tail}}{{chooseBank.card_name}}</view>
        </view>
        <image class=  "del" src = "../static/images/ic_home_open_1.png" />
      </view>
    </view>
    <view class = "content">
      <view class = "tit">提现金额</view>
      <view class = "input-view">
        <view class = "icon">￥</view>
        <input type="digit" placeholder = "请填写您的提现金额"  maxlength = "6" placeholder-style = "font-size:30rpx;color:##CFCFCF;" @input = "inputMoney"/>
      </view>
       <view class = "text-view" v-if="isBeyond">
        <view class = "beyond">超过可提现余额</view>
      </view>
      <view class = "text-view" wx:else>
        <view class = "text">服务费{{serviceFee}}元</view>
        <view class = "textxx" wx:if = "{{serviceFee !=0}}">到账金额{{factFee}}元</view>
      </view>
    </view>
    <button class = "btn" :class="isBeyond?'disabled':''" @tap ="{{isBeyond?'':'clickTx'}}">提现</button>
    <view class="modal-mask"   catchtouchmove="preventTouchMove" v-if="showPay" @tap ="hideModal"></view>
    <view class = "pop-pay" v-if="showPay">
      <view class = "top">
        <view class = "name">请输入支付密码</view>
        <image class = "xx" src = "../static/images/ic_home_advertising_machine_close.png"  @tap = "hideModal" />
      </view>

      <!-- <input type="number"  style="min-height: 0;max-height: 0;color: #fff;"  cursor-spacing = "150rpx"  password maxlength = "{{passLength}}" value = "{{payPassValue}}" focus = "{{isFocus}}" @input = "inputPayPass" @blur = "blurPayPass"></input> -->
      <view class = "num">
        <block v-for="(item, index) in passLength" :key="index">
          <!-- <input class = "num-item" password cursor-spacing = "150rpx" value="{{payPassValue.length>=index+1?payPassValue[index]:''}}" disabled  @tap.stop = "clickPassInput"></input> -->
        </block>
      </view>
      <view class = "forget" @tap="clickForget">忘记支付密码？</view>
  </view>
</template>

<script>
export default {
  data () {
    return {
      showPay:false,
      isFocus:false,
      passLength:6,
      payPassValue:'',   //支付密码输入内容
      inputBan:false,
      bankList:[],
      money:0,
      bank_card_id:'',    //银行卡id
      chooseBank:null,    //选择的银行卡
      proportion:0,      //服务费比例
      serviceFee:0,      //服务费
      factFee:0,          //到账金额
      isBeyond:false,     //超出金额
      userInfo:null,
    }
  }
}
</script>

<style lang="less" scoped>
.top{
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
    .add-icon{
      width:50rpx;
      height:50rpx;
      flex:0 0 auto;
      margin-right: 33rpx;
      border:1rpx solid #E5E5E5;
    }
    .add-text{
      font-size:30rpx;
      color:rgba(51,51,51,1);
      margin-right: auto;
    }
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
.content{
  width:100%;
  height:300rpx;
  background:rgba(255,255,255,1);
  padding:22rpx 50rpx;
  box-sizing: border-box;
  margin-top:20rpx;
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
      height:100rpx;
      font-size: 98rpx;
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
    .textxx{
      font-size:28rpx;
      color:rgba(20,20,20,1);
      margin-left:50rpx;
    }
    .beyond{
      font-size:28rpx;
      color:rgba(245,166,35,1);
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
.disabled{
  background:rgba(183,190,194,1);
  color:#fff;
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
