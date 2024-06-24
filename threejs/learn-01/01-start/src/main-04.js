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

/* 
// 需要6个顶点才能实现一个正方形面
const geometry = new THREE.BufferGeometry();
const vertices = new Float32Array([
  -1.0, -1.0, 0.0, 
   1.0, -1.0, 0.0,
   1.0,  1.0, 0.0,

   1.0,  1.0, 0.0,
  -1.0,  1.0, 0.0,
  -1.0, -1.0, 0.0 
])
geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3)) */

// 使用索引绘制，（通用索引点）
const geometry = new THREE.BufferGeometry();
const vertices = new Float32Array([
  -1.0, -1.0, 0.0, 
   1.0, -1.0, 0.0,
   1.0,  1.0, 0.0,
  -1.0,  1.0, 0.0,
])
geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3))
const indices = new Uint16Array([0, 1, 2, 2, 3, 0])
geometry.setIndex(new THREE.BufferAttribute(indices, 1))

const material = new THREE.MeshBasicMaterial({
  color: 0x00ff00, 
  side: THREE.DoubleSide,
  wireframe: true
})
const plane = new THREE.Mesh(geometry, material)
scene.add(plane)

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
// 设置阻尼系数
// controls.dampingFactor = 0.001
// 设置自动旋转
// controls.autoRotate = true

// 渲染
// renderer.render(scene, camera)

function animate() {
  controls.update()

  requestAnimationFrame(animate)
  // 旋转
  // cube.rotation.x += 0.01
  // cube.rotation.y += 0.01
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

let colorParams = { cubeColor: '#ff0000' }
gui.addColor(colorParams, 'cubeColor').name('立方体颜色').onChange(val => cube.material.color.set(val))
