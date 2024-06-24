import '../style.css'

import * as THREE from 'three'
// 导入轨道控制器
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js'
// 导入gltf加载器
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
// hdr加载器
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader'

import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'
// 导入tween
import * as TWEEN from 'three/examples/jsm/libs/tween.module'

// 目标：点光源



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
camera.position.z = 15
camera.position.x = 0
camera.position.y = 0
camera.lookAt(0, 0, 0)

// 场景渲染器
const renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)
// 开启场景中的阴影贴图
renderer.shadowMap.enabled = true;
document.body.appendChild(renderer.domElement)

// 红色代表 X 轴. 绿色代表 Y 轴. 蓝色代表 Z 轴.
const axesHelper = new THREE.AxesHelper(5)
scene.add(axesHelper)

const controls = new OrbitControls(camera, renderer.domElement)
// 设置带阻尼的惯性
controls.enableDamping = true


const sphereGeometry = new THREE.SphereGeometry(1, 20, 20)
const material = new THREE.MeshStandardMaterial({
  side: THREE.DoubleSide
})

const sphere = new THREE.Mesh(sphereGeometry, material)
sphere.castShadow = true
scene.add(sphere)

// 创建平面
const planeGeometry = new THREE.PlaneGeometry(10, 10)
const plane = new THREE.Mesh(planeGeometry, material)
plane.position.set(0, -1, 0)
plane.rotation.x = -Math.PI / 2;
plane.receiveShadow = true
scene.add(plane)


// 灯光
// 环境光
const light = new THREE.AmbientLight(0xffffff, 0.5)
scene.add(light)

const pointLight = new THREE.PointLight( 0xff0000, 1 );
// spotLight.position.set( 5, 5, 5 );
pointLight.position.set( 2, 2, 2 );
pointLight.castShadow = true
pointLight.decay = 0.6
scene.add(pointLight)

const smallBall = new THREE.Mesh(
  new THREE.SphereGeometry(0.1, 20, 20),
  new THREE.MeshBasicMaterial({ color: 0xFF0000 })
)
smallBall.position.set(2, 2, 2)
smallBall.add(pointLight)
scene.add(smallBall)

// 设置时钟
const clock = new THREE.Clock()
function animate() {
  let time = clock.getElapsedTime()
  controls.update()

  smallBall.position.x = 3 * Math.cos(time)
  smallBall.position.z = 3 * Math.sin(time)
  smallBall.position.y = 2 + Math.cos(time * 4)

  requestAnimationFrame(animate)
  // 渲染
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

const gui = new GUI()

gui.add(smallBall.position, 'x').min(-5).max(5).step(0.1)
gui.add(pointLight, 'distance').min(0).max(5).step(0.01)
gui.add(pointLight, 'decay').min(0).max(5).step(0.1)