<script setup>

import { onMounted } from 'vue'
import gsap from 'gsap'
import * as Cesium from "cesium";

import initViewer from '@/cesium/initViewer'
import MousePosition from '@/cesium/MousePosition'
import CesiumNavigation from "cesium-navigation-es6";
import modifyMap from '@/cesium/modifyMap';
import modifyBuild from '@/cesium/modifyBuild';
import LightCone from '@/cesium/LightCone';
import RectFlyLight from '@/cesium/RectFlyLight';
import RoadLightLine from '@/cesium/RoadLightLine';
import RadarLight from '@/cesium/RadarLight';
import LightSpread from '@/cesium/LightSpread';
import LightWall from '@/cesium/LightWall';
import ParticleLight from '@/cesium/ParticleLight';

onMounted(async() => {
  const viewer = await initViewer()

  const mousePosition = new MousePosition(viewer)

  const options = {
    // 启用罗盘
    enableCompass: true,
    // 启用缩放控件
    enableZoomControls: true,
    // 启用距离图例
    enableDistanceLegend: true,
    // 启用指南针外环
    enableCompassOuterRing: true,
  };
  new CesiumNavigation(viewer, options);

  modifyMap(viewer)
  
  await modifyBuild(viewer)

  new LightCone(viewer)

  new RectFlyLight(viewer)

  new RoadLightLine(viewer)

  new RadarLight(viewer)

  new LightSpread(viewer)

  new LightWall(viewer)

  new ParticleLight(viewer, Cesium.Color.RED)
  new ParticleLight(viewer, Cesium.Color.AQUA)
  new ParticleLight(viewer, Cesium.Color.GREEN)
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
