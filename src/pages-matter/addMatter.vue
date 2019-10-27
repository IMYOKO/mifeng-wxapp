<template>
  <view class="container">
    <view v-if="showModal" class="modal" @tap.stop="closeModal">
      <view class="modal_body">
        <view class="modal_content">
          <view class="content">请勾选并详细阅读《广告发布规则》才能进行素材发布</view>
        </view>
        <view class="modal_btn" @tap="closeModal">确定</view>
      </view>
    </view>
    <view class="neck-ct">
      <view class="item">
        <view class="line"></view>
        <view class="tit">素材名称</view>
        <view class="num">{{nameLength}}/50</view>
      </view>
      <textarea maxlength="50" placeholder="请输入素材名称" placeholder-class="input-placeholder"
        @input="inputName"></textarea>
    </view>
    <view class="text_group">
      <radio-group bindchange="radioChange" @tap="click_radio">
        <radio style="zoom:.5" :checked="status" color="#FFD602" />
      </radio-group>
      <view class="subtext">是否详细阅读并同意</view>
      <view class="subtext" style="color:#E9C300" @tap="Torules">《广告发布规则》</view>
    </view>
    <view class="item pd mt">
      <view class="line"></view>
      <view class="tit">素材类型</view>
      <picker mode="selector" :range="typeRange" :value="type" @change="typeChange">
        <view class="picker-container">
            <view class="itembtn">{{typeRange[type - 1]}}</view>
            <image class="arrow" src="../static/images/ic_home_open_1.png" />
        </view>
      </picker>
    </view>
    <view class="item pd" @tap="clickChooseImg">
      <view class="line"></view>
      <view class="tit">选择图片</view>
      <image class="arrow" src="../static/images/ic_home_open_1.png" />
    </view>
    <view class="item pd" v-if="type == 2" @tap="clickChooseVideo">
      <view class="line"></view>
      <view class="tit">选择视频</view>
      <!--<video wx:if = "{{video}}" class = "img" show-fullscreen-btn = "false" src=  "{{video}}"></video>-->
      <image class="arrow" src="../static/images/ic_home_open_1.png" />
    </view>
    <view class="placeholderContainer">
      <view class="placeholderContent" v-if="type == 1">
        <image class="image" style="z-index: 0" src="../static/images/pic_addmatter_image_placeholder.png" />
        <image class="image" style="z-index: 10" :src="logo" />
      </view>
      <view class="placeholderContent" v-if="type == 2">
        <image class="image" style="z-index: 0" src="../static/images/pic_addmatter_group_placeholder.png" />
        <video v-if="video" :src="video"></video>
        <image class="videoImg" :src="logo" />
      </view>
    </view>

    <view class="tip">图片规格为手机图片,组合素材必须上传一张图片一个视频，视频时长不超过1分钟</view>
    <formidTaker>
    <view class="btn">
      <button class="left" @tap="clickPreView">预览效果</button>
      <button class="right" @tap="clickUpload">上传</button>
    </view>
    </formidTaker>
  </view>
