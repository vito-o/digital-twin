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

  viewer.scene.primitives.add(
    await Cesium.createOsmBuildingsAsync()
  )

  // let material = Cesium.Color.RED;

  /* // 虚线
  let material = new Cesium.PolylineDashMaterialProperty({
    dashLength: 30,
    color: Cesium.Color.RED
  }) */

  // 箭头
  // let material = new Cesium.PolylineArrowMaterialProperty(Cesium.Color.RED)

  // 发光飞线
  let material = new Cesium.PolylineGlowMaterialProperty({
    // 设置发光程度
    glowPower: 0.8,
    // 尾椎缩小程度
    taperPower: 0.7,
    color: Cesium.Color.RED
  })

  const redLine = viewer.entities.add({
    polyline: {
      positions: Cesium.Cartesian3.fromDegreesArray([-75, 35, -125, 35]),
      width: 20,
      material: material
    }
  })

  viewer.camera.setView(viewer.entities)
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
