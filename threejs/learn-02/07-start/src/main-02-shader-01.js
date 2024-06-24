import '../style.css'
//

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
const renderer = new THREE.WebGLRenderer({
  antialias: true
})
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

// 设置相机位置
camera.position.z = 5
camera.position.y = 1.8
camera.position.x = 0
camera.lookAt(0, 2, 0)
// 重置渲染器宽高比
renderer.setSize(window.innerWidth, window.innerHeight)
// 重置相机宽高比
camera.aspect = window.innerWidth / window.innerHeight
camera.updateProjectionMatrix()

// 坐标辅助器
const axesHelper = new THREE.AxesHelper(5)
scene.add(axesHelper)

// 控制器
const controls = new OrbitControls(camera, renderer.domElement)
// 设置带阻尼的惯性
controls.enableDamping = true

// 创建着色器材质
const shaderMaterial = new THREE.ShaderMaterial({
  vertexShader: `
    void main() {
      gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1);
    }
  `,
  fragmentShader: `
    void main() {
      gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
    }
  `
})
/**
 * projectionMatrix：投影矩阵
 * viewMatrix：视图矩阵
 * modelMatrix：模型矩阵
 * vec4(position, 1)：顶点坐标
 * 
 * 相乘顺序不能改变。物体本身拥有一个坐标系，叫本地坐标系。把物体放到世界坐标系中，
 * 采用了模型矩阵，就是执行缩放、平移、旋转操作的过程。此时物体就具有世界坐标系。
 * 
 * 再加入上帝之眼，就是视图矩阵，包括视点坐标，观察点坐标，和上放向。
 * 现在只差最后一步-投影矩阵，物体就可以呈现出来了。
 * 目前显示设备都是二维平面，所以需要投影矩阵来转换物体，投影矩阵通常分为平行投影和透视投影
 */


const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(1, 1, 64, 64),
  shaderMaterial
  // new THREE.MeshBasicMaterial({ color: '#00ff00' })
)
scene.add(floor)


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

