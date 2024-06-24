import '../style.css'
//1.初识Points与点材质

import * as THREE from 'three'
// 导入轨道控制器
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js'
// 导入gltf加载器
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
// hdr加载器
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader'

import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'

import { TransformControls } from 'three/examples/jsm/controls/TransformControls'

// 场景
const scene = new THREE.Scene()

// 创建相机
const camera = new THREE.PerspectiveCamera(
  45,   // 视角
  window.innerWidth / window.innerWidth,
  0.1,  // 近平面
  1000  // 远平面
)
// 设置相机位置
camera.position.set(0, 0, 10)


// 场景渲染器
const renderer = new THREE.WebGLRenderer({
  antialias: true
})
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

// ------------------------------------
// 重置相机宽高比
camera.aspect = window.innerWidth / window.innerHeight
camera.updateProjectionMatrix()
// 重置渲染器宽高比
renderer.setSize(window.innerWidth, window.innerHeight)
// ------------------------------------

// 坐标辅助器
const axesHelper = new THREE.AxesHelper(5)
scene.add(axesHelper)

// 控制器
const controls = new OrbitControls(camera, renderer.domElement)
// 设置带阻尼的惯性
controls.enableDamping = true

const sphereGeometry = new THREE.SphereGeometry(3, 20, 20)
// const material = new THREE.MeshBasicMaterial({ color: 0xff0000 })
// const mesh = new THREE.Mesh(sphereGeometry, material)
// scene.add(mesh)

let pointMaterial = new THREE.PointsMaterial()
let points = new THREE.Points(sphereGeometry, pointMaterial)
pointMaterial.size = 0.1
scene.add(points)

/* 
const gltfLoader = new GLTFLoader()
const dracoLoader = new DRACOLoader()
// 设置draco路径
dracoLoader.setDecoderPath('/draco/')
// 设置gltf加载器draco解码器
gltfLoader.setDRACOLoader(dracoLoader)
gltfLoader.load('/model/liveroom-scene.glb', gltf => {
  basicScene = gltf.scene
}) */

/* // 加载环境贴图
let rgbLoader = new RGBELoader()
rgbLoader.load('/textures/Alex_Hart-Nature_Lab_Bones_2k.hdr', envMap => {
  envMap.mapping = THREE.EquirectangularReflectionMapping
  scene.environment = envMap
  scene.background = new THREE.Color(0xcccccc)
}) */

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


