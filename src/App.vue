<script>
export default {
  onLaunch: function() {
    console.log("App Launch");
  },
  onShow: function() {
    console.log("App Show");
  },
  onHide: function() {
    console.log("App Hide");
  }
};
</script>

<style lang="less">
.wxParse {
  padding: 20rpx 40rpx;
}
page {
  height: 100%;
  background: #f6f6f6;
}
.clearfix {
  zoom: 1;
}
.clearfix:after {
  display: block;
  content: "\200B";
  clear: both;
  height: 0;
}
button::after {
  border: none;
}
</style>

