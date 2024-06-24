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
camera.position.set(0, 1, 6)

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

// 创建一个球体
const sphereShape = new CANNON.Sphere(0.5)
// 创建一个刚体
const sphereBody = new CANNON.Body({
  mass: 1,
  shape: sphereShape,
  position: new CANNON.Vec3(0, 5, 0)
})
// 将刚体添加到物理世界
world.addBody(sphereBody)

// 创建一个物理世界的平面
// const planeShape = new CANNON.Plane() //平面是无线衍生的
const planeShape = new CANNON.Box(new CANNON.Vec3(5, 0.1, 5))
// 创建一个刚体
const planeBody = new CANNON.Body({
  mass: 0, //0 表示质量非常大或者碰撞后完全不动
  shape: planeShape,
  position: new CANNON.Vec3(0, 0, 0),
  type: CANNON.Body.STATIC //设置物体为静态的
})
// 旋转
// new CANNON.Vec3(1, 0, 0)  从哪个轴开始旋转
// planeBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI /2+0.1)
planeBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), 0)
world.addBody(planeBody)

//创建击打声音
const hitSound = new Audio('/assets/metalHit.mp3')

sphereBody.addEventListener('collide', e => {
  const impactStrength = e.contact.getImpactVelocityAlongNormal()
  if(impactStrength > 2) {
    hitSound.currentTime = 0
    hitSound.play()
  }
})


// 创建一个球体几何
const sphereMesh = new THREE.Mesh(
  new THREE.SphereGeometry(0.5, 32, 32),
  new THREE.MeshBasicMaterial({ color: 0x00ff00 })
)
scene.add(sphereMesh)

// 创建一个平面
const planeMesh = new THREE.Mesh(
  new THREE.PlaneGeometry(10, 10),
  new THREE.MeshBasicMaterial({ color: 0xffff00 })
)
planeMesh.rotation.x = -Math.PI / 2
scene.add(planeMesh)

let clock = new THREE.Clock()
// 渲染
function animate() {
  let delta = clock.getDelta()
  // 设置一帧的时间
  world.step(1 / 60, delta)
  // 更新物体的位置
  sphereMesh.position.copy(sphereBody.position)
  // 更新物体的旋转
  sphereMesh.quaternion.copy(sphereBody.quaternion)

  // planeMesh.position.copy(planeBody.position)
  // planeMesh.quaternion.copy(planeBody.quaternion)

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



  


