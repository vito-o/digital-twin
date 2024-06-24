import '../style.css'


import * as THREE from 'three'
// 导入轨道控制器
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js'
// hdr加载器
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader'


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
let texture = textureLoader.load('/textures/watercover/CityNewYork002_COL_VAR1_1K.png')
// 设置颜色空间 ，
// 不同的颜色空间可以表示不同范围和精度的颜色
// 比如有些 正常的从黑到白颜色空间，18%就是人眼看见的黑和白中间的颜色
// 但有些颜色空间，50%才是中间颜色
texture.colorSpace = THREE.SRGBColorSpace;

// 加载ao贴图
let aoMap = textureLoader.load('/textures/watercover/CityNewYork002_AO_1K.jpg')

// 透明度贴图
let alphaMap = textureLoader.load('/textures/door/height.jpg')

// 光照贴图
let lightMap = textureLoader.load('/textures/colors.png')

// 高光贴图
let specularMap = textureLoader.load('/textures/watercover/CityNewYork002_GLOSS_1K.jpg')

let planeGeometry = new THREE.PlaneGeometry(1, 1)
let planeMaterial = new THREE.MeshBasicMaterial({
  color: 0XFFFFFF,
  map: texture,
  side: THREE.DoubleSide,
  transparent: true,
  aoMap: aoMap,
  // reflectivity: 0.1,
  // alphaMap: alphaMap,
  // lightMap: lightMap,
  specularMap: specularMap
})
let plane = new THREE.Mesh(planeGeometry, planeMaterial)
scene.add(plane)


const rgbLoader = new RGBELoader()
rgbLoader.load('/textures/Alex_Hart-Nature_Lab_Bones_2k.hdr', envMap => {
  // 设置球形映射
  envMap.mapping = THREE.EquirectangularReflectionMapping
  // 设置环境贴图
  scene.background = envMap
  // 设置plane的环境贴图
  planeMaterial.envMap = envMap
})

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
gui.add(texture, 'colorSpace', {
  sRGB: THREE.SRGBColorSpace,
  Linear: THREE.LinearSRGBColorSpace
}).onChange(() => {
  // 设置需要中途进行更新
  texture.needsUpdate = true
})