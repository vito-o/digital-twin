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

  let position = Cesium.Cartesian3.fromDegrees(113.3191, 23.109, 2000)
 
  viewer.camera.flyTo({
    destination: position,
    orientation: {
      heading: Cesium.Math.toRadians(0),
      pitch: Cesium.Math.toRadians(-90),
      roll: 0
    }
  })
 
  // 添加3D建筑
  const osmBuildings = viewer.scene.primitives.add(
    await Cesium.createOsmBuildingsAsync()
  );
  
  // 添加3D模型
  const airplane = viewer.entities.add({
    name: 'Airplane',
    position: Cesium.Cartesian3.fromDegrees(113.3191, 23.109, 1500),
    model: {
      uri: '/model/Air.glb',
      // 设置飞机的最小像素
      minimumPixelSize: 128,
      // 设置飞机的轮廓
      silhouetteSize: 1,
      // 设置飞机的颜色
      silhouetteColor: Cesium.Color.WHITE,
      // 设置相机距离模型多元的距离显示
      distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 200000)
    }
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
