<template>
  <view class="container">
    <view class="tit">
      请输入6位数
      <text>支付密码</text>
    </view>
    <input
      type="number"
      style="min-height: 0;max-height: 0;color: #fff;"
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
          :value="payPassValue.length>=index+1?payPassValue[index]:''"
          disabled
          @tap.stop="clickPassInput"
        />
      </block>
    </view>
    <button class="btn" @tap="clickSure">确定</button>
  </view>
</template>
<script>
import { updateUserInfo } from "../utils/user";
import tip from "../utils/tip";
import { USER_TOKEN, USER_INFO, USER_SPECICAL_INFO } from "../utils/constant";
export default {
  config: {
    navigationBarTitleText: "设置支付密码"
  },
  data() {
    return {
      isFocus: true,
      passLength: 6,
      payPassValue: "", //支付密码输入内容
      type: 1 //1支付时设置密码，2主动设置密码
    };
  },

  onLoad(options) {
    this.type = options.type || 1;
  },
  methods: {
    inputPayPass(e) {
      this.payPassValue = e.detail.value;
    },
    //失去焦点
    blurPayPass() {
      let that = this;
      that.isFocus = false;
    },
    //点击聚焦
    clickPassInput() {
      let that = this;
      that.isFocus = true;
    },
    async clickSure() {
      const res = await this.$server.updatePaypwd({
        newPwd: this.payPassValue
      });
      updateUserInfo({ has_password: true });
      uni.navigateTo({
        url: "/pages-user/setPassSuccess?type=" + this.type
      });
    }
  }
};
</script>
<style lang="less">
page {
  position: relative;
  background-color: #fff;
}
.container {
  position: relative;
  padding: 1px;
  box-sizing: border-box;
}
.tit {
  font-size: 30rpx;
  color: rgba(102, 102, 102, 1);
  text-align: center;
  margin-top: 130rpx;
  margin-bottom: 50rpx;
  text {
    color: #333;
    font-weight: bold;
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
.btn {
  width: 675rpx;
  height: 92rpx;
  line-height: 92rpx;
  background: rgba(255, 214, 2, 1);
  border-radius: 5rpx;
  font-size: 32rpx;
  color: rgba(20, 20, 20, 1);
  margin-top: 50rpx;
}
</style>
