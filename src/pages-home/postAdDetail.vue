<template>
  <view class="postAdDetail">
    <view class = "tit">{{orderInfo.name}}</view>
    <view class = "time">
      <view class = "time-selectet" @tap ="clickDate">
        <view class = "text">投放时间</view>
        <view class ="num">总天数（{{orderInfo.to_dates.length}}）</view>
        <image class = "icon" src = "../static/images/ic_home_launch_time_1.png" v-if="dateOpen" />
        <image class = "icon" src = "../static/images/ic_home_launch_time_2.png" v-else />
      </view>
      <view class = "time-view" v-if="dateOpen">
        <view class = "time-item" v-for="(item, index) in orderInfo.to_dates" :key="index">{{item}}</view>
      </view>
    </view>
    <view class = "matter">
      <view class ="top">
        <view class = "name">广告素材</view>
        <view class = "text">{{orderInfo.material.name}}</view>
      </view>
      <video :src="orderInfo.material.video" class = "video" v-if="orderInfo.material.type == 2"></video>
      <image class = "img" :src="orderInfo.material.logo" />
    </view>
    <view class = "machine">
      <view class = "name">广告机</view>
      <view class = "item" v-for="(item, index) in orderInfo.order_items" :key="index">
        <image class = "logo" :src='item.advertise_machine.logo' />
        <view class = "ct">
          <view class = "top">{{item.advertise_machine.name}}</view>
          <view class = "middle">
            <view class = "place">{{item.advertise_machine.province}}{{item.advertise_machine.city}}{{item.advertise_machine.district}}{{item.advertise_machine.site}}广告机</view>
            <view class = "pri" v-if="orderInfo.material.type == 1">¥{{item.advertise_machine.image_price}}／天</view>
            <view class = "pri" v-if="orderInfo.material.type == 2">¥{{item.advertise_machine.combine_price}}／15s／天</view>
          </view>
          <view class = "bottom">
            <view class ="mark">{{item.advertise_machine.advertise_machine_label_type.name}}</view>
            <view class = "num">×{{item.amount}}</view>
          </view>
        </view>
      </view>
      <view class = "total">
        <view class = "text">合计</view>
        <view class = "pri">¥{{orderInfo.total_amount}}</view>
      </view>
    </view>
    <view class = "pay">
      <view class = "name">支付方式</view>
      <view class = "pay-view">
        <view class = "item" :class="pay_type == 2 ? 'balance' : ''" @tap="clickPayType(2)">
          <image class ="pay-icon" src = "../static/images/ic_home_payment_wallet.png" />
          <view class = "text">余额支付</view>
          <view class = "pri">（余额：¥{{userInfo.money}}）</view>
        </view>
        <view class = "item" :class="pay_type == 3 ? 'balance' : ''" @tap = "clickPayType(3)">
          <image class ="pay-icon wx" src = "../static/images/ic_home_payment_wechat.png" />
          <view class = "text">微信支付</view>
        </view>
        <view class = "item" :class="pay_type == 4?'balance':''" @tap = "clickPayType(4)">
          <image class ="pay-icon jf" src = "../static/images/ic_home_payment_integral.png" />
          <view class = "text">积分支付</view>
          <view class = "pri">（积分：{{userInfo.integral}}）</view>
        </view>
      </view>
    </view>
    <button class ="btn" @tap="clickSureOrder">确认下单</button>
    <view class="modal-mask"   catchtouchmove="preventTouchMove" v-if="showPay"></view>
    <view class = "pop-pay" v-if="showPay">
      <view class = "top">
        <view class = "name">请输入支付密码</view>
        <image class = "xx" src = "../static/images/ic_home_advertising_machine_close.png" @tap="clickHidden" />
      </view>
      <!-- <input type="number" style="min-height: 0; max-height: 0; color: #fff;" cursor-spacing = "150rpx"  password :maxlength="passLength" v-model="payPassValue"  @focus="isFocus" @input="inputPayPass" @blur="blurPayPass" /> -->
        <view class = "num">
          <block v-for="(item, index) in passLength" :key="index">
            <!-- <input class = "num-item" password cursor-spacing="150rpx" value="{{payPassValue.length>=index+1?payPassValue[index]:''}}" disabled  @tap.stop ="clickPassInput" /> -->
          </block>
        </view>
      <view class = "forget" @tap="clickForget">忘记支付密码？</view>
    </view>
  </view>
</template>

<script>
export default {
  data () {
    return {
      showPay: false,
      isFocus: true,
      passLength: 6,
      payPassValue: '',   //支付密码输入内容
      inputBan: false,
      id: '',
      orderInfo: null,
      dateOpen: false,   //日期折叠
      pay_type: 2,      // 支付类型，1为未选， 2，3，4为余额，微信，积分
      userInfo: null
    }
  }
}
</script>

