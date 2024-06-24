import './style.css'
// 碰撞
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
/* const gltfLoader = new GLTFLoader()
// 实例化加载器draco
const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath('/draco/')
gltfLoader.setDRACOLoader(dracoLoader)
gltfLoader.load('/model/lion.gltf', gltf => {
}) */
//----------------------------------------------------------------

//----------------------------------------------------------------
// 初始化物理世界
let world = new CANNON.World()
// 设置重力
world.gravity.set(0, -9.82, 0)

let phyMeshes = []
let meshs = []

// 设置碰撞组，数值要用2的幂
const GROUP0 = 1;
const GROUP1 = 2;
const GROUP2 = 4;
const GROUP3 = 8;

// 创建一个平面
const planeShape = new CANNON.Box(new CANNON.Vec3(5, 0.1, 5))
// 创建一个平面刚体
const planeMaterialCon = new CANNON.Material('planeMaterial')
planeMaterialCon.friction = 0;
const planeBody = new CANNON.Body({
  mass: 0,
  shape: planeShape,
  position: new CANNON.Vec3(0, -0.1, 0),
  material: planeMaterialCon,
  collisionFilterGroup: GROUP0,
  collisionFilterMask: GROUP1 | GROUP2 | GROUP3,
});
// planeBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), 0.1)
world.addBody(planeBody)


// 创建立方体
const boxShape1 = new CANNON.Box(new CANNON.Vec3(0.5, 0.5, 0.5));
// 创建一个刚体
const boxMaterialCon1 = new CANNON.Material('boxMaterial1')
boxMaterialCon1.friction = 0
const boxBody1 = new CANNON.Body({
  mass: 1,
  shape: boxShape1,
  position: new CANNON.Vec3(-2, 0.5, 0),
  material: boxMaterialCon1,
  collisionFilterGroup: GROUP1,
  collisionFilterMask: GROUP0 | GROUP2 | GROUP3,
})
world.addBody(boxBody1)
phyMeshes.push(boxBody1)

// 创建球体
const sphereShape1 = new CANNON.Sphere(0.5);
// 创建一个刚体
const sphereShapeMaterialCon1 = new CANNON.Material('sphereMaterial1')
sphereShapeMaterialCon1.friction = 0
const sphereBody1 = new CANNON.Body({
  mass: 1,
  shape: sphereShape1,
  position: new CANNON.Vec3(0, 0.5, 0),
  material: sphereShapeMaterialCon1,
  collisionFilterGroup: GROUP2,
  collisionFilterMask: GROUP0 | GROUP1,
})
world.addBody(sphereBody1)
phyMeshes.push(sphereBody1)

// 创建圆柱体
const cylinderShape = new CANNON.Cylinder(0.5, 0.5, 1, 32)
const cylinderShapeMaterialCon1 = new CANNON.Material('cylinderMaterial1')
cylinderShapeMaterialCon1.friction = 0
const cylinderBody = new CANNON.Body({
  mass: 1,
  shape: cylinderShape,
  position: new CANNON.Vec3(2, 0.5, 0),
  material: cylinderShapeMaterialCon1,
  collisionFilterGroup: GROUP3,
  collisionFilterMask: GROUP0 | GROUP1,
})
world.addBody(cylinderBody)
phyMeshes.push(cylinderBody)

// 设置立方体的初始化
boxBody1.velocity.set(3, 0, 0)



// 创建一个平面几何体
const planeGeometry = new THREE.BoxGeometry(10, 0.2, 10);
const planeMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00 })
const planeMesh = new THREE.Mesh(planeGeometry, planeMaterial)
// planeMesh.rotation.x = 0.1;
scene.add(planeMesh)

// 创建一个立方体的几何体
const boxGeometry1 = new THREE.BoxGeometry(1, 1, 1)
// 创建一个立方体的材质
const boxMaterial1 = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
// 创建一个立方体的网格
const boxMesh1 = new THREE.Mesh(boxGeometry1, boxMaterial1)
scene.add(boxMesh1)
meshs.push(boxMesh1)

// 创建一个球的几何体
const sphereGeometry1 = new THREE.SphereGeometry(.5, 32, 32)
// 创建一个球的材质
const sphereMaterial1 = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
// 创建一个球的网格
const sphereMesh1 = new THREE.Mesh(sphereGeometry1, sphereMaterial1)
scene.add(sphereMesh1)
meshs.push(sphereMesh1)

// 创建一个圆柱体的几何体
const cylinderGeometry1 = new THREE.CylinderGeometry(0.5, 0.5, 1, 32)
const cylinderMaterial1 = new THREE.MeshBasicMaterial({ color: 0xff0000 })
const cylinderMesh1 = new THREE.Mesh(cylinderGeometry1, cylinderMaterial1)
scene.add(cylinderMesh1)
meshs.push(cylinderMesh1)
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



  