</template>
<script>
  import request from '../utils/request';
  import FormidTaker from '../components/formidTaker';
  import tip from '../utils/tip';
  import {
    USER_TOKEN,
    USER_INFO,
    USER_SPECICAL_INFO
  } from '../utils/constant';
  import qiniuUpload from '../utils/qiniuUpload';
  export default {
    config: {
      navigationBarTitleText: '添加素材',
    },
    components: {
      formidTaker: FormidTaker
    },
    data () {
      return {
        nameLength: 0,
        name: '',
        logo: '',
        type: 1,
        video: '',
        seconds: 0,
        status: true,
        showModal:false,
        typeRange: ['图片素材', '组合素材']
      }
    },
    onLoad(options) {
      this.type = options.type || 0;
    },
    methods: {
      radioChange(){
        // this.status = !this.status
        console.log(this.status)
      },
      click_radio() {
        this.status = !this.status
        // console.log("click_radio:",this.status)
      },
      closeModal(){
        this.showModal = false
      },
      Torules() {
        uni.navigateTo({
          url: './adRulse?adtype=0&&adxieyitype=rule'
        })
      },
      //输入广告名称
      inputName(e) {
        this.name = e.detail.value;
        this.nameLength = e.detail.value.length;
      },
      //选择类型
      typeChange(e) {
        this.type = Number(e.detail.value) + 1;
      },
      //上传照片
      clickChooseImg() {

        let that = this;
        uni.showActionSheet({
          itemList: ['拍照', '从相册选择'],
          success(res) {
            console.log(res);
            if (res.tapIndex == 0) {
              uni.chooseImage({
                count: 1,
                sourceType: ['camera'],
                success: function (res) {
                  let tempFilePaths = res.tempFilePaths;
                  tip.loading('上传中');
                  qiniuUpload(tempFilePaths[0], async function (res) {
                    that.logo = res.imageURL;
                    tip.loaded();
                  })
                },
              })
            } else if (res.tapIndex == 1) {
              uni.chooseImage({
                count: 1,
                sourceType: ['album'],
                success: function (res) {
                  let tempFilePaths = res.tempFilePaths;
                  tip.loading('上传中');
                  qiniuUpload(tempFilePaths[0], async function (res) {
                    that.logo = res.imageURL;
                    console.log(that.logo)
                    tip.loaded();
                  })
                },
              })
            }
          },
          fail(res) {
            console.log(res.errMsg)
          }
        })
      },
      //添加视频
      clickChooseVideo() {
        let that = this;
        uni.chooseVideo({
          sourceType: ['album', 'camera'],
          maxDuration: 60,
          camera: 'back',
          compressed: false,
          success(res) {
            tip.loading('视频上传中');
            qiniuUpload(res.tempFilePath, async function (res) {
              that.video = res.imageURL;
              tip.loaded();
            })
          },
          complete(res) {
            that.seconds = res.duration;
            if (that.seconds > 60) {
              that.video = '';
              that.seconds = '';
              tip.toast('视频超过60s');
            }
          },
        })
      },
      //预览
      clickPreView() {
        if (!this.name) {
          tip.toast('请输入素材名称');
          return;
        }
        if (!this.logo) {
          tip.toast('请选择图片');
          return;
        }
        if (this.type == 2 && !this.video) {
          tip.toast('请选择视频');
          return;
        }
        if (this.type == 2 && parseFloat(this.seconds) > 60) {
          tip.toast('上传视频不能超过1分钟请重新选择');
          return;
        }
        uni.navigateTo({
          url: './preMatter?type=' + this.type + '&logo=' + this.logo + '&video=' + this.video + '&name=' + this
            .name
        })
      },
      //上传
      async clickUpload() {
        if (!this.status) {
          this.showModal = true;
          return;
        }
        if (!this.name) {
          tip.toast('请输入广告名称');
          return;
        }
        if (!this.logo) {
          tip.toast('请选择图片');
          return;
        }
        if (this.type == 2 && !this.video) {
          tip.toast('请选择视频');
          return;
        }
        if (this.type == 2 && parseFloat(this.seconds) > 60) {
          tip.toast('上传视频不能超过1分钟请重新选择');
          return;
        }
        const payload = {
          materialName: this.name,
          materialType: this.type,
          logo: this.logo,
          video: this.video,
        }
        try {
          await this.$server.addMaterials(payload)
          this.$CommonJs.pathTo('/pages-matter/addMatterSuccess')
        } catch (error) {}
      }
    }
  }

