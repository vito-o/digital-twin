<script setup>
import { onMounted } from 'vue'
// App10-设置alpha填充图片
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


// 创建平面
const planeGeometry = new THREE.PlaneGeometry(2, 2, 1, 1);
const planeMaterial = new THREE.MeshBasicMaterial({
  color: 0xffffff,
  side: THREE.DoubleSide,
  transparent: true,
  depthWrite: false,
  // blending: THREE.AdditiveBlending
})
const plane = new THREE.Mesh(planeGeometry, planeMaterial)
scene.add(plane)

let alphaMap = new THREE.TextureLoader().load('/textures/chat_alpha.png')

// 创建canvas对象
const canvas = document.createElement('canvas')
canvas.width = 1080
canvas.height = 1080
canvas.style.position = 'absolute'
canvas.style.top = '0px'
canvas.style.left = '0px'
canvas.style.zIndex = '1'
canvas.style.transformOrigin = '0 0'
canvas.style.transform = 'scale(0.1)'
const context = canvas.getContext('2d')

let image = new Image()
image.src = '/textures/chat.png'
image.onload = () => {
  context.drawImage(image, 0, 0, 1080, 1080)
  context.textAlign = 'center'
  context.font = "bold 100px Arial";
  context.fillStyle = "rgba(0,0,0,1)";
  context.fillText('Hello World', canvas.width /  2, canvas.height / 2)

  let texture = new THREE.CanvasTexture(canvas)
  plane.material.map = texture
  plane.material.alphaMap = alphaMap
  plane.material.needsUpdate = true
}


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
