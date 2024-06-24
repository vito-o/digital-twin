import '../style.css'
// 户型数据与全景图生成VR全景看房

import * as THREE from 'three'
// 导入轨道控制器
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js'
// 导入gltf加载器
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
// hdr加载器
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader'

import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'

import { TransformControls } from 'three/examples/jsm/controls/TransformControls'

import gsap from 'gsap'

import RoomShapeMesh from "./threeMesh/RoomShapeMesh.js";
import WallShaderMaterial from "./threeMesh/WallShaderMaterial.js";
import Wall from "./threeMesh/Wall.js";

import demo720Json from './demo720.json'

let otherDom = document.querySelector('.other')
otherDom.innerHTML = `
  <button class="btn" id="btn">切换房间</button>
  <div class="mask-wrap">
    <div class="loading"></div>
    <div class="progress">
      <img src="/img/assets/loading.gif" alt="" />
      <span id="p-val">加载中：0%</span>
    </div>
  </div>
`;
let pValDom = otherDom.querySelector('#p-val')
let btnDom = otherDom.querySelector('#btn')



// 场景
const scene = new THREE.Scene()


// 创建相机
const camera = new THREE.PerspectiveCamera(
  75,   // 视角
  window.innerWidth / window.innerWidth,
  0.1,  // 近平面
  1000  // 远平面
)
// 设置相机位置
camera.position.set(0, 14, 10)
// 更新摄像头
camera.aspect = window.innerWidth / window.innerHeight;
// 更新摄像机的投影矩阵
camera.updateProjectionMatrix();


// 场景渲染器
const renderer = new THREE.WebGLRenderer({
  antialias: true,
  alpha: true
})
// 更新渲染器
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);  // 设置渲染器的像素比
renderer.physicallyCorrectLights = true
renderer.shadowMap.enabled = true;
document.body.appendChild(renderer.domElement)

// ------------------------------------
// 坐标辅助器
// const axesHelper = new THREE.AxesHelper(5)
// scene.add(axesHelper)

// 控制器
const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true // 设置带阻尼的惯性

// 加载全景图
const loader = new THREE.TextureLoader()
const texture = loader.load('/assets/HdrSkyCloudy004_JPG_8K.jpg')
texture.mapping = THREE.EquirectangularReflectionMapping
scene.background = texture
scene.environment = texture

let idToPanorama = {};
 // 全景定位
let panoramaLocation = demo720Json.panoramaLocation;

// 循环创建房间
for(let i = 0; i < demo720Json.objData.roomList.length; i++) {
  // 获取房间数据
  const room = demo720Json.objData.roomList[i];
  let roomMesh_b = new RoomShapeMesh(room)
  let roomMesh_t = new RoomShapeMesh(room, true)
  scene.add(roomMesh_b, roomMesh_t)

  // 房间到全景图的映射
  for (let j = 0; j < panoramaLocation.length; j++) {
    const panorama = panoramaLocation[j];
    if (panorama.roomId == room.roomId) {
      let material = new WallShaderMaterial(panorama);
      panorama.material = material;
      idToPanorama[room.roomId] = panorama
    }
  }

  roomMesh_b.material = idToPanorama[room.roomId].material
  roomMesh_b.material.side = THREE.DoubleSide
  roomMesh_t.material = idToPanorama[room.roomId].material.clone()
  roomMesh_t.material.side = THREE.FrontSide
}

// 创建墙
for (let i = 0; i < demo720Json.wallRelation.length; i++) {
  let wallPoints = demo720Json.wallRelation[i].wallPoints
  let faceRelation = demo720Json.wallRelation[i].faceRelation

  faceRelation.forEach(item => {
    item.panorama = idToPanorama[item.roomId]
  })

  let mesh = new Wall(wallPoints, faceRelation)
  scene.add(mesh)
}


THREE.DefaultLoadingManager.onProgress = (item, loaded, total) => {
  let progress = new Number((loaded / total) * 100)
  pValDom.innerHTML = `加载中：${progress.toFixed(2)}%`
  if (progress >= 100) {
    otherDom.querySelector('.mask-wrap').remove()
  }
}

// 设置时钟
const clock = new THREE.Clock()

function animate() {
  let deltaTime = clock.getElapsedTime()

  requestAnimationFrame(animate)
  // 渲染
  renderer.render(scene, camera)

  controls.update()
}

animate()



// 监听窗口变化
window.addEventListener('resize', () => {
  // 更新摄像头
  camera.aspect = window.innerWidth / window.innerHeight;
  //   更新摄像机的投影矩阵
  camera.updateProjectionMatrix();
  //   更新渲染器
  renderer.setSize(window.innerWidth, window.innerHeight);
  //   设置渲染器的像素比
  renderer.setPixelRatio(window.devicePixelRatio);
})

// 创建GUI
// const gui = new GUI();

let roomIndex = 0;
let dir = new THREE.Vector3();
let timeline = gsap.timeline();

btnDom.addEventListener('click', () => {
  let room = panoramaLocation[roomIndex]
  dir = camera.position
    .clone()
    .sub(
      new THREE.Vector3(
        room.point[0].x / 100,
        room.point[0].z / 100,
        room.point[0].y / 100,
      )
    )
    .normalize();
  
  timeline.to(camera.position, {
    duration: 1,
    x: room.point[0].x / 100 + dir.x * 0.01,
    y: room.point[0].z / 100,
    z: room.point[0].y / 100 + dir.z * 0.01,
  })

  camera.lookAt(
    room.point[0].x / 100,
    room.point[0].z / 100,
    room.point[0].y / 100,
  )
  controls.target.set(
    room.point[0].x / 100,
    room.point[0].z / 100,
    room.point[0].y / 100,
  )
  
  roomIndex++
  if (roomIndex >= panoramaLocation.length) {
    roomIndex = 0;
  }
})