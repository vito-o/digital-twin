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
 
  /* // 白色纹理
  let material = new Cesium.ColorMaterialProperty(
    new Cesium.Color(1.0, 1.0, 1.0, 1.0)
  ) */
  
  /* // 棋盘纹理
  let material = new Cesium. ({
    evenColor: Cesium.Color.RED,
    oddColor: Cesium.Color.YELLOW,
    repeat: new Cesium.Cartesian2(2, 2)
  }) */

  /* // 条纹纹理
  let material = new Cesium.StripeMaterialProperty({
    evenColor: Cesium.Color.WHEAT,
    oddColor: Cesium.Color.BLACK,
    repeat: 8
  }) */

  // 网格纹理
  let material = new Cesium.GridMaterialProperty({
    color: Cesium.Color.YELLOW,
    cellAlpha: 0.2,
    lineCount: new Cesium.Cartesian2(4, 4),
    lineThickness: new Cesium.Cartesian2(4.0, 4.0)
  })


  // 使用entity创建矩形
  let rectangle = viewer.entities.add({
    id: 'entities',
    rectangle: {
      coordinates: Cesium.Rectangle.fromDegrees(
        // 西经
        90,
        // 南纬
        20,
        // 东经
        110,
        // 北纬
        30
      ),
      // material: Cesium.Color.RED.withAlpha(0.5)
      material: material
    }
  })



  // 使用primive创建矩形
  let rectGeometry1 = new Cesium.RectangleGeometry({
    rectangle: Cesium.Rectangle.fromDegrees(
      // 西经
      115,
      // 南纬
      20,
      // 东经
      135,
      // 北纬
      30
    ),
    // 距离表面高度
    height: 0,
    vertexFormat: Cesium.PerInstanceColorAppearance.VERTEX_FORMAT
  })
  let instance1 = new Cesium.GeometryInstance({
    id: 'red',
    geometry: rectGeometry1,
    attributes: {
      color: Cesium.ColorGeometryInstanceAttribute.fromColor(
        Cesium.Color.RED.withAlpha(0.5)
      )
    }
  })


  let rectGeometry2 = new Cesium.RectangleGeometry({
    rectangle: Cesium.Rectangle.fromDegrees(
      // 西经
      140,
      // 南纬
      20,
      // 东经
      160,
      // 北纬
      30
    ),
    // 距离表面高度
    height: 0,
    vertexFormat: Cesium.PerInstanceColorAppearance.VERTEX_FORMAT
  })
  let instance2 = new Cesium.GeometryInstance({
    id: 'blue',
    geometry: rectGeometry2,
    attributes: {
      color: Cesium.ColorGeometryInstanceAttribute.fromColor(
        Cesium.Color.BLUE.withAlpha(0.5)
      )
    }
  })


  // 3.设置外观
  let appearance = new Cesium.PerInstanceColorAppearance({
    flat: true
  })
  // 4-图元
  let primitive = new Cesium.Primitive({
    geometryInstances: [instance1, instance2],
    appearance: appearance
  })

  viewer.scene.primitives.add(primitive)

  viewer.camera.setView(viewer.entities)
  
  // 修改颜色
  setInterval(() => {
    let attributes = primitive.getGeometryInstanceAttributes('blue')
    attributes.color = Cesium.ColorGeometryInstanceAttribute.toValue(
      Cesium.Color.fromRandom({
        alpha: 0.5
      })
    )
  }, 1000)


  // 拾取
  let handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas)
  handler.setInputAction(
    movement => {
      let pickedObject = viewer.scene.pick(movement.position)
      console.log(pickedObject)
      if (Cesium.defined(pickedObject) && typeof pickedObject.id == 'string') {
        let attributes = primitive.getGeometryInstanceAttributes(pickedObject.id)
        attributes.color = Cesium.ColorGeometryInstanceAttribute.toValue(
          Cesium.Color.YELLOW.withAlpha(0.5)
        )
      }
    }, 
    Cesium.ScreenSpaceEventType.LEFT_CLICK
  )

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
