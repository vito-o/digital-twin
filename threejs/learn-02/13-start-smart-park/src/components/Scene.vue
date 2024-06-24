<script setup>
import { onMounted, ref, watch } from 'vue'
import * as THREE from 'three'
import gsap from 'gsap'

// 导入场景
import scene from "@/three/scene";
// 导入相机
import CameraModule from "@/three/camera";
// 导入控制器
import ControlsModule from "@/three/controls";
// 导入辅助坐标轴
import axesHelper from "@/three/axesHelper";
// 导入渲染器
import renderer from "@/three/renderer";
// 初始化调整屏幕
import "@/three/init";
// 导入添加物体函数
import createMesh from "@/three/createMesh";

import animate from "@/three/animate";


// import eventHub from "@/utils/eventHub";
const props = defineProps(['eventList'])

// 场景元素div
let sceneDiv = ref()
// 添加相机
scene.add(CameraModule.activeCamera)
// 添加坐标辅助器
scene.add(axesHelper)

createMesh()

onMounted(() => {
  sceneDiv.value.appendChild(renderer.domElement)
  animate()
})


</script>

<template>
  <div class="scene" ref="sceneDiv"></div>
</template>


<style>
.scene {
  width: 100vw;
  height: 100vh;
  position: fixed;
  z-index: 100;
  left: 0;
  top: 0;
}
</style>