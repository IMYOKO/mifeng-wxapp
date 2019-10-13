<template>
    <view class="noMore" v-if="show">
        <!-- <text class="line"></text> -->
        <text class="text">{{message}}</text>
        <!-- <text class="line"></text> -->
    </view>
</template>
<script>
export default {
    props: {
        show: {
            type: Boolean,
            default: true
        },
        message: {
            default: '没有更多啦~'
        }
    }
}
</script>
<style lang="less">
.noMore {
    margin: 15rpx auto;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0 3%;
    .line {
      width: 200rpx;
      height: 1rpx;
      border-top:1rpx solid #e2e3e4;
      flex: 1 0 auto;
    }
    .text {
        font-size: 26rpx;
        color: #bfbfbf;
        margin: 0 30rpx;
    }
}
</style>
