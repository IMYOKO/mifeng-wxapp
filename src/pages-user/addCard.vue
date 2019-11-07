<template>
  <view class="addCard">
    <form @submit="formSubmit" @reset="formReset">
      <view class="tip">填写卡号</view>
      <view class="content">
        <view class="item none">
          <view class="tit">卡号</view>
          <input
            class="large-text"
            type="text"
            placeholder="请输入开户银行卡号"
            name="bank_card_numbers"
            placeholder-class="input-placeholder"
            @input="inputCard"
          />
        </view>
        <view class="item none">
          <view class="tit">支行名称</view>
          <input
            class="large-text"
            type="text"
            placeholder="请输入银行支行名称"
            name="bank_branch_name"
            placeholder-class="input-placeholder"
          />
        </view>
      </view>
      <view class="tip">信息验证</view>
      <view class="content">
        <view class="item">
          <view class="tit">姓名</view>
          <input
            class="large-text"
            type="text"
            maxlength="6"
            placeholder="请输入您的真实姓名"
            name="name"
            placeholder-class="input-placeholder"
          />
        </view>
        <view class="item">
          <view class="tit">身份证</view>
          <input
            class="large-text"
            type="idcard"
            placeholder="请输入身份证号码"
            maxlength="18"
            name="identity_card_number"
            placeholder-class="input-placeholder"
          />
        </view>
        <view class="item">
          <view class="tit">手机号</view>
          <input
            class="large-text"
            type="number"
            placeholder="请输入银行预留手机号"
            name="phone"
            maxlength="11"
            placeholder-class="input-placeholder"
            @input="inputPhone"
          />
        </view>
        <view class="item none">
          <view class="tit">验证码</view>
          <input
            type="text"
            placeholder="请输入验证码"
            name="request_code"
            maxlength="6"
            placeholder-class="input-placeholder"
          />
          <view class="yzm" :class="isSend?'disabled':''" @tap="clickYzm">{{yzmContent}}</view>
        </view>
      </view>
      <button class="btn" form-type="submit">下一步</button>
    </form>
  </view>
</template>

<script>
import request from "../utils/request";
import tip from "../utils/tip";
import bankCheck from "../utils/bankCheck";
import { USER_TOKEN, USER_INFO, USER_SPECICAL_INFO } from "../utils/constant";
export default {
  config: {
    navigationBarTitleText: "添加银行卡"
  },
  data() {
    return {
      yzmContent: "获取验证码",
      isSend: false,
      count_task: null,
      phone: "",
      relevance_bank: "", //银行卡名
      card_name: "", //储蓄卡 信用卡
      bankBranch: "" // 支行名称
    };
  },
  onUnload() {
    clearInterval(this.count_task); //停止计时
  },
  methods: {
    //输入电话
    inputPhone(e) {
      this.phone = e.detail.value;
    },
    //输入银行卡
    inputCard(e) {
      let temp = bankCheck.bankCardAttribution(e.detail.value);
      console.log(temp);
      if (temp != "error") {
        this.relevance_bank = temp.bankName;
        this.card_name = temp.cardTypeName;
      } else {
        this.relevance_bank = "";
        this.card_name = "";
      }
    },
    inputBranch(e) {
      this.bankBranch = e.detail.value;
    },
    //获取验证码
    async clickYzm() {
      if (this.isSend) return;
      let myreg = /^[1][0-9]{10}$/;
      if (!myreg.test(this.phone)) {
        tip.toast("请输入合法的手机号码");
        return;
      }
      this.isSend = true;
      //发送成功
      // 按钮倒计时
      var count = 60;
      var curCount = count; //当前剩余秒数
      this.isSend = true;
      this.yzmContent = curCount + "s后可重发";
      var task = () => {
        if (curCount == 0) {
          this.isSend = false;
          this.yzmContent = "重新发送";
          clearInterval(this.count_task); //停止计时器
        } else {
          curCount--;
          this.yzmContent = curCount + "s后可重发";
        }
      };
      task();
      this.count_task = setInterval(task, 1000);
      const json = await this.$server.getCode({
        username: this.phone,
        type: 5
      });
    },
    async formSubmit(e) {
      let bankCard = e.detail.value.bank_card_numbers;
      let bankName = this.relevance_bank;
      let idcard = e.detail.value.identity_card_number;
      let userName = e.detail.value.name;
      let verifyCode = e.detail.value.request_code;
      let bankBranch = e.detail.value.bank_branch_name;
      let phone = this.phone;
      if (!bankCard) {
        tip.toast("请输入银行卡号");
        return;
      }
      if (!bankBranch) {
        tip.toast("请输入银行支行名称");
        return;
      }
      if (!bankName) {
        tip.toast("不支持该类型的银行卡");
        return;
      }
      if (!userName) {
        tip.toast("请输入您的真实姓名");
        return;
      }
      var reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
      if (!reg.test(idcard)) {
        tip.toast("请输入合法的身份证号码");
        return;
      }
      let myreg = /^[1][0-9]{10}$/;
      if (!myreg.test(phone)) {
        tip.toast("请输入合法的手机号码");
        return;
      }
      if (!verifyCode) {
        tip.toast("请输入验证码");
        return;
      }
      const json = await this.$server.addUserBank({
        bankCard,
        bankName,
        bankBranch,
        idcard,
        verifyCode,
        userName
      });
      await tip.success("添加成功");
      uni.navigateBack();
    }
  }
};
</script>

<style lang="less" scoped>
.tip {
  width: 100%;
  height: 68rpx;
  line-height: 68rpx;
  font-size: 24rpx;
  color: rgba(155, 155, 155, 1);
  padding-left: 45rpx;
  box-sizing: border-box;
}
.content {
  width: 720rpx;
  min-height: 95rpx;
  background: rgba(255, 255, 255, 1);
  margin: 0 auto;
  padding: 0 30rpx;
  box-sizing: border-box;
  .item {
    width: 100%;
    height: 90rpx;
    display: flex;
    align-items: center;
    border-bottom: 1rpx solid #e3e3e4;
    .tit {
      width: 160rpx;
      font-size: 30rpx;
      color: rgba(0, 0, 0, 1);
      margin-right: 20rpx;
    }
    .large-text {
      width: 100%;
    }
    input {
      min-width: 320rpx;
    }
    .yzm {
      width: 200rpx;
      height: 81rpx;
      line-height: 81rpx;
      background: rgba(255, 214, 2, 1);
      border-radius: 5rpx;
      font-size: 26rpx;
      color: rgba(20, 20, 20, 1);
      text-align: center;
      flex: 0 0 auto;
    }
    .disabled {
      background: #ccc;
    }
  }
  .none {
    border: 0;
  }
}
.btn {
  width: 675rpx;
  height: 92rpx;
  line-height: 92rpx;
  background: rgba(255, 214, 2, 1);
  border-radius: 5rpx;
  font-size: 36rpx;
  color: rgba(20, 20, 20, 1);
  margin-top: 50rpx;
}
</style>
