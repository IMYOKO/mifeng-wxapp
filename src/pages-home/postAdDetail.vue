<template>
  <view class="postAdDetail">
    <!-- <view class = "tit">{{orderInfo.name}}</view> -->
    <view class="time">
      <view class="time-selectet" @tap="clickDate">
        <view class="text">投放时间</view>
        <view class="num" v-if="orderInfo.sfbp === 1">总时间（{{orderInfo.bpsj ? orderInfo.bpsj : 0}}）</view>
        <view class="num" v-else>总天数（{{orderInfo.putDays ? orderInfo.putDays : 0}}）</view>
        <image class="icon" src="../static/images/ic_home_launch_time_1.png" v-if="dateOpen" />
        <image class="icon" src="../static/images/ic_home_launch_time_2.png" v-else />
      </view>
      <view class="time-view" v-if="dateOpen">
        <view class="time-item" v-for="(item, index) in orderInfo.putDay" :key="index">{{item}}</view>
      </view>
    </view>
    <view class="matter" v-if="orderInfo.screenType === 1">
      <view class="top">
        <view class="name">广告素材</view>
        <view class="text"></view>
      </view>
      <video
        :src="orderInfo.video"
        class="video"
        v-if="orderInfo.materialType === 3 || orderInfo.materialType === 4"
      ></video>
      <video
        :src="orderInfo.video"
        class="video min min5"
        v-if="orderInfo.materialType === 5"
      ></video>
      <image
        class="img"
        :src="orderInfo.logo"
        v-if="orderInfo.materialType === 1 || orderInfo.materialType === 2 || orderInfo.materialType === 5"
      />
    </view>
    <view class="matter min" v-if="orderInfo.screenType === 2">
      <view class="top">
        <view class="name">广告素材</view>
        <view class="text"></view>
      </view>
      <video
        :src="orderInfo.video"
        class="video min"
        v-if="orderInfo.materialType === 3 || orderInfo.materialType === 4 || orderInfo.materialType === 5"
      ></video>
      <image
        class="img min"
        :src="orderInfo.logo"
        v-if="orderInfo.materialType === 1 || orderInfo.materialType === 2 || orderInfo.materialType === 5"
      />
    </view>
    <view class="machine">
      <view class="name">广告机</view>
      <view class="item" v-for="(item, index) in machineList" :key="index">
        <image class="logo" :src="item.logo" />
        <view class="ct">
          <view class="top">{{item.materialName}}</view>
          <view class="middle">
            <view class="place">{{item.province}}{{item.city}}{{item.district}}{{item.address}}广告机</view>
            <block v-if="orderInfo.sfbp === 0">
              <view
                class="pri"
                v-if="orderInfo.materialType === 1 || orderInfo.materialType === 2 || orderInfo.materialType === 5"
              >¥{{item.unitPrice}}／天</view>
              <view
                class="pri"
                v-if="orderInfo.materialType === 3 || orderInfo.materialType === 4"
              >¥{{item.unitPrice}}／{{item.unitTime}}s／天</view>
            </block>
            <block v-else>
              <view
                class="pri"
              >¥{{item.unitPrice}}／{{item.unitTime}}s</view>
            </block>
          </view>
          <view class="bottom">
            <view class="mark mark2">{{item.screenType === 1 ? '竖屏' : '横屏'}}</view>
            <view class="mark">{{item.lableType}}</view>
            <view class="num">×{{item.amount}}</view>
          </view>
        </view>
      </view>
      <view class="total">
        <view class="text">合计</view>
        <view class="pri">¥{{orderInfo.amount ? orderInfo.amount : 0}}</view>
      </view>
    </view>
    <view class = "pay" v-if="orderStatus !== 1">
      <view class = "name">支付方式</view>
      <view class = "pay-view">
        <view class = "item" :class="pay_type === 2 ? 'balance' : ''" @tap="clickPayType(2)">
          <image class ="pay-icon" src = "../static/images/ic_home_payment_wallet.png" />
          <view class = "text">余额支付</view>
          <view class = "pri">（余额：¥{{money}}）</view>
        </view>
        <view class="item" :class="pay_type === 1 ? 'balance' : ''" @tap="clickPayType(1)">
          <image class="pay-icon wx" src="../static/images/ic_home_payment_wechat.png" />
          <view class="text">微信支付</view>
        </view>
        <view class="item" :class="pay_type === 3?'balance':''" @tap="clickPayType(3)">
          <image class="pay-icon jf" src="../static/images/ic_home_payment_integral.png" />
          <view class="text">积分支付</view>
          <view class="pri">（积分：{{integral}}）</view>
        </view>
      </view>
    </view>
    <button class ="btn" @tap="clickSureOrderFree" v-if="orderStatus === 1">查看订单</button>
    <button class ="btn" @tap="clickSureOrder" v-else>确认下单</button>
    <view class="modal-mask"   catchtouchmove="preventTouchMove" v-if="showPay"></view>
    <view class = "pop-pay" v-if="showPay">
      <view class = "top">
        <view class = "name">请输入支付密码</view>
        <image class = "xx" src = "../static/images/ic_home_advertising_machine_close.png" @tap="clickHidden" />
      </view>
      <input
        type="number"
        style="min-height: 0;max-height: 0;color: #fff;"
        cursor-spacing="150rpx"
        password
        :maxlength="passLength"
        :value="payPassValue"
        :focus="isFocus"
        @input="inputPayPass"
        @blur="blurPayPass"
      />
      <view class="num">
        <block v-for="(item, index) in passLength" :key="index">
          <input
            class="num-item"
            password
            cursor-spacing="150rpx"
            :value="payPassValue.length>=index+1?payPassValue[index]:''"
            disabled
            @tap.stop="clickPassInput"
          />
        </block>
      </view>
      <view class="forget" @tap="clickForget">忘记支付密码？</view>
    </view>
  </view>
