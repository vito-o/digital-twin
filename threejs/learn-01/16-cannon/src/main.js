import './style.css'

// ====================================================================
import * as THREE from 'three'
// 导入轨道控制器
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'


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
// 允许休息
world.allowSleep = true


// 设置立方体材质
const boxMaterialCon = new CANNON.Material("boxMaterial");
boxMaterialCon.friction = 0.2;
boxMaterialCon.restitution = 0.1;
// 创建一个平面
const planeShape1 = new CANNON.Plane();
// 创建一个刚体
const planeBody1 = new CANNON.Body({
  mass: 0,
  shape: planeShape1,
  position: new CANNON.Vec3(0, 0, 0),
  type: CANNON.Body.STATIC,
  material: boxMaterialCon,
  collisionFilterGroup: GROUP1,
  collisionFilterMask: GROUP1 | GROUP2 | GROUP3,
});
planeBody1.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2);
// 将刚体添加到物理世界
world.addBody(planeBody1);

// 创建材质
const materialCon1 = new CANNON.Material('boxMaterial')
// 创建一个物理世界的平面
const planeShape = new CANNON.Box(new CANNON.Vec3(5, 0.1, 5))

materialCon1.restitution = 0.3
materialCon1.friction = 0.4
// 创建一个刚体
const planeBody = new CANNON.Body({
  mass: 0, //0 表示质量非常大或者碰撞后完全不动
  shape: planeShape,
  position: new CANNON.Vec3(0, -0.1, 0),
  type: CANNON.Body.STATIC, //设置物体为静态的
  material: materialCon1,
  collisionFilterGroup: GROUP1, //设置碰撞组为一组
  collisionFilterMask: GROUP1 | GROUP2 | GROUP3 //碰撞组掩码，就是和谁碰撞
})
// 旋转
// new CANNON.Vec3(1, 0, 0)  从哪个轴开始旋转
planeBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), 0)
world.addBody(planeBody)

// 创建一个平面
const planeMesh = new THREE.Mesh(
  new THREE.BoxGeometry(10, 0.1, 10),
  new THREE.MeshBasicMaterial({ color: 0xffff00 })
)
// planeMesh.rotation.x = -Math.PI / 2
scene.add(planeMesh)
//----------------------------------------------------------------
let phyMeshes = []
let meshes = []

// 创建由2个球加1个圆柱体组成的胶囊体
// 创建刚体
const capsuleBody = new CANNON.Body({
  mass: 1,
  position: new CANNON.Vec3(0, 5, 0),
  material: materialCon1,
  collisionFilterGroup: GROUP2,
  collisionFilterMask: GROUP1 | GROUP2 | GROUP3
})

// 创建一个球体几何
const sphereShape = new CANNON.Sphere(0.5)
// 创建一个圆柱体
const cylinderShape = new CANNON.Cylinder(0.5, 0.5, 1.5, 20)
// 将球体和圆柱体添加到body
capsuleBody.addShape(sphereShape, new CANNON.Vec3(0, 0.75, 0))
capsuleBody.addShape(cylinderShape, new CANNON.Vec3(0, 0, 0))
capsuleBody.addShape(sphereShape, new CANNON.Vec3(0, -0.75, 0))
// capsuleBody.velocity.set(2, 0, 0)

world.addBody(capsuleBody)
phyMeshes.push(capsuleBody)

// 创建胶囊体几何
const capsuleGeometry = new THREE.CylinderGeometry(0.5, 0.5, 1.5, 20)
const capsuleMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 })
const capsuleMesh = new THREE.Mesh(capsuleGeometry, capsuleMaterial)
capsuleMesh.position.copy(capsuleBody.position)
capsuleMesh.quaternion.copy(capsuleBody.quaternion)
scene.add(capsuleMesh)
meshes.push(capsuleMesh)

// 创建球体
const sphereGeometry = new THREE.SphereGeometry(0.5, 20, 20)
const sphereMaterial = new THREE.MeshBasicMaterial({ color: 0x0000ff })
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
  let mesh = gltf.scene.children[0]
  mesh.material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
  scene.add(mesh)
  meshes.push(mesh)

  const materialCon4 = new CANNON.Material('boxMaterial')
  // 设置trimeshbody
  const trimesh = new CANNON.Trimesh(
    mesh.geometry.attributes.position.array,
    mesh.geometry.index.array
  )
  let trimeshBody = new CANNON.Body({
    mass: 1,
    position: new CANNON.Vec3(0, 2, 0),
    material: materialCon4,
    // shape: trimesh,
    collisionFilterGroup: GROUP3,
    collisionFilterMask: GROUP1 | GROUP2 | GROUP3
  })
  trimeshBody.addShape(trimesh)
  world.addBody(trimeshBody)
  phyMeshes.push(trimeshBody)
})


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



  


