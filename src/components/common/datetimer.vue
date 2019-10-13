<template>
  <view>
    <text wx:if="{{timeType == 'hour'}}" class="time">{{strH}}:{{strM}}:{{strS}}</text>
    <text wx:if="{{timeType == 'minute'}}" class="time">{{strM}}:{{strS}}</text>
    <text wx:else class="time">{{strS}}</text>
  </view>
</template>
<script>
import wepy from 'wepy'
export default class Timer extends wepy.component {
  props = {
    startTime: {
      default: ""
    },
    endTime: {
      default: ""
    }
  }
  data = {
    hour: 0,
    minute: 0,
    second: 0,
    timeType: 'second',
    isShow: true,
    interval: {},
  }

  onLoad() {
    //倒计时
    this.isShow = true;
    this.hour = 0;
    this.minute = 0;
    this.second = 0;
    this.startTime = "";
    this.endTime = "";
    clearInterval(this.interval);
  }

  methods = {
    initTimer(val) {
      console.log(val);
      let date = new Date();
      this.startTime = val.startTime;
      this.endTime = val.endTime;
      this.timeType = val.timeType || 'second';

      //开始时间(.replace(/(-)/g, '/')解决ios 不兼容问题)
      let startDay = new Date(this.startTime.replace(/(-)/g, '/'));
      //结束时间
      let endDay = new Date(this.endTime.replace(/(-)/g, '/'));

      // 计算时会发生隐式转换，调用valueOf()方法，转化成时间戳的形式
      let days = (endDay - startDay) / 1000 / 3600 / 24;

      //计算是当前时间是否在区间内
      // if (startDay < date && date < endDay) {
      //   this.isShow = true;
      // }

      let day = Math.floor(days);
      let hours = (days - day) * 24;
      let hour = Math.floor(hours);
      let minutes = (hours - hour) * 60;
      let minute = Math.floor(minutes);
      let seconds = (minutes - minute) * 60;
      let second = Math.floor(seconds);

      //赋值
      this.day = day;
      //this.hour = day * 24 + hour;
      this.hour = hour;
      this.minute = minute;
      this.second = second;

      this.interval = setInterval(() => {
        let second = this.second;
        let minute = this.minute;
        let hour = this.hour;
        if ((--second) < 0) {
          if (this.timeType == 'second') {
            this.$emit('timerComplete')
            clearInterval(this.interval);
            return;
          }
          minute--;
          second = 59;
        }

        if (minute < 0) {
          if (this.timeType == 'minute') {
            this.$emit('timerComplete')
            clearInterval(this.interval);
            return;
          }
          hour--;
          minute = 59;
        }
        if (this.hour < 0) {
          if (this.timeType == 'minute') {
            this.$emit('timerComplete')
            clearInterval(this.interval);
            return;
          }
        }
        this.second = second;
        this.minute = minute;
        this.hour = hour;
        this.$apply();
      }, 1000);

      this.$apply();
    }
  }

  onUnload() {
    console.log("onUnload....");
    clearInterval(this.interval);
  }

  onHide() {
    console.log("onHide....");
    clearInterval(this.interval);
  }

  computed = {
    strD() {
      return this.day;
    },
    strH() {
      return this.hour < 10 ? "0" + this.hour : this.hour;
    },
    strM() {
      return this.minute < 10 ? "0" + this.minute : this.minute;
    },
    strS() {
      return this.second < 10 ? "0" + this.second : this.second;
    },
    total() {
      return (this.hour * 60 * 60) + (this.minute * 60) + this.second;
    },
  }

}

</script>
<style lang="less">

</style>