</template>

<script>
import { USER_TOKEN, USER_INFO, USER_SPECICAL_INFO } from "../utils/constant";
export default {
  data() {
    return {
      showPay: false,
      isFocus: true,
      passLength: 6,
      payPassValue: "", //支付密码输入内容
      inputBan: false,
      id: null,
      orderInfo: null,
      dateOpen: false, //日期折叠
      pay_type: 2, // 支付类型，0为未选 1-微信、2-余额、3-积分
      userInfo: null,
      machineList: [],
      money: 0,
      integral: 0,
      orderStatus: 0,
      payPwd: 0 // 0-否、1-是
    }
  },
  async onLoad(options) {
    this.id = options.id;
    this.orderStatus = Number(options.orderStatus);
    this.userInfo = uni.getStorageSync(USER_INFO) || null;
    //获取页面信息
    await this.getUserAssets();
    await this.getUserIntegral();
    await this.checkPaypwd()
    await this.getOrderInfo();
  },
  methods: {
    //获取用户信息
    async getUserAssets() {
      const res = await this.$server.getUserAssets();
      this.money = res.data.data.amountKy;
    },
    //获取用户信息
    async getUserIntegral() {
      const res = await this.$server.getUserIntegral();
      this.integral = res.data.data.amountKy;
    },
    clickDate() {
      this.dateOpen = !this.dateOpen;
    },
    //选择支付方式
    clickPayType(pay_type) {
      this.pay_type = pay_type;
    },
    //忘记支付密码
    clickForget() {
      this.$CommonJs.pathTo("/pages-home/updatePayPass");
    },
    inputPayPass(e) {
      this.payPassValue = e.detail.value;
      if (e.detail.value.length === 6) {
        if (this.inputBan) {
          return;
        }
        this.inputBan = true;
        this.callPayOut();
      }
    },
    //失去焦点
    blurPayPass() {
      this.isFocus = false;
    },
    //点击聚焦
    clickPassInput() {
      this.isFocus = true;
    },
    clickHidden() {
      this.showPay = false;
      this.payPassValue = "";
    },
    //获取页面信息
    async getOrderInfo() {
      try {
        const res = await this.$server.getMaterialsOrderDetail({
          orderId: this.id
        });
        const orderInfo = res.data.data.materialDetail;
        orderInfo.putDay = orderInfo.putDay.split(",");
        orderInfo.bpsj = this.$CommonJs.bpsjFn(orderInfo.bpsj)
        this.orderInfo = orderInfo;
        this.machineList = res.data.data.machineList;
      } catch (error) {}
    },
    // 获取是否设置支付密码
    async checkPaypwd () {
      const res = await this.$server.checkPaypwd()
      if (res.data.status === 0) {
        this.payPwd = res.data.data.payPwd
      }
    },
    async clickSureOrder() {
      //没有密码
      if (this.pay_type === 2 || this.pay_type === 3) {
        //余额  积分支付
        if(this.payPwd === 0){
          this.$CommonJs.pathTo('/pages-user/setPayPass')
          return;
        }
        this.showPay = true;
      } else if (this.pay_type === 1) {
        // 微信支付
        //发起支付通信
        const payload = {
          orderId: this.id,
          payType: 1
        };
        await this.$server
          .orderPay(payload)
          .then(res => {
            this.payPassValue = "";
            wx.requestPayment({
              timeStamp: res.data.timeStamp,
              nonceStr: res.data.nonceStr,
              package: res.data.package,
              signType: res.data.signType,
              paySign: res.data.paySign,
              success: function(res) {
                uni.redirectTo({
                  url: "/pages-home/paySuccess?id=" + this.id
                });
              },
              fail: function(res) {
                // tip.toast('支付取消');
                console.log(res);
              }
            });
          })
          .catch(err => {
            if (err.code != 0) {
              this.inputBan = false;
              this.payPassValue = "";
            }
          });
      }
    },
    async clickSureOrderFree () {
      uni.switchTab({
        url:'/pages/advertise'
      })
    },
    async callPayOut(){
      //发起支付通信
      const payload = {
        orderId: this.id,
        payType: this.pay_type,
        paypwd: this.payPassValue
      };
      await this.$server
        .orderPay(payload)
        .then(res => {
          this.payPassValue = "";
          uni.redirectTo({
            url: "/pages-home/paySuccess?id=" + this.id
          });
        })
        .catch(err => {
          if (err.code != 0) {
            this.inputBan = false;
            this.payPassValue = "";
            if (err.code == 40301002) {
              //密码错误
              wx.showModal({
                title: "密码输入错误",
                content: "",
                cancelText: "忘记密码",
                confirmText: "重新输入",
                confirmColor: "#000000",
                cancelColor: "#000000",
                success: function(res) {
                  if (res.confirm) {
                    //重新输入
                  } else if (res.cancel) {
                    //忘记密码
                    uni.navigateTo({
                      url: "/pages-home/updatePayPass"
                    });
                  }
                }
              });
            }
          }
        });
    }
  }
};
</script>

