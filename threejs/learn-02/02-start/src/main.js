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



const geometry = new THREE.TorusKnotGeometry(5, 1, 300, 20);
const material = new THREE.MeshPhysicalMaterial({ 
  color: 0xffff00 ,
  side: THREE.FrontSide
});
const torusKnot = new THREE.Mesh( geometry, material );
scene.add( torusKnot );


const material2 = new THREE.MeshBasicMaterial({ 
  color: 0xffcccc ,
  side: THREE.BackSide,
  
  stencilWrite: true,
  stencilRef: 1,
  stencilZPass: THREE.ReplaceStencilOp
});
const torusKnot2 = new THREE.Mesh( geometry, material2 );
scene.add( torusKnot2 );

// 创建平面裁剪
const plane = new THREE.Plane(new THREE.Vector3(0, -1, 0), 0)
material.clippingPlanes = [plane]
material2.clippingPlanes = [plane]
renderer.localClippingEnabled = true

const planeGeometry = new THREE.PlaneGeometry(20, 20)
const planeMaterial = new THREE.MeshPhysicalMaterial({
  metalness: 1,
  roughness: 0.05,

  stencilWrite: true,
  stencilRef: 1,
  stencilFunc: THREE.EqualStencilFunc
})
const planeMesh = new THREE.Mesh(planeGeometry, planeMaterial)
planeMesh.rotation.x = - Math.PI / 2
scene.add(planeMesh)

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


