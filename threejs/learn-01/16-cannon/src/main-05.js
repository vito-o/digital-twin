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

// 设置碰撞组（碰撞组需要设置2的幂次方）
const GROUP1 = 1
const GROUP2 = 2
const GROUP3 = 4
const GROUP4 = 8


// 初始化物理世界
const world = new CANNON.World()
// 设置重力
world.gravity.set(0, -9.82, 0)


// 创建一个物理世界的平面
const planeShape = new CANNON.Box(new CANNON.Vec3(5, 0.1, 5))
// 创建材质
const materialCon1 = new CANNON.Material('boxMaterial')
materialCon1.restitution = 0
materialCon1.friction = 0
// 创建一个刚体
const planeBody = new CANNON.Body({
  mass: 0, //0 表示质量非常大或者碰撞后完全不动
  shape: planeShape,
  position: new CANNON.Vec3(0, 0, 0),
  type: CANNON.Body.STATIC, //设置物体为静态的
  material: materialCon1,
  collisionFilterGroup: GROUP1, //设置碰撞组为一组
  collisionFilterMask: GROUP2 | GROUP3 | GROUP4 //碰撞组掩码，就是和谁碰撞
})
// 旋转
// new CANNON.Vec3(1, 0, 0)  从哪个轴开始旋转
planeBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), 0)
world.addBody(planeBody)

// 创建一个平面
const planeMesh = new THREE.Mesh(
  new THREE.PlaneGeometry(10, 10),
  new THREE.MeshBasicMaterial({ color: 0xffff00 })
)
planeMesh.rotation.x = -Math.PI / 2
scene.add(planeMesh)
//----------------------------------------------------------------
let phyMeshes = []
let meshes = []

// 创建物理立方体
const boxShape = new CANNON.Box(new CANNON.Vec3(0.5, 0.5, 0.5))
// 创建材质
const materialCon2 = new CANNON.Material('boxMaterial')
materialCon2.friction = 0
// 创建立方体刚体
const boxBody = new CANNON.Body({
  shape: boxShape,
  position: new CANNON.Vec3(-3, .5, 0),
  mass: 1,
  material: materialCon2,
  collisionFilterGroup: GROUP2,
  collisionFilterMask: GROUP1 | GROUP3 | GROUP4
})
world.addBody(boxBody)
phyMeshes.push(boxBody)

// 创建立方体几何体
const boxGeometry = new THREE.BoxGeometry(1, 1, 1)
const boxMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 })
const boxMesh1 = new THREE.Mesh(boxGeometry, boxMaterial)
scene.add(boxMesh1)
meshes.push(boxMesh1)


// 创建物理球
const sphereShape = new CANNON.Sphere(0.5)
// 创建材质
const materialCon3 = new CANNON.Material('boxMaterial')
materialCon3.friction = 0
// 创建球刚体
const sphereBody = new CANNON.Body({
  shape: sphereShape,
  position: new CANNON.Vec3(0, .5, 0),
  mass: 1,
  material: materialCon3,
  collisionFilterGroup: GROUP3,
  collisionFilterMask: GROUP1 | GROUP2
})
world.addBody(sphereBody)
phyMeshes.push(sphereBody)

// 创建球体几何
const sphereGeometry = new THREE.SphereGeometry(0.5, 32, 32)
const sphereMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 })
const sphereMesh = new THREE.Mesh(sphereGeometry, sphereMaterial)
scene.add(sphereMesh)
meshes.push(sphereMesh)


// 创建物理圆柱体
const cylinderShape = new CANNON.Cylinder(0.5, 0.5, 1, 32)
// 创建材质
const materialCon4 = new CANNON.Material('boxMaterial')
materialCon4.friction = 0
// 创建刚体
const cylinderBody = new CANNON.Body({
  shape: cylinderShape,
  position: new CANNON.Vec3(3, .5, 0),
  mass: 1,
  material: materialCon4,
  collisionFilterGroup: GROUP4,
  collisionFilterMask: GROUP1 | GROUP2
})
cylinderBody.restitution = 0
world.addBody(cylinderBody)
phyMeshes.push(cylinderBody)

// 创建圆柱几何体
const cylinderGeometry = new THREE.CylinderGeometry(0.5, 0.5, 1, 32)
const cylinderMaterial = new THREE.MeshBasicMaterial({ color: 0x0000ff })
const cylinderMesh = new THREE.Mesh(cylinderGeometry, cylinderMaterial)
scene.add(cylinderMesh)
meshes.push(cylinderMesh)


// 设置立方体的初始速度
boxBody.velocity.set(5, 0, 0)
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



  


