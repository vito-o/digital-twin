import '../style.css'
//运用数学知识打造复杂形状臂旋星系01

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

const params = {
  count: 100,
  size: 0.5,
  radius: 5, 
  branch: 3,
  color: '#ffffff',
  rotateScale: 0.3
}

let geometry = null
let material = null
const generateGalaxy = () => {
  // 生成顶点
  geometry = new THREE.BufferGeometry()
  // 生成随机位置
  const positions = new Float32Array(params.count * 3)
  // 生成顶点颜色
  const colors = new Float32Array(params.count * 3)

  // 循环生成点
  for(let i = 0; i < params.count; i++) {
    let current = i * 3;
    // 当前点应该在哪个分支的的角度上
    const branchAngel = (i % params.branch) * ((2 * Math.PI) / params.branch)
    // 当前点距离圆心的距离
    const distance = Math.random() * params.radius

    positions[current] = Math.cos(branchAngel + distance * params.rotateScale) * distance
    positions[current + 1] = 0;
    positions[current + 2] = Math.sin(branchAngel + distance * params.rotateScale) * distance;

    colors[current] = Math.random()
    colors[current + 1] = Math.random()
    colors[current + 2] = Math.random()
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))

  material = new THREE.PointsMaterial({
    transparent: true,
    map: textures,
    alphaMap: textures,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    size: params.size,
    color: new THREE.Color(params.color),
    // 是否使用顶点着色。默认值为false。
    vertexColors: true,
  })

  const point = new THREE.Points(geometry, material)
  scene.add(point)
}

generateGalaxy()

// 设置时钟
const clock = new THREE.Clock()

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


