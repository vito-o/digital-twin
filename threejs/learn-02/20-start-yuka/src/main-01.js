import './style.css'
// 路径跟随
// ====================================================================
import * as THREE from 'three'
// 导入轨道控制器
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'

import * as YUKA from 'yuka'

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
camera.position.set(0, 5, 10)

// 渲染器
const renderer = new THREE.WebGLRenderer({
  antialias: true, // 抗锯齿
})
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.shadowMap.enabled = true
screenDom.appendChild(renderer.domElement)

// 坐标助手 红色代表 X 轴. 绿色代表 Y 轴. 蓝色代表 Z 轴.
const axesHelper = new THREE.AxesHelper(15)
scene.add(axesHelper)

// 控制器
const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true // 设置带阻尼惯性

// ---------------------------------------------------------------

// 创建地面
const planeGeometry = new THREE.PlaneGeometry(50, 50)
const planeMaterial = new THREE.MeshStandardMaterial({ color: 0x999999 })
const plane = new THREE.Mesh(planeGeometry, planeMaterial)
plane.receiveShadow = true
plane.rotation.x = - Math.PI / 2;
plane.position.y = -0.5;
scene.add(plane)

// 创建灯光
let light = new THREE.SpotLight(0xffffff, 5, 100, Math.PI / 8, 0.5, 0)
light.position.set(10, 40, 10)
light.castShadow = true
scene.add(light)

const spotLightHelper = new THREE.SpotLightHelper( light );
scene.add( spotLightHelper );

// 创建锥体
const coneGeometry = new THREE.ConeGeometry(0.2, 1, 32)
coneGeometry.rotateX(Math.PI / 2)
const coneMaterial = new THREE.MeshStandardMaterial({ color: 0xff0000 })
const cone = new THREE.Mesh(coneGeometry, coneMaterial)
cone.matrixAutoUpdate = false;
// cone.receiveShadow = true
cone.castShadow = true
scene.add(cone)


// 创建yuka的车辆
const vehicle = new YUKA.Vehicle();
// 设置车辆的渲染对象
vehicle.setRenderComponent(cone, (entity, renderComponent) => {
  // entity 车辆实体
  // renderComponent 模型
  renderComponent.matrix.copy(entity.worldMatrix)
})
vehicle.maxSpeed = 5;

// 创建yuka路径
const path = new YUKA.Path()
path.add(new YUKA.Vector3(0, 0, 0));
path.add(new YUKA.Vector3(0, 0, 10));
path.add(new YUKA.Vector3(10, 0, 10));
path.add(new YUKA.Vector3(10, 0, 0));
path.add(new YUKA.Vector3(0, 0, 0));
path.loop = true

// 将路径当前的位置设置为车辆的位置
vehicle.position.copy(path.current())

// 跟随路径的行为
const followPathBehavior = new YUKA.FollowPathBehavior(path);
vehicle.steering.add(followPathBehavior)

// 创建对实体管理对象
const entityManager = new YUKA.EntityManager()
entityManager.add(vehicle)

// 显示路径
const showPathLine = path => {
  const positions = []
  for (let i = 0; i < path._waypoints.length; i++) {
    positions.push(
      path._waypoints[i].x,
      path._waypoints[i].y,
      path._waypoints[i].z,
    )
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));

  const material = new THREE.LineBasicMaterial({ color: 0x0000ff })
  const line = new THREE.Line(geometry, material)
  scene.add(line)
}
showPathLine(path)
// ---------------------------------------------------------------

let time = new YUKA.Time()
// 渲染
function animate() {
  let delta = time.update().getDelta();

  entityManager.update(delta)

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



  


