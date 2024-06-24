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

 
  // 1、屏幕坐标系统，二维的笛卡尔坐标系，Cartesian2类型
  // 2、地理坐标系统，WGS-84坐标系，Cartographic类型，经度、纬度、高度
  // 3、笛卡尔空间直角坐标系，Cartesian3类型

  // 角度转弧度
  let radians = Cesium.Math.toRadians(90)
  console.log(radians)  // 1.5707963267948966

  // 弧度转角度
  let degrees = Cesium.Math.toDegrees(2 * Math.PI)
  console.log(degrees)  // 360

  // 将经纬度转为笛卡尔坐标 (输入的是角度)
  let cartesian3 = Cesium.Cartesian3.fromDegrees(
    // 经度
    89.5,
    // 维度
    20.4,
    // 高度
    100
  )
  console.log(cartesian3)

  // 将笛卡尔坐标转换为经纬度 (输出的经纬度是弧度)
  let cartographic = Cesium.Cartographic.fromCartesian(cartesian3)
  console.log(cartographic)
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