<style lang="less" scoped>
.tit {
  font-size: 40rpx;
  font-weight:bold;
  color:rgba(20,20,20,1);
  padding:25rpx;
  box-sizing: border-box;
  border-bottom:1rpx solid #E5E5E5;
  line-height:56rpx;
  background:rgba(255,255,255,1);
  word-wrap:break-word;
}
.time{
  padding:0 34rpx;
  padding-bottom:20rpx;
  box-sizing: border-box;
  background:rgba(255,255,255,1);
  .time-selectet{
    width:100%;
    height:84rpx;
    display: flex;
    align-items: center;
    border-bottom:1rpx solid #E5E5E5;
    .text{
      width:55%;
      word-break:break-all;
      font-size:28rpx;
      font-weight:bold;
      color:rgba(20,20,20,1);
      margin-right: auto;
    }
    .num{
      font-size:28rpx;
      font-weight:bold;
      color:rgba(20,20,20,1);
    }
    .icon{
      width:20rpx;
      height:20rpx;
      margin-left:15rpx;
      padding-top:8rpx;
    }
  }
  .time-view{
    width:100%;
    display: flex;
    align-content: space-around;
    flex-wrap: wrap;
    .time-item{
      width:225rpx;
      text-align: center;
      font-size:28rpx;
      font-weight:bold;
      color:rgba(20,20,20,1);
      margin-top:20rpx;
    }
  }
}
.matter{
  width:100%;
  min-height:780rpx;
  background:rgba(255,255,255,1);
  margin-top:20rpx;
  padding-bottom: 20rpx;
  box-sizing: border-box;
  .top{
    width:100%;
    display: flex;
    align-items: center;
    padding:35rpx 32rpx;
    box-sizing:border-box;
    .name{
      font-size:28rpx;
      font-weight:bold;
      color:rgba(20,20,20,1);
      margin-right: auto;
      flex:1 0 auto;
    }
    .text{
      word-break:break-all;
      font-size:28rpx;
      color:rgba(102,102,102,1);
      margin-left:30rpx;
    }
  }
  .video{
    display: block;
    width:344rpx;
    height:169rpx;
    margin:0 auto;
    margin-bottom: 20rpx;
  }
  .img{
    width:344rpx;
    height:631rpx;
    display: block;
    margin:0 auto;
    margin-top:20rpx;
  }
}
.machine{
  width:100%;
  background-color: #fff;
  margin-top:20rpx;
  .name{
    width:100%;
    height:84rpx;
    line-height:84rpx;
    background:rgba(255,255,255,1);
    font-size:28rpx;
    font-weight:bold;
    color:rgba(20,20,20,1);
    border-bottom:1rpx solid #E5E5E5;
    padding-left:33rpx;
    box-sizing: border-box;
  }
  .item{
    width:687rpx;
    min-height:140rpx;
    margin:0 auto;
    border-bottom:1rpx solid #E5E5E5;
    padding:20rpx 0;
    box-sizing: border-box;
    display:flex;
    align-items: center;
    .logo{
      width:110rpx;
      height:110rpx;
      margin-right:25rpx;
      flex:0 0 auto;
    }
    .ct{
      width:80%;
      .top{
        width:100%;
        font-size:26rpx;
        font-weight:bold;
        color:rgba(20,20,20,1);
        word-wrap:break-word;
      }
      .middle{
        width:100%;
        display: flex;
        align-items: center;
        margin-top:10rpx;
        .place{
          font-size:22rpx;
          color:rgba(102,102,102,1);
          margin-right: auto;
          word-break: break-all;
        }
        .pri{
          font-size:24rpx;
          color:rgba(20,20,20,1);
          margin-left:20rpx;
        }
      }
      .bottom{
        width:100%;
        display: flex;
        align-items:center;
        margin-top:10rpx;
        .mark{
          height:37rpx;
          line-height:37rpx;
          background:rgba(255,242,225,1);
          font-size:22rpx;
          color:rgba(195,83,1,1);
          padding:0 10rpx;
          box-sizing: border-box;
          margin-right: auto;
        }
        .num{
          font-size:24rpx;
          color:rgba(20,20,20,1);
        }
      }
    }
  }
  .total{
    width:100%;
    height:84rpx;
    background:rgba(255,255,255,1);
    display: flex;
    align-items: center;
    padding:0 33rpx;
    box-sizing: border-box;
    .text{
      font-size:28rpx;
      font-weight:bold;
      color:rgba(20,20,20,1);
      margin-right: auto;
    }
    .pri{
      font-size:28rpx;
      color:rgba(20,20,20,1);
    }
  }
}
.pay{
  width:100%;
  background-color: #fff;
  margin-top:20rpx;
  .name{
    width:100%;
    height:84rpx;
    line-height:84rpx;
    background:rgba(255,255,255,1);
    font-size:28rpx;
    font-weight:bold;
    color:rgba(20,20,20,1);
    border-bottom:1rpx solid #E5E5E5;
    padding-left:33rpx;
    box-sizing: border-box;
  }
  .pay-view{
    width:100%;
    height:220rpx;
    background:rgba(255,255,255,1);
    display: flex;
    align-items: center;
    justify-content: space-around;
    .item{
      width:220rpx;
      height:180rpx;
      border-radius:10rpx;
      background:#fff;
      .pay-icon{
        width:46rpx;
        height:40rpx;
        display: block;
        margin: 0 auto;
        margin-top:30rpx;
      }
      .wx{
        width:46rpx;
        height:43rpx;
      }
      .jf{
        width:45rpx;
        height:42rpx;
      }
      .text{
        width:100%;
        font-size:30rpx;
        color:rgba(153,153,153,1);
        margin-top:22rpx;
        margin-bottom: 5rpx;
        text-align: center;
      }
      .pri{
        width:100%;
        font-size:22rpx;
        color:rgba(174,174,174,1);
        text-align: center;
      }
    }
    .balance{
      background:rgba(51,51,51,1);
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
  margin-top:20rpx;
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
