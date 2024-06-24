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



  let rectGeometry = new Cesium.RectangleGeometry({
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
    height: 0,
    vertexFormat: Cesium.EllipsoidSurfaceAppearance.VERTEX_FORMAT
  })

  let instance = new Cesium.GeometryInstance({
    id: 'rect',
    geometry: rectGeometry,
    attributes: {
      color: Cesium.ColorGeometryInstanceAttribute.fromColor(
        Cesium.Color.RED.withAlpha(0.5)
      )
    },
    vertexFormat: Cesium.EllipsoidSurfaceAppearance.VERTEX_FORMAT
  })

  // 设置外观
  /* let material = new Cesium.Material({
    fabric: {
      type: 'Color',
      uniforms: {
        color: new Cesium.Color(1.0, 1.0, 0.0, 0.5)
      }
    }
  }) */

  /* let material = new Cesium.Material({
    fabric: {
      type: 'Image',
      uniforms: {
        image: '/texture/logo.png'
      }
    }
  }) */

  let material = new Cesium.Material({
    fabric: {
      uniforms: {
        uTime: 0
      },
      source: `
        czm_material czm_getMaterial(czm_materialInput materialInput) {
          czm_material material = czm_getDefaultMaterial(materialInput);
          float strength = mod((materialInput.s - uTime) * 10.0, 1.0);
          // material.diffuse = vec3(materialInput.st + uTime, 0.0);
          material.diffuse = vec3(strength, 0.0, 0.0);
          return material;
        }
      `
    }
  })

  gsap.to(material.uniforms, {
    uTime: 1,
    duration: 2,
    repeat: -1,
    ease: 'linear'
  })

  console.log(material);
  console.log(material.shaderSource);
  let appearance = new Cesium.EllipsoidSurfaceAppearance({
    material: material,
    aboveGround: false,
    translucent: true,
  })

  // 图元
  let primitive = new Cesium.Primitive({
    geometryInstances: [instance],
    appearance: appearance
  })

  viewer.scene.primitives.add(primitive)


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
