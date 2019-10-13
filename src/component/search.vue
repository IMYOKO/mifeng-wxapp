<template>
  <view class="content">
    <view class="search">
      <view class="serch_content">
        <i class="iconfont icon-search"></i>
        <input type="text" name="search_input" maxlength = "20" bindinput="searchInput" class="search_input" focus="true" v-model="search_input_value" confirm-type="search" placeholder="搜索商品" />
        <i v-if="search_input_value!=''" @tap="delText" class="iconfont icon-del"></i>
      </view>
      <button class="btn btn_cancel" @tap="goBack()" v-if="search_input_value==''">取消</button>
      <button class="btn btn_search" @tap="search()" v-else>搜索</button>
    </view>
  </view>
</template>

<script>
export default {
  data () {
    return {
      search_input_value: '',
      show: 1
    }
  },
  methods: {
    searchInput(e) {
      this.search_input_value = e.detail.value;
    },
    goBack() {
      uni.navigateBack();
    },
    search() {
      this.$emit('searchValue', this.search_input_value);
    },
    delText() {
      this.search_input_value = "";
    },
    show(param){
      this.show = param;
    }
  }
}
</script>

<style lang="less" scoped>
.content {
  padding: 10rpx;
}

.search {
  align-items: center;
  display: flex;
  margin: 0 auto;
  width: 680rpx;
  .serch_content {
    display: flex;
    align-items: center;
    border-radius: 300rpx;
    color: #333;
    width: 560rpx;
    background: #efefef;
    padding: 5rpx 12rpx;
    height: 65rpx;
    .search_input {
      font-size: 28rpx;
      width: 100%;
    }
  }
  .icon-search {
    font-size: 40rpx;
  }
  .btn {
    width: 120rpx;
    height: 65rpx;
    font-size: 28rpx;
    line-height: 65rpx;
    margin-left: 20rpx;
    padding-left: 5rpx;
    padding-right: 5rpx;
  }
  .btn_search {
    color: #fff;
    background: #e2413c;
  }
  .icon-del {
    height: 60rpx;
    line-height: 60rpx;
    width: 60rpx;
    font-size: 40rpx;
  }
}
</style>
