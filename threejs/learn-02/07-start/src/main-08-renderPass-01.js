import '../style.css'
//效果合成器
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

// 导入后期效果合成器
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer'

// 导入渲染通道
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass'
import { DotScreenPass } from 'three/examples/jsm/postprocessing/DotScreenPass'
import { SMAAPass } from 'three/examples/jsm/postprocessing/SMAAPass'
import { SSAARenderPass } from 'three/examples/jsm/postprocessing/SSAARenderPass'
import { GlitchPass } from 'three/examples/jsm/postprocessing/GlitchPass'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass'
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass'

import gsap from 'gsap'

// 场景
const scene = new THREE.Scene()

// 创建相机
const camera = new THREE.PerspectiveCamera(
  90,   // 视角
  window.innerWidth / window.innerWidth,
  0.1,  // 近平面
  1000  // 远平面
)
// 设置相机位置
camera.position.set(0, 0, 3)

// 场景渲染器
const renderer = new THREE.WebGLRenderer({
  antialias: true
})
renderer.setSize(window.innerWidth, window.innerHeight)
// renderer.shadowMap.enabled = true
// renderer.outputEncoding = THREE.sRGBEncoding
// renderer.toneMapping = THREE.ACESFilmicToneMapping
// renderer.toneMappingExposure = 0.1
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


// 合成效果
const effectComposer = new EffectComposer(renderer)
effectComposer.setSize(window.innerWidth, window.innerHeight)

// 添加渲染通道
const renderPass = new RenderPass(scene, camera)
effectComposer.addPass(renderPass)

// 点效果
const dotScreenPass = new DotScreenPass();
dotScreenPass.enabled = false
effectComposer.addPass(dotScreenPass)

// 抗锯齿
const smaaPass = new SMAAPass()
smaaPass.enabled = false
effectComposer.addPass(smaaPass)

// 发光效果
const unrealBloomPass = new UnrealBloomPass()
unrealBloomPass.enabled = false
effectComposer.addPass(unrealBloomPass)

// 屏幕闪动
// const glitchPass = new GlitchPass()
// // glitchPass.enabled = false
// effectComposer.addPass(glitchPass)


const gltfLoader = new GLTFLoader();
gltfLoader.load('/models/DamagedHelmet/glTF/DamagedHelmet.gltf', gltf => {
  const mesh = gltf.scene.children[0]
  // mesh.castShadow = true
  scene.add(mesh)
})


const directionLight = new THREE.DirectionalLight('#ffffff', 1)
// directionLight.castShadow = true
directionLight.position.set(0, 0, 200)
scene.add(directionLight)


const cubeTextureLoader = new THREE.CubeTextureLoader();
const envMapTexture = cubeTextureLoader.load([
  '/textures/environmentMaps/0/px.jpg',
  '/textures/environmentMaps/0/nx.jpg',
  '/textures/environmentMaps/0/py.jpg',
  '/textures/environmentMaps/0/ny.jpg',
  '/textures/environmentMaps/0/pz.jpg',
  '/textures/environmentMaps/0/nz.jpg',
])
scene.environment = envMapTexture
scene.background = envMapTexture


let clock = new THREE.Clock()
function animate() {
  let elapsedTime = clock.getElapsedTime()

  controls.update()

  requestAnimationFrame(animate)
  // 渲染
  // renderer.render(scene, camera)
  effectComposer.render()
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


