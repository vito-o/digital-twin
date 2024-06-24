import './style.css'
// 逃离行为
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

/* // 创建锥体
const coneGeometry = new THREE.ConeGeometry(0.2, 1, 32)
coneGeometry.rotateX(Math.PI / 2)
const coneMaterial = new THREE.MeshStandardMaterial({ color: 0xff0000 })
const cone = new THREE.Mesh(coneGeometry, coneMaterial)
cone.matrixAutoUpdate = false;
// cone.receiveShadow = true
cone.castShadow = true
scene.add(cone) */

const gltfLoader = new GLTFLoader();
const dracoLoader = new DRACOLoader();
// 设置draco路径
dracoLoader.setDecoderPath('/draco/')
// 设置gltf加载器draco解码器
gltfLoader.setDRACOLoader(dracoLoader)

gltfLoader.load('/model/car.gltf', gltf => {
  const car = gltf.scene;
  car.children[0].rotation.y = Math.PI / 2;
  car.children[0].scale.set(0.2, 0.2, 0.2)
  car.castShadow = true
  scene.add(car)
  vehicle.setRenderComponent(car, callback)
})

// 创建yuka的车辆
const vehicle = new YUKA.Vehicle();
// 设置车辆的渲染对象
// vehicle.setRenderComponent(cone, callback)
const callback = (entity, renderComponent) => {
  renderComponent.position.copy(entity.position)
  renderComponent.quaternion.copy(entity.rotation)
  // entity 车辆实体
  // renderComponent 模型
}
vehicle.maxSpeed = 5;


// 创建目标小球
const sphereGeometry = new THREE.SphereGeometry(0.1, 32, 32);
const sphereMaterial = new THREE.MeshStandardMaterial({ color: 0xff00ff });
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
sphere.receiveShadow = true;
sphere.castShadow = true;
scene.add(sphere);

// 创建目标
const target = new YUKA.GameEntity()
target.setRenderComponent(sphere, callback)

// 创建对实体管理对象
const entityManager = new YUKA.EntityManager()
entityManager.add(vehicle)
entityManager.add(target)

// // 到达行为
// const arriveBehavior = new YUKA.ArriveBehavior(target.position, 2, 1)
// vehicle.steering.add(arriveBehavior)

const fleeBehavior = new YUKA.FleeBehavior(target.position, 3);
vehicle.steering.add(fleeBehavior)

// 点击将目标移动到点击的位置
const ndc = new THREE.Vector2()
const raycaster = new THREE.Raycaster();
window.addEventListener('click', e => {
  ndc.x = (e.clientX / window.innerWidth) * 2 - 1;
  ndc.y = -(e.clientY / window.innerHeight) * 2 + 1;
  raycaster.setFromCamera(ndc, camera)
  let intersects = raycaster.intersectObject(plane)
  if (intersects.length) {
    const point = intersects[0].point;
    target.position.set(point.x, 0, point.z)
  }
})

// 设置障碍
const obstacles = []

for (let i = 0; i < 5; i++) {
  const boxGeometry = new THREE.BoxGeometry(3, 3, 3);
  const boxMaterial = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
  const box = new THREE.Mesh(boxGeometry, boxMaterial);
  box.position.set(Math.random() * 30 - 15, 0, Math.random() * 30 - 5);
  box.receiveShadow = true;
  box.castShadow = true;
  scene.add(box);

  // 创建障碍物
  const obstacle = new YUKA.GameEntity();
  obstacle.position.copy(box.position)

  // 设置障碍物的半径
  boxGeometry.computeBoundingSphere();
  obstacle.boundingRadius = boxGeometry.boundingSphere.radius;
  obstacles.push(obstacle)

  entityManager.add(obstacle)
}

// 避障行为
const obstacleAvoidanceBehavior = new YUKA.ObstacleAvoidanceBehavior(obstacles)
vehicle.steering.add(obstacleAvoidanceBehavior)
vehicle.smoother = new YUKA.Smoother(30)
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



  


