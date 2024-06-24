import '../style.css'
//曲线

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

// 场景
const scene = new THREE.Scene()



// 创建相机
const camera = new THREE.PerspectiveCamera(
  45,   // 视角
  window.innerWidth / window.innerWidth,
  0.1,  // 近平面
  1000  // 远平面
)
// 设置相机位置
camera.position.set(0, 0, 18)


// 场景渲染器
const renderer = new THREE.WebGLRenderer({
  antialias: true,
  alpha: true
})
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)
renderer.shadowMap.enabled = true;
renderer.physicallyCorrectLights = true
// ------------------------------------

// 坐标辅助器
const axesHelper = new THREE.AxesHelper(5)
scene.add(axesHelper)

// 控制器
const controls = new OrbitControls(camera, renderer.domElement)
// 设置带阻尼的惯性
controls.enableDamping = true

let geometry = new THREE.SphereGeometry(0.1, 16, 16)
let material = new THREE.MeshBasicMaterial({color: 0xff0000, wireframe: true})
let mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)


let curve = new THREE.CatmullRomCurve3(
  [
    new THREE.Vector3(-10, 0, 10),
    new THREE.Vector3(-5, 5, 5),
    new THREE.Vector3(0, 0, 5),
    new THREE.Vector3(5, -5, 5),
    new THREE.Vector3(10, 0, 10),
  ], true
)
let points = curve.getPoints(50)
const geo = new THREE.BufferGeometry().setFromPoints(points)
const curveMesh = new THREE.Line(
  geo, 
  new THREE.LineBasicMaterial({color: 0xff0000})
)
scene.add(curveMesh)


// 设置时钟
const clock = new THREE.Clock()

function animate() {
  let deltaTime = clock.getElapsedTime()

  // t 为 0 ~ 5 秒
  let t = deltaTime % 10;
  // t 为 0 ~ 1 秒
  t /= 10;
  if (curve) {
    // getPointAt 曲线上的位置。必须在[0,1]范围内
    const point = curve.getPointAt(t)
    mesh.position.set(point.x, point.y, point.z)
    // camera.lookAt(0, 0, 0)
    // camera.position.set(point.x, point.y, point.z)
    
    if (t + 0.3 < 1) {
      const point1 = curve.getPointAt(t + 0.3)
      // dd.lookAt(point1)
    }
    // camera.position.copy(point)
  }


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

