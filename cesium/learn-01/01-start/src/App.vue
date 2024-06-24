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
  defines: {
    distance:
      "distance(vec2(${feature['cesium#longitude']},${feature['cesium#latitude']}),vec2(113.3191,23.109))",
  },
  color: {
    conditions : [
      ["${distance} < 0.01", "color('rgba(0,0,50, 0.7)')"],
      ["${distance} < 0.02", "color('rgba(0,0,50, 0.5)')"],
      ["${distance} < 0.04", "color('rgba(0,0,50, 0.2)')"],
      ["true", "color('white')"],
    ]
  },
  show: "${distance} < 0.04 && ${feature['building']} === 'apartments'",
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
