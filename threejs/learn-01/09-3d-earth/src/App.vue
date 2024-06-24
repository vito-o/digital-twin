<script setup>
import { onMounted, ref } from 'vue'

import * as THREE from 'three'
// 导入轨道控制器
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

// 导入gltf加载器
import { GLTFLoader } from 'three/examples/jsm/loaders/gltfloader'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader'

import gsap from 'gsap'

const screenDomRef = ref()
const pages = ref()

const lon2xyz = (R, longitude, latitude) => {
  let lon = (longitude * Math.PI) / 180 //转弧度值
  let lat = (latitude * Math.PI) / 180  //转弧度值
  lon = -lon //js坐标系z坐标轴对应经度-90度，而不是90度

  // 经纬度坐标转球面坐标计算公式
  const x = R * Math.cos(lat) * Math.cos(lon);
  const y = R * Math.sin(lat);
  const z = R * Math.cos(lat) * Math.sin(lon);

  return new THREE.Vector3(x, y, z)
}


// 场景
const scene = new THREE.Scene()

// 照相机
const camera = new THREE.PerspectiveCamera(
  45,   // 视角
  window.innerWidth / window.innerWidth,
  0.1,  // 近平面
  1000  // 远平面
)
camera.position.set(0, 50, 300)

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

// 背景
// let textureLoader = new THREE.TextureLoader()
// let envMap = textureLoader.load('/assets/25s.jpg')
// envMap.mapping = THREE.EquirectangularReflectionMapping
scene.background = new THREE.Color(0x030311)
// scene.environment = envMap

// 使用点材质创建星空效果
const vertices = []
for(let i = 0; i < 500; i++) {
  // const vertex = new THREE.Vector3()
  let x = 800 * Math.random() - 400;
  let y = 800 * Math.random() - 400;
  let z = 800 * Math.random() - 400;
  vertices.push(x, y, z)
}

let starsGeometry = new THREE.BufferGeometry()
starsGeometry.setAttribute(
  'position', 
  new THREE.BufferAttribute(new Float32Array(vertices), 3)
)

const startsTexture = new THREE.TextureLoader().load('/images/stars.png')
const startsMaterial = new THREE.PointsMaterial({
  size: 2,
  sizeAttenuation: true, //尺寸衰减
  color: 0x4d76cf,
  transparent: true,
  opacity: 1,
  map: startsTexture
})
let starts = new THREE.Points(starsGeometry, startsMaterial)
scene.add(starts)

// 创建地球
let earthGeometry = new THREE.SphereGeometry(50, 32, 32)
let earthTexture = new THREE.TextureLoader().load('/images/map.jpg')
let earthMaterial = new THREE.MeshBasicMaterial({
  map: earthTexture
})
let earth = new THREE.Mesh(earthGeometry, earthMaterial)
scene.add(earth)

// 发光地图
let lightTexture = new THREE.TextureLoader().load('/images/earth.jpg')
let lightEarthGeometry = new THREE.SphereGeometry(53, 32, 32)
let lightEarthMaterial = new THREE.MeshBasicMaterial({
  map: lightTexture,
  alphaMap: lightTexture,
  blending: THREE.AdditiveBlending,
  transparent: true
})
let lightEarth = new THREE.Mesh(lightEarthGeometry, lightEarthMaterial)
scene.add(lightEarth)
// blending 被设置为 THREE.AdditiveBlending，这是 Three.js 中的一种混合模式。
// AdditiveBlending 特别适用于创建发光效果，因为它将材质的颜色与背景颜色相加，
// 从而产生一种明亮的效果，就像光线穿过半透明的幻灯片一样。
// 这种混合模式通常用于实现霓虹灯效果、激光或其他需要发光的视觉元素。

// 添加地球内外发光精灵
let spriteTexture = new THREE.TextureLoader().load('/images/glow.png')
let spriteMaterial = new THREE.SpriteMaterial({
  map: spriteTexture,
  color: 0x4d76cf,
  transparent: true,
  depthWrite: false,
  depthTest: false,
  blending: THREE.AdditiveBlending
})
let sprite = new THREE.Sprite(spriteMaterial)
sprite.scale.set(155, 155, 0)
scene.add(sprite)

