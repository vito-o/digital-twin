import './style.css'
// 破坏约束
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



const sphereGeometry = new THREE.SphereGeometry(0.5, 20, 20);
const sphereMaterial = new THREE.MeshBasicMaterial({  color: 0x00ff00 })
const sphereShape = new CANNON.Sphere(0.45)

const sphereMaterialCon = new CANNON.Material('sphereMaterial')
sphereMaterialCon.friction = 0;
sphereMaterialCon.restitution = 0.1;

for (let i = 0; i < 15; i++) {
  const mesh = new THREE.Mesh(sphereGeometry, sphereMaterial)
  mesh.position.y = 15 - i * 1.2;
  meshs.push(mesh)
  scene.add(mesh)

  const shapeBody = new CANNON.Body({
    mass: i == 0 ? 0 : 1,
    type: i == 0 ? CANNON.Body.STATIC : CANNON.Body.DYNAMIC,
    shape: sphereShape,
    position: new CANNON.Vec3(0, 15 - i * .9, 0),
    material: sphereMaterialCon,
    collisionFilterGroup: GROUP1,
    collisionFilterMask: GROUP0 | GROUP2
  })
  world.addBody(shapeBody)
  phyMeshes.push(shapeBody)

  // 添加lock约束
  if (i > 0) {
    const constraint1 = new CANNON.DistanceConstraint(
      shapeBody, phyMeshes[i - 1],  0.9,
    )
    world.addConstraint(constraint1)

    // setTimeout(() => {
    //   world.removeConstraint(constraint1)
    // },2000)
  }
}

window.addEventListener('click', () => {
  const sphereShape = new CANNON.Sphere(0.45)
  const sphereBody = new CANNON.Body({
    mass: 1,
    shape: sphereShape,
    position: new CANNON.Vec3(5, 10, 0),
    material: sphereMaterialCon,
    collisionFilterGroup: GROUP2,
    collisionFilterMask: GROUP0 | GROUP1
  })
  sphereBody.velocity.set(-40, 0, 0)
  world.addBody(sphereBody)
  phyMeshes.push(sphereBody)

  const sphereGeometry = new THREE.SphereGeometry(0.45, 32, 32)
  const sphereMaterial = new THREE.MeshBasicMaterial({ color: 0x0000ff })
  const sphereMesh = new THREE.Mesh(sphereGeometry, sphereMaterial)
  scene.add(sphereMesh)
  meshs.push(sphereMesh)
})

// 在每次世界模拟完一个时间步之后，判断约束力度的绝对值大小，如果大于1000，就删除约束
world.addEventListener('postStep', () => {
  // 循环判断世界约束
  for (let i = 0; i < world.constraints.length; i++) {
    const constraint = world.constraints[i]
    // 获取约束力度的绝对值大小
    let multiplier = Math.abs(constraint.equations[0].multiplier)
    if (multiplier > 1000) {
      // 删除约束
      world.removeConstraint(constraint)
    }
  }
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



  


