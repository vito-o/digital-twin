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

// 场景
const scene = new THREE.Scene()

// 创建相机
const camera = new THREE.PerspectiveCamera(
  45,   // 视角
  window.innerWidth / window.innerWidth,
  0.1,  // 近平面
  1000  // 远平面
)

// 场景渲染器
const renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)



// 设置相机位置
camera.position.z = 15
camera.position.x = 15
camera.position.y = 15
camera.lookAt(0, 0, 0)

const axesHelper = new THREE.AxesHelper(5)
scene.add(axesHelper)

const controls = new OrbitControls(camera, renderer.domElement)
// 设置带阻尼的惯性
controls.enableDamping = true

function animate() {
  controls.update()

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


// 创建三个球
const shape1 = new THREE.Mesh(
  new THREE.SphereGeometry(1, 32, 32),
  new THREE.MeshBasicMaterial({
    color: 0x00ff00
  })
)
shape1.position.x = -3;
scene.add(shape1)

const shape2 = new THREE.Mesh(
  new THREE.SphereGeometry(1, 32, 32),
  new THREE.MeshBasicMaterial({
    color: 0x0000ff
  })
)
scene.add(shape2)

const shape3 = new THREE.Mesh(
  new THREE.SphereGeometry(1, 32, 32),
  new THREE.MeshBasicMaterial({
    color: 0xfff00f
  })
)
shape3.position.x = 3;
scene.add(shape3)

// 创建射线
// 在threejs中，视口坐标范围是  上下[1, -1], 左右[-1, 1]
const raycaster = new THREE.Raycaster()
// 创建鼠标向量（用来保存点到屏幕上的位置坐标信息）
const mouse = new THREE.Vector2()

window.addEventListener('click', event => {
  // 设置鼠标向量的x,y值
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -((event.clientY / window.innerHeight) * 2 - 1)

  // 通过摄像机和鼠标位置更新射线
  raycaster.setFromCamera(mouse, camera)

  // 计算物体和射线的焦点
  const intersects = raycaster.intersectObjects([shape1, shape2, shape3])

  if (intersects.length) {
    if (!intersects[0].object._isSelect) {
      intersects[0].object._isSelect = true
      intersects[0].object._originColor = intersects[0].object.material.color.getHex()
      intersects[0].object.material.color.set(0xff0000)
    } else {
      intersects[0].object._isSelect = false
      intersects[0].object.material.color.set(intersects[0].object._originColor)
    }
  }
})