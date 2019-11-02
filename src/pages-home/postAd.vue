<template>
  <view class="postAd">
    <image class="top-img" src="../static/images/pic_home_banner_2.png" />
    <view class="item pd mt" @click="clickChooseMatter">
      <view class="line"></view>
      <view class="tit">选择素材</view>
      <view class="text">{{material_name}}</view>
      <image class="arrow" src="../static/images/ic_home_open_1.png"/>
    </view>
    <view class="item pd bd-bt" @click="clickChooseMachine">
      <view class="line"></view>
      <view class="tit">选择广告机</view>
      <image class="add-icon" src="../static/images/ic_home_add_to.png"/>
    </view>
    <view class="content">
      <view class="item-ct bd-bt" v-for="(item, index) in machineCartList" :key="index">
        <image class="logo" :src="item.advertise_machine.logo" />
        <view class="middle">
          <view class="name">{{item.advertise_machine.name}}</view>
          <view class="place">
            {{item.advertise_machine.province}}{{item.advertise_machine.city}}{{item.advertise_machine.district}}{{item.advertise_machine.site}}
          </view>
          <view class="mark">{{item.advertise_machine.advertise_machine_label_type.name}}</view>
        </view>
        <image class="del" src="../static/images/ic_home_delete.png" @click="clickDelAdMachine(item.id)" />
      </view>
    </view>
    <view class="item pd mt">
      <view class="line"></view>
      <view class="tit">选择投放时间</view>
    </view>
    <view class="item pd mt" @click="clickChooseDate">
      <view class="line none"></view>
      <view class="tit">选择时间</view>
      <view class="text"></view>
      <image class="arrow" src="../static/images/ic_home_open_1.png" />
    </view>
    <view class="item pd">
      <view class="line none"></view>
      <view class="tit">投放天数</view>
      <view class="d-num">{{to_dates.length}}</view>
    </view>
    <view class="note">注：广告显示为当天循环播放，图片广告每次播放时长为15秒，视频+图片广告播放时长为视频时长（视频总时长不能超过一分钟）。价格以播放时长计算，X元/15秒</view>
    <view @click="clickSubmit">
      <!-- <formidTaker> -->
        <button class="btn">确认投放</button>
      <!-- </formidTaker> -->
    </view>
  </view>
</template>

<script>
export default {
  data () {
    return {
      machineCartList: [],
      material_id: '', //素材id
      material_name: '', //素材名称
      to_dates: [] //选择的日期
    }
  },
  onShow() {
    let matter = uni.getStorageSync('matter') || null;
    if (matter) {
      console.log(matter)
      this.material_id = matter.id || '';
      this.material_name = matter.name || '';
      uni.removeStorageSync('matter');
    }
    // let selectDate = wepy.getStorageSync('selectDate') || null;
    // if (selectDate) {
    //   this.to_dates = selectDate;
    //   this.$apply();
    //   wepy.removeStorageSync('selectDate');
    // }
    // //获取我的广告机购物车
    // this.getMachineCart();
  },
  methods: {
    //选择素材
    clickChooseMatter () {
      this.$CommonJs.pathTo('/pages-home/chooseMatter')
    },
    //选择广告机
    clickChooseMachine (option) {
      console.log(option)
      this.$CommonJs.pathTo('/pages-home/chooseAdMachine')
    },
    //选择时间
    clickChooseDate () {
      this.$CommonJs.pathTo('/pages-home/chooseDate')
    },
    // 确认投放
    clickSubmit () {
      console.log('clickSubmit')
      this.$CommonJs.pathTo('/pages-home/postAdDetail')
    }
  }
}
</script>

<style lang="less" scoped>
.postAd {
  .top-img {
    width: 100%;
    height: 200rpx;
    display: block;
  }
  .neck-ct {
    background-color: #fff;
    padding: 24rpx 58rpx 24rpx 0;
    box-sizing: border-box;

    textarea {
      width: 100%;
      height: 180rpx;
      border: none;
      background-color: #fff;
      padding: 12rpx 24rpx;
      box-sizing: border-box;
      font-size: 28rpx;
    }
  }
    .item {
    width: 100%;
    min-height: 84rpx;
    display: flex;
    align-items: center;
    background-color: #fff;

    .line {
      width: 9rpx;
      height: 34rpx;
      background: rgba(247, 208, 67, 1);
      margin-right: 24rpx;
      flex: 0 0 auto;
    }

    .tit {
      width: 180rpx;
      font-size: 28rpx;
      font-weight: bold;
      color: rgba(20, 20, 20, 1);
      margin-right: auto;
      flex: 0 0 auto;
    }

    .num {
      font-size: 28rpx;
      font-weight: bold;
      color: rgba(20, 20, 20, 1);
    }

    .d-num {
      font-size: 28rpx;
      color: rgba(102, 102, 102, 1);
    }

    .text {
      width: 55%;
      word-break: break-all;
      font-size: 28rpx;
      color: rgba(20, 20, 20, 1);
      margin-right: 15rpx;
      text-align: right;
    }

    .arrow {
      width: 20rpx;
      height: 25rpx;
      padding-top: 5rpx;
      display: block;
      flex: 0 0 auto;
    }

    .add-icon {
      width: 40rpx;
      height: 40rpx;
      display: block;
      flex: 0 0 auto;
    }
  }

  .content {
    width: 100%;
    background-color: #fff;
    padding: 20rpx 58rpx 20rpx 32rpx;
    box-sizing: border-box;

    .item-ct {
      width: 100%;
      display: flex;
      align-items: center;
      padding: 20rpx 0;
      box-sizing: border-box;

      .logo {
        width: 110rpx;
        height: 110rpx;
        margin-right: 25rpx;
        flex: 0 0 auto;
      }

      .middle {
        width: 100%;
        margin-right: auto;

        .name {
          width: 340rpx;
          word-wrap: break-word;
          font-size: 26rpx;
          font-weight: bold;
          color: rgba(20, 20, 20, 1);
        }

        .place {
          font-size: 22rpx;
          color: rgba(102, 102, 102, 1);
          margin-top: 8rpx;
          word-break: break-all;
        }

        .mark {
          width: 88rpx;
          text-align: center;
          font-size: 22rpx;
          color: rgba(195, 83, 1, 1);
          background: rgba(255, 242, 225, 1);
          padding: 0 10rpx;
          box-sizing: border-box;
          margin-top: 8rpx;
        }
      }

      .del {
        width: 45rpx;
        height: 45rpx;
        display: block;
        margin-right: 5rpx;
        flex: 0 0 auto;
      }
    }
  }

  .note {
    width: 100%;
    background: rgba(255, 238, 236, 1);
    font-size: 24rpx;
    color: rgba(254, 56, 36, 1);
    padding: 22rpx 55rpx;
    box-sizing: border-box;
  }

  .btn {
    width: 675rpx;
    height: 92rpx;
    line-height: 92rpx;
    background: rgba(255, 214, 2, 1);
    border-radius: 5rpx;
    font-size: 36rpx;
    color: rgba(20, 20, 20, 1);
    margin: 50rpx auto;
  }

  .pd {
    padding-right: 58rpx;
    box-sizing: border-box;
  }

  .mt {
    margin-top: 20rpx;
  }

  .bd-bt {
    border-bottom: 1rpx solid #f1f0f6;
  }

  .none {
    background: #fff !important;
  }
}
</style>
