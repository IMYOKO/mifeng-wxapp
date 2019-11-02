<template>
  <view>
    <uParse :content.sync="info"></uParse>
  </view>
</template>
<script>
import uParse from "../components/uParse/wxParse";
export default {
  components: {
    uParse: uParse
  },

  data() {
    return {
      info: null
    };
  },

  async onLoad() {
    const res = await this.$server.getArticle({
      type: 5
    });
    this.info = res.data.data.article;
  }
};
</script>
<style lang="less">
page {
  background: #fff;
}
</style>