<script setup>
import { onMounted, ref } from 'vue'

import * as THREE from 'three'
// 导入轨道控制器
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

// 导入gltf加载器
import { GLTFLoader } from 'three/examples/jsm/loaders/gltfloader'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader'

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
camera.position.set(1.5, 1, 1.5)

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

// 设置背景
const textLoader = new THREE.TextureLoader()
const bgTexture = textLoader.load('/assets/imgs/050.jpg')
bgTexture.mapping = THREE.EquirectangularRefractionMapping
scene.background = bgTexture
scene.environment = bgTexture


const gltfLoader = new GLTFLoader()
// 实例化加载器draco
// const dracoLoader = new DRACOLoader()
// dracoLoader.setDecoderPath('/draco/')
// gltfLoader.setDRACOLoader(dracoLoader)
gltfLoader.load('/assets/model/bear.gltf', gltf => {

  let bear = gltf.scene.children[0]
  bear.material = new THREE.MeshPhongMaterial({
    color: 0xffffff,
    envMap: bgTexture,
    refractionRatio: 0.7,
    reflectivity: 0.99,
  })

  scene.add(bear)
})

// MeshPhongMaterial 需要光照
const ambient = new THREE.AmbientLight(0xffffff, 2)
scene.add(ambient)

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
