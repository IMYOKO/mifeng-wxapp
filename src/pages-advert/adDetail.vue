<template>
  <view>
    <image
      class="top-img"
      src="../static/images/pic_advertisement_to_be_paid.png"
      v-if="orderInfo.status === 0"
    />
    <image
      class="top-img"
      src="../static/images/pic_advertisement_to_be_put_on.png"
      v-if="orderInfo.status === 1"
    />
    <image
      class="top-img"
      src="../static/images/pic_advertisement_In_the_launch.png"
      v-if="orderInfo.status === 2"
    />
    <image
      class="top-img"
      src="../static/images/pic_advertisement_put_to_the_end.png"
      v-if="orderInfo.status === 3"
    />
    <image
      class="top-img"
      src="../static/images/pic_advertisement_closed.png"
      v-if="orderInfo.status === 4"
    />
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
        <view class="time-item" v-for="(item,index) in orderInfo.putDay" :key="index">{{item}}</view>
      </view>
    </view>
    <view class="matter" v-if="orderInfo.screenType === 1">
      <view class="top">
        <view class="name">广告素材</view>
        <view class="text">{{orderInfo.materialName}}</view>
      </view>
      <video
        :src="orderInfo.video"
        class="video"
        v-if="orderInfo.materialType === 3 || orderInfo.materialType === 4 || orderInfo.materialType === 5"
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
        <view class="text">{{orderInfo.materialName}}</view>
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
              >¥{{item.price}}／天</view>
              <view
                class="pri"
                v-if="orderInfo.materialType === 3 || orderInfo.materialType === 4"
              >¥{{item.price}}／15s／天</view>
            </block>
            <block v-else>
              <view class="pri">¥{{orderInfo.bpprice}}／{{orderInfo.bpsj}}</view>
            </block>
          </view>
          <view class="middle">
            <view class="place">投放次数</view>
            <view class="pri">{{item.playTimes}}</view>
          </view>
          <view class="middle">
            <view class="place">投放时间</view>
            <view class="pri">{{item.playTime}}</view>
          </view>
          <view class="bottom">
            <view class="mark mark2">{{item.screenType === 1 ? '竖屏' : '横屏'}}</view>
            <view class="mark">{{item.lableType}}</view>
            <view class="num" v-if="orderInfo.sfbp === 0">×{{item.price}}</view>
            <view class="num" v-else>×{{orderInfo.bpprice}}</view>
          </view>
        </view>
      </view>
      <view class="total">
        <view class="text">合计</view>
        <view class="pri">¥{{orderInfo.amount ? orderInfo.amount : 0}}</view>
      </view>
    </view>
    <view class="order-info">
      <view class="info">
        <view class="line"></view>
        <view class="item">
          <view class="info-tit">订单信息</view>
        </view>
      </view>
      <view class="info">
        <view class="line none"></view>
        <view class="item">
          <view class="info-tit">订单编号</view>
          <view class="text">{{orderInfo.orderno}}</view>
        </view>
      </view>
      <view class="info">
        <view class="line none"></view>
        <view class="item">
          <view class="info-tit">创建时间</view>
          <view class="text">{{orderInfo.createTime}}</view>
        </view>
      </view>
      <block v-if="orderInfo.status == 0 || orderInfo.status == 2 || orderInfo.status == 3">
        <view class="info">
          <view class="line none"></view>
          <view class="item">
            <view class="info-tit">支付时间</view>
            <view class="text">{{orderInfo.payTime}}</view>
          </view>
        </view>
        <view class="info">
          <view class="line none"></view>
          <view class="item">
            <view class="info-tit">支付方式</view>
            <view class="text" v-if="orderInfo.payType === 2">余额支付</view>
            <view class="text" v-if="orderInfo.payType === 1">微信支付</view>
            <view class="text" v-if="orderInfo.payType === 3">积分支付</view>
          </view>
        </view>
      </block>
    </view>
    <view class="blank" v-if="orderInfo.status === 0"></view>
    <view class="btn-view" v-if="orderInfo.status === 0">
      <view class="btn cancel" @tap="clickCancel">取消订单</view>
      <view class="btn" @tap="clickPay">立即支付</view>
    </view>
    <view class="pop" v-if="showPop1">
      <image
        class="del"
        src="../static/images/ic_home_advertising_machine_close.png"
        @tap="clickHidden"
      />
      <view class="title">付款详情</view>
      <view class="item" @tap="clickSelectPayWay">
        <view class="ll">付款方式</view>
        <block v-if="pay_type === 1">
          <image class="pay-icon" src="../static/images/ic_home_payment_wechat.png" />
          <view class="pay-text">微信支付</view>
        </block>
        <block v-if="pay_type === 2">
          <image class="pay-icon" src="../static/images/ic_home_payment_wallet.png" />
          <view class="pay-text">余额支付</view>
        </block>
        <block v-if="pay_type === 3">
          <image class="pay-icon" src="../static/images/ic_home_payment_integral.png" />
          <view class="pay-text">积分支付</view>
        </block>
        <image class="arrow" src="../static/images/ic_home_open_1.png" />
      </view>
      <view class="item">
        <view class="ll">需付款</view>
        <view class="pri">{{orderInfo.amount}}元</view>
      </view>
      <button class="btn" @tap="clickConfirmPay">确认付款</button>
    </view>
    <view class="pop" v-if="showPop2">
      <view class="top">
        <image class="back" src="../static/images/ic_my_payment_return_3.png" @tap="clickPopBack" />
        <view class="top-tit">选择付款方式</view>
      </view>
      <view class="ct" @tap="clickPayWay(1)">
        <image class="ct-icon" src="../static/images/ic_home_payment_wechat.png" />
        <view class="ct-text">微信支付</view>
      </view>
      <view class="ct" :class="orderInfo.amount>money?'grey':''" @tap="clickPayWay(2)">
        <image class="ct-icon" src="../static/images/ic_home_payment_wallet.png" />
        <view class="ct-text">余额支付（余额：¥{{money}}）</view>
      </view>
      <view class="ct" :class="orderInfo.amount>integral?'grey':''" @tap="clickPayWay(3)">
        <image class="ct-icon" src="../static/images/ic_home_payment_integral.png" />
        <view class="ct-text">积分支付（积分：{{integral}}）</view>
      </view>
    </view>
    <view
      class="modal-mask"
      @tap="clickHidden"
      catchtouchmove="preventTouchMove"
      v-if="showPop1 || showPop2"
    ></view>
    <view class="modal-mask" catchtouchmove="preventTouchMove" v-if="showPay"></view>
    <view class="pop-pay" v-if="showPay">
      <view class="top">
        <view class="name">请输入支付密码</view>
        <image
          class="xx"
          src="../static/images/ic_home_advertising_machine_close.png"
          @tap="clickHidden"
        />
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
import request from "../utils/request";
import tip from "../utils/tip";
import { USER_TOKEN, USER_INFO, USER_SPECICAL_INFO } from "../utils/constant";
export default {
  config: {
    navigationBarTitleText: "广告详情"
  },

  data() {
    return {
      id: "",
      orderInfo: null,
      dateOpen: false,
      showPop1: false,
      showPop2: false,
      pay_type: 2, // 支付类型，0为未选 1-微信、2-余额、3-积分
      userInfo: null,
      showPay: false,
      isFocus: true,
      passLength: 6,
      payPassValue: "", //支付密码输入内容
      inputBan: false,
      money: 0, // 余额
      integral: 0, // 积分
      machineList: []
    };
  },
  onLoad(options) {
    this.id = options.id;
    this.getOrderInfo();
  },
  async onShow() {
    this.userInfo = uni.getStorageSync(USER_INFO) || null;
    await this.getUserAssets();
    await this.getUserIntegral();
  },
  methods: {
    //忘记支付密码
    clickForget() {
      this.$CommonJs.pathTo("/pages-home/updatePayPass");
    },
    //获取用户余额
    async getUserAssets() {
      const res = await this.$server.getUserAssets();
      this.money = res.data.data.amountKy;
    },
    //获取用户积分
    async getUserIntegral() {
      const res = await this.$server.getUserIntegral();
      this.integral = res.data.data.amountKy;
    },
    async getOrderInfo() {
      try {
        const payload = {
          orderId: this.id
        };
        const res = await this.$server.getMaterialsOrderDetail(payload);
        const orderInfo = res.data.data.materialDetail;
        orderInfo.putDay = orderInfo.putDay.split(",");
        orderInfo.bpsj = this.$CommonJs.bpsjFn(orderInfo.bpsj)
        this.orderInfo = orderInfo;
        this.machineList = res.data.data.machineList;
        this.machineList.map(item => {
          item.playTime = this.$CommonJs.bpsjFn(item.playTime)
        })
      } catch (error) {}
    },
    //取消订单
    async clickCancel() {
      await tip.confirm("确定要取消该订单?");
      const payload = {
        orderId: this.id
      };
      await this.$server.orderClose(payload);
      await tip.success("已取消该订单");
      uni.switchTab({
        url: "/pages/advertise"
      });
    },
    inputPayPass(e) {
      this.payPassValue = e.detail.value;
      let length = e.detail.value.length;
      if (length === 6) {
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
      this.showPop1 = false;
      this.showPop2 = false;
    },
    //跳转选择支付方式
    clickSelectPayWay() {
      this.showPop1 = false;
      this.showPop2 = true;
    },
    //选择支付方式
    clickPayWay(pay_type) {
      if (pay_type === 2) {
        //余额支付
        if (this.orderInfo.amount > this.money) {
          tip.toast("可支付余额不足");
          return;
        }
      }
      if (pay_type === 3) {
        //积分支付
        if (this.orderInfo.amount > this.integral) {
          tip.toast("可支付积分不足");
          return;
        }
      }
      this.pay_type = pay_type;
      this.showPop1 = true;
      this.showPop2 = false;
    },
    //弹框返回
    clickPopBack() {
      this.showPop1 = true;
      this.showPop2 = false;
    },
    //确认付款
    async clickConfirmPay() {
      if (this.pay_type === 0) {
        tip.toast("请选择支付方式");
        return;
      }
      //没有密码
      if (this.pay_type === 2 || this.pay_type == 3) {
        //余额  积分支付
        // if(!this.userInfo.has_password){
        //     uni.navigateTo({
        //       url:'./setPayPass'
        //     })
        //     return;
        //   }
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
    //立即支付
    clickPay(e) {
      this.showPop1 = true;
    },
    //点击投放时间
    clickDate() {
      this.dateOpen = !this.dateOpen;
    },
    async callPayOut() {
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
            url: "/pages-home/paySuccess?id=" + this.payId
          });
        })
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
    },
  }
};
</script>
<style lang="less">
.top-img {
  width: 100%;
  height: 200rpx;
  background: #fff;
  display: block;
}
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
      font-size: 28rpx;
      color: rgba(102, 102, 102, 1);
      word-break: break-all;
      margin-left: 30rpx;
    }
  }
  .video {
    display: block;
    width: 344rpx;
    height: 169rpx;
    margin: 0 auto;
    margin-bottom: 20rpx;
    &.min {
      width: 700rpx;
      height: 340rpx;
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
  margin-bottom: 20rpx;
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
          word-break: break-all;
          font-size: 22rpx;
          color: rgba(102, 102, 102, 1);
          margin-right: auto;
          width: 80%;
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
.info {
  width: 100%;
  background-color: #fff;
  display: flex;
  align-items: center;
  .line {
    width: 9rpx;
    height: 34rpx;
    background: rgba(247, 208, 67, 1);
    margin-right: auto;
  }
  .none {
    background: #fff;
  }
  .item {
    width: 721rpx;
    height: 85rpx;
    background: rgba(255, 255, 255, 1);
    display: flex;
    align-items: center;
    border-bottom: 1rpx solid #e5e5e5;
    padding-right: 30rpx;
    box-sizing: border-box;
    .info-tit {
      font-size: 28rpx;
      font-weight: bold;
      color: rgba(51, 51, 51, 1);
      margin-right: auto;
    }
    .text {
      font-size: 28rpx;
      color: rgba(20, 20, 20, 1);
    }
  }
}
.blank {
  width: 100%;
  height: 92rpx;
}
.btn-view {
  width: 100%;
  height: 92rpx;
  background: rgba(255, 255, 255, 1);
  display: flex;
  align-items: center;
  position: fixed;
  bottom: 0;
  left: 0;
  padding: 0 33rpx;
  box-sizing: border-box;
  .btn {
    width: 150rpx;
    height: 54rpx;
    line-height: 54rpx;
    background: rgba(255, 214, 2, 1);
    border-radius: 3rpx;
    font-size: 26rpx;
    color: rgba(20, 20, 20, 1);
    border: 2rpx solid rgba(255, 214, 2, 1);
    text-align: center;
  }
  .cancel {
    background: rgba(255, 255, 255, 1);
    color: rgba(102, 102, 102, 1);
    border: 2rpx solid #999999;
    margin-left: auto;
    margin-right: 24rpx;
  }
}
.pop {
  width: 640rpx;
  height: 687rpx;
  background: rgba(255, 255, 255, 1);
  border-radius: 20rpx;
  position: fixed;
  top: 200rpx;
  left: 55rpx;
  z-index: 99;
  .del {
    width: 45rpx;
    height: 45rpx;
    position: absolute;
    top: 30rpx;
    right: 30rpx;
  }
  .title {
    font-size: 36rpx;
    font-weight: bold;
    color: rgba(51, 51, 51, 1);
    text-align: center;
    margin-top: 56rpx;
  }
  .item {
    width: 100%;
    display: flex;
    align-items: center;
    padding: 0 30rpx 0 56rpx;
    box-sizing: border-box;
    margin-top: 45rpx;
    .ll {
      font-size: 26rpx;
      color: rgba(51, 51, 51, 1);
      margin-right: auto;
    }
    .pay-icon {
      width: 45rpx;
      height: 45rpx;
      margin-right: 10rpx;
    }
    .pay-text {
      font-size: 24rpx;
      color: rgba(102, 102, 102, 1);
      margin-right: 22rpx;
    }
    .arrow {
      width: 18rpx;
      height: 25rpx;
    }
    .pri {
      font-size: 36rpx;
      font-weight: bold;
      color: rgba(51, 51, 51, 1);
      margin-right: 40rpx;
    }
  }
  .btn {
    width: 555rpx;
    height: 85rpx;
    line-height: 85rpx;
    background: rgba(255, 214, 2, 1);
    border-radius: 10rpx;
    font-size: 32rpx;
    color: rgba(20, 20, 20, 1);
    margin-top: 250rpx;
  }
  .top {
    width: 100%;
    height: 100rpx;
    display: flex;
    align-items: center;
    padding: 0 40rpx;
    box-sizing: border-box;
    border-bottom: 1rpx solid rgba(207, 207, 207, 1);
    text-align: center;
    .back {
      width: 25rpx;
      height: 40rpx;
      flex: 0 0 auto;
    }
    .top-tit {
      width: 100rpx;
      flex: 1 0 auto;
      text-align: center;
      font-size: 36rpx;
      font-weight: bold;
      color: rgba(51, 51, 51, 1);
    }
  }
  .ct {
    width: 600rpx;
    height: 112rpx;
    padding: 0 37rpx;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    font-size: 30rpx;
    color: rgba(20, 20, 20, 1);
    border-bottom: 1rpx solid rgba(233, 233, 233, 1);
    .ct-icon {
      width: 35rpx;
      height: 38rpx;
      margin-right: 20rpx;
    }
  }
  .grey {
    color: rgba(174, 174, 174, 1);
  }
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
</style>
