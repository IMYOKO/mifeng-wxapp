<template>
    <view class="loadMoreGif" v-if="show">
        <image src="../../static/images/loadding.gif" />
        <text>{{message}}</text>
    </view>
</template>
<script>
export default {
    props: {
        show: {
            type: Boolean,
            default: false
        },
        message: {
            default: '正在加载中'
        }
    }
}
</script>
<style lang="less">
.loadMoreGif {
    margin: 15rpx auto;
    width: 220rpx;
    display: flex;
    justify-content: center;
    align-items: center;
    text {
        font-size: 26rpx;
        color: #bfbfbf;
        // margin-left: 10rpx;
    }
    image {
        width: 30rpx;
        height: 30rpx;
    }
}
</style>
