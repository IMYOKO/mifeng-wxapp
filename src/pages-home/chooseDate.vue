<template>
  <view class="chooseDate">
    <view class="wrap">
      <view>
        <view class="date-show">
          <image
            class="tap-icon"
            src="../static/images/ic_home_calendar_previous_page.png"
            mode="aspectFit"
            @tap="lastMonth"
          />
          <view class="dete-now">{{year}}年 - {{month}}月</view>
          <image
            class="tap-icon"
            src="../static/images/ic_home_calendar_next_page.png"
            mode="aspectFit"
            @tap="nextMonth"
          />
        </view>
      </view>
      <view class="header">
        <view
          v-for="(item, index) in date"
          :key="index"
          :class="(index == todayIndex) && isTodayWeek ? 'weekMark' : ''"
        >
          {{item}}
          <view></view>
        </view>
      </view>
      <view class="date-box">
        <view v-for="(item, index) in dateArr" :key="index"  :class="isToday == item.isToday ? 'nowDay' : ''" :data-date="item.isToday">			
          <view class="date-head" :class="item.unUse?'un-use':'' || item.isSelected?'selected':''" :data-dateLine = "item.dateLine" :data-index = "index"  v-if="item.unUse">{{item.dateNum}}</view>
          <view class="date-head" :class="item.unUse?'un-use':'' || item.isSelected?'selected':''" :data-dateLine = "item.dateLine" :data-index = "index" @tap = "clickDateNum" v-else>{{item.dateNum}}</view>
          <view class='date-weight'></view>
        </view>
      </view>
    </view>
    <view class="tip">
      <view class="tip-item">
        <view class="tip-icon now"></view>
        <view class="tip-text">当前日期</view>
      </view>
      <view class="tip-item">
        <view class="tip-icon"></view>
        <view class="tip-text">投放日期</view>
      </view>
    </view>
    <view class="daynum">共选择天数 {{selectDate.length}}</view>
    <button class="btn" @tap="clickSure">确定</button>
  </view>
</template>

