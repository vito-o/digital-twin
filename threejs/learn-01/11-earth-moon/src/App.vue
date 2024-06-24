<script setup>
import { onMounted, ref } from 'vue'

import * as THREE from 'three'
// 导入轨道控制器
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

import { CSS2DRenderer, CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer'

const screenDomRef = ref()

// 全局变量
let moon, earth;
let clock = new THREE.Clock()
let textureLoader = new THREE.TextureLoader()

const EARTH_RADIUS = 2.5
const MOON_RADIUS = 0.27

// 场景
const scene = new THREE.Scene()

// 照相机
const camera = new THREE.PerspectiveCamera(
  45,   // 视角
  window.innerWidth / window.innerWidth,
  0.1,  // 近平面
  200  // 远平面
)
camera.position.set(10, 5, -20)

// 渲染器
const renderer = new THREE.WebGLRenderer({
  antialias: true, // 抗锯齿
  // 对数深度缓冲区
  // logarithmicDepthBuffer: true
  alpha: true,  // 透明
})
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.shadowMap.enabled = true
// renderer.outputEncoding = THREE.sRGBEncoding;

// 坐标助手 红色代表 X 轴. 绿色代表 Y 轴. 蓝色代表 Z 轴.
const axesHelper = new THREE.AxesHelper(15)
scene.add(axesHelper)




// earth
const earthGeometry = new THREE.SphereGeometry(EARTH_RADIUS, 16, 16)
const earthMaterial = new THREE.MeshPhongMaterial({
  shininess: 5, //specular高亮的程度，越高的值越闪亮。默认值为 30。
  map: textureLoader.load('/textures/planets/earth_atmos_2048.jpg'),
  specular: textureLoader.load('/textures/planets/earth_specular_2048.jpg'),
  normalMap: textureLoader.load('/textures/planets/earth_normal_2048.jpg'),
})
earth = new THREE.Mesh(earthGeometry, earthMaterial)
earth.castShadow = true
earth.receiveShadow = true
// earth.rotation.y = Math.PI;
scene.add(earth)

// moon 
const moonGeometry = new THREE.SphereGeometry(MOON_RADIUS, 16, 16)
const moonMaterial = new THREE.MeshPhongMaterial({
  shininess: 5, //specular高亮的程度，越高的值越闪亮。默认值为 30。
  map: textureLoader.load('/textures/planets/moon_1024.jpg'),
})
moon = new THREE.Mesh(moonGeometry, moonMaterial)
moon.castShadow = true
moon.receiveShadow = true
scene.add(moon)

const earthDiv = document.createElement('div')
earthDiv.className = 'label'
earthDiv.textContent = 'Earth'
const earthLabel = new CSS2DObject(earthDiv)
earthLabel.position.set(0, EARTH_RADIUS + 0.5, 0)
earth.add(earthLabel)

const moonDiv = document.createElement('div')
moonDiv.className = 'label'
moonDiv.textContent = 'Moon'
const moonLabel = new CSS2DObject(moonDiv)
moonLabel.position.set(0, MOON_RADIUS + 0.5, 0)
moon.add(moonLabel)

const chinaDiv = document.createElement('div')
chinaDiv.className = 'label-china'
chinaDiv.textContent = '中国'
const chinaLabel = new CSS2DObject(chinaDiv)
chinaLabel.position.set(-0.7, EARTH_RADIUS / 2 + 0.3, -EARTH_RADIUS+0.3)
earth.add(chinaLabel)

// 标签渲染器
const labelRenderer = new CSS2DRenderer()
labelRenderer.setSize(window.innerWidth, window.innerHeight)
labelRenderer.domElement.style.position = 'absolute'
labelRenderer.domElement.style.top = '0px'
document.body.appendChild(labelRenderer.domElement)

// 控制器
const controls = new OrbitControls(camera, labelRenderer.domElement)
controls.enableDamping = true // 设置带阻尼惯性

// 聚光灯
const dirLight = new THREE.SpotLight(0xffffff)
dirLight.position.set(0, 0, -10)
dirLight.intensity = 10
dirLight.decay = 0
dirLight.target = earth
dirLight.castShadow = true
scene.add(dirLight)

// 添加环境光
const aLight = new THREE.AmbientLight(0xffffff)
aLight.intensity = 0.3
scene.add(aLight)

const raycaster = new THREE.Raycaster();

// 渲染
let oldtime = 0;
const animate = () => {
  let elapsed = clock.getElapsedTime()
  moon.position.set(Math.sin(elapsed) * 5, 0, Math.cos(elapsed) * 5)

  // 地球旋转
  let axis = new THREE.Vector3(0, 1, 0)
  // earth.rotateOnAxis(axis, (elapsed - oldtime) * Math.PI / 10)
  oldtime = elapsed

  // -------------------------------------------------
  // ‘中国’文字到背面后隐藏， 使用射线进行处理 (和地球自旋转冲突)
  const chinaPosition = chinaLabel.position.clone();
  // 1.计算出标签跟摄像机的距离
  const labelDistance = chinaPosition.distanceTo(camera.position)
  // 2.检测射线的碰撞
  // 向量(坐标)从世界空间投影到相机的标准化设备坐标 (NDC) 空间。
  chinaPosition.project(camera)
  raycaster.setFromCamera(chinaPosition, camera)
  // 3.碰撞数量
  const intersects = raycaster.intersectObjects(scene.children, true)
  // 4.如果没有碰撞到任何物品，那么让标签显示
  if (intersects.length == 0) {
    chinaLabel.element.classList.add('visible')
  } else {
    const minDistance = intersects[0].distance;
    if (minDistance < labelDistance) {
      chinaLabel.element.classList.remove('visible');
    } else {
      chinaLabel.element.classList.add('visible')
    }
  }
  // -------------------------------------------------

  renderer.render(scene, camera)
  labelRenderer.render(scene, camera)
  controls.update()
  requestAnimationFrame(animate)
}

// 监听窗口变化
window.addEventListener('resize', () => {
  // 重置渲染器宽高比
  labelRenderer.setSize(window.innerWidth, window.innerHeight)
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
canvas {
  background-image: url(/imgs/star.jpg);
  background-size: cover;
}

.label {
  color: #fff;
  font-size: 16px;
}
</style>
