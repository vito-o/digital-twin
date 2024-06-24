import './style.css'
// 刚体车辆
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
let meshes = []

// 设置碰撞组，数值要用2的幂
const GROUP0 = 1;
const GROUP1 = 2;
const GROUP2 = 4;


// 创建地面
const groundShape = new CANNON.Plane()
const groundBody = new CANNON.Body({
  mass: 0,
  shape: groundShape,
  material: new CANNON.Material(),
})
groundBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2)
world.addBody(groundBody)
phyMeshes.push(groundBody)

const groundMesh = new THREE.Mesh(
  new THREE.PlaneGeometry(100, 100),
  new THREE.MeshBasicMaterial({
    color: 0x666666,
  })
);
groundMesh.rotation.x = -Math.PI / 2;
scene.add(groundMesh);
meshes.push(groundMesh);


// 创建车身
const chassisShape = new CANNON.Box(new CANNON.Vec3(5, 0.5, 2))
const chassisBody = new CANNON.Body({
  mass: 10,
  shape: chassisShape
})
chassisBody.position.set(0, 5, 0)
phyMeshes.push(chassisBody)

// three.js的车身
const chassisMesh = new THREE.Mesh(
  new THREE.BoxGeometry(10, 1, 4),
  new THREE.MeshBasicMaterial({
    color: 0x660066,
  })
);
scene.add(chassisMesh);
meshes.push(chassisMesh);


// 创建刚性车子
const vehicle = new CANNON.RigidVehicle({
  chassisBody
})


// 创建轮子
const wheelShape = new CANNON.Sphere(1.5)
const wheelBody1 = new CANNON.Body({
  mass: 1,
  shape: wheelShape
})
vehicle.addWheel({
  body: wheelBody1,
  // 轮子位置
  position: new CANNON.Vec3(-4, -0.5, 3.5),
  // 旋转轴
  axis: new CANNON.Vec3(0, 0, -1),
  direction: new CANNON.Vec3(0, -1, 0)
})
phyMeshes.push(wheelBody1)

// three.js的车轮
const wheelMaterial = new THREE.MeshBasicMaterial({
  color: 0x660000,
  wireframe: true,
});
const wheelGeometry = new THREE.SphereGeometry(1.5, 8, 8);
const wheelMesh1 = new THREE.Mesh(
  new THREE.SphereGeometry(1.5, 8, 8),
  wheelMaterial
);
scene.add(wheelMesh1);
meshes.push(wheelMesh1);



const wheelBody2 = new CANNON.Body({
  mass: 1,
  shape: wheelShape
})
vehicle.addWheel({
  body: wheelBody2,
  // 轮子位置
  position: new CANNON.Vec3(-4, -0.5, -3.5),
  // 旋转轴
  axis: new CANNON.Vec3(0, 0, -1),
  direction: new CANNON.Vec3(0, -1, 0)
})
phyMeshes.push(wheelBody2)

const wheelMesh2 = new THREE.Mesh(
  new THREE.SphereGeometry(1.5, 8, 8),
  wheelMaterial
);
scene.add(wheelMesh2);
meshes.push(wheelMesh2);



const wheelBody3 = new CANNON.Body({
  mass: 1,
  shape: wheelShape
})
vehicle.addWheel({
  body: wheelBody3,
  // 轮子位置
  position: new CANNON.Vec3(4, -0.5, 3.5),
  // 旋转轴
  axis: new CANNON.Vec3(0, 0, -1),
  direction: new CANNON.Vec3(0, -1, 0)
})
phyMeshes.push(wheelBody3)

const wheelMesh3 = new THREE.Mesh(
  new THREE.SphereGeometry(1.5, 8, 8),
  wheelMaterial
);
scene.add(wheelMesh3);
meshes.push(wheelMesh3);



const wheelBody4 = new CANNON.Body({
  mass: 1,
  shape: wheelShape
})
vehicle.addWheel({
  body: wheelBody4,
  // 轮子位置
  position: new CANNON.Vec3(4, -0.5, -3.5),
  // 旋转轴
  axis: new CANNON.Vec3(0, 0, -1),
  direction: new CANNON.Vec3(0, -1, 0)
})
phyMeshes.push(wheelBody4)

const wheelMesh4 = new THREE.Mesh(
  new THREE.SphereGeometry(1.5, 8, 8),
  wheelMaterial
);
scene.add(wheelMesh4);
meshes.push(wheelMesh4);


// 设置完毕后，将车子添加到世界
vehicle.addToWorld(world)

// 控制车子
window.addEventListener('keydown', e => {
  if (e.key === 'w') {
    // setWheelForce(力，轮子编号)
    vehicle.setWheelForce(-100, 0)
    vehicle.setWheelForce(-100, 1)
  }
  if (e.key === 's') {
    vehicle.setWheelForce(100, 0)
    vehicle.setWheelForce(100, 1)
  }
  if (e.key === 'a') {
    vehicle.setSteeringValue(Math.PI / 4, 0)
    vehicle.setSteeringValue(Math.PI / 4, 1)
  }
  if (e.key === 'd') {
    vehicle.setSteeringValue(-Math.PI / 4, 0)
    vehicle.setSteeringValue(-Math.PI / 4, 1)
  }
})
window.addEventListener('keyup', e => {
  if (e.key === 'w') {
    // setWheelForce(力，轮子编号)
    vehicle.setWheelForce(0, 0)
    vehicle.setWheelForce(0, 1)
  }
  if (e.key === 's') {
    vehicle.setWheelForce(0, 0)
    vehicle.setWheelForce(0, 1)
  }
  if (e.key === 'a') {
    vehicle.setSteeringValue(0, 0)
    vehicle.setSteeringValue(0, 1)
  }
  if (e.key === 'd') {
    vehicle.setSteeringValue(0, 0)
    vehicle.setSteeringValue(0, 1)
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
    meshes[i].position.copy(phyMeshes[i].position)
    meshes[i].quaternion.copy(phyMeshes[i].quaternion)
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



  