<script>
import tip from '../utils/tip';
import util from '../utils/util';
export default {
  data() {
    return {
      year: 0,
      month: 0,
      date: ["日", "一", "二", "三", "四", "五", "六"],
      dateArr: [],
      isToday: "",
      isTodayWeek: false,
      selectDate: [], //选择的日期
      unUseDate: [] //无法选择的日期
    };
  },
  async onLoad(options) {
    let free = options.free;
    let advertise_machine_id = options.advertise_machine_id;
    let to_dates = options.to_dates;
    if (to_dates) {
      this.selectDate = to_dates.split(",");
    } else {
      this.selectDate = [];
    }
    let now = new Date();
    let year = now.getFullYear();
    let month = now.getMonth() + 1;
    this.year = year;
    this.month = month;
    let this_month_day =
      "" + year + "-" + (month < 10 ? "0" + month : month) + "-" + "01";
    await this.getUnuseDate(this_month_day, free, advertise_machine_id);
    this.isToday =
      "" +
      year +
      "-" +
      (month < 10 ? "0" + month : month) +
      "-" +
      now.getDate();
    this.dateInit();
  },
  methods: {
    //选择日期
    clickDateNum(e) {
      let date = e.currentTarget.dataset.dateline; //选择的日期
      let index = e.currentTarget.dataset.index; //选择的日期
      let flag = this.selectDate.indexOf(date);
      console.log(flag);
      if (flag == -1) {
        //不存在
        this.selectDate.push(date);
        this.dateArr[index].isSelected = true;
      } else {
        this.selectDate.splice(flag, 1);
        this.dateArr[index].isSelected = false;
      }
    },
    async lastMonth() {
      //全部时间的月份都是按0~11基准，显示月份才+1
      let year = this.month - 2 < 0 ? this.year - 1 : this.year;
      let month = this.month - 2 < 0 ? 11 : this.month - 2;
      this.year = year;
      this.month = month + 1;
      let this_month_day =
        "" +
        this.year +
        "-" +
        (this.month < 10 ? "0" + this.month : this.month) +
        "-" +
        "01";
        console.log(this_month_day)
      await this.getUnuseDate(this_month_day);
      this.dateInit(year, month);
    },
    async nextMonth() {
      //全部时间的月份都是按0~11基准，显示月份才+1
      let year = this.month > 11 ? this.year + 1 : this.year;
      let month = this.month > 11 ? 0 : this.month;
      this.year = year;
      this.month = month + 1;
      let this_month_day =
        "" +
        this.year +
        "-" +
        (this.month < 10 ? "0" + this.month : this.month) +
        "-" +
        "01";
      await this.getUnuseDate(this_month_day);
      this.dateInit(year, month);
    },
    //确定
    clickSure() {
      uni.setStorageSync("selectDate", this.selectDate);
      uni.navigateBack();
    },
    //获取不可以使用的日期
    async getUnuseDate(this_month_day, free = 0, advertise_machine_id = 0) {
      // const json = await request({
      //   url: "advertise_machine_cart_items/no_allow_dates",
      //   methd: "GET",
      //   loading: "",
      //   data: {
      //     this_month_day: this_month_day,
      //     advertise_machine_id: advertise_machine_id,
      //     free: free
      //   }
      // });
      // this.unUseDate = json.data;
      try {
        const payload = {
          machineIds: `${advertise_machine_id}`
        }
        const res = await this.$server.checkDate(payload)
        this.unUseDate = res.data.data.dataList;
      } catch (error) {
        
      }
    },
    dateInit(setYear, setMonth) {
      //全部时间的月份都是按0~11基准，显示月份才+1
      let dateArr = []; //需要遍历的日历数组数据
      let arrLen = 0; //dateArr的数组长度
      let now = setYear ? new Date(setYear, setMonth) : new Date();
      let year = setYear || now.getFullYear();
      let nextYear = 0;
      let month = setMonth || now.getMonth(); //没有+1方便后面计算当月总天数
      let nextMonth = month + 1 > 11 ? 1 : month + 1;
      let startWeek = new Date(year + "/" + (month + 1) + "/" + 1).getDay(); //目标月1号对应的星期
      let dayNums = new Date(year, nextMonth, 0).getDate(); //获取目标月有多少天
      let obj = {};
      let num = 0;

      if (month + 1 > 11) {
        nextYear = year + 1;
        dayNums = new Date(nextYear, nextMonth, 0).getDate();
      }
      arrLen = startWeek + dayNums;
      for (let i = 0; i < arrLen; i++) {
        if (i >= startWeek) {
          num = i - startWeek + 1;
          obj = {
            isToday:
              "" +
              year +
              "-" +
              (month + 1 < 10 ? "0" + (month + 1) : month + 1) +
              "-" +
              (num < 10 ? "0" + num : num),
            dateLine:
              "" +
              year +
              "-" +
              (month + 1 < 10 ? "0" + (month + 1) : month + 1) +
              "-" +
              (num < 10 ? "0" + num : num),
            dateNum: num,
            weight: 5
          };
        } else {
          obj = {};
        }
        dateArr[i] = obj;
      }
      this.dateArr = dateArr;
      let tempDateArr = this.dateArr;
      for (var i in tempDateArr) {
        if (tempDateArr[i].dateLine) {
          for (var k in this.selectDate) {
            if (tempDateArr[i].dateLine == this.selectDate[k]) {
              this.dateArr[i].isSelected = true;
              continue;
            }
          }
          if (
            util.getTimeStamp(tempDateArr[i].dateLine) <
            util.getTimeStamp(this.isToday)
          ) {
            //时间未大于今天  不能选取
            this.dateArr[i].unUse = true;
          }
        }
      }

      for (var i in this.dateArr) {
        for (var j in this.unUseDate) {
          if (this.dateArr[i].dateLine == this.unUseDate[j]) {
            //已被选完 该天不能被选取
            this.dateArr[i].unUse = true;
            continue;
          }
        }
      }
      let nowDate = new Date();
      let nowYear = nowDate.getFullYear();
      let nowMonth = nowDate.getMonth() + 1;
      let nowWeek = nowDate.getDay();
      let getYear = setYear || nowYear;
      let getMonth = setMonth >= 0 ? setMonth + 1 : nowMonth;
      if (nowYear == getYear && nowMonth == getMonth) {
        this.isTodayWeek = true;
        this.todayIndex = nowWeek;
      } else {
        this.isTodayWeek = false;
        this.todayIndex = -1;
      }
    }
  }
};
</script>

