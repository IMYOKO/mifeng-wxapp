<template>
  <view>
    <image class="top-img" src="../static/images/pic_home_banner_2.png" />
    <view class="item pd mt" @tap="clickChooseMatter">
      <view class="line"></view>
      <view class="tit">选择素材</view>
      <view class="text">{{material_id}}</view>
      <image class="arrow" src="../static/images/ic_home_open_1.png" />
    </view>
    <view class="item pd bd-bt" @tap="clickChooseMachine">
      <view class="line"></view>
      <view class="tit">选择广告机</view>
      <image class="add-icon" src="../static/images/ic_home_add_to.png" />
    </view>
    <view class="content">
      <view class="item-ct bd-bt" v-for="(item, index) in machineCartList" :key="index">
        <image class="logo" :src="item.logo" />
        <view class="middle">
          <view class="name">{{item.machineName}}</view>
          <view class="place">{{item.province}}{{item.city}}{{item.district}}{{item.address}}</view>
          <view class="mark mark2">{{item.screenType === 1 ? '竖屏' : '横屏'}}</view>
          <view class="mark">{{item.labelType}}</view>
        </view>
        <image
          v-if="!item.notDel"
          class="del"
          src="../static/images/ic_home_delete.png"
          @tap="clickDelAdMachine(index)"
        />
      </view>
    </view>
    <view class="item pd mt">
      <view class="line"></view>
      <view class="tit">投放类型</view>
      <view class="itembtn itembtn2">
        <view class="bp" :class="{select: type === 1}">按天投放</view>
        <!-- <view class="bp" :class="{select: type === 2}" @click="selectType(2)">霸屏投放</view> -->
      </view>
    </view>
    <block v-if="type === 1">
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
      <picker mode="multiSelector" @columnchange="bindMultiPickerColumnChange" :value="multiIndex" :range="multiArray">
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
        <view class="d-num">
          {{multiArray[0][multiIndex[0]]}}小时 {{multiArray[1][multiIndex[1]]}}分钟
        </view>
      </view>
    </block>
    <view class="note" v-if="type === 1">注：广告显示为当天无限循环播放；图片广告每次播放时长为15秒；视频广告每次播放时长为视频时长，视频价格视频时长计算，X元/15秒。</view>
    <view class="note" v-if="type === 2">注：广告加载完毕后马上显示在广告机上；霸屏播放时长为客户选择时长，价格按分钟计算。X元/分钟。</view>
    <button class="btn" @tap="clickSubmit">确认投放</button>
  </view>
</template>

