import './style.css'
// 复杂模型
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

// 创建一个平面
const planeShape = new CANNON.Box(new CANNON.Vec3(5, 0.1, 5))
// const planeShape = new CANNON.Plane()
// 创建一个平面刚体
const planeMaterialCon = new CANNON.Material('planeMaterial')
planeMaterialCon.friction = 0.2;
planeMaterialCon.restitution = 0.1;
const planeBody = new CANNON.Body({
  mass: 0,
  shape: planeShape,
  position: new CANNON.Vec3(0, -0.1, 0),
  material: planeMaterialCon,
  collisionFilterGroup: GROUP0,
  collisionFilterMask: GROUP1 | GROUP2,
});
// planeBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), 0.1)
// planeBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2)
world.addBody(planeBody)

const planeShape1 = new CANNON.Plane()
const planeBody1 = new CANNON.Body({
  mass: 0,
  shape: planeShape1,
  position: new CANNON.Vec3(0, 0, 0),
  type: CANNON.Body.STATIC,
  material: planeMaterialCon,
  collisionFilterGroup: GROUP0,
  collisionFilterMask: GROUP2,
})
planeBody1.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2)
world.addBody(planeBody1)

// 胶囊体
const capsuleMaterialCon = new CANNON.Material('capsuleMaterial')
capsuleMaterialCon.friction = 0.2
capsuleMaterialCon.restitution = 0.1;
const capsuleBody = new CANNON.Body({
  mass: 1,
  position: new CANNON.Vec3(0, 5, 0),
  material: capsuleMaterialCon,
  collisionFilterGroup: GROUP1,
  collisionFilterMask: GROUP0 | GROUP2,
})

// 胶囊体 - 球体
const sphereShape = new CANNON.Sphere(0.5);
// 胶囊体 - 圆柱体
const cylinderShape = new CANNON.Cylinder(0.5, 0.5, 1.5, 20);
capsuleBody.addShape(sphereShape, new CANNON.Vec3(0, 0.75, 0))
capsuleBody.addShape(cylinderShape, new CANNON.Vec3(0, 0, 0))
capsuleBody.addShape(sphereShape, new CANNON.Vec3(0, -0.75, 0))
world.addBody(capsuleBody)
phyMeshes.push(capsuleBody)

// 设置胶囊体 - 的初始化
capsuleBody.velocity.set(0.5, 0, 0)



// 创建一个平面几何体
const planeGeometry = new THREE.BoxGeometry(10, 0.2, 10);
const planeMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00 })
const planeMesh = new THREE.Mesh(planeGeometry, planeMaterial)
// planeMesh.rotation.x = 0.1;
scene.add(planeMesh)


// 创建一个胶囊的几何体
const capsuleGeometry = new THREE.CylinderGeometry(0.5, 0.5, 1.5, 20)
const capsuleMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 })
const capsuleMesh = new THREE.Mesh(capsuleGeometry, capsuleMaterial)
scene.add(capsuleMesh)
meshs.push(capsuleMesh)

// 创建一个球的几何体
const sphereGeometry = new THREE.SphereGeometry(.5, 20, 20)
// 创建一个球的材质
const sphereMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
// 创建一个球的网格
const sphereMesh1 = new THREE.Mesh(sphereGeometry, sphereMaterial)
sphereMesh1.position.set(0, 0.75, 0)
capsuleMesh.add(sphereMesh1)
const sphereMesh2 = new THREE.Mesh(sphereGeometry, sphereMaterial)
sphereMesh2.position.set(0, -0.75, 0)
capsuleMesh.add(sphereMesh2)


//----------------------------------------------------------------
const gltfLoader = new GLTFLoader()
// 实例化加载器draco
const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath('/draco/')
gltfLoader.setDRACOLoader(dracoLoader)
gltfLoader.load('/model/lion.gltf', gltf => {
  let lion = gltf.scene.children[0]
  lion.material = new THREE.MeshBasicMaterial({ color: 0xff0000 })
  scene.add(lion)
  meshs.push(lion)

  // 设置trimeshbody
  const trimeshShape = new CANNON.Trimesh(
    lion.geometry.attributes.position.array,
    lion.geometry.index.array
  );

  const lionMaterialCon = new CANNON.Material('lionMaterial')
  lionMaterialCon.friction = 0.2
  lionMaterialCon.restitution = 0.1;
  let trimeshBody = new CANNON.Body({
    mass: 1,
    position: new CANNON.Vec3(0, 2, 0),
    material: lionMaterialCon,
    collisionFilterGroup: GROUP2,
    collisionFilterMask: GROUP0 | GROUP1
  })
  trimeshBody.addShape(trimeshShape)

  trimeshBody.velocity.set(0, 0, 0)
  world.addBody(trimeshBody)
  phyMeshes.push(trimeshBody)
})
//----------------------------------------------------------------

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



  


