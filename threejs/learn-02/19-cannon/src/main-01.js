import './style.css'

// ====================================================================
import * as THREE from 'three'
// 导入轨道控制器
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'


// import gsap from 'gsap'
import * as CANNON from "cannon-es";

let screenDom = document.getElementById('screenDom')
// 场景
const scene = new THREE.Scene()

// 照相机
const camera = new THREE.PerspectiveCamera(
  90,   // 视角
  window.innerWidth / window.innerWidth,
  0.1,  // 近平面
  1000  // 远平面
)
camera.position.set(-5, 5, 10)

// 渲染器
const renderer = new THREE.WebGLRenderer({
  antialias: true, // 抗锯齿
})
renderer.setSize(window.innerWidth, window.innerHeight)
screenDom.appendChild(renderer.domElement)

// 坐标助手 红色代表 X 轴. 绿色代表 Y 轴. 蓝色代表 Z 轴.
const axesHelper = new THREE.AxesHelper(15)
scene.add(axesHelper)

// 控制器
const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true // 设置带阻尼惯性

//----------------------------------------------------------------
/* const gltfLoader = new GLTFLoader()
// 实例化加载器draco
const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath('/draco/')
gltfLoader.setDRACOLoader(dracoLoader)
gltfLoader.load('/model/lion.gltf', gltf => {
}) */
//----------------------------------------------------------------

//----------------------------------------------------------------
// 初始化物理世界
let world = new CANNON.World()
// 设置重力
world.gravity.set(0, -9.82, 0)


// 创建球体
const sphereShape = new CANNON.Sphere(0.5);
// 创建一个刚体
const sphereBody = new CANNON.Body({
  mass: 1,
  shape: sphereShape,
  position: new CANNON.Vec3(0, 5, 0)
})
world.addBody(sphereBody)


// 创建一个球的几何体
const sphereGeometry = new THREE.SphereGeometry(0.5, 32, 32)
// 创建一个球的材质
const sphereMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
// 创建一个球的网格
const sphereMesh = new THREE.Mesh(sphereGeometry, sphereMaterial)
scene.add(sphereMesh)



//----------------------------------------------------------------

let clock = new THREE.Clock()
// 渲染
function animate() {
  let delta = clock.getDelta()

  world.step(1/60, delta)
  // 更新球体网格的位置和旋转
  sphereMesh.position.copy(sphereBody.position)
  sphereMesh.quaternion.copy(sphereBody.quaternion)

  controls.update()
  requestAnimationFrame(animate)
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



  


