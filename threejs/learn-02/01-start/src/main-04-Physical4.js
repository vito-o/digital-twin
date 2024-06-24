import '../style.css'
// MeshPhongMaterial - 虹彩效应

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

// .glb 模型是二进制的数据
// .gltf 模型是json格式的数据
const gltfLoader = new GLTFLoader()
const dracoLoader = new DRACOLoader()
// 设置draco路径
dracoLoader.setDecoderPath('/draco/')
// 设置gltf加载器draco解码器
gltfLoader.setDRACOLoader(dracoLoader)

let rgbeLoader = new RGBELoader()
rgbeLoader.load('/textures/Alex_Hart-Nature_Lab_Bones_2k.hdr', envMap => {
  envMap.mapping = THREE.EquirectangularReflectionMapping
  // envMap.mapping = THREE.EquirectangularRefractionMapping
  scene.background = envMap
  scene.environment = envMap
})

let brickRoughness = new THREE.TextureLoader().load('/textures/brick/brick_roughness.jpg')
let brickColor = new THREE.TextureLoader().load('/textures/brick/brick_diffuse.jpg')

const sphereGeometry = new THREE.SphereGeometry(1, 32, 32)
const sphereMaterial = new THREE.MeshPhysicalMaterial({
  color: 0xffffff,
  // 粗糙度
  roughness: 0.05,
  // 透光率（或者说透光性），范围从0.0到1.0。默认值是0.0。
  // 很薄的透明或者半透明的塑料、玻璃材质即便在几乎完全透明的情况下仍旧会保留反射的光线，透光性属性用于这种类型的材质。
  transmission: 1,
  // 厚度
  thickness: 0.1,
  // iridescence属性是该材质的一个属性，用于控制材质的彩虹光效果。
  iridescence: 1,
  // 反射率
  reflectivity: 1,
  // 虹彩效应的折射率
  iridescenceIOR: 1.3,
  // 虹彩效应薄膜的厚度范围
  iridescenceThicknessRange: [100, 400],
  // 虹彩效应厚度贴图
  iridescenceThicknessMap: brickRoughness
})
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial)
scene.add(sphere)

gui.add(sphereMaterial, 'iridescence', 0, 1).name('虹彩效应')
gui.add(sphereMaterial, 'reflectivity', 0, 1).name('反射率')
gui.add(sphereMaterial, 'iridescenceIOR', 0, 3).name('虹彩效应的折射率')

let iridescenceThickness = {
  min: 100,
  max: 400,
}

gui.add(iridescenceThickness, 'min', 0, 1000)
   .name('虹彩效应最小厚度')
   .onChange(() => {
    sphereMaterial.iridescenceThicknessRange[0] = iridescenceThickness.min
   });
gui.add(iridescenceThickness, 'max', 0, 1000)
   .name('虹彩效应最大厚度')
   .onChange(() => {
    sphereMaterial.iridescenceThicknessRange[1] = iridescenceThickness.max
   });
 