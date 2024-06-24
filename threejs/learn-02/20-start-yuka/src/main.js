import './style.css'
// 导航网格自动导航
// ====================================================================
import * as THREE from 'three'
// 导入轨道控制器
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";

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
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.shadowMap.enabled = true;
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1;
document.body.appendChild(renderer.domElement);

// 坐标助手 红色代表 X 轴. 绿色代表 Y 轴. 蓝色代表 Z 轴.
const axesHelper = new THREE.AxesHelper(15)
scene.add(axesHelper)

// 控制器
const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true // 设置带阻尼惯性
// ---------------------------------------------------------------


const gltfLoader = new GLTFLoader();
const dracoLoader = new DRACOLoader();
// 设置draco路径
dracoLoader.setDecoderPath('/draco/')
// 设置gltf加载器draco解码器
gltfLoader.setDRACOLoader(dracoLoader)


let plane;
gltfLoader.load("/model/city.glb", function (gltf) {
  plane = gltf.scene;
  scene.add(plane);
});


/* gltfLoader.load('/model/car.gltf', gltf => {
  const car = gltf.scene
  car.children[0].rotation.y = Math.PI / 2;
  car.children[0].scale.set(0.2, 0.2, 0.2)
  car.castShadow = true;
  scene.add(car)
  vehicle.setRenderComponent(car, callback)
}) */


// 创建目标小球
const sphereGeometry = new THREE.SphereGeometry(0.1, 32, 32);
const sphereMaterial = new THREE.MeshStandardMaterial({ color: 0xff00ff });
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
sphere.receiveShadow = true;
sphere.castShadow = true;
scene.add(sphere);


// 设置车辆的渲染对象
const callback = (entity, renderComponent) => {
  // entity 车辆实体  renderComponent 模型
  renderComponent.position.copy(entity.position)
  renderComponent.quaternion.copy(entity.rotation)
}


class CustomVechicle extends YUKA.Vehicle{
  constructor(navMesh) {
    super();
    this.navMesh = navMesh;
  }

  update(delta) {
    super.update(delta)
    const currentRegion = this.navMesh.getRegionForPoint(this.position);
    if (currentRegion) {
      const distance = currentRegion.distanceToPoint(this.position);
      this.position.y -= distance * 0.2;
    }
  }
}


// 创建对实体管理对象
const entityManager = new YUKA.EntityManager()

// 创建车辆
// const vehicle = new YUKA.Vehicle();
// vehicle.maxSpeed = 3;
// entityManager.add(vehicle)

// 创建目标
const target = new YUKA.GameEntity();
target.setRenderComponent(sphere, callback)
target.position.set(Math.random() * 20 - 10, 0, Math.random() * 20 - 10);
entityManager.add(target)


// 网格加载器
const navMeshLoader = new YUKA.NavMeshLoader()
// 加载网格
let navMesh, vehicle;
navMeshLoader.load('/model/citymap1.gltf').then(navigationMesh => {
  navMesh = navigationMesh

  vehicle = new CustomVechicle(navMesh)
  vehicle.maxSpeed = 15
  vehicle.smoother = new YUKA.Smoother(30)
  entityManager.add(vehicle)

  gltfLoader.load('/model/robot.glb', gltf => {
    const car = gltf.scene;
    car.children[0].scale.set(0.6, 0.6, 0.6)
    scene.add(car)
    vehicle.setRenderComponent(car, callback)
  })
})


// 点击将目标移动到点击位置
const ndc = new THREE.Vector2();
const raycaster = new THREE.Raycaster()
window.addEventListener('pointerdown', e => {
  ndc.x = (e.clientX / window.innerWidth) * 2 - 1;
  ndc.y = - (e.clientY / window.innerHeight) * 2 + 1;
  raycaster.setFromCamera(ndc, camera)
  const intersects = raycaster.intersectObject(plane)
  if (intersects.length) {
    const point = intersects[0].point;
    target.position.set(point.x, 0, point.z)

    let from = vehicle.position
    let to = point

    // 根据导航网格获取路径
    const path = navMesh.findPath(from, to);
    const path1 = new YUKA.Path()
    for(let item of path) {
      path1.add(new YUKA.Vector3(item.x, item.y, item.z))
    }
    showPathLine(path1)
    vehicle.steering.clear();

    // const followPathBehavior = new YUKA.FollowPathBehavior(path1)
    // vehicle.steering.add(followPathBehavior)

    const onPathBehavior = new YUKA.OnPathBehavior(path1, 0.1, 0.1);
    // onPathBehavior.weight = 10;
    vehicle.steering.add(onPathBehavior);

    const arriveBehavior = new YUKA.ArriveBehavior(to, 3, 3);
    arriveBehavior.weight = 1;
    vehicle.steering.add(arriveBehavior);
  }
})


let line;
const showPathLine = (path) => {
  if (line) {
    scene.remove(line)
    line.geometry.dispose();
    line.material.dispose();
  }
  const positions = []
  for (let i = 0; i < path._waypoints.length; i++) {
    positions.push(
      path._waypoints[i].x,
      path._waypoints[i].y,
      path._waypoints[i].z,
    )
  }
  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  const material = new THREE.LineBasicMaterial({ color: 0x0000ff })
  line = new THREE.Line(geometry, material)
  scene.add(line)
}


// 加载hdr环境贴图
const hdrLoader = new RGBELoader()
hdrLoader.load('/texture/013.hdr', texture => {
  texture.mapping = THREE.EquirectangularReflectionMapping;
  scene.background = texture;
  scene.environment = texture;
})
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



  


