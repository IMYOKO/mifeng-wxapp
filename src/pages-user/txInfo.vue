<template>
  <view class="tx-info">
    <ul class="tx-list">
      <li>
        <view class="item">
          <span>用户昵称</span>
          <span>{{nickName}}</span>
        </view>
      </li>
      <li>
        <view class="item">
          <span>真实姓名</span>
          <span>{{userName}}</span>
        </view>
      </li>
      <li>
        <view class="item">
          <span>提现金额</span>
          <span>{{amount}} 元</span>
        </view>
      </li>
      <li>
        <view class="item">
          <span>银行卡号</span>
          <span>{{bankCard}}</span>
        </view>
      </li>
      <li>
        <view class="item">
          <span>银行名称</span>
          <span>{{bankName}}</span>
        </view>
      </li>
      <li>
        <view class="item">
          <span>支行名称</span>
          <span>{{bankBranch}}</span>
        </view>
      </li>
      <li>
        <view class="item">
          <span>审核状态</span>
          <span>{{statusText}}</span>
        </view>
      </li>
      <li>
        <view class="item">
          <span>提现时间</span>
          <span>{{createTime}}</span>
        </view>
      </li>
    </ul>
  </view>
</template>

<script>
export default {
  data () {
    return {
      id: null,
      nickName: '',
      amount: 0,
      userName: '',
      bankCard: '',
      bankName: '',
      bankBranch: '',
      status: '',
      statusText: '',
      createTime: '',
    }
  },
  onLoad (option) {
    this.id = Number(option.id)
    this.userCashAudit()
  },
  methods: {
    async userCashAudit () {
      const payload = {
        id: this.id
      }
      const res = await this.$server.userCashAudit(payload)
      this.nickName = res.data.data.nickName
      this.amount = res.data.data.amount
      this.userName = res.data.data.userName
      this.bankCard = res.data.data.bankCard
      this.bankName = res.data.data.bankName
      this.bankBranch = res.data.data.bankBranch
      let status = res.data.data.status
      this.status = status
      switch (status) {
        case 0:
          this.statusText = '待审核'
          break;
        case 1:
          this.statusText = '审核通过'
          break;
        case 2:
          this.statusText = '已驳回'
          break;
      }
      this.createTime = res.data.data.createTime
    }
  }
}
</script>

<style lang="less" scoped>
.tx-info {
  padding-top: 20rpx;
  .tx-list {
    li {
      margin-bottom: 10rpx;
      background: #fff;
      padding: 20rpx 25rpx;
      .item {
        display: flex;
        justify-content: space-between;
        span {
          font-size: 30rpx;
          line-height: 34rpx;
          color: #666;

          &:last-child {
            color: #000;
          }
        }
      }
    }
  }
}
</style>
