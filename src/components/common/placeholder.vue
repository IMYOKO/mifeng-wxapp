<template>
    <view class="empty-placeholder row-center" :if="show">
        <image class="icon-xl" :src="icon"/>
        <view class="txt">{{message}}</view>
    </view>
</template>
<script>
export default {
    props: {
        show: {
            type: Boolean,
            default: false
        },
        icon: {
            default: '/static/images/page_empty.png'
        },
        message: {
            default: '未发现数据~'
        }
    }
}
</script>
<style lang="less">
.empty-placeholder {
margin-top:150rpx;
    width: 100%;
    text-align: center;
    text {
        color: #666;
        font-size: 40rpx;
        margin-left: 30rpx;
    }
}

.icon-xl {
    width: 190rpx;
    height: 124rpx;
    display: block;
    margin: 0 auto;
}

.txt {
    font-size: 28rpx;
    color: #bfbfbf;
    margin-top: 20rpx;
}
</style>
