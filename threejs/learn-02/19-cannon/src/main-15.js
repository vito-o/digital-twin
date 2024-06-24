import './style.css'
// 流体模拟
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
  new THREE.PlaneGeometry(10, 10),
  new THREE.MeshBasicMaterial({
    color: 0x666666,
  })
);
groundMesh.rotation.x = -Math.PI / 2;
scene.add(groundMesh);
meshes.push(groundMesh);

// 创建前后左右四个平面
const planeShape = new CANNON.Plane();
const planeBody1 = new CANNON.Body({
  mass: 0,
  shape: planeShape,
  material: new CANNON.Material(),
});
planeBody1.quaternion.setFromAxisAngle(new CANNON.Vec3(0, 1, 0), -Math.PI / 2);
planeBody1.position.set(5, 5, 0);
world.addBody(planeBody1);
phyMeshes.push(planeBody1);

const planeMesh1 = new THREE.Mesh(
  new THREE.PlaneGeometry(10, 10),
  new THREE.MeshBasicMaterial({
    color: 0x666666,
    wireframe: true,
  })
);
planeMesh1.position.copy(planeBody1.position);
planeMesh1.quaternion.copy(planeBody1.quaternion);
scene.add(planeMesh1);
meshes.push(planeMesh1);

const planeShape2 = new CANNON.Plane();
const planeBody2 = new CANNON.Body({
  mass: 0,
  shape: planeShape,
  material: new CANNON.Material(),
});
planeBody2.quaternion.setFromAxisAngle(new CANNON.Vec3(0, 1, 0), Math.PI / 2);
planeBody2.position.set(-5, 5, 0);
world.addBody(planeBody2);
phyMeshes.push(planeBody2);

const planeMesh2 = new THREE.Mesh(
  new THREE.PlaneGeometry(10, 10),
  new THREE.MeshBasicMaterial({
    color: 0x666666,
    wireframe: true,
  })
);
planeMesh2.position.copy(planeBody2.position);
planeMesh2.quaternion.copy(planeBody2.quaternion);
scene.add(planeMesh2);
meshes.push(planeMesh2);

const planeShape3 = new CANNON.Plane();
const planeBody3 = new CANNON.Body({
  mass: 0,
  shape: planeShape,
  material: new CANNON.Material(),
});
planeBody3.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), Math.PI);
planeBody3.position.set(0, 5, 5);
world.addBody(planeBody3);
phyMeshes.push(planeBody3);

const planeMesh3 = new THREE.Mesh(
  new THREE.PlaneGeometry(10, 10),
  new THREE.MeshBasicMaterial({
    color: 0x666666,
    wireframe: true,
  })
);
planeMesh3.position.copy(planeBody3.position);
planeMesh3.quaternion.copy(planeBody3.quaternion);
scene.add(planeMesh3);
meshes.push(planeMesh3);

const planeShape4 = new CANNON.Plane();
const planeBody4 = new CANNON.Body({
  mass: 0,
  shape: planeShape,
  material: new CANNON.Material(),
});
planeBody4.position.set(0, 5, -5);

world.addBody(planeBody4);
phyMeshes.push(planeBody4);

const planeMesh4 = new THREE.Mesh(
  new THREE.PlaneGeometry(10, 10),
  new THREE.MeshBasicMaterial({
    color: 0x666666,
    wireframe: true,
  })
);
planeMesh4.position.copy(planeBody4.position);
planeMesh4.quaternion.copy(planeBody4.quaternion);
scene.add(planeMesh4);
meshes.push(planeMesh4);


// 创建SPH流体系统
const sphSystem = new CANNON.SPHSystem();
// 流体密度
sphSystem.density = 1
// 流体粘度
sphSystem.viscosity = 0.01;
// 流体交互距离
sphSystem.smoothingRadius = 1;
// 将流体添加到世界
world.subsystems.push(sphSystem)

// 创建流体粒子
const particleShape = new CANNON.Particle();
const particleMaterial = new CANNON.Material();
const sphereGeometry = new THREE.SphereGeometry(0.1, 10, 10)
const sphereMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 })

for(let i = 0; i < 400; i ++) {
  const particleBody = new CANNON.Body({
    mass: 0.01,
    shape: particleShape,
    material: particleMaterial
  })
  particleBody.position.set(Math.random() * -0.5, 10 + i, Math.random() * -0.5)
  world.addBody(particleBody)
  phyMeshes.push(particleBody)
  // 将粒子添加到流体系统中
  sphSystem.add(particleBody)

  // threejs小球
  const particleMesh = new THREE.Mesh(sphereGeometry, sphereMaterial);
  particleMesh.position.copy(particleBody.position);
  scene.add(particleMesh);
  meshes.push(particleMesh);
}


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



  


