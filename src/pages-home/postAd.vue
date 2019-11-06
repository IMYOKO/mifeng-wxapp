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
        <image class="logo" :src="item.logo" />
        <view class="middle">
          <view class="name">{{item.machineName}}</view>
          <view class="place">
            {{item.province}}{{item.city}}{{item.district}}{{item.address}}
          </view>
          <view class="mark">{{item.labelType}}</view>
        </view>
        <image class="del" src="../static/images/ic_home_delete.png" @click="clickDelAdMachine(index)" />
      </view>
    </view>
    <view class="item pd mt">
      <view class="line"></view>
      <view class="tit">选择投放类型</view>
      <picker mode="selector" :range="typeRange" :value="type" @change="typeChange">
        <view class="itembtn" :class="{'no-select': type === 0}">{{typeRange[type]}}</view>
      </picker>
    </view>
    <block v-if="type === 1 || type === 2">
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
    </block>
    <block v-if="type === 2">
      <picker mode="selector" :range="bapingRange" :value="bapingType" @change="bapingTypeChange">
        <view class="item pd mt">
          <view class="line none"></view>
          <view class="tit">选择时间</view>
          <view class="text"></view>
          <image class="arrow" src="../static/images/ic_home_open_1.png" />
        </view>
      </picker>
      <view class="item pd">
        <view class="line none"></view>
        <view class="tit">霸屏时间</view>
        <view class="d-num">{{bapingType >= 0 ? dictData[bapingType].dictLabel : 0}}</view>
      </view>
    </block>
    <view class="note">注：广告显示为当天循环播放，图片广告每次播放时长为15秒，视频+图片广告播放时长为视频时长（视频总时长不能超过一分钟）。价格以播放时长计算，X元/15秒</view>
    <view @click="clickSubmit">
      <!-- <formidTaker> -->
        <button class="btn">确认投放</button>
      <!-- </formidTaker> -->
    </view>
  </view>
</template>

<script>
import tip from '../utils/tip';
export default {
  data () {
    return {
      machineCartList: [],
      material_id: '', //素材id
      material_name: '', //素材名称
      to_dates: [], //选择的日期,
      dictData: [],
      type: 0,
      typeRange: ['请选择', '按天投放', '霸屏投放'],
      bapingRange: [],
      bapingType: -1
    }
  },
  onShow() {
    let matter = uni.getStorageSync('matter') || null;
    if (matter) {
      this.material_id = matter.id || '';
      this.material_name = matter.name || '';
      uni.removeStorageSync('matter');
    }
    let selectDate = uni.getStorageSync('selectDate') || null;
    if (selectDate) {
      this.to_dates = selectDate;
      uni.removeStorageSync('selectDate');
    }
    // //获取我的广告机购物车
    this.getMachineCart();

    this.getDictData()
  },
  methods: {
    typeChange (e) {
      this.type = Number(e.detail.value);
    },
    bapingTypeChange (e) {
      this.bapingType = Number(e.detail.value);
    },
    //选择素材
    clickChooseMatter () {
      this.$CommonJs.pathTo('/pages-home/chooseMatter')
    },
    //选择广告机
    clickChooseMachine (option) {
      this.$CommonJs.pathTo('/pages-home/chooseAdMachine')
    },
    //选择时间
    clickChooseDate () {
      this.$CommonJs.pathTo('/pages-home/chooseDate?to_dates=' + this.to_dates)
    },
    // 确认投放
    clickSubmit () {
      this.$CommonJs.pathTo('/pages-home/postAdDetail')
    },
    getMachineCart () {
      const machineCartList = uni.getStorageSync('adMachineId') || []
      this.machineCartList = machineCartList
    },
    async clickDelAdMachine(index) {
      await tip.confirm('确定取消该广告机?');
      // const json = await request({
      //   url: 'advertise_machine_cart_items/delete',
      //   method: 'POST',
      //   loading: '',
      //   data: {
      //     id: id
      //   }
      // });
      this.machineCartList.splice(index, 1)
      uni.setStorageSync('adMachineId', this.machineCartList);

      await tip.success('已取消');
    },
    async clickSubmit() {
      if (!this.material_id) {
        tip.toast('请选择素材');
        return;
      }
      if (this.machineCartList.length === 0) {
        tip.toast('请选择广告机');
        return;
      }
      if (this.type === 0) {
        tip.toast('请选择投放方式');
        return;
      }
      if (this.to_dates.length === 0) {
        tip.toast('请选择投放时间');
        return;
      }
      if (this.type === 2 && this.bapingType === -1) {
        tip.toast('请选择霸屏时间');
        return;
      }
      // const json = await request({
      //   url: 'orders/store',
      //   method: 'POST',
      //   loading: '',
      //   data: {
      //     to_dates: this.to_dates,
      //     material_id: this.material_id,
      //     name: this.name,
      //     pay_type: 1
      //   }
      // });
      try {
        const machineIds = this.machineCartList.map(item => item.id).join(',')
        const putDays = this.to_dates.map(item => item).join(',')
        const dictId = this.type === 2 ? this.dictData[this.bapingType].id : 0
        const payload = {
          machineIds,
          materialId: this.material_id,
          putDays,
          dictId
        }
        const res = await this.$server.addMaterialOrder(payload)
        const orderId = res.data.data.orderId
        await tip.success('下单成功');
        this.$CommonJs.pathTo('/pages-home/postAdDetail?id=' + orderId)
      } catch (error) {}
    },
    async getDictData () {
      try {
        const res = await this.$server.getDictData()
        this.dictData = res.data.data.dictData
        let bapingRange = []
        this.dictData.map(item => bapingRange.push(item.dictLabel))
        this.bapingRange = bapingRange
      } catch (error) {
        
      }
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

    .itembtn {
      font-size: 28rpx;

      &.no-select {
        opacity: .4;
      }
    }
  }

  .bd-bt {
    border-bottom: 1rpx solid #f1f0f6;
  }

  .none {
    background: #fff !important;
  }
}
</style>
