import '../style.css'
// MeshPhongMaterial

import * as THREE from 'three'
// 导入轨道控制器
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js'
// 导入gltf加载器
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
// hdr加载器
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader'

import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'

// 场景
const scene = new THREE.Scene()

// 创建相机
const camera = new THREE.PerspectiveCamera(
  45,   // 视角
  window.innerWidth / window.innerWidth,
  0.1,  // 近平面
  1000  // 远平面
)

// 场景渲染器
const renderer = new THREE.WebGLRenderer({
  antialias: true
})
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

// 设置相机位置
camera.position.z = 5
camera.position.x = 5
camera.position.y = 5
camera.lookAt(0, 0, 0)

const axesHelper = new THREE.AxesHelper(5)
scene.add(axesHelper)

const controls = new OrbitControls(camera, renderer.domElement)
// 设置带阻尼的惯性
controls.enableDamping = true

function animate() {
  controls.update()

  requestAnimationFrame(animate)
  // 渲染
  renderer.render(scene, camera)
}

animate()

// 监听窗口变化
window.addEventListener('resize', () => {
  // 重置渲染器宽高比
  renderer.setSize(window.innerWidth, window.innerHeight)
  // 重置相机宽高比
  camera.aspect = window.innerWidth / window.innerHeight
  // 更新相机的投影矩阵
  camera.updateProjectionMatrix()
})

// 添加纹理
let textureLoader = new THREE.TextureLoader()
let colorTexture = textureLoader.load('/textures/watercover/CityNewYork002_COL_VAR1_1K.png')
colorTexture.colorSpace = THREE.SRGBColorSpace

// 设置高光贴图
let specularTexture = textureLoader.load('/textures/watercover/CityNewYork002_GLOSS_1K.jpg')

// 法线贴图
let normalTexture = textureLoader.load('/textures/watercover/CityNewYork002_NRM_1K.jpg')

// 凹凸贴图
let bumpTexture = textureLoader.load('/textures/watercover/CityNewYork002_DISP_1K.jpg')

// 置换贴图, 让图像真正凹凸，不过需要模型 细分（段数）比较大 new THREE.PlaneGeometry(1, 1, 200, 200)
let dispTexture = textureLoader.load('/textures/watercover/CityNewYork002_DISP_1K.jpg')

// 环境光遮蔽贴图
let aoTexture = textureLoader.load('/textures/watercover/CityNewYork002_AO_1K.jpg')

// 创建平面
let planeGeometry = new THREE.PlaneGeometry(1, 1, 200, 200)
/* let planeMaterial = new THREE.MeshPhongMaterial({
  map: colorTexture,
  transparent: true,
  specularMap: specularTexture,
  // normalMap: normalTexture,
  bumpMap: bumpTexture,
  displacementMap: dispTexture,
  displacementScale: 0.02,
  aoMap: aoTexture
}) */
let planeMaterial = new THREE.MeshLambertMaterial({
  map: colorTexture,
  transparent: true,
  specularMap: specularTexture,
  normalMap: normalTexture,
  bumpMap: bumpTexture,
  displacementMap: dispTexture,
  displacementScale: 0.02,
  aoMap: aoTexture
})
let plane = new THREE.Mesh(planeGeometry, planeMaterial)
plane.rotation.x = - Math.PI / 2
scene.add(plane)

// 环境光
let ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
scene.add(ambientLight)

// 点光源
let pointLight = new THREE.PointLight(0xffffff, 20)
pointLight.position.set(0, 3, 0)
scene.add(pointLight)

let rgbeLoader = new RGBELoader()
rgbeLoader.load('/textures/Alex_Hart-Nature_Lab_Bones_2k.hdr', envMap => {
  envMap.mapping = THREE.EquirectangularReflectionMapping
  scene.background = envMap
  scene.environment = envMap

  // 设置plane的环境贴图
  plane.material.envMap = envMap
})