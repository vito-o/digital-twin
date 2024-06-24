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
  console.log(Cesium.CesiumTerrainProvider)

  let viewer = new Cesium.Viewer('cesiumContainer', {
    // 是否显示信息窗口
    infoBox: false,

    /* // 设置地形
    terrainProvider: await Cesium.createWorldTerrainAsync({
      requestVertexNormals: true,
      requestWaterMask: true
    }) */
    
    // 设置自定义地形
    terrainProvider: await Cesium.CesiumTerrainProvider.fromUrl('/terrains/gz', {
      requestWaterMask: true, 
      requestVertexNormals: true
    })
  })

  // 隐藏logo
  viewer.cesiumWidget.creditContainer.style.display = 'none'

 

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
