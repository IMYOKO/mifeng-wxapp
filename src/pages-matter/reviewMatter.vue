<template>
  <view class="review-matter">
    <view class="banner">
      <span v-if="auditStatus === 0">待审核素材</span>
      <span v-if="auditStatus === 1">已通过素材</span>
      <span v-if="auditStatus === 2">已驳回素材</span>
    </view>
    <view class="info-item">
      <span>创建时间</span>
      <span>{{createTime}}</span>
    </view>
    <view class="info-item">
      <span>用户昵称</span>
      <span>{{nickName}}</span>
    </view>
    <view class="matter-wrapper">
      <view class="top">
        <span>{{screenType === 1 ? '竖屏' : screenType === 2 ? '横屏' : ''}}</span>
        <span>{{materialTypeText}}</span>
      </view>

      <view class="matter-box">
        <view class="matter heng" v-if="screenType === 2 && materialType !== 5">
          <image @click="previewImage(logo)" :src='logo' v-if="materialType === 2" />
          <video :src="video" v-if="materialType === 4"></video>
        </view>
        <view class="matter shu" v-if="screenType === 1 && materialType !== 5">
          <image @click="previewImage(logo)" :src='logo' v-if="materialType === 1" />
          <video :src="video" v-if="materialType === 3"></video>
        </view>
        <view class="matter zhuhe" v-if="materialType === 5">
          <video :src="video"></video>
          <image  @click="previewImage(logo)" :src='logo' />
        </view>
      </view>
    </view>
    <view class="info-item" v-if="auditStatus === 0">
      <span>审核备注</span>
    </view>
    <view class="input-box" v-if="auditStatus === 0">
      <input type="text" placeholder="请输入审核备注" v-model="auditRemark" />
    </view>
    <view class="info-item btn" v-if="auditStatus === 0">
      <view class="left"></view>
      <view class="right">
        <span class="bohui" @click="sumbit(2)">驳回</span>
        <span @click="sumbit(1)">通过</span>
      </view>
    </view>
  </view>
</template>

<script>
import tip from "../utils/tip";
export default {
  data () {
    return {
      id: null,
      materialType: null,
      logo: '',
      video: '',
      screenType: null,
      auditStatus: null,
      nickName: '',
      auditRemark: '',
      createTime: '',
      materialTypeText: ''
    }
  },
  onLoad (option) {
    this.id = Number.parseInt(option.id)
    this.getMaterialsForAudit()
  },
  methods: {
    previewImage(url) {
      uni.previewImage({
        urls: [url]
      });
    },
    async getMaterialsForAudit() {
      const payload = {
        id: this.id
      }
      const res = await this.$server.getMaterialsForAudit(payload)
      const item = res.data.data.material
      let materialType = item.materialType
      this.materialType = materialType
      switch (materialType) {
        case 1:
          this.materialTypeText = '竖屏图片'
          break;
        case 2:
          this.materialTypeText = '横屏图片'
          break;
        case 3:
          this.materialTypeText = '竖屏视频'
          break;
        case 4:
          this.materialTypeText = '横屏视频'
          break;
        case 5:
          this.materialTypeText = '组合素材'
          break;
      }
      
      this.logo = item.logo
      this.video = item.video
      this.screenType = item.screenType
      this.auditStatus = item.auditStatus
      this.nickName = item.nickName
      this.createTime = item.createTime
    },
    async sumbit (auditStatus) {
      if (this.auditRemark == '') {
        tip.error('请输入审核备注')
        return;
      }
      const payload = {
        id: this.id,
        auditStatus,
        auditRemark: this.auditRemark
      }
      await this.$server.materialAudit(payload)
      tip.success('操作成功');
      this.getMaterialsForAudit();
    }
  }
}
</script>

<style lang="less" scoped>
.review-matter {
  .banner {
    height: 200rpx;
    background: #FFD602;
    text-align: center;
    font-size: 44rpx;
    font-weight: bold;
    line-height: 200rpx;
  }
  .info-item {
    height: 85rpx;
    line-height: 85rpx;
    padding: 0 30rpx;
    background: #fff;
    display: flex;
    font-size: 28rpx;
    justify-content: space-between;
    margin-bottom: 1rpx;
    &.btn {
      margin-top: 40rpx;
      .right {
        span {
          padding: 5rpx 20rpx;
          background: #FFD602;
          color: #141414;
          margin-left: 15rpx;
        }
        .bohui {
          color: #999;
          background: none;
          border: 1rpx solid #999;
        }
      }
    }
  }
  .matter-wrapper {
    margin: 20rpx 0;
    background: #fff;

    .top {
      height: 85rpx;
      line-height: 85rpx;
      padding: 0 30rpx;
      background: #fff;
      display: flex;
      font-size: 28rpx;
      color:rgba(20,20,20,1);
      justify-content: space-between;
      margin-bottom: 1rpx;
    }

    .matter-box {
      padding: 20rpx 0;
      display: flex;
      justify-content: center;

      .shu {
        width: 344rpx;

        image,
        video {
          width: 100%;
          height: 630rpx;
        }
      }
      .heng {
        width: 662rpx;
        image,
        video {
          width: 100%;
          height: 352rpx;
        }
      }
      .zhuhe {
        width: 662rpx;
        video {
          width: 100%;
          height: 352rpx;
          margin-bottom: 10rpx;
        }
        image {
          width: 100%;
          height: 268rpx;
        }
      }
    }

  }
  .input-box {
    background: #fff;
    padding: 10rpx 30rpx;

    input {
      font-size: 28rpx;
    }
  }
}
</style>
