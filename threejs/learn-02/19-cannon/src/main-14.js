import './style.css'
// 铰链约束
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
camera.position.set(0, 12, 20)

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
// 初始化物理世界
let world = new CANNON.World()
// 设置重力
world.gravity.set(0, -9.82, 0)
// 设置物理世界允许休眠
world.allowSleep = true;

let phyMeshes = []
let meshs = []

// 设置碰撞组，数值要用2的幂
const GROUP0 = 1;
const GROUP1 = 2;
const GROUP2 = 4;

// 创建固定box形状
const fixedShape = new CANNON.Box(new CANNON.Vec3(2.5, 2.5, 0.25))
const fixedBody = new CANNON.Body({
  mass: 0,
  type: CANNON.Body.STATIC,
  position: new CANNON.Vec3(0, 10, 0)
})
fixedBody.addShape(fixedShape)

world.addBody(fixedBody)
phyMeshes.push(fixedBody)

const fixedMesh = new THREE.Mesh(
  new THREE.BoxGeometry(5, 5, 0.5),
  new THREE.MeshBasicMaterial({ color: 0x00ff00 })
)
scene.add(fixedMesh)
meshs.push(fixedMesh)


// 创建移动的body
const moveShape = new CANNON.Box(new CANNON.Vec3(2.5, 2.5, 0.25))
const moveBody = new CANNON.Body({
  mass: 1,
  position: new CANNON.Vec3(0, 4, 0)
})
moveBody.addShape(moveShape)

world.addBody(moveBody)
phyMeshes.push(moveBody)

const moveMesh = new THREE.Mesh(
  new THREE.BoxGeometry(5, 5, 0.5),
  new THREE.MeshBasicMaterial({ color: 0x00ff00 })
)
scene.add(moveMesh)
meshs.push(moveMesh)

// 创建铰链约束
const hingeConstraint = new CANNON.HingeConstraint(fixedBody, moveBody, {
  pivotA: new CANNON.Vec3(0, -3, 0),
  pivotB: new CANNON.Vec3(0, 3, 0),
  axisA: new CANNON.Vec3(1, 0, 0),
  axisB: new CANNON.Vec3(1, 0, 0),
})
world.addConstraint(hingeConstraint)


window.addEventListener('click', () => {
  //创建一个力
  // const force = new CANNON.Vec3(0, 0, -100)
  // moveBody.applyForce(force, moveBody.position)

  // 启动马达
  hingeConstraint.enableMotor()
  // 设置马达的速度
  hingeConstraint.setMotorSpeed(10)
})



//----------------------------------------------------------------

let clock = new THREE.Clock()
// 渲染
function animate() {
  let delta = clock.getDelta()

  world.step(1/60, delta)
  // 更新球体网格的位置和旋转
  for(let i = 0; i < phyMeshes.length; i++) {
    meshs[i].position.copy(phyMeshes[i].position)
    meshs[i].quaternion.copy(phyMeshes[i].quaternion)
  }

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



  


