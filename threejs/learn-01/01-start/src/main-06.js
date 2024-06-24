import '../style.css'


import * as THREE from 'three'
// 导入轨道控制器
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js'

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
const renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

// 创建纹理加载器
let textureLoader = new THREE.TextureLoader()
// 加载纹理
let texture = textureLoader.load('/textures/water/watercover-01.png')

// 加载ao贴图
let aoMap = textureLoader.load('/textures/water/watercover-01.png')

let planeGeometry = new THREE.PlaneGeometry(1, 1)
let planeMaterial = new THREE.MeshBasicMaterial({
  color: 0XFFFFFF,
  map: texture,
  side: THREE.DoubleSide,
  transparent: true,
  aoMap: aoMap
})
let plane = new THREE.Mesh(planeGeometry, planeMaterial)
scene.add(plane)


// 设置相机位置
camera.position.z = 2
camera.position.x = 2
camera.position.y = 2
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


const gui = new GUI()
gui.add(planeMaterial, 'aoMapIntensity').min(0).max(1).name('ao贴图')