// 内发光
let spriteTexture1 = new THREE.TextureLoader().load('/images/innerGlow.png')
let spriteMaterial1 = new THREE.SpriteMaterial({
  map: spriteTexture1,
  color: 0x4d76cf,
  transparent: true,
  depthWrite: false, // 渲染此材质是否对深度缓冲区有任何影响。默认为true。
  depthTest: false,  // 是否在渲染此材质时启用深度测试。默认为 true。
  blending: THREE.AdditiveBlending
})
let sprite1 = new THREE.Sprite(spriteMaterial1)
sprite1.scale.set(128, 128, 0)
scene.add(sprite1)

// 光柱
for(let i = 0; i < 30; i++) {
  let lightPillarTexture = new THREE.TextureLoader().load('/images/light_column.png')
  let lightPillarGeometry = new THREE.PlaneGeometry(3, 20)
  let lightPillarMaterial = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    map: lightPillarTexture,
    alphaMap: lightPillarTexture,
    transparent: true,
    blending: THREE.AdditiveBlending,
    side: THREE.DoubleSide,
    depthWrite: false
  })
  let lightPillar = new THREE.Mesh(lightPillarGeometry, lightPillarMaterial)
  //复制一份 lightPillar，然后旋转90度 让两张图交叉起来，看起来像三维图像
  lightPillar.add(lightPillar.clone().rotateY(Math.PI / 2)) 

  // 创建波纹扩散效果
  let circlePlane = new THREE.PlaneGeometry(6, 6)
  let circleTexture = new THREE.TextureLoader().load('/images/label.png')
  let circleMaterial = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    map: circleTexture,
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,  // 渲染此材质是否对深度缓冲区有任何影响。默认为true。
    side: THREE.DoubleSide
  })
  let circleMesh = new THREE.Mesh(circlePlane, circleMaterial)
  circleMesh.rotation.x = -Math.PI / 2
  circleMesh.position.set(0, -7, 0)
  lightPillar.add(circleMesh)

  // 波纹扩散效果
  gsap.to(circleMesh.scale, {
    duration: 1 + Math.random() * 0.5,
    x: 2,
    y: 2,
    z: 2,
    repeat: -1,
    delay: Math.random() * 0.5,
    yoyo: true,
    ease: 'power2.inOut'
  })

  // 设置光柱位置
  let lat = Math.random() * 180 - 90
  let lon = Math.random() * 360 - 180;
  let position = lon2xyz(60, lon, lat)
  lightPillar.position.set(position.x, position.y, position.z)

  // 将光柱旋转到垂直于 地心或者法向量
  lightPillar.quaternion.setFromUnitVectors(
    new THREE.Vector3(0, 1, 0),
    position.clone().normalize()
  )

  scene.add(lightPillar)
}

// 绕地球运行的月球
let moonTexture = new THREE.TextureLoader().load('/images/moon.jpg')
let moonMaterial = new THREE.MeshStandardMaterial({
  map: moonTexture,
  emissive: 0xffffff,        // 材质的放射（光）颜色，基本上是不受其他光照影响的固有颜色。默认为黑色。
  emissiveMap: moonTexture,  //设置放射（发光）贴图。默认值为null。放射贴图颜色由放射颜色和强度所调节。 
})
let moonGeometry = new THREE.SphereGeometry(5, 32, 32)
let moon = new THREE.Mesh(moonGeometry, moonMaterial)
moon.position.set(150, 0, 0)
scene.add(moon)

// 创建月环
let moonRingTexture = new THREE.TextureLoader().load('/images/moon_ring.png')
let moonRingMaterial = new THREE.MeshBasicMaterial({
  map: moonRingTexture,
  alphaMap: moonRingTexture,
  transparent: true,
  blending: THREE.AdditiveBlending,
  depthWrite: false,  // 渲染此材质是否对深度缓冲区有任何影响。默认为true。
  side: THREE.DoubleSide
})
let moonRingGeometry = new THREE.RingGeometry(145, 155, 64)
let moonRing = new THREE.Mesh(moonRingGeometry, moonRingMaterial)
moonRing.rotation.x = - Math.PI / 2
scene.add(moonRing)

let time = {
  value: 0
}

gsap.to(time, {
  value: 1,
  duration: 10,
  repeat: -1,
  ease: 'linear',
  onUpdate: () => {
    moon.position.x = 150 * Math.cos(time.value * Math.PI * 2)
    moon.position.z = 150 * Math.sin(time.value * Math.PI * 2)
    moon.rotation.y = time.value * Math.PI * 8
  }
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
