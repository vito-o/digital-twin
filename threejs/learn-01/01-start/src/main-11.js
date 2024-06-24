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
document.body.appendChild(renderer.domElement)


const axesHelper = new THREE.AxesHelper(5)
scene.add(axesHelper)

const controls = new OrbitControls(camera, renderer.domElement)
// 设置带阻尼的惯性
controls.enableDamping = true


// 创建三个球
const shape1 = new THREE.Mesh(
  new THREE.SphereGeometry(1, 32, 32),
  new THREE.MeshBasicMaterial({
    color: 0x00ff00
  })
)
shape1.position.x = -3;
scene.add(shape1)


function animate() {
  controls.update()

  requestAnimationFrame(animate)
  // 渲染
  renderer.render(scene, camera)

  TWEEN.update()
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


const tween1 = new TWEEN.Tween(shape1.position)
tween1.to({ x: 4, y: 0 }, 1000)
// tween.repeat(Infinity)  //循环
// tween.yoyo(true) //往复
// tween.delay(50)
tween1.easing(TWEEN.Easing.Quadratic.InOut)


let tween2 = new TWEEN.Tween(shape1.position)
tween2.to({ y: -4 }, 1000);
tween1.chain(tween2)
tween2.chain(tween1)

tween1.start()

tween1.onStart(() => console.log('开始'))
tween1.onComplete(() => console.log('结束'))
tween1.onStop(() => console.log('停止'))
tween1.onUpdate(() => console.log('更新'))

let params = {
  stop: () => {
    tween1.stop()
  }
}
gui.add(params, 'stop')