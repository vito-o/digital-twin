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

const camera = new THREE.PerspectiveCamera(
  75,   // 视角
  window.innerWidth / window.innerWidth,
  0.1,  // 近平面
  1000  // 远平面
)
camera.position.set(0, 0, 0.1)
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

const gltfLoader = new GLTFLoader()
// 实例化加载器draco
const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath('/draco/')
dracoLoader.setDecoderConfig({ type: 'js' })
gltfLoader.setDRACOLoader(dracoLoader)
// gltfLoader.load('/assets/robot.glb', gltf => {
//   scene.add(gltf.scene)
// })
/* 
// 添加立方体
const geometry = new THREE.BoxGeometry(10, 10, 10)
// 4_b
let arr = ['4_l', '4_r', '4_u', '4_d', '4_b', '4_f']  //左右 上下 前后
let boxMaterials = []
for(let item of arr) {
  let texture = new THREE.TextureLoader().load(`/imgs/living/${item}.jpg`)
  
  if (item == '4_u' || item == '4_d') {
    texture.rotation = Math.PI
    texture.center = new THREE.Vector2(0.5, 0.5)
  }
  boxMaterials.push(new THREE.MeshBasicMaterial({ map: texture }))
}
const cube = new THREE.Mesh(geometry, boxMaterials)
cube.geometry.scale(1, 1, -1) //这个属性 就可以让看见盒子里面 ，好像进入了盒子内部一样
scene.add(cube)

// cube.geometry.scale(1, 1, -1)
// 这个调用的作用是将立方体（或任何其他几何体）沿着 X 轴和 Y 轴保持原始大小不变，
// 而沿着 Z 轴缩放到其原始大小的相反方向。换句话说，它将几何体“翻转”或“反转”沿着 Z 轴。
// 这通常用于创建几何体内部的镜像效果，或者在某些特定类型的动画中改变几何体的方向。

// 例如，如果你有一个标准的立方体，调用 scale(1, 1, -1) 后，立方体的正面将朝向原来的背面，
// 而背面将朝向原来的正面。这种操作在创建某些视觉效果或进行特定的空间变换时非常有用。
 */


// 添加球场景
let rgbeLoader = new RGBELoader()

const geometry = new THREE.SphereGeometry(5, 32, 32)
rgbeLoader.load('./imgs/hdr/Living.hdr', texture => {
  const material = new THREE.MeshBasicMaterial({ map: texture })
  const mesh = new THREE.Mesh(geometry, material)
  mesh.geometry.scale(1, 1, -1)
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
  <div class="canvas-container" ref="screenDomRef"></div>
</template>

<style scoped>

</style>
