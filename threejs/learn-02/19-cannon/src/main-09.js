import './style.css'
// Lock约束
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
camera.position.set(0, 2, 10)

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

// 创建一个平面
const planeShape = new CANNON.Box(new CANNON.Vec3(8, 0.1, 8))
// const planeShape = new CANNON.Plane()
// 创建一个平面刚体
const planeMaterialCon = new CANNON.Material('planeMaterial')
planeMaterialCon.friction = 0;
planeMaterialCon.restitution = 0.1;
const planeBody = new CANNON.Body({
  mass: 0,
  shape: planeShape,
  position: new CANNON.Vec3(0, -0.1, 0),
  material: planeMaterialCon,
  collisionFilterGroup: GROUP0,
  collisionFilterMask: GROUP1,
});
// planeBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), 0.1)
// planeBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2)
world.addBody(planeBody)

// 创建一个平面几何体
const planeGeometry = new THREE.BoxGeometry(16, 0.2, 16);
const planeMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00 })
const planeMesh = new THREE.Mesh(planeGeometry, planeMaterial)
scene.add(planeMesh)

const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
const boxMaterial = new THREE.MeshBasicMaterial({  color: 0x00ff00 })
const boxShape = new CANNON.Box(new CANNON.Vec3(0.5, 0.5, 0.5))

const boxMaterialCon = new CANNON.Material('boxMaterial')
boxMaterialCon.friction = 0;
boxMaterialCon.restitution = 0.1;

let previousBody;
for (let i = 0; i < 10; i++) {
  const mesh = new THREE.Mesh(boxGeometry, boxMaterial)
  mesh.position.x = i;
  mesh.position.y = 1;
  meshs.push(mesh)
  scene.add(mesh)

  const boxBody = new CANNON.Body({
    mass: 1,
    shape: boxShape,
    position: new CANNON.Vec3(i + 0.5 * i, 1, 0),
    material: boxMaterialCon,
    collisionFilterGroup: GROUP1,
    collisionFilterMask: GROUP0
  })
  world.addBody(boxBody)
  phyMeshes.push(boxBody)

  // 添加lock约束
  if (previousBody) {
    const constraint = new CANNON.LockConstraint(boxBody, previousBody)
    world.addConstraint(constraint)
    setTimeout(() => {
      world.removeConstraint(constraint)
    },2000)
  }
  previousBody = boxBody;
}




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



  


