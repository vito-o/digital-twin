<script setup>
import * as Cesium from 'cesium'
import './Widgets/widgets.css'
import { onMounted } from 'vue'

window.CESIUM_BASE_URL = '/'

// 设置cesium的token
Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI5NjJhMjVmMC00OGFhLTQ4ZmUtOTFiNi1hYWZmYjYzOTc4MDIiLCJpZCI6MTc5NDA4LCJpYXQiOjE3MDA0NDIwMTJ9.5qvGOWqbkxsRzHfZuvYeWiSyFmtk1_4m5NIQHuW0zpE'

// 设置相机的默认视角 (中国)
Cesium.Camera.DEFAULT_VIEW_RECTANGLE = Cesium.Rectangle.fromDegrees(
  // 西经
  89.5,
  // 南纬
  20.4,
  // 东经
  110.4,
  // 北纬
  61.2
)

onMounted(async() => {
  let viewer = new Cesium.Viewer('cesiumContainer', {
    // 是否显示信息窗口
    infoBox: false,
  })

  // 隐藏logo
  viewer.cesiumWidget.creditContainer.style.display = 'none'

  let position = Cesium.Cartesian3.fromDegrees(116.393428, 39.90923, 100)
  /* 
  // setView 瞬间到达指定位置，视角
  viewer.camera.setView({
    // 指定相机位置
    destination: position,
    // 指定相机视角
    orientation: {
      // 指定相机的朝向，偏航角
      heading: Cesium.Math.toRadians(0),
      // 指定相机的俯仰角，0度是竖直向上，-90度是向下
      pitch: Cesium.Math.toRadians(-20),
      // 指定相机的滚转角，翻滚角
      roll: 0
    }
  }) */

  /* 
  // flyTo 让相机飞往某个地方
  viewer.camera.flyTo({
    destination: position,
    orientation: {
      heading: Cesium.Math.toRadians(0),  // 角度转弧度
      pitch: Cesium.Math.toRadians(-20),  // 角度转弧度
      roll: 0,
    }
  }) */
})

</script>

<template>
  <div id="cesiumContainer" ref="cesiumContainer"></div>
</template>

<style >
*{
  margin: 0;
  padding: 0;
}

#cesiumContainer{
  width: 100vw;
  height: 100vh;
}
</style>
