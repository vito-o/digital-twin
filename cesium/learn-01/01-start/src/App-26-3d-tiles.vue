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

  viewer.scene.primitives.add(
    await Cesium.createOsmBuildingsAsync()
  )

  const tileset = await Cesium.Cesium3DTileset.fromUrl('/Assets/tileset.json'
  )

  viewer.scene.primitives.add(tileset)
  viewer.zoomTo(tileset)

  // 3dtiles调试面板
  viewer.extend(Cesium.viewerCesium3DTilesInspectorMixin)

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
