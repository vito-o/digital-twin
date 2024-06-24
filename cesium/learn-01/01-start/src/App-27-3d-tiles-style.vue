<script setup>
import * as Cesium from 'cesium'
import './Widgets/widgets.css'
import { onMounted } from 'vue'
import gsap from 'gsap'
import planeData from './assets/json/plane.json'


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
    terrainProvider: await Cesium.createWorldTerrainAsync({
      requestWaterMask: true,
      requestVertexNormals: true
    })
  })

  // 隐藏logo
  viewer.cesiumWidget.creditContainer.style.display = 'none'


  let tiles3d = await Cesium.createOsmBuildingsAsync()
  viewer.scene.primitives.add(
    tiles3d
  )

  let position = Cesium.Cartesian3.fromDegrees(
    // 经度
    113.3191,
    // 维度
    23.109,
    // 高度
    1000
  )

  viewer.camera.flyTo({
    destination: position,
    duration: 2
  })

 console.log(tiles3d)
 /* tiles3d.style= new Cesium.Cesium3DTileStyle({
  // color: "color('yellow')",
  color: "rgba(255,255, 0, 0.5)",
  show: true
 }) */

 tiles3d.style = new Cesium.Cesium3DTileStyle({
  color: {
    conditions : [
      [
        "${feature['building']} === 'apartments'",
        "color('rgba(50, 255, 0, 0.5)')",
      ],
      [
        "${feature['building']} === 'office'",
        "color('rgba(255, 255, 0, 0.5)')",
      ],
      [
        "${feature['cesium#estimatedHeight']} > 300",
        "color('rgba(200, 200, 255, 0.7)')",
      ],
      [
        "${feature['cesium#estimatedHeight']} > 100",
        "color('rgba(100, 100, 255, 0.7)')",
      ],
      [
        "${feature['cesium#estimatedHeight']} > 50",
        "color('rgba(50, 50, 150, 0.7)')",
      ],
      ["true", "color('white')"],
    ]
  },
  show: true
 })

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
