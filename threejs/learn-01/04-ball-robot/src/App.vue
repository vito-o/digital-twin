<script setup>
import { onMounted, ref } from 'vue'

import * as THREE from 'three'
// 导入轨道控制器
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

// 导入gltf加载器
import { GLTFLoader } from 'three/examples/jsm/loaders/gltfloader'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader'

// 导入反射
import { Reflector } from 'three/examples/jsm/objects/Reflector'

const screenDomRef = ref()

// 场景
const scene = new THREE.Scene()

// 照相机
const camera = new THREE.PerspectiveCamera(
  75,   // 视角
  window.innerWidth / window.innerWidth,
  0.1,  // 近平面
  1000  // 远平面
)
camera.position.set(0, 2, 6)
camera.lookAt(0, 0, 0)

// 渲染器
const renderer = new THREE.WebGLRenderer({
  antialias: true, // 抗锯齿
})
renderer.setSize(window.innerWidth, window.innerHeight)

// 坐标助手 红色代表 X 轴. 绿色代表 Y 轴. 蓝色代表 Z 轴.
const axesHelper = new THREE.AxesHelper(5)
scene.add(axesHelper)

// 控制器
const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true // 设置带阻尼惯性

// 初始化渲染背景
// renderer.setClearColor('#000')
// scene.background = new THREE.Color('#ccc')
// scene.environment = new THREE.Color('#ccc')

const rgbeLoader = new RGBELoader()
rgbeLoader.load('/assets/sky12.hdr', envMap => {
  envMap.mapping = THREE.EquirectangularReflectionMapping
  scene.background = envMap
  scene.environment = envMap
})

const gltfLoader = new GLTFLoader()
// 实例化加载器draco
const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath('/draco/')
dracoLoader.setDecoderConfig({ type: 'js' })
gltfLoader.setDRACOLoader(dracoLoader)
gltfLoader.load('/assets/robot.glb', gltf => {
  scene.add(gltf.scene)
})

// 添加灯光
let light1 = new THREE.DirectionalLight(0xffffff, 1)
light1.position.set(0, 10, 10)
let light2 = new THREE.DirectionalLight(0xffffff, 1)
light2.position.set(0, 10, -10)
let light3 = new THREE.DirectionalLight(0xffffff, 1)
light3.position.set(10, 10, 10)
scene.add(light1, light2, light3)

// 添加光阵
let videoDom = document.createElement('video')
videoDom.src = '/assets/zp2.mp4'
videoDom.loop = true
videoDom.muted = true
videoDom.play()

let videoTexture = new THREE.VideoTexture(videoDom)
const videoGeoPlane = new THREE.PlaneGeometry(8, 4.5)
const videoMaterial = new THREE.MeshBasicMaterial({
  map: videoTexture,
  transparent: true,
  side: THREE.DoubleSide,
  alphaMap: videoTexture
})
const videoMesh = new THREE.Mesh(videoGeoPlane, videoMaterial)
videoMesh.position.set(0, 0.2, 0)
videoMesh.rotation.x = -Math.PI / 2
scene.add(videoMesh)

// 添加镜面反射
let reflectorGeometry = new THREE.PlaneGeometry(100, 100)
let reflectorPlane = new Reflector(reflectorGeometry, {
  textureWidth: window.innerWidth,
  textureHeight: window.innerHeight,
  color: 0x332222
})
reflectorPlane.rotation.x = -Math.PI / 2
scene.add(reflectorPlane)

// 渲染
const animate = () => {
  requestAnimationFrame(animate)

  renderer.render(scene, camera)
  controls.update()
}

// 监听窗口变化
window.addEventListener('resize', () => {
  // 重置渲染器宽高比
  renderer.setSize(window.innerWidth, window.innerHeight)
  // 重置相机宽高比
  camera.aspect = window.innerWidth / window.innerHeight
  // 更新相机的投影矩阵
  camera.updateProjectionMatrix()
})

onMounted(() => {
  screenDomRef.value.appendChild(renderer.domElement)

  animate()
})
</script>

<template>
  <div class="canvas-container" ref="screenDomRef"></div>
</template>

<style scoped>

</style>
