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
import { renderer, css3dRenderer } from "@/three/renderer";
// 初始化调整屏幕
import "@/three/init";
// 导入添加物体函数
import createMesh from "@/three/createMesh";

import animate from "@/three/animate";

// import eventHub from "@/utils/eventHub";
const props = defineProps(['eventList'])

// 场景元素div
let sceneDiv = ref()
let css3dSceneDiv = ref()
// 添加相机
scene.add(CameraModule.activeCamera)
// 添加坐标辅助器
scene.add(axesHelper)

createMesh()

onMounted(() => {
  sceneDiv.value.appendChild(renderer.domElement)
  css3dSceneDiv.value.appendChild(css3dRenderer.domElement)
  animate()
})

</script>

<template>
  <div class="scene" ref="sceneDiv"></div>
  <div class="css3d-scene" ref="css3dSceneDiv"></div>
</template>


<style lang="less">
.scene {
  width: 100vw;
  height: 100vh;
  position: fixed;
  z-index: 100;
  left: 0;
  top: 0;
}

.css3d-scene{
  position: fixed;
  left: 0;
  top: 0;
  z-index: 101;
  pointer-events: none;
}

.elementTag {
  position: relative;
  left: -30px;
  top: 15px;

  &::before {
    content: "";
    display: block;
    position: absolute;
    width: 100px;
    height: 1px;
    background: rgb(127 177 255 / 75%);
    bottom: 0;
    right: -100px;
    transform: rotate(30deg);
    transform-origin: 0 0;
  }

  &::after {
    content: "";
    display: block;
    position: absolute;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: rgb(127 177 255 / 75%);
    bottom: -65px;
    right: -105px;
  }

  .elementContent {
    background-color: rgba(20, 143, 221, 0.68);
    box-shadow: 0 0 12px rgba(0, 128, 255, 0.75);
    border: 1px solid rgba(127, 177, 255, 0.75);
    padding: 20px;
    color: #efefef;

    h3 {
      font-size: 18px;
      font-weight: bold;
      margin: 0;
      padding: 0;
    }

    p{
      margin-top: 5px;
    }
  }
}
</style>