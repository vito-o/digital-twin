import '../style.css'
//纹理重复_缩放_旋转_位移操作

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
let texture = textureLoader.load('/texture/amber/base_color.jpg')
texture.colorSpace = THREE.SRGBColorSpace;
/* // 决定纹理在表面的重复次数，两个方向分别表示U和V，Vector2
texture.repeat.set(2, 2) 
// 设置水平重复
// 这个值定义了纹理贴图在水平方向上将如何包裹，在UV映射中对应于U。
// texture.wrapS = THREE.RepeatWrapping
texture.wrapS = THREE.MirroredRepeatWrapping
// 设置垂直重复
// 这个值定义了纹理贴图在垂直方向上将如何包裹，在UV映射中对应于V。
// texture.wrapT = THREE.RepeatWrapping
texture.wrapT = THREE.MirroredRepeatWrapping */
/* // 纹理偏移
texture.offset.set(0.3, 0.3) */
// 纹理旋转， 旋转是逆时针旋转
texture.rotation = Math.PI / 4
texture.center.set(0.5, 0.5)

const planeGeometry = new THREE.PlaneGeometry(2, 2)
const planeMaterial = new THREE.MeshBasicMaterial({
  map: texture,
  // transparent: true,
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

// 创建GUI
const gui = new GUI();