<style lang="less" scoped>
.wrap {
  width: 100%;
  min-height: 866rpx;
  background: rgba(255, 255, 255, 1);
  .date-show {
    position: relative;
    width: 90%;
    font-size: 32rpx;
    color: #282828;
    text-align: center;
    margin: 0 auto;
    padding: 59rpx 0;
    display: flex;
    align-items: center;
    justify-content: space-around;
  }
  .tap-icon {
    width: 45rpx;
    height: 45rpx;
  }
  .header {
    font-size: 0;
    padding: 0 24rpx;
  }
  .header > view {
    display: inline-block;
    width: 14.285%;
    color: #333;
    font-size: 30rpx;
    text-align: center;
    border-bottom: 1px solid #d0d0d0;
    padding: 39rpx 0;
  }
  .weekMark {
    position: relative;
  }
  .weekMark view {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    border-bottom: 1px solid #22a7f6;
  }
  .date-box {
    font-size: 0;
    padding: 20rpx;
    box-sizing: border-box;
  }
  .date-box > view {
    position: relative;
    display: inline-block;
    width: 14.285%;
    color: #020202;
    font-size: 40rpx;
    text-align: center;
    vertical-align: middle;
    margin: 15rpx 0;
  }
  .date-head {
    width: 74rpx;
    height: 74rpx;
    line-height: 74rpx;
    font-size: 26rpx;
  }
  .nowDay .date-head {
    border-radius: 50%;
    text-align: center;
    color: #fff !important;
    background: rgba(8, 25, 46, 1);
    margin: 0 auto;
  }
  .selected {
    width: 74rpx !important;
    height: 74rpx !important;
    border-radius: 6rpx !important;
    background: rgba(255, 210, 81, 1) !important;
    color: #fff !important;
  }
  .un-use {
    color: #ccc;
  }
  .date-weight {
    font-size: 22rpx;
    padding: 5rpx 0;
  }
  .nowDay .date-weight {
    color: #22a7f6;
  }
  .one {
    position: absolute;
    bottom: 0;
    right: 5rpx;
    width: 20rpx;
    height: 20rpx;
    border-radius: 50%;
    background-color: red;
  }
  .two {
    position: absolute;
    bottom: 30rpx;
    right: 5rpx;
    width: 20rpx;
    height: 20rpx;
    border-radius: 50%;
    background-color: blue;
  }
}
.tip {
  width: 100%;
  height: 174rpx;
  display: flex;
  align-items: center;
  justify-content: space-around;
  .tip-item {
    width: 50%;
    display: flex;
    align-items: center;
    text-align: center;
    padding-left: 80rpx;
    box-sizing: border-box;
    .tip-icon {
      width: 26rpx;
      height: 26rpx;
      background: rgba(255, 210, 81, 1);
      border-radius: 6rpx;
      margin-right: 22rpx;
    }
    .now {
      width: 20rpx;
      height: 20rpx;
      background: rgba(8, 25, 46, 1);
      border-radius: 50%;
    }
    .tip-text {
      font-size: 26rpx;
      color: rgba(127, 143, 164, 1);
    }
  }
}
.daynum {
  width: 100%;
  height: 70rpx;
  line-height: 70rpx;
  background: rgba(255, 248, 220, 1);
  font-size: 28rpx;
  color: rgba(20, 20, 20, 1);
  text-align: center;
}
.btn {
  width: 100%;
  height: 96rpx;
  line-height: 96rpx;
  background: rgba(255, 210, 81, 1);
  font-size: 32rpx;
  font-weight: bold;
  color: rgba(79, 70, 40, 1);
  border-radius: 0;
}
</style>
