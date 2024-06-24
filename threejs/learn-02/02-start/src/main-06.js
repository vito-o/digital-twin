import '../style.css'
//材质深度模式_深度测试_深度写入_渲染顺序详解

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

/* let rgbeLoader = new RGBELoader()
rgbeLoader.load('/texture/opt/memorial/Alex_Hart-Nature_Lab_Bones_2k.hdr', envMap => {
  envMap.mapping = THREE.EquirectangularReflectionMapping
  scene.background = envMap
  scene.environment = envMap
  plane.material.map = envMap
  plane.material.needsUpdate = true
}) */

// 创建平面
const plane1Geometry = new THREE.PlaneGeometry(5, 5)
const plane1Material = new THREE.MeshBasicMaterial({
  map: new THREE.TextureLoader().load('/texture/sprite0.png'),
  side: THREE.DoubleSide,
})
const plane1 = new THREE.Mesh(plane1Geometry, plane1Material)
scene.add(plane1)

// 创建平面
const plane2Geometry = new THREE.PlaneGeometry(5, 5)
const plane2Material = new THREE.MeshBasicMaterial({
  map: new THREE.TextureLoader().load('/texture/lensflare0_alpha.png'),
  side: THREE.DoubleSide,
})
const plane2 = new THREE.Mesh(plane2Geometry, plane2Material)
plane2.position.z = 3
scene.add(plane2)

plane1.material.transparent = true
plane2.material.transparent = true

// 设置深度模式
plane1.material.depthFunc = THREE.LessEqualDepth
plane1.material.depthWrite = true
plane1.material.depthTest = true

plane2.material.depthFunc = THREE.LessEqualDepth
plane2.material.depthWrite = true
plane2.material.depthTest = true

const gui1 = gui.addFolder("plane1");
gui1
  .add(plane1.material, "depthWrite")
  .name("深度写入")
  .onChange(() => {
    plane1.material.needsUpdate = true;
  });
gui1
  .add(plane1.material, "depthTest")
  .name("深度测试")
  .onChange(() => {
    plane1.material.needsUpdate = true;
  });

gui1.add(plane1, 'renderOrder', 0, 10).step(1).name('渲染顺序')

const gui2 = gui.addFolder("plane2");
gui2
  .add(plane2.material, "depthWrite")
  .name("深度写入")
  .onChange(() => {
    plane2.material.needsUpdate = true;
  });
gui2
  .add(plane2.material, "depthTest")
  .name("深度测试")
  .onChange(() => {
    plane2.material.needsUpdate = true;
  });
gui2.add(plane2, 'renderOrder', 0, 10).step(1).name('渲染顺序')

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


