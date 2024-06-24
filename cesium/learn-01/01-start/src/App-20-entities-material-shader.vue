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



  /* let material = new Cesium.GridMaterialProperty({
    color: Cesium.Color.YELLOW,
    cellAlpha: 0.2,
    lineCount: new Cesium.Cartesian2(4, 4),
    lineThickness: new Cesium.Cartesian2(4.0, 4.0)
  }) */

  class CustomMaterialProperty{

    params = {
      uTime: 0
    }
    
    definitionChanged = new Cesium.Event();

    constructor() {
      Cesium.Material._materialCache.addMaterial("CustomMaterial", {
        fabric: {
          type: 'CustomMaterial',
          uniforms: {
            uTime: 0,
          },
          source: `
            czm_material czm_getMaterial(czm_materialInput materialInput) {
              czm_material material = czm_getDefaultMaterial(materialInput);
              material.diffuse = vec3(materialInput.st, uTime);
              return material;
            }
          `
        }
      });

      gsap.to(this.params, {
        uTime: 1,
        duration: 2,
        repeat: -1,
        yoyo: true
      });
    }

    getType() {
      return 'CustomMaterial';
    }

    getValue(time, uniforms) {
      uniforms.uTime = this.params.uTime;
      return uniforms;
    }
  }

  let material = new CustomMaterialProperty();

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
