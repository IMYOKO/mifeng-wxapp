<template>
  <view>
    <view class="content">
      <view
        class="item"
        v-for="(item, index) in bankList"
        :key="index"
        :data-index="index"
        @tap="clickChooseBank"
      >
        <view class="text">
          <view class="name">{{item.bankName}}</view>
          <view class="card">尾号{{item.tail}}{{item.typeText}}</view>
        </view>
      </view>
    </view>
    <button class="btn" @tap="clickAddBack">添加银行卡</button>
  </view>
</template>
<script>
import bankCheck from "../utils/bankCheck";
export default {
  data() {
    return {
      bankList: []
    };
  },
  onShow() {
    this.getBankList();
  },
  methods: {
    //添加银行卡
    clickAddBack() {
      uni.navigateTo({
        url: "/pages-user/addCard"
      });
    },
    //选择银行卡
    clickChooseBank(e) {
      let index = e.currentTarget.dataset.index;
      let chooseBank = this.bankList[index];
      uni.setStorageSync("chooseBank", chooseBank);
      uni.navigateBack();
    },

    async getBankList() {
      const json = await this.$server.getUserBankList();
      this.bankList = json.data.data.item.map(card => {
        card.tail = card.bankCard.slice(-4);
        const info = bankCheck.bankCardAttribution(card.bankCard);
        card.typeText = info.cardTypeName;
        return card;
      });
    }
  }
};
</script>
<style lang="less">
page {
  padding-bottom: 92rpx;
  box-sizing: border-box;
}
.content {
  width: 100%;
  background-color: #fff;
  .item {
    width: 100%;
    height: 144rpx;
    background: rgba(255, 255, 255, 1);
    display: flex;
    align-items: center;
    padding: 34rpx 50rpx;
    box-sizing: border-box;
    .text {
      margin-right: auto;
      .name {
        font-size: 28rpx;
        font-weight: bold;
        color: rgba(20, 20, 20, 1);
      }
      .card {
        margin-top: 8rpx;
        font-size: 24rpx;
        color: rgba(102, 102, 102, 1);
      }
    }
    .del {
      width: 45rpx;
      height: 45rpx;
      flex: 0 0 auto;
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
  position: fixed;
  bottom: 0;
  left: 0;
}
</style>