<script>
import tip from "../utils/tip";
import { USER_TOKEN, USER_INFO, USER_SPECICAL_INFO } from "../utils/constant";
let hourArr = []
for(let i = 0; i < 24; i++) {
  hourArr.push(i)
}
let minArr = []
for(let i = 0; i < 60; i++) {
  minArr.push(i)
}
export default {
  data() {
    return {
      id: "",
      nameLength: 0, //广告名称长度
      machineCartList: [],
      material_id: "", //素材id
      material_name: "", //素材名称
      to_dates: [], //选择的日期
      dictData: [],
      type: 1,
      typeRange: ["请选择", "按天投放", "霸屏投放"],
      bapingRange: [],
      bapingType: -1,
      material_screenType: null,
      multiArray: [
        hourArr,
        minArr
      ],
      multiIndex: [0, 0],
    };
  },

  onLoad(options) {
    this.id = options.id;
    this.material_screenType = options.material_screenType || null;
  },
  onShow() {
    let matter = uni.getStorageSync("matter") || null;
    if (matter) {
      this.material_id = matter.id || "";
      this.material_name = matter.name || "";
      this.material_screenType = matter.screenType || null;
    }
    let selectDate = uni.getStorageSync("selectDate") || null;
    if (selectDate) {
      this.to_dates = selectDate;
    }
    //获取我的广告机购物车
    this.getMachineCart();

  },
  onUnload() {
    uni.removeStorageSync("matter");
    uni.removeStorageSync("selectDate");
    uni.setStorageSync("adMachineId", []);
  },
  methods: {
    bindMultiPickerColumnChange (e) {
      console.log('修改的列为：' + e.detail.column + '，值为：' + e.detail.value)
      this.multiIndex[e.detail.column] = e.detail.value
      this.$forceUpdate()
    },
    selectType (type) {
      this.type = type
      this.bapingType = type
      if (this.type === 1) {
        this.to_dates = [];
      }
      if (this.type === 2) {
        const times = new Date().getTime()
        const to_dates = this.$CommonJs.timestampToTime(times, false, 'YMD')
        this.to_dates = [to_dates]
        console.log(this.to_dates)
      }
    },
    //选择时间
    clickChooseDate() {
      if (this.machineCartList.length === 0) {
        tip.toast("请选择广告机");
        return;
      }
      const machineIds = this.machineCartList.map(item => item.id).join(",");
      uni.navigateTo({
        url:
          "/pages-home/chooseDate?to_dates=" +
          this.to_dates +
          "&free=1"
           + '&machineIds=' + machineIds
      });
    },
    //选择素材
    clickChooseMatter() {
      if (this.machineCartList.length > 0) {

        this.$CommonJs.pathTo("/pages-home/chooseMatter?material_screenType=" +
            this.material_screenType);
      } else {

        this.$CommonJs.pathTo("/pages-home/chooseMatter?material_screenType=" +
            this.material_screenType + "&noMachineCartList=yes");
      }
    },
    //选择广告机
    clickChooseMachine() {
      this.$CommonJs.pathTo(
        "/pages-home/chooseAdMachine?material_screenType=" +
          this.material_screenType + "&isFree=free"
      );
    },
    //删除广告机
    async clickDelAdMachine(index) {
     await tip.confirm("确定取消该广告机?");
      this.machineCartList.splice(index, 1);
      uni.setStorageSync("adMachineId", this.machineCartList);
      await tip.success("已取消");
    },
    //确认投放
    async clickSubmit() {
      if (!this.material_id) {
        tip.toast("请选择素材");
        return;
      }
      if (this.machineCartList.length === 0) {
        tip.toast("请选择广告机");
        return;
      }
      if (this.type === 0) {
        tip.toast("请选择投放方式");
        return;
      }
      if (this.to_dates.length === 0) {
        tip.toast("请选择投放时间");
        return;
      }
      if (this.type === 2 && this.multiArray[0][this.multiIndex[0]] === 0 && this.multiArray[1][this.multiIndex[1]] === 0) {
        tip.toast("请选择霸屏时间");
        return;
      }
      try {
        const machineIds = this.machineCartList.map(item => item.id).join(",");
        const putDays = this.to_dates.map(item => item).join(",");
        // const dictId = this.type === 2 ? this.dictData[this.bapingType].id : 0;
        const payload = {
          machineIds,
          materialId: this.material_id,
          putDays,
          bpsj: 0,
          publishEntry: 1
        };
        if (this.type === 2) {
          payload.bpsj = this.multiArray[0][this.multiIndex[0]] * 60 * 60 + this.multiArray[1][this.multiIndex[1]] * 60
        }
        console.log(payload)
        const res = await this.$server.addMaterialOrder(payload);
        const orderId = res.data.data.orderId;
        const orderStatus = res.data.data.status;
        await tip.success("下单成功");
        uni.removeStorageSync("matter");
        uni.removeStorageSync("selectDate");
        uni.setStorageSync("adMachineId", []);
        this.$CommonJs.pathTo("/pages-home/postAdDetail?orderStatus=" + orderStatus + "&id=" + orderId);
      } catch (error) {
        const status = error.data.status
        const data = error.data.data
        this.delMachineCart(status, data)
      }
    },
    async delMachineCart (status, data) {
      if (status === 10109) {
        await tip.confirm("当前时间段，存在不可用的广告机，是否移除?");
        data.map(item => {
          this.machineCartList.map((value, index) => {
            if (value.id === item.id) {
              this.machineCartList.splice(index, 1);
            }
          })
        })
        uni.setStorageSync("adMachineId", this.machineCartList);
      }
    },
    async getDictData() {
      try {
        const res = await this.$server.getDictData();
        this.dictData = res.data.data.dictData;
        let bapingRange = [];
        this.dictData.map(item => bapingRange.push(item.dictLabel));
        this.bapingRange = bapingRange;
      } catch (error) {}
    },
    getMachineCart() {
      const machineCartList = uni.getStorageSync("adMachineId") || [];
      this.machineCartList = machineCartList;
    }
  }
};
</script>

<style lang="less">
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
    word-wrap: break-word;
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
        text-align: center;
        font-size: 22rpx;
        color: rgba(195, 83, 1, 1);
        background: rgba(255, 242, 225, 1);
        padding: 0 10rpx;
        box-sizing: border-box;
        margin-top: 8rpx;
        display: inline-block;

        &.mark2 {
          margin-right: 2px;
          background: #575757;
          color: #f6e186;
        }
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
      opacity: 0.4;
    }
  }
}
.bd-bt {
  border-bottom: 1rpx solid #f1f0f6;
}
.none {
  background: #fff !important;
}
</style>