</script>
<style lang="less">
  .container {
    position: relative;
  }

  .modal {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.8);
    z-index: 999;
  .modal_body{
    width: 540rpx;
      height: 292rpx;
      background: rgba(255, 255, 255, 1);
      border-radius: 4rpx;
      position: relative;
      left: 50%;
      margin-top: 497rpx;
      margin-left: -270rpx;
      // padding: 61rpx 32rpx;
      box-sizing: border-box;
  }
  .modal_content{
     padding: 61rpx 32rpx;
      box-sizing: border-box;
  }
    .content {
      width: 476rpx;
      height: 76rpx;
      font-size: 28rpx;
      font-family: PingFangSC-Medium;
      font-weight: 500;
      color: rgba(51, 51, 51, 1);
      line-height: 38rpx;
      text-align: center;
      margin: 0 auto;
    }

    .modal_btn {
      border-top: 1rpx solid#8d8d8d;
      height: 94rpx;
      font-size: 36rpx;
      font-family: PingFangSC-Medium;
      font-weight: 500;
      color: #141414;
      text-align: center;
      line-height: 94rpx;
    }
  }

  .neck-ct {
    background-color: #fff;
    padding: 24rpx 58rpx 24rpx 0;
    box-sizing: border-box;

    textarea {
      width: 100%;
      height: 180rpx;
      border: none;
      background-color: #fff;
      padding: 12rpx 24rpx;
      box-sizing: border-box;
      font-size: 28rpx;
    }
  }

  .text_group {
    padding-left: 31rpx;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    .subtext {
      margin-top: 17rpx;
      display: inline-block;
      height: 34rpx;
      font-size: 22rpx;
      font-family: PingFangSC-Regular;
      font-weight: 400;
      color: rgba(155, 155, 155, 1);
      line-height: 34rpx;
    }
  }

  .item {
    width: 100%;
    min-height: 84rpx;
    display: flex;
    align-items: center;
    background-color: #fff;
    padding: 15rpx 0;
    box-sizing: border-box;

    .line {
      width: 9rpx;
      height: 34rpx;
      background: rgba(247, 208, 67, 1);
      margin-right: 24rpx;
    }

    .tit {
      font-size: 28rpx;
      font-weight: bold;
      color: rgba(20, 20, 20, 1);
      margin-right: auto;
    }

    .num {
      font-size: 28rpx;
      font-weight: bold;
      color: rgba(20, 20, 20, 1);
    }

    .text {
      font-size: 28rpx;
      color: rgba(20, 20, 20, 1);
      margin-right: 15rpx;
    }

    .img {
      width: 120rpx;
      height: 120rpx;
      margin-right: 15rpx;
      flex: 0 0 auto;
    }

    .arrow {
      width: 20rpx;
      height: 25rpx;
      padding-top: 5rpx;
    }

    .add-icon {
      width: 40rpx;
      height: 40rpx;
    }
  }

  .pd {
    padding-right: 58rpx;
    box-sizing: border-box;
  }

  .mt {
    margin-top: 20rpx;
  }

  .tip {
    width: 100%;
    background: rgba(255, 238, 236, 0.5);
    font-size: 24rpx;
    color: rgba(254, 56, 36, 1);
    text-align: center;
    position: fixed;
    bottom: 92rpx;
    left: 0;
    padding: 15rpx 30rpx;
    box-sizing: border-box;
    z-index: 50;
  }

  .btn {
    width: 100%;
    height: 92rpx;
    display: flex;
    align-items: center;
    position: fixed;
    bottom: 0;
    left: 0;
    z-index: 60;

    .left {
      color: rgba(255, 255, 255, 1);
      background: rgba(20, 20, 20, 1);
    }

    .right {
      color: rgba(20, 20, 20, 1);
      background: rgba(255, 214, 2, 1);
    }
  }

  button {
    width: 50%;
    height: 92rpx;
    line-height: 92rpx;
    font-size: 36rpx;
    border-radius: 0;
  }

  .itembtn {
    width: 140rpx;
    height: 50rpx;
    line-height: 50rpx;
    text-align: center;
    font-size: 24rpx;
    color: rgba(20, 20, 20, 1);
  }

  .selected {
    background: rgba(51, 51, 51, 1);
    color: rgba(255, 214, 2, 1);
    margin-left: 10rpx;
  }

  .placeholderContainer {
    width: 100vw;
    text-align: center;
    margin-top: 30rpx;
    padding-bottom: 190rpx;
  }

  .placeholderContent {
    width: 50vw;
    height: calc(50vw * 1920/1080);
    display: inline-block;
    position: relative;

    .image {
      width: 100%;
      height: 100%;
      position: absolute;
      left: 0;
    }

    video {
      width: 100%;
      height: calc(50vw * 608/1080);
      background: rgba(20, 20, 20, 1);
      border-radius: 7rpx 7rpx 0px 0px;
      display: block;
      margin: 0 auto;
      position: relative;
      z-index: 30;
    }

    .videoImg {
      width: 100%;
      height: calc(50vw * 1312/1080);
      top: calc(50vw * 608/1080);
      position: absolute;
      left: 0;
    }
  }

  .picker-container {
    display: flex;
    align-items: center;
  }

</style>
