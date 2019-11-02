<template>
  <view>
    <uParse :content.sync="info"></uParse>
  </view>
</template>
<script>
import tip from "../utils/tip";
import uParse from "../components/uParse/wxParse";
import { USER_TOKEN, USER_INFO, USER_SPECICAL_INFO } from "../utils/constant";
export default {
  components: {
    uParse: uParse
  },
  data() {
    return { info: null };
  },
  onLoad() {
    this.getInfo();
  },
  methods: {
    async getInfo() {
      const res = await this.$server.getArticle({
        type: 5
      });
      this.info = res.data.data.article;
    }
  }
};
</script>
<style lang="less">
page {
  background: #fff;
}
</style>