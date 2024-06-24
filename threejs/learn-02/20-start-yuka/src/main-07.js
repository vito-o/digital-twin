import './style.css'
// 候鸟集群聚散效果
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
let light = new THREE.SpotLight(0xffffff, 5, 100, Math.PI / 6, 0.5, 0)
light.position.set(10, 40, 10)
light.castShadow = true
scene.add(light)

const spotLightHelper = new THREE.SpotLightHelper( light );
scene.add( spotLightHelper );



const gltfLoader = new GLTFLoader();
const dracoLoader = new DRACOLoader();
// 设置draco路径
dracoLoader.setDecoderPath('/draco/')
// 设置gltf加载器draco解码器
gltfLoader.setDRACOLoader(dracoLoader)

let c1 = gltfLoader.loadAsync('/model/car.gltf')
Promise.all([c1]).then(res => {
  // 创建群体随机行走行为
  const wanderBehavior = new YUKA.WanderBehavior(3)

  // 设置整齐群体转向
  const alignmentBehavior = new YUKA.AlignmentBehavior()
  alignmentBehavior.weight = 5;

  // 设置聚集行为
  const cohesionBehavior = new YUKA.CohesionBehavior()
  cohesionBehavior.weight = 5

  // 设置分离行为
  const separationBehavior = new YUKA.SeparationBehavior()
  separationBehavior.weight = 0.5

  for (let i = 0; i < 50; i++) {
    const car = res[0].scene.clone();
    car.children[0].rotation.y = Math.PI / 2;
    car.children[0].scale.set(0.2, 0.2, 0.2)
    car.castShadow = true;
    scene.add(car)
    const vehicle1 = new YUKA.Vehicle();
    vehicle1.position.set(Math.random() * 20 - 10, 0, Math.random() * 20 - 10)
    vehicle1.rotation.fromEuler(0, Math.random() * Math.PI, 0)
    vehicle1.setRenderComponent(car, callback)
    vehicle1.maxSpeed = 3;
    entityManager.add(vehicle1)

    vehicle1.steering.add(wanderBehavior)
    vehicle1.steering.add(alignmentBehavior)
    vehicle1.steering.add(cohesionBehavior)
    vehicle1.steering.add(separationBehavior)
  }
})

// 设置车辆的渲染对象
const callback = (entity, renderComponent) => {
  // entity 车辆实体
  // renderComponent 模型
  renderComponent.position.copy(entity.position)
  renderComponent.quaternion.copy(entity.rotation)
}

// 创建对实体管理对象
const entityManager = new YUKA.EntityManager()


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



  


