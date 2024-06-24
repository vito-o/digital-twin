<script setup>
import { onMounted } from 'vue'
// App11-视频纹理
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { Octree } from "three/examples/jsm/math/Octree.js";
import { OctreeHelper } from "three/examples/jsm/helpers/OctreeHelper.js";
import { Capsule } from "three/examples/jsm/math/Capsule.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import Stats from "three/examples/jsm/libs/stats.module.js";

import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";
import { Reflector } from 'three/examples/jsm/objects/Reflector.js'

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x88ccee)

const camera = new THREE.PerspectiveCamera(70, window.innerWidth/window.innerHeight, 0.001, 1000)
camera.position.set(0, 0, 10);

const renderer = new THREE.WebGLRenderer({
  antialias: true
})
renderer.setPixelRatio(window.devicePixelRatio)
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.VSMShadowMap
renderer.outputEncoding = THREE.sRGBEncoding
renderer.toneMapping = THREE.ACESFilmicToneMapping

const stats = new Stats();
stats.domElement.style.position = "absolute";
stats.domElement.style.top = "0px";

let controls = new OrbitControls(camera, renderer.domElement);

// 添加视频纹理
const video = document.createElement('video')
video.src = '/video/keji1.mp4'
video.muted = true
video.loop = true
video.play()
const texture = new THREE.VideoTexture(video)

// 创建平面
const planeGeometry = new THREE.PlaneGeometry(2, 2, 1, 1);
const planeMaterial = new THREE.MeshBasicMaterial({
  color: 0xffffff,
  side: THREE.DoubleSide,
  transparent: true,
  depthWrite: false,
  blending: THREE.AdditiveBlending,
  map: texture,
  alphaMap: texture
})
const plane = new THREE.Mesh(planeGeometry, planeMaterial)
scene.add(plane)





const clock = new THREE.Clock();
const animate = () => {
  let delta = clock.getDelta();
 
  controls.update()

  renderer.render(scene, camera)

  requestAnimationFrame(animate)
}


onMounted(() => {
  const container = document.getElementById('container')

  container.appendChild(renderer.domElement)

  container.appendChild(stats.domElement);

  animate()
})

window.addEventListener('resize', () => {
  // 更新摄像头
  camera.aspect = window.innerWidth / window.innerHeight
  // 更新摄像机的投影矩阵
  camera.updateProjectionMatrix()
  // 更新渲染器
  renderer.setPixelRatio(window.devicePixelRatio)
  // 设置渲染器的像素比
  renderer.setSize(window.innerWidth, window.innerHeight)
})
</script>

<template>
  <div id="container"></div>
</template>

<style scoped>
#container {
  width: 100vw;
  height: 100vh;
}
</style>
