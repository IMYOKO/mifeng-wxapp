<template>
  <view class="fxUs">
    <map
      class="fxUs-map"
      id="map"
      :longitude="position.longitude"
      :latitude="position.latitude"
      scale="11"
      :markers="markers"
      show-location
      :style="{height: windowHeight + 'rpx'}"
    >
    </map>
  </view>
</template>

<script>
export default {
  data () {
    return {
      windowHeight: 0,
      position: null,
      markers: [],
    }
  },
  async onLoad() {
    let systemInfo = uni.getSystemInfoSync();
    this.windowHeight = Math.ceil(systemInfo.windowHeight / (systemInfo.windowWidth / 750))
    uni.getLocation({
      type: 'wgs84',
      success: (res) => {
        this.position = {
          latitude: res.latitude,
          longitude: res.longitude
        }
        this.getNearbyList();
      },
      fail: () => {
        this.position = {
          latitude: 22,
          longitude: 114
        }
        this.getNearbyList();
      }
    })
  },
  methods: {
    async getNearbyList (longitude, latitude) {
      const payload = {
        longitude,
        latitude,
        labelType: '',
        machineName: '',
        screenType: '',
        province: '',
        city: '',
        district: '',
        start: 0,
        offset: 50,
      }
      const res = await this.$server.getMachinesList(payload)
      const contentList = res.data.data.item;
      let arr = []
      contentList.forEach((item, index) => {
        arr.push({
          iconPath: "../static/images/ic_location_1.png",
          id: index,
          latitude: item.latitude,
          longitude: item.longitude,
          width: 25,
          height: 40
        })
      })
      this.markers = arr;
    }
  }
}
</script>

<style lang="less" scoped>
.fxUs-map {
  width: 100%;
}
</style>
