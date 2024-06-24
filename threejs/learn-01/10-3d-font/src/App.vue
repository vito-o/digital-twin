<script setup>
import { onMounted, ref } from 'vue'

import * as THREE from 'three'
// 导入轨道控制器
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
// 导入字体加载器
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader'
// 导入文本缓冲几何体
// 一个用于将文本生成为单一的几何体的类
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry'

// 导入gltf加载器
// import { GLTFLoader } from 'three/examples/jsm/loaders/gltfloader'
// import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'
// import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader'

import gsap from 'gsap'

const screenDomRef = ref()
const pages = ref()

// 场景
const scene = new THREE.Scene()

// 照相机
const camera = new THREE.PerspectiveCamera(
  45,   // 视角
  window.innerWidth / window.innerWidth,
  0.1,  // 近平面
  2000  // 远平面
)
camera.position.set(0, 0, 800)

// 渲染器
const renderer = new THREE.WebGLRenderer({
  antialias: true, // 抗锯齿
  // 对数深度缓冲区
  // logarithmicDepthBuffer: true
})
renderer.setSize(window.innerWidth, window.innerHeight)
// renderer.outputEncoding = THREE.sRGBEncoding;

// 坐标助手 红色代表 X 轴. 绿色代表 Y 轴. 蓝色代表 Z 轴.
const axesHelper = new THREE.AxesHelper(15)
scene.add(axesHelper)

// 控制器
const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true // 设置带阻尼惯性

// 添加环境纹理
const bgTexture = new THREE.TextureLoader().load('/hdr/room.jpg')
bgTexture.mapping = THREE.EquirectangularReflectionMapping
scene.background = bgTexture
scene.environment = bgTexture
scene.backgroundBlurriness = 0.5 //模糊度

let fontLoader = new FontLoader()
fontLoader.load('/fonts/FangSong_Regular.json', font => {
  const geometry = new TextGeometry( 'Hello three.js! 安德森', {
		font: font,
		size: 80,
		height: 5, //文字厚度
		curveSegments: 12, //字体曲线段数
		bevelEnabled: true, //是否启用斜角
		bevelThickness: 10, // 斜角厚度
		bevelSize: 2,       // 斜角大小
		bevelSegments: 5    // 斜角分段数
	});
  geometry.center()

  const material = new THREE.MeshPhysicalMaterial({
    color: 0xeeeeff,
    roughness: 0,
    reflectivity: 1, //反射率，由0.0到1.0。默认为0.5, 相当于折射率1.5。
    thickness: 80,  //厚度
    ior: 1.5, //折射率
    side: THREE.DoubleSide,
    transmission: 1,  // 设置透射率
  })
  const mesh = new THREE.Mesh(geometry, material)
  scene.add(mesh)
})

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
  <div class="home">
    <div class="canvas-container" ref="screenDomRef"></div>
  </div>
</template>

<style>

</style>
