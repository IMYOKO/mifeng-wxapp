<template>
  <view class="fxUs">
    <map
      class="fxUs-map"
      id="map"
      :longitude="longitude"
      :latitude="latitude"
      scale="11"
      :markers="markers"
      show-location
      :style="{height: windowHeight}"
    >
    </map>
  </view>
</template>

<script>
export default {
  data () {
    return {
      longitude: 116.3974,
      latitude: 39.909,
      markers: [{
        latitude: 39.909,
        longitude: 116.39742,
        iconPath: '../static/images/ic_location_1.png',
        width: 25,
        height: 40
      }],
      windowHeight: '100vh'
    }
  }
}
</script>

<style lang="less" scoped>
.fxUs-map {
  width: 100%;
}
</style>
