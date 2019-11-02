<template>
  <view class="container">
    <View class="content">
      <wxParse :content.sync="content"></wxParse>
    </View>
  </view>
</template>
<script>
import request from "../utils/request";
import tip from "../utils/tip";
import wxParse from "../components/uParse/wxParse";
export default {
  config: {
    navigationBarTitleText: "广告发布规则",
    navigationBarBackgroundColor: "#ffffff",
    navigationBarTextStyle: "black"
  },
  components: {
    wxParse: wxParse
  },
  data() {
    return {
      content: "",
      adxieyitype: ""
    };
  },
  methods: {
    async getServerAgreement() {
      const res = await this.$server.getArticle({
        type: 3
      });
      this.info = res.data.data.article;
    }
  },
  onLoad(option) {
    console.log(option);
    let adtype = option.adtype;
    this.adxieyitype = option.adxieyitype;
    if (adtype == 1) {
      uni.setNavigationBarTitle({
        title: "使用须知"
      });
    }
    this.getServerAgreement();
  }
};
</script>
<style lang="less">
.container {
  padding: 20rpx 20rpx;
  box-sizing: border-box;
}
.header {
  color: #d8d8d8;
}

.content {
  box-sizing: border-box;
  padding: 0rpx 20rpx 30rpx 20rpx;
}
</style>
