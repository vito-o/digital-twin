import './style.css'
// 弹簧约束
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





// 创建物理球体
const sphereShape = new CANNON.Sphere(.2)
const sphereMaterialCon = new CANNON.Material('sphereMaterial')
sphereMaterialCon.friction = 0;
sphereMaterialCon.restitution = 0.1;
const body = new CANNON.Body({
  mass: 0,
  type: CANNON.Body.STATIC,
  shape: sphereShape,
  position: new CANNON.Vec3(0, 10, 0),
  material: sphereMaterialCon,
  // collisionFilterGroup: GROUP1,
  // collisionFilterMask: GROUP0 | GROUP2
})
world.addBody(body)
phyMeshes.push(body)

const sphereGeometry = new THREE.SphereGeometry(0.2, 8, 8);
const sphereMaterial = new THREE.MeshBasicMaterial({  color: 0x00ff00 })
const sphereMesh = new THREE.Mesh(sphereGeometry, sphereMaterial)
scene.add(sphereMesh)
meshs.push(sphereMesh)



const boxShape = new CANNON.Box(new CANNON.Vec3(1, 1, 0.3));
const boxBody = new CANNON.Body({
  mass: 1,
  shape: boxShape,
  position: new CANNON.Vec3(0, 6, 0),
  material: sphereMaterialCon,
  // collisionFilterGroup: GROUP2,
  // collisionFilterMask: GROUP0 | GROUP1,
});
world.addBody(boxBody);
phyMeshes.push(boxBody);

const boxGeometry = new THREE.BoxGeometry(2, 2, 0.6);
const boxMaterial = new THREE.MeshBasicMaterial({  color: 0x00ff00 })
const boxMesh = new THREE.Mesh(boxGeometry, boxMaterial)
scene.add(boxMesh)
meshs.push(boxMesh)


// 创建一个弹簧拉住立方体
const spring = new CANNON.Spring(body, boxBody, {
  // 弹簧长度
  restLength: 5,
  // 弹簧的刚度
  stiffness: 100,
  // 弹簧的阻尼
  damping: 1,
  // 弹簧的锚点
  localAnchorA: new CANNON.Vec3(0, 0, 0),
  localAnchorB: new CANNON.Vec3(-1, 1, 0),
})

// 通过计算每一step之前获取弹簧的作用力，并且应用弹簧的作用力
world.addEventListener('preStep', () => {
  // 应用弹簧的作用力
  spring.applyForce()
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



  


