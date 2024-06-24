import * as Cesium from 'cesium'
import '@/Widgets/widgets.css'

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

export default async function initViewer() {
  let viewer = new Cesium.Viewer('cesiumContainer', {
    // 是否显示信息窗口
    infoBox: true,
    // 是否显示查询按钮
    geocoder: false,
    // 是否显示home按钮
    homeButton: false,
    // 是否显示查看器的显示模式
    sceneModePicker: false,
    // 是否显示图层选择
    baseLayerPicker: false,
    // 是否显示帮助按钮
    navigationHelpButton: false,
    // 是否显示播放动画
    animation: false,
    // 是否显示时间轴
    timeline: false,
    // 是否显示全屏按钮
    fullscreenButton: false,
    // 是否显示信息窗口
    infoBox: false,
    terrainProvider: await Cesium.createWorldTerrainAsync({
      requestWaterMask: true,
      // requestVertexNormals: true
    })
  })

  viewer.clock.shouldAnimate = true;
  
  // 隐藏logo
  viewer.cesiumWidget.creditContainer.style.display = 'none'

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

  return viewer;
}