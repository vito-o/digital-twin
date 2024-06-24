<script setup>
import { onMounted, ref } from 'vue'

import * as THREE from 'three'
// 导入轨道控制器
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

// 导入gltf加载器
import { GLTFLoader } from 'three/examples/jsm/loaders/gltfloader'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader'

import { Water } from 'three/examples/jsm/objects/Water2'

const screenDomRef = ref()

// 场景
const scene = new THREE.Scene()

// 照相机
const camera = new THREE.PerspectiveCamera(
  75,   // 视角
  window.innerWidth / window.innerWidth,
  0.1,  // 近平面
  2000  // 远平面
)
camera.position.set(-50, 50, 130)

// 渲染器
const renderer = new THREE.WebGLRenderer({
  antialias: true, // 抗锯齿
  // 对数深度缓冲区
  logarithmicDepthBuffer: true
})
renderer.setSize(window.innerWidth, window.innerHeight)
// renderer.outputEncoding = THREE.sRGBEncoding;

// 坐标助手 红色代表 X 轴. 绿色代表 Y 轴. 蓝色代表 Z 轴.
const axesHelper = new THREE.AxesHelper(15)
scene.add(axesHelper)

// 控制器
const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true // 设置带阻尼惯性

new RGBELoader().load('/assets/050.hdr', envMap => {
  envMap.mapping = THREE.EquirectangularReflectionMapping
  scene.background = envMap
  scene.environment = envMap
})

// 添加平面
const sky = new THREE.Mesh(
  new THREE.SphereGeometry(1000, 60, 60),
  new THREE.MeshBasicMaterial({ 
    map: new THREE.TextureLoader().load('/textures/sky.jpg'),
  })
)
sky.geometry.scale(1, 1, -1)
scene.add(sky)

// 视频纹理
let video = document.createElement('video')
video.src = '/textures/sky.mp4'
video.muted = true
video.loop = true

window.addEventListener('click', e => {
  if (video.paused) {
    video.play()
    sky.material.map = new THREE.VideoTexture(video)
    sky.material.map.needsUpdate = true
  }
})


// 创建水面
const water = new Water(
  new THREE.CircleGeometry(1000, 32),
  {
    textureWidth: 1024,
    textureHeight: 1024,
    color: 0xeeeeff,
    flowDirection: new THREE.Vector2(1, 1),
    scale: 1
  }
)
water.rotation.x = -Math.PI / 2
water.position.y = 3
scene.add(water)

// 设置背景
// const textLoader = new THREE.TextureLoader()
// const bgTexture = textLoader.load('/assets/imgs/050.jpg')
// bgTexture.mapping = THREE.EquirectangularRefractionMapping
// scene.background = bgTexture
// scene.environment = bgTexture


const gltfLoader = new GLTFLoader()
// 实例化加载器draco
const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath('/draco/')
gltfLoader.setDRACOLoader(dracoLoader)
gltfLoader.load('/model/island2.glb', gltf => {
  console.log(gltf)
  scene.add(gltf.scene)
})

const ambientLight = new THREE.AmbientLight(0x404040);
scene.add(ambientLight)

const light = new THREE.DirectionalLight(0xffffff, 10)
light.position.set(-100, -100, 10)
scene.add(light)

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
