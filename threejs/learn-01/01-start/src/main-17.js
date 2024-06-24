import '../style.css'
// 几何体居中 与几何体中心点

import * as THREE from 'three'
// 导入轨道控制器
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js'
// 导入gltf加载器
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
// hdr加载器
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader'

import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'
// 导入tween
import * as TWEEN from 'three/examples/jsm/libs/tween.module'


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
camera.position.z = 15
camera.position.x = 0
camera.position.y = 0
camera.lookAt(0, 0, 0)

// 场景渲染器
const renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

// 红色代表 X 轴. 绿色代表 Y 轴. 蓝色代表 Z 轴.
const axesHelper = new THREE.AxesHelper(5)
scene.add(axesHelper)

const controls = new OrbitControls(camera, renderer.domElement)
// 设置带阻尼的惯性
controls.enableDamping = true


let sphere1 = new THREE.Mesh(
  new THREE.SphereGeometry(0.5, 32, 32),
  new THREE.MeshBasicMaterial({ color: 0xff0000 })
)
sphere1.position.x = -3
scene.add(sphere1)

let sphere2 = new THREE.Mesh(
  new THREE.SphereGeometry(0.5, 32, 32),
  new THREE.MeshBasicMaterial({ color: 0x00ff00 })
)
sphere2.position.x = 0
scene.add(sphere2)

let sphere3 = new THREE.Mesh(
  new THREE.SphereGeometry(0.5, 32, 32),
  new THREE.MeshBasicMaterial({ color: 0x0000ff })
)
sphere3.position.x = 3
scene.add(sphere3)

/* 
sphere1.geometry.computeBoundingBox()
sphere2.geometry.computeBoundingBox()
sphere3.geometry.computeBoundingBox()

let sphere1Box = sphere1.geometry.boundingBox
let sphere2Box = sphere2.geometry.boundingBox
let sphere3Box = sphere3.geometry.boundingBox

sphere1.updateWorldMatrix(true, true)
sphere2.updateWorldMatrix(true, true)
sphere3.updateWorldMatrix(true, true)

sphere1Box.applyMatrix4(sphere1.matrixWorld)
sphere2Box.applyMatrix4(sphere2.matrixWorld)
sphere3Box.applyMatrix4(sphere3.matrixWorld)

let box1Helper = new THREE.Box3Helper(sphere1Box, 0xff0000)
let box2Helper = new THREE.Box3Helper(sphere2Box, 0x00ff00)
let box3Helper = new THREE.Box3Helper(sphere3Box, 0x0000ff)

scene.add(box1Helper)
scene.add(box2Helper)
scene.add(box3Helper) */

let box = new THREE.Box3()
let arrSphere = [sphere1, sphere2, sphere3]
for (let i = 0; i < arrSphere.length; i++) {
  /* 
  // 第一种方式：计算多个物体的包围盒
  // 获取当前物体的包围盒
  arrSphere[i].geometry.computeBoundingBox()
  // 获取包围盒
  let box3 = arrSphere[i].geometry.boundingBox;
  arrSphere[i].updateWorldMatrix(true, true)
  // 将包围盒转到世界坐标系
  box3.applyMatrix4(arrSphere[i].matrixWorld)
  box.union(box3)
   */

  // 第二种方式：计算多个物体的包围盒
  let box3 = new THREE.Box3().setFromObject(arrSphere[i])
  // 合并包围盒
  box.union(box3)
}

let boxHelper = new THREE.Box3Helper(box, 0xffff00)
scene.add(boxHelper)


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

// rgbeLoader 加载hdr贴图
let rgbeLoader = new RGBELoader()
rgbeLoader.load('/textures/Alex_Hart-Nature_Lab_Bones_2k.hdr', envMap => {
  // 设置球形贴图
  envMap.mapping = THREE.EquirectangularReflectionMapping
  // 设置背景贴图
  scene.background = envMap
  // 设置环境贴图
  scene.environment = envMap
  // 设置plane的环境贴图
})

