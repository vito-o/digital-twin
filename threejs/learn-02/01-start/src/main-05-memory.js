import '../style.css'
// 内存清理

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


let sphereGeometry, sphereMaterial, texture, sphere

function animate() {
  create()

  controls.update()

  requestAnimationFrame(animate)
  // 渲染
  renderer.render(scene, camera)

  

  // 清除场景中的物体
  scene.remove(sphere)
  // 清除球
  sphereGeometry.dispose()
  // 清除材质
  sphereMaterial.dispose()
  // 清除纹理贴图
  // texture.dispose()
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


function create() {
  sphereGeometry = new THREE.SphereGeometry(
    2, 
    Math.random() * 64, 
    Math.random() * 32
  )
  sphereMaterial = new THREE.MeshBasicMaterial({
    color: 0xffffff * Math.random(),
  })
  sphere = new THREE.Mesh(sphereGeometry, sphereMaterial)
  scene.add(sphere)
}
