import '../style.css'
//纹理纵向翻转与预乘alpha生成颜色

import * as THREE from 'three'
// 导入轨道控制器
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js'
// 导入gltf加载器
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
// hdr加载器
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader'

import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'


// 创建GUI
const gui = new GUI();

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
camera.position.y = 5
camera.position.x = 5
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

let textureLoader = new THREE.TextureLoader()

// let texture = textureLoader.load('/texture/watercover/CityNewYork002_COL_VAR1_1K.png')
let texture = textureLoader.load('/texture/rain.png')
texture.colorSpace = THREE.SRGBColorSpace;
// 如果设置为true，纹理在上传到GPU的时候会进行纵向的翻转。默认值为true。
// texture.flipY = false ;

/* 
// 如果设置为true并且alpha通道存在的话，上传到GPU时alpha的数值将会与颜色通道的数值相乘。默认为false。
texture.premultiplyAlpha = true
scene.background = new THREE.Color(0xffffff)
gui.add(texture, 'premultiplyAlpha').onChange(() => {  
  texture.needsUpdate = true
}) */

const planeGeometry = new THREE.PlaneGeometry(2, 2)
const planeMaterial = new THREE.MeshBasicMaterial({
  map: texture,
  transparent: true, 
})
const plane = new THREE.Mesh(planeGeometry, planeMaterial)
scene.add(plane)
/* const gltfLoader = new GLTFLoader()
const dracoLoader = new DRACOLoader()
// 设置draco路径
dracoLoader.setDecoderPath('/draco/')
// 设置gltf加载器draco解码器
gltfLoader.setDRACOLoader(dracoLoader)
gltfLoader.load('/model/客厅/scene.glb', gltf => {
  scene.add(gltf.scene)
})
 */

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


