<template>
  <view class="container">
    <View class="content">
      <html2wxml :parserName="name" :parserContent.sync="content"></html2wxml>
    </View>
  </view>
</template>
<script>
  import request from '../utils/request';
  import tip from '../utils/tip';
  import html2wxml from '../components/html2wxml';
  export default {
    config: {
      navigationBarTitleText: '广告发布规则',
      navigationBarBackgroundColor: '#ffffff',
      navigationBarTextStyle:'black'
    },
    components: {
      html2wxml: html2wxml,
    },
    data() {
      return {
        content: '',
        adxieyitype:''
      }
    },
    async getServerAgreement() {
      let res = await request({
        url: 'serviceAgreement/show',
        method: "get",
        data: {
          "key": this.adxieyitype // rule
        }
      })
      this.content = res.data.content;
      this.$emit('html2wxml', 'htmlParserNotice');
    },
    onLoad(option) {
      console.log(option)
      let adtype = option.adtype
      this.adxieyitype = option.adxieyitype
      if(adtype==1){
        uni.setNavigationBarTitle({
          title:'使用须知'
        })
      }
      this.getServerAgreement();
    }
  }

</script>
<style lang="less">
.container{
  padding: 20rpx 20rpx;
  box-sizing: border-box;
}
  .header {
    color: #D8D8D8;
  }

  .content {
    box-sizing: border-box;
    padding: 0rpx 20rpx 30rpx 20rpx;
  }


</style>
