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



const gltfLoader = new GLTFLoader()
gltfLoader.load('/model/Duck.glb', gltf => {
  scene.add(gltf.scene)

  let duckMesh = gltf.scene.getObjectByName('LOD3spShape')
  let duckGeometry = duckMesh.geometry;
  console.log(duckMesh)
  // 计算包围盒
  duckGeometry.computeBoundingBox()
  // 设置几何体居中
  duckGeometry.center()//----------

  // 获取duck包围盒
  let duckBox = duckGeometry.boundingBox
  // 更新世界矩阵
  duckMesh.updateWorldMatrix(true, true)
  // 更新包围盒
  duckBox.applyMatrix4(duckMesh.matrixWorld)

  // 获取包围盒中心点
  let center = duckBox.getCenter(new THREE.Vector3())
  console.log(center)
  
  // 创建包围盒辅助器
  let boxHelper = new THREE.Box3Helper(duckBox, 0xffff00)
  scene.add(boxHelper)

  // 获取包围球
  let duckSphere = duckGeometry.boundingSphere
  duckSphere.applyMatrix4(duckMesh.matrixWorld)
  // 创建包围球的辅助器
  let sphere = new THREE.Sphere(duckSphere.center, duckSphere.radius)
  let sphereGeometry = new THREE.SphereGeometry(duckSphere.radius, 16, 16)
  let sphereMesh = new THREE.Mesh(
    sphereGeometry,
    new THREE.MeshBasicMaterial({ wireframe: true, color: 0x00ff00})
  )
  sphereMesh.position.copy(duckSphere.center)
  scene.add(sphereMesh)
})

const dracoLoader = new DRACOLoader()
// 设置draco路径
dracoLoader.setDecoderPath('/draco/')
// 设置gltf加载器draco解码器
gltfLoader.setDRACOLoader(dracoLoader)



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

