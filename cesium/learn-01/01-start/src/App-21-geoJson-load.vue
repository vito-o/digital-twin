<script setup>
import * as Cesium from 'cesium'
import './Widgets/widgets.css'
import { onMounted } from 'vue'
import gsap from 'gsap'

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

  let dataGeo = Cesium.GeoJsonDataSource.load(
    '/china.json',
    {
      stroke: Cesium.Color.RED,
      fill: Cesium.Color.SKYBLUE.withAlpha(0.5),
      strokeWidth: 4
    }
  )
  // console.log(dataGeo)
  // viewer.dataSources.add(dataGeo)

  dataGeo.then(dataSources => {
    viewer.dataSources.add(dataSources)
    console.log(dataSources, 'dataSources')
    let entities = dataSources.entities.values
    entities.forEach((entity, i) => {
      entity.polygon.material = new Cesium.ColorMaterialProperty(
        Cesium.Color.fromRandom({ alpha: 1 })
      )
      entity.polygon.outline = false
      let randomNum = parseInt(Math.random() * 5)
      entity.polygon.extrudedHeight = 100000 * randomNum
    })
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
