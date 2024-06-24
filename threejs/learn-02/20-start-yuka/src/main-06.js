import './style.css'
// 偏离追击实现跟随效果
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

let c1 = gltfLoader.loadAsync('/model/car.gltf')
let c2 = gltfLoader.loadAsync('/model/truck.gltf')
Promise.all([c1, c2]).then(res => {
  const truce = res[1].scene;
  truce.children[0].rotation.y = Math.PI / 2;
  truce.children[0].scale.set(0.2, 0.2, 0.2)
  truce.castShadow = true;
  scene.add(truce)
  const vehicle2 = new YUKA.Vehicle();
  vehicle2.position.set(Math.random() * 20 - 10, 0, Math.random() * 20 - 10)
  vehicle2.setRenderComponent(truce, callback)
  vehicle2.maxSpeed = 5;
  entityManager.add(vehicle2)


  const offsets = [
    new YUKA.Vector3(0, 0, 1),
    new YUKA.Vector3(-1, 0, 1),
    new YUKA.Vector3(1, 0, 1),
    new YUKA.Vector3(3, 0, -3),
    new YUKA.Vector3(-3, 0, -3),
  ];

  for (let i = 0; i < offsets.length; i++) {
    const car = res[0].scene.clone();
    car.children[0].rotation.y = Math.PI / 2;
    car.children[0].scale.set(0.2, 0.2, 0.2)
    car.castShadow = true;
    scene.add(car)
    const vehicle1 = new YUKA.Vehicle();
    vehicle1.position.set(Math.random() * 20 - 10, 0, Math.random() * 20 - 10)
    vehicle1.setRenderComponent(car, callback)
    vehicle1.maxSpeed = 4;
    entityManager.add(vehicle1)

    // 设置小汽车偏移跟随行为
    const offsetPursuitBehavior = new YUKA.OffsetPursuitBehavior(vehicle2, offsets[i])
    vehicle1.steering.add(offsetPursuitBehavior)
  }



  // 设置卡车行为
  const arriveBehavior = new YUKA.ArriveBehavior(target.position)
  vehicle2.steering.add(arriveBehavior)

  setInterval(() => {
    target.position.set(Math.random() * 50 - 25, 0, Math.random() * 50 - 25);
  }, 3000)
})

// 设置车辆的渲染对象
const callback = (entity, renderComponent) => {
  // entity 车辆实体
  // renderComponent 模型
  renderComponent.position.copy(entity.position)
  renderComponent.quaternion.copy(entity.rotation)
}


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
entityManager.add(target)





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



  


