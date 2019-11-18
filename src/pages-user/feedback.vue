<template>
  <view>
    <view class="content">
      <textarea
        placeholder="* 我们懂得聆听，请在此写下您的建议"
        maxlength="200"
        placeholder-class="input-placeholder"
        @input="inputContent"
      ></textarea>
      <view class="num">
        <text>{{contentLength}}</text>/200
      </view>
      <view class="img-num">图片({{images.length}}/3)</view>
      <view class="up-img">
        <view class="uploaded-img" v-for="(item, index) in images" :for-item="item" :key="index">
          <image :src="item" class="img" />
          <image
            class="del"
            :data-index="index"
            @tap="clickDelImg"
            src="../static/images/ic_home_picture_delete.png"
          />
        </view>
        <view class="add" @tap="clickAddImg" v-if="images.length < 3">
          <image class="add-img" src="../static/images/ic_my_feedback_add.png" />
          <view class="add-text">添加图片</view>
        </view>
      </view>
    </view>
    <button class="btn" @tap="clickSubmit">保存</button>
  </view>
</template>
<script>
import request from "../utils/request";
import tip from "../utils/tip";
import { USER_TOKEN, USER_INFO, USER_SPECICAL_INFO } from "../utils/constant";
import qiniuUpload from "../utils/qiniuUpload";
export default {
  config: {
    navigationBarTitleText: "意见反馈"
  },

  data() {
    return {
      content: "",
      contentLength: 0,
      images: []
    };
  },

  methods: {
    inputContent(e) {
      this.content = e.detail.value;
      this.contentLength = e.detail.value.length;
    },
    //添加图片
    clickAddImg() {
      let that = this;
      if (that.images.length >= 5) {
        tip.toast("最多上传3张图片");
        return;
      }
      uni.chooseImage({
        count: 3 - that.images.length,
        success: function(res) {
          let tempFilePaths = res.tempFilePaths;
          let arr = new Array(tempFilePaths.length);
          let count = 0;
          tip.loading("上传中");
          for (let i in tempFilePaths) {
            qiniuUpload(tempFilePaths[i], function(res) {
              arr[i] = res.imageURL;
              count++;
              if (count == arr.length) {
                that.images = [...that.images, ...arr];
                tip.loaded();
              }
            });
          }
        }
      });
    },
    //删除图片
    clickDelImg(e) {
      let index = e.currentTarget.dataset.index;
      this.images.splice(index, 1);
    },
    //保存
    async clickSubmit() {
      if (!this.content) {
        tip.toast("请输入建议内容");
        return;
      }
      // if (this.images.length <= 0) {
      //   tip.toast("请上传图片");
      //   return;
      // }
      await this.$server.addUserOpinion({
        opinion: this.content,
        imagePath: this.images.join(";")
      });
      await tip.success("反馈成功");
      uni.navigateBack();
    }
  }
};
</script>
<style lang="less">
.content {
  background: #fff;
  position: relative;
}
.num {
  width: 100rpx;
  text-align: center;
  font-size: 28rpx;
  color: #4a4a4a;
  position: absolute;
  top: 255rpx;
  right: 40rpx;
  text {
    color: rgba(255, 214, 2, 1);
  }
}
textarea {
  width: 680rpx;
  height: 300rpx;
  margin: 0 auto;
  font-size: 28rpx;
  border-bottom: 1rpx solid #e5e5e5;
  background-color: #fff;
  padding: 20rpx 0;
  box-sizing: border-box;
}
.img-num {
  font-size: 28rpx;
  color: rgba(33, 43, 54, 1);
  margin-top: 20rpx;
  padding-left: 30rpx;
}
.up-img {
  width: 100%;
  padding: 26rpx 24rpx;
  box-sizing: border-box;
  display: flex;
  flex-wrap: wrap;
  background-color: #fff;
  .uploaded-img {
    width: 151rpx;
    height: 152rpx;
    margin-right: 30rpx;
    margin-top: 10rpx;
    position: relative;
    .img {
      display: block;
      width: 151rpx;
      height: 152rpx;
    }
    .del {
      display: block;
      width: 35rpx;
      height: 35rpx;
      position: absolute;
      top: -7%;
      right: -3%;
    }
  }
  .add {
    width: 151rpx;
    height: 152rpx;
    background: rgba(246, 248, 250, 1);
    border-radius: 4rpx;
    text-align: center;
    margin-top: 10rpx;
    .add-img {
      display: block;
      width: 58rpx;
      height: 58rpx;
      margin: 0 auto;
      margin-top: 34rpx;
      margin-bottom: 12rpx;
    }
    .add-text {
      font-size: 24rpx;
      color: rgba(214, 218, 229, 1);
    }
  }
}
.btn {
  width: 675rpx;
  height: 92rpx;
  line-height: 92rpx;
  background: rgba(255, 214, 2, 1);
  border-radius: 5rpx;
  font-size: 32rpx;
  color: rgba(20, 20, 20, 1);
  margin-top: 50rpx;
}
</style>