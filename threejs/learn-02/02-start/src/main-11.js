import '../style.css'
//模板渲染

import * as THREE from 'three'
// 导入轨道控制器
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js'
// 导入gltf加载器
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
// hdr加载器
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader'

import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'
import { EXRLoader } from "three/examples/jsm/loaders/EXRLoader.js";
import { LogLuvLoader } from "three/examples/jsm/loaders/LogLuvLoader.js";
import { RGBMLoader } from "three/examples/jsm/loaders/RGBMLoader";


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
camera.position.z = 15
camera.position.y = 15
camera.position.x = 15
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


// .glb 模型是二进制的数据
// .gltf 模型是json格式的数据
/* const gltfLoader = new GLTFLoader()
gltfLoader.load('/model/cup.glb', gltf => {
  scene.add(gltf.scene)
})

const dracoLoader = new DRACOLoader()
// 设置draco路径
dracoLoader.setDecoderPath('/draco/')
// 设置gltf加载器draco解码器
gltfLoader.setDRACOLoader(dracoLoader) */

// 创建平面

// 1、2个为物体提都设置模板缓冲区的写入和测试
// 2、设置模板缓冲区的基准值 stencilRef: 2,
// 3、设置允许写入的掩码0xff
// 4、再小球上设置模板比较函数THREE.EqualStencilFunc
// 5、设置当函数比较通过时，设置为replacet替换 stencilZPass: THREE.ReplaceStencilOp

const planeGeometry = new THREE.PlaneGeometry(8, 8)
const planeMaterial = new THREE.MeshPhysicalMaterial({
  // 是否对模板缓冲执行模板操作，如果执行写入或者与模板缓冲进行比较，这个值需要设置为true。默认为false。
  stencilWrite: true,
  // 与模板缓冲进行比较时所使用的位元遮罩，默认为0xFF
  stencilWriteMask: 0xff,  // 0 ~ 255
  // 在进行模板比较或者模板操作的时候所用的基准值，默认为0。
  stencilRef: 2,
  // 当比较函数和深度检测都通过时要执行的模板操作，默认为KeepStencilOp，在模板操作constants 中查看可用值。
  stencilZPass: THREE.ReplaceStencilOp
})
const plane = new THREE.Mesh(planeGeometry, planeMaterial)
scene.add(plane)

// 创建小球
const sphereGeometry = new THREE.SphereGeometry(1, 20, 20)
const sphereMaterial = new THREE.MeshPhysicalMaterial({
  color: 0xffcccc,
  // 是否对模板缓冲执行模板操作，如果执行写入或者与模板缓冲进行比较，这个值需要设置为true。默认为false。
  stencilWrite: true,
  // 在进行模板比较或者模板操作的时候所用的基准值，默认为0。
  stencilRef: 2,
  stencilFunc: THREE.EqualStencilFunc
})
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial)
sphere.position.z = 10
scene.add(sphere)


let rgbeLoader = new RGBELoader()
rgbeLoader.load('/texture/opt/memorial/Alex_Hart-Nature_Lab_Bones_2k.hdr', envMap => {
  envMap.mapping = THREE.EquirectangularReflectionMapping
  scene.background = envMap
  scene.environment = envMap
})

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