<style lang="less" scoped>
.tit {
  font-size: 40rpx;
  font-weight: bold;
  color: rgba(20, 20, 20, 1);
  padding: 25rpx;
  box-sizing: border-box;
  border-bottom: 1rpx solid #e5e5e5;
  line-height: 56rpx;
  background: rgba(255, 255, 255, 1);
  word-wrap: break-word;
}
.time {
  padding: 0 34rpx;
  padding-bottom: 20rpx;
  box-sizing: border-box;
  background: rgba(255, 255, 255, 1);
  .time-selectet {
    width: 100%;
    height: 84rpx;
    display: flex;
    align-items: center;
    border-bottom: 1rpx solid #e5e5e5;
    .text {
      width: 25%;
      word-break: break-all;
      font-size: 28rpx;
      font-weight: bold;
      color: rgba(20, 20, 20, 1);
      margin-right: auto;
    }
    .num {
      font-size: 28rpx;
      font-weight: bold;
      color: rgba(20, 20, 20, 1);
    }
    .icon {
      width: 20rpx;
      height: 20rpx;
      margin-left: 15rpx;
      padding-top: 8rpx;
    }
  }
  .time-view {
    width: 100%;
    display: flex;
    align-content: space-around;
    flex-wrap: wrap;
    .time-item {
      width: 225rpx;
      text-align: center;
      font-size: 28rpx;
      font-weight: bold;
      color: rgba(20, 20, 20, 1);
      margin-top: 20rpx;
    }
  }
}
.matter {
  width: 100%;
  background: rgba(255, 255, 255, 1);
  margin-top: 20rpx;
  padding-bottom: 20rpx;
  box-sizing: border-box;
  .top {
    width: 100%;
    display: flex;
    align-items: center;
    padding: 35rpx 32rpx;
    box-sizing: border-box;
    .name {
      font-size: 28rpx;
      font-weight: bold;
      color: rgba(20, 20, 20, 1);
      margin-right: auto;
      flex: 1 0 auto;
    }
    .text {
      word-break: break-all;
      font-size: 28rpx;
      color: rgba(102, 102, 102, 1);
      margin-left: 30rpx;
    }
  }
  .video {
    display: block;
    width: 344rpx;
    height: 631rpx;
    margin: 0 auto;
    margin-bottom: 20rpx;
    &.min {
      width: 700rpx;
      height: 340rpx;
    }
    &.min5 {
      width: 344rpx;
      height: 180rpx;
    }
  }
  .img {
    width: 344rpx;
    height: 631rpx;
    display: block;
    margin: 0 auto;
    margin-top: 20rpx;
    &.min {
      width: 700rpx;
      height: 340rpx;
    }
  }
}
.machine {
  width: 100%;
  background-color: #fff;
  margin-top: 20rpx;
  .name {
    width: 100%;
    height: 84rpx;
    line-height: 84rpx;
    background: rgba(255, 255, 255, 1);
    font-size: 28rpx;
    font-weight: bold;
    color: rgba(20, 20, 20, 1);
    border-bottom: 1rpx solid #e5e5e5;
    padding-left: 33rpx;
    box-sizing: border-box;
  }
  .item {
    width: 687rpx;
    min-height: 140rpx;
    margin: 0 auto;
    border-bottom: 1rpx solid #e5e5e5;
    padding: 20rpx 0;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    .logo {
      width: 110rpx;
      height: 110rpx;
      margin-right: 25rpx;
      flex: 0 0 auto;
    }
    .ct {
      width: 80%;
      .top {
        width: 100%;
        font-size: 26rpx;
        font-weight: bold;
        color: rgba(20, 20, 20, 1);
        word-wrap: break-word;
      }
      .middle {
        width: 100%;
        display: flex;
        align-items: center;
        margin-top: 10rpx;
        .place {
          font-size: 22rpx;
          color: rgba(102, 102, 102, 1);
          margin-right: auto;
          word-break: break-all;
          width: 70%;
        }
        .pri {
          font-size: 24rpx;
          color: rgba(20, 20, 20, 1);
          margin-left: 20rpx;
        }
      }
      .bottom {
        width: 100%;
        display: flex;
        align-items: center;
        margin-top: 10rpx;
        .mark {
          height: 37rpx;
          line-height: 37rpx;
          background: rgba(255, 242, 225, 1);
          font-size: 22rpx;
          color: rgba(195, 83, 1, 1);
          padding: 0 10rpx;
          box-sizing: border-box;
          margin-right: auto;
          &.mark2 {
            margin-right: 2px;
            background: #575757;
            color: #f6e186;
          }
        }
        .num {
          font-size: 24rpx;
          color: rgba(20, 20, 20, 1);
        }
      }
    }
  }
  .total {
    width: 100%;
    height: 84rpx;
    background: rgba(255, 255, 255, 1);
    display: flex;
    align-items: center;
    padding: 0 33rpx;
    box-sizing: border-box;
    .text {
      font-size: 28rpx;
      font-weight: bold;
      color: rgba(20, 20, 20, 1);
      margin-right: auto;
    }
    .pri {
      font-size: 28rpx;
      color: rgba(20, 20, 20, 1);
    }
  }
}
.pay {
  width: 100%;
  background-color: #fff;
  margin-top: 20rpx;
  .name {
    width: 100%;
    height: 84rpx;
    line-height: 84rpx;
    background: rgba(255, 255, 255, 1);
    font-size: 28rpx;
    font-weight: bold;
    color: rgba(20, 20, 20, 1);
    border-bottom: 1rpx solid #e5e5e5;
    padding-left: 33rpx;
    box-sizing: border-box;
  }
  .pay-view {
    width: 100%;
    height: 220rpx;
    background: rgba(255, 255, 255, 1);
    display: flex;
    align-items: center;
    justify-content: space-around;
    .item {
      width: 220rpx;
      height: 180rpx;
      border-radius: 10rpx;
      background: #fff;
      .pay-icon {
        width: 46rpx;
        height: 40rpx;
        display: block;
        margin: 0 auto;
        margin-top: 30rpx;
      }
      .wx {
        width: 46rpx;
        height: 43rpx;
      }
      .jf {
        width: 45rpx;
        height: 42rpx;
      }
      .text {
        width: 100%;
        font-size: 30rpx;
        color: rgba(153, 153, 153, 1);
        margin-top: 22rpx;
        margin-bottom: 5rpx;
        text-align: center;
      }
      .pri {
        width: 100%;
        font-size: 22rpx;
        color: rgba(174, 174, 174, 1);
        text-align: center;
      }
    }
    .balance {
      background: rgba(51, 51, 51, 1);
    }
  }
}
.btn {
  width: 100%;
  height: 92rpx;
  line-height: 92rpx;
  background: rgba(255, 214, 2, 1);
  font-size: 36rpx;
  color: rgba(20, 20, 20, 1);
  margin-top: 20rpx;
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
.pop-pay {
  width: 640rpx;
  height: 500rpx;
  background: rgba(255, 255, 255, 1);
  border-radius: 20rpx;
  position: fixed;
  top: 220rpx;
  left: 55rpx;
  z-index: 999;
  .top {
    width: 100%;
    height: 100rpx;
    display: flex;
    align-items: center;
    padding: 0 36rpx;
    box-sizing: border-box;
    border-bottom: 1rpx solid #cfcfcf;
    .name {
      width: 100rpx;
      font-size: 36rpx;
      font-weight: bold;
      color: rgba(51, 51, 51, 1);
      text-align: center;
      flex: 1 0 auto;
    }
    .xx {
      width: 35rpx;
      height: 35rpx;
      flex: 0 0 auto;
    }
  }
  .num {
    font-size: 32rpx;
    color: #333;
    display: flex;
    margin-top: 20rpx;
    justify-content: space-around;
    padding: 0 58rpx;
    box-sizing: border-box;
    .num-item {
      height: 74rpx;
      line-height: 74rpx;
      width: 75rpx;
      text-align: center;
      border: 1rpx solid #cfcfcf;
      background: rgba(245, 245, 245, 1);
    }
  }
  .forget {
    font-size: 24rpx;
    color: rgba(48, 60, 66, 1);
    text-align: right;
    padding: 0 58rpx;
    box-sizing: border-box;
    margin-top: 30rpx;
  }
}
</style>
