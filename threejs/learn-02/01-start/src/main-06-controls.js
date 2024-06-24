import '../style.css'
//限制控制器位移-旋转角度避免3d场景穿帮

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
camera.position.z = 0
camera.position.y = 1.2
camera.position.x = 5
camera.lookAt(0, 2, 0)
// 重置渲染器宽高比
renderer.setSize(window.innerWidth, window.innerHeight)
// 重置相机宽高比
camera.aspect = window.innerWidth / window.innerHeight
camera.updateProjectionMatrix()

const axesHelper = new THREE.AxesHelper(5)
scene.add(axesHelper)

const controls = new OrbitControls(camera, renderer.domElement)
// 设置带阻尼的惯性
controls.enableDamping = true
controls.target.set(0, 1.2, 0)
// 禁止平移
controls.enablePan = false
controls.minDistance = 3
controls.maxDistance = 5
// 垂直角度
controls.minPolarAngle = Math.PI / 2 - Math.PI / 12
controls.maxPolarAngle = Math.PI / 2
// 水平角度
controls.minAzimuthAngle = Math.PI / 2 - Math.PI / 8
controls.maxAzimuthAngle = Math.PI / 2 + Math.PI / 8

const gltfLoader = new GLTFLoader()
const dracoLoader = new DRACOLoader()
// 设置draco路径
dracoLoader.setDecoderPath('/draco/')
// 设置gltf加载器draco解码器
gltfLoader.setDRACOLoader(dracoLoader)

// 直接使用时候报错，THREE.GLTFLoader: No DRACOLoader instance provided
// 原因是模型是压缩的，需要使用解压缩工具DRACOLoader
gltfLoader.load('/model/客厅/scene.glb', gltf => {
  scene.add(gltf.scene)
})

// 加载环境贴图
let rgbLoader = new RGBELoader()
rgbLoader.load('/textures/Alex_Hart-Nature_Lab_Bones_2k.hdr', envMap => {
  envMap.mapping = THREE.EquirectangularReflectionMapping
  scene.environment = envMap
})


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

// 创建GUI
const gui = new GUI();

