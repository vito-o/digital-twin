import './style.css'

// ====================================================================
import * as THREE from 'three'
// 导入轨道控制器
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

// import gsap from 'gsap'
import * as CANNON from 'cannon-es'

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

// 初始化物理世界
const world = new CANNON.World()
// 设置重力
world.gravity.set(0, -9.82, 0)

const boxMaterialCon1 = new CANNON.Material('boxMaterial')
// boxMaterialCon1.friction = 1
// boxMaterialCon1.restitution = 1

// 创建一个物理世界的平面
// const planeShape = new CANNON.Plane() //平面是无线衍生的
const planeShape = new CANNON.Box(new CANNON.Vec3(5, 0.1, 5))
// 创建一个刚体
const planeBody = new CANNON.Body({
  mass: 0, //0 表示质量非常大或者碰撞后完全不动
  shape: planeShape,
  position: new CANNON.Vec3(0, 0, 0),
  type: CANNON.Body.STATIC, //设置物体为静态的
  material: boxMaterialCon1
})
// 旋转
// new CANNON.Vec3(1, 0, 0)  从哪个轴开始旋转
planeBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), 0.1)
world.addBody(planeBody)

// 创建一个平面
const planeMesh = new THREE.Mesh(
  new THREE.PlaneGeometry(10, 10),
  new THREE.MeshBasicMaterial({ color: 0xffff00 })
)
planeMesh.rotation.x = -Math.PI / 2+0.1
scene.add(planeMesh)
//----------------------------------------------------------------
let phyMeshes = []
let meshes = []

// 创建物理立方体
const boxShape = new CANNON.Box(new CANNON.Vec3(0.5, 0.5, 0.5))
// 设置立方体的材质

// 创建立方体刚体
const boxBody1 = new CANNON.Body({
  shape: boxShape,
  position: new CANNON.Vec3(0, 5, 0),
  mass: 1,
  material: boxMaterialCon1
})
world.addBody(boxBody1)
phyMeshes.push(boxBody1)

// 创建立方体几何体
const boxGeometry = new THREE.BoxGeometry(1, 1, 1)
const boxMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 })
const boxMesh1 = new THREE.Mesh(boxGeometry, boxMaterial)
scene.add(boxMesh1)
meshes.push(boxMesh1)


// 设置立方体的材质
const boxMaterialCon2 = new CANNON.Material('boxSlipperyMaterial')
boxMaterialCon2.friction = 0; //摩擦系数为0
// 创建立方体刚体
const boxBody2 = new CANNON.Body({
  shape: boxShape,
  position: new CANNON.Vec3(1, 5, 0),
  mass: 1,
  material: boxMaterialCon2
})
world.addBody(boxBody2)
phyMeshes.push(boxBody2)

const boxMesh2 = new THREE.Mesh(boxGeometry, boxMaterial)
scene.add(boxMesh2)
meshes.push(boxMesh2)


// 设置立方体的材质
const boxMaterialCon3 = new CANNON.Material('boxSlipperyMaterial')
// boxMaterialCon3.friction = 0; //摩擦系数为0
// boxMaterialCon3.restitution = 1; //设置弹性
// 创建立方体刚体
const boxBody3 = new CANNON.Body({
  shape: boxShape,
  position: new CANNON.Vec3(2, 5, 0),
  mass: 1,
  material: boxMaterialCon3
})
world.addBody(boxBody3)
phyMeshes.push(boxBody3)

const boxMesh3 = new THREE.Mesh(boxGeometry, boxMaterial)
scene.add(boxMesh3)
meshes.push(boxMesh3)

// 定义接触材质
const material3ToPlane = new CANNON.ContactMaterial(
  boxMaterialCon1,
  boxMaterialCon3,
  {
    friction: 0,
    restitution: 1
  }
)
world.addContactMaterial(material3ToPlane)

const material3ToPlane2 = new CANNON.ContactMaterial(
  boxMaterialCon1,
  boxMaterialCon2,
  {
    friction: 0,
    restitution: .2
  }
)
world.addContactMaterial(material3ToPlane2)
//----------------------------------------------------------------

let clock = new THREE.Clock()
// 渲染
function animate() {
  let delta = clock.getDelta()
  // 设置一帧的时间
  world.step(1 / 60, delta)

  for(let i=0; i < phyMeshes.length; i++) {
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



  


