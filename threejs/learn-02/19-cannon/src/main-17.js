import './style.css'
// 有悬架的车辆 + 漂移
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
let meshes = []

// 设置碰撞组，数值要用2的幂
const GROUP0 = 1;
const GROUP1 = 2;
const GROUP2 = 4;


// 创建地面
const groundShape = new CANNON.Box(new CANNON.Vec3(50, 0.2, 50))
const groundPhyMaterial = new CANNON.Material("ground");
const groundBody = new CANNON.Body({
  mass: 0,
  shape: groundShape,
  // material: groundPhyMaterial,
})
// groundBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2)
world.addBody(groundBody)
phyMeshes.push(groundBody)

const groundMesh = new THREE.Mesh(
  new THREE.BoxGeometry(100, 0.4, 100),
  new THREE.MeshBasicMaterial({
    color: 0x666666,
  })
);
// groundMesh.rotation.x = -Math.PI / 2;
scene.add(groundMesh);
meshes.push(groundMesh);


// 创建车身
const chassisShape = new CANNON.Box(new CANNON.Vec3(2, 0.5, 1))
const chassisBody = new CANNON.Body({
  mass: 150,
  shape: chassisShape
})
chassisBody.position.set(0, 15, 0)
phyMeshes.push(chassisBody)

// three.js的车身
const chassisMesh = new THREE.Mesh(
  new THREE.BoxGeometry(4, 1, 2),
  new THREE.MeshBasicMaterial({
    color: 0x660066,
  })
);
scene.add(chassisMesh);
meshes.push(chassisMesh);


// 创建有悬架的车子
const vehicle = new CANNON.RaycastVehicle({
  chassisBody
})

const wheelOptions = {
  // 轮子半径
  radius: 1,
  // 本地坐标系中的轮子位置
  directionLocal: new CANNON.Vec3(0, -1, 0),
  suspensionStiffness: 30, // 悬架的刚度
  suspensionRestLength: 0.3, // 悬架的休息长度
  frictionSlip: 1.4, // 滑动摩擦力
  dampingRelaxation: 2.3, // 振动
  dampingCompression: 4.4, // 压缩
  maxSuspensionForce: 100000, // 最大悬架力
  // rollInfluence: 0.1, // 滚动影响
  axleLocal: new CANNON.Vec3(0, 0, 1), // 本地坐标系中的轴
  // chassisConnectionPointLocal: new CANNON.Vec3(-1, 0, 1), // 本地坐标系中的车身连接点
  maxSuspensionTravel: 0.2, // 最大悬架行程
  // customSlidingRotationalSpeed: -30,
  // useCustomSlidingRotationalSpeed: true,
};




vehicle.addWheel({
  ...wheelOptions,
  chassisConnectionPointLocal: new CANNON.Vec3(-1, 0, 1)
})
vehicle.addWheel({
  ...wheelOptions,
  chassisConnectionPointLocal: new CANNON.Vec3(-1, 0, -1)
})
vehicle.addWheel({
  ...wheelOptions,
  chassisConnectionPointLocal: new CANNON.Vec3(1, 0, 1)
})
vehicle.addWheel({
  ...wheelOptions,
  chassisConnectionPointLocal: new CANNON.Vec3(1, 0, -1)
})

vehicle.addToWorld(world)

const wheelBodies = []

// 创建轮子
const wheelShape = new CANNON.Cylinder(0.5, 0.5, 0.2, 20)
const wheelPhyMaterial = new CANNON.Material('wheel')

const wheelGeometry = new THREE.CylinderGeometry(0.5, 0.5, 0.2, 20)
const wheelMaterial = new THREE.MeshBasicMaterial({
  color: 0x660000,
  wireframe: true
})

/* const wheel_ground = new CANNON.ContactMaterial(
  wheelPhyMaterial,
  groundPhyMaterial,
  {
    friction: 0,
    restitution: 0,
    contactEquationStiffness: 1000,
  }
) */
// world.addContactMaterial(wheel_ground)


for(let i = 0; i < vehicle.wheelInfos.length; i++) {
  const wheelBody = new CANNON.Body({
    mass: 0,
    shape: wheelShape,
    // material: wheelPhyMaterial
  })
  phyMeshes.push(wheelBody)
  wheelBodies.push(wheelBody)

  const wheelMesh = new THREE.Mesh(wheelGeometry, wheelMaterial);
  wheelMesh.rotation.x = -Math.PI / 2;
  const wheelObj = new THREE.Object3D();
  wheelObj.add(wheelMesh);
  scene.add(wheelObj);
  meshes.push(wheelObj);
}

world.addEventListener('postStep', () => {
  //更新轮子的位置
  wheelBodies.forEach((wheelBody, index) => {
    vehicle.updateWheelTransform(index);
    wheelBody.position.copy(vehicle.wheelInfos[index].worldTransform.position)
    wheelBody.quaternion.copy(vehicle.wheelInfos[index].worldTransform.quaternion)
  })
})

// 控制车子
window.addEventListener('keydown', e => {
  if (e.key === 'w') {
    // setWheelForce(力，轮子编号)
    vehicle.applyEngineForce(-1000, 0)
    vehicle.applyEngineForce(-1000, 1)
  }
  if (e.key === 's') {
    vehicle.applyEngineForce(1000, 0)
    vehicle.applyEngineForce(1000, 1)
  }
  if (e.key === 'a') {
    vehicle.setSteeringValue(Math.PI / 4, 0)
    vehicle.setSteeringValue(Math.PI / 4, 1)
  }
  if (e.key === 'd') {
    vehicle.setSteeringValue(-Math.PI / 4, 0)
    vehicle.setSteeringValue(-Math.PI / 4, 1)
  }

  if (e.key === 'r') {
    chassisBody.velocity.set(0, 0, 0)
    chassisBody.angularVelocity.set(0, 0, 0)
    chassisBody.position.set(0, 10, 0)
  }

  if (e.key === ' ') {
    vehicle.setBrake(100, 2)
    vehicle.setBrake(100, 3)
  }
})
window.addEventListener('keyup', e => {
  if (e.key === 'w') {
    // setWheelForce(力，轮子编号)
    vehicle.applyEngineForce(0, 0)
    vehicle.applyEngineForce(0, 1)
  }
  if (e.key === 's') {
    vehicle.applyEngineForce(0, 0)
    vehicle.applyEngineForce(0, 1)
  }
  if (e.key === 'a') {
    vehicle.setSteeringValue(0, 0)
    vehicle.setSteeringValue(0, 1)
  }
  if (e.key === 'd') {
    vehicle.setSteeringValue(0, 0)
    vehicle.setSteeringValue(0, 1)
  }

  if (e.key === ' ') {
    vehicle.setBrake(0, 2)
    vehicle.setBrake(0, 3)
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



  


