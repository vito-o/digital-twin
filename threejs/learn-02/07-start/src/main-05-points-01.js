import '../style.css'
//着色器设置点材质 - 点着色器图形设置原理

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

import vertexShader from './shader/point/p01_vertex.glsl?raw'
import fragmentShader from './shader/point/p01_fragment.glsl?raw'


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
camera.position.set(0, 0, 40)

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

let textureLoader = new THREE.TextureLoader()
let textures = textureLoader.load('/textures/particles/8.png')


const geometry = new THREE.BufferGeometry()
const positions = new Float32Array([0, 0, 0])
geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))

/* const material = new THREE.PointsMaterial({
  color: 0xff0000,
  size: 40,
  sizeAttenuation: true
}) */
const material = new THREE.ShaderMaterial({
  vertexShader,
  fragmentShader,
  transparent: true,
})

const points = new THREE.Points(geometry, material)
scene.add(points)



// 设置时钟 
// const clock = new THREE.Clock()

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


