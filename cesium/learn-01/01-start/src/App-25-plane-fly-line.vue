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

  const positionProperty = new Cesium.SampledPositionProperty()

  // 设置时间间隔
  const timeStepInSeconds = 30
  // 整个飞机花费时间
  const totalSeconds = (planeData.length - 1) * timeStepInSeconds

  // 设置起点时间
  const time = new Date("2022-03-09T23:10:00Z");

  const startJulianDate = Cesium.JulianDate.fromDate(time)
  const stopJulianDate = Cesium.JulianDate.addSeconds(
    startJulianDate,
    totalSeconds,
    new Cesium.JulianDate()
  )

  // 将查看器的时间调整到起点和结束点的范围
  viewer.clock.startTime = startJulianDate.clone()
  viewer.clock.stopTime = stopJulianDate.clone()
  viewer.clock.currentTime = startJulianDate.clone()
  viewer.timeline.zoomTo(startJulianDate, stopJulianDate)

  planeData.forEach((dataPoint, i) => {
    // 当前点的时间
    const time = Cesium.JulianDate.addSeconds(
      startJulianDate,
      i * timeStepInSeconds,
      new Cesium.JulianDate()
    )

    // 当前点的位置
    const position = Cesium.Cartesian3.fromDegrees(
      dataPoint.longitude,
      dataPoint.latitude,
      dataPoint.height,
    )

    // 添加轨迹采样点
    positionProperty.addSample(time, position)

    // 添加点
    viewer.entities.add({
      position,
      point: {
        pixelSize: 10,
        color: Cesium.Color.RED,
        outlineColor: Cesium.Color.WHITE,
        outlineWidth: 2
      }
    })
  })

  // 创建飞机
  const planeEntity = viewer.entities.add({
    availability: new Cesium.TimeIntervalCollection([
      new Cesium.TimeInterval({
        start: startJulianDate,
        stop: stopJulianDate
      })
    ]),
    name: '飞机',
    position: positionProperty,
    // VelocityOrientationProperty会自动根据采样点，计算出飞机的速度和方向
    orientation: new Cesium.VelocityOrientationProperty(positionProperty),
    model: {
      uri: '/model/Air.glb'
    },
    path: new Cesium.PathGraphics({
      width: 5
    })
  })

  // 相机追踪运动的问题
  viewer.trackedEntity = planeEntity;

  // 设置时间速率
  viewer.clock.multiplier = 60;

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
