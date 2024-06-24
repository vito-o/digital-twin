import '../style.css'
// 修改着色器代码内容， 看raw/*.glsl文件

/**
 * 着色器材质的变量
 * 
 * 每个着色器材质都可以指定两种不同类型的shaders，他们是顶点着色器和片元着色器
 * ·顶点着色器首先允许，他接收attribute，计算/操纵每个单独顶点的位置，并将其他数据(varyings)传递
 * 给片元着色器。
 * ·片元（或像素）着色器后运行；他设置渲染到平面的每个单独片元（像素）的颜色
 * 
 * shader中有三种类型的变量：uniforms, attributes和varyings
 * ·uniforms是所有顶点都具有相同的值的变量。比如灯光、雾和阴影贴图就是被存储在uniforms中的数据
 *  uniforms可以通过顶点着色器和片元着色器来访问
 * ·attributes与每个顶点关联的变量。例如，顶点位置、法线和顶点颜色都是存储在attributes中的数据。
 *  attributes只可以在顶点着色器中访问
 * ·varyings是从顶点着色器传递到片元着色器的变量。对于每一个片元，每一个varying的值将是相邻顶点值得平滑插值
 * 
 * 注意：在shader内部，uniforms和attributes就像常量；你只能通过js代码通过缓冲区来修改他们得值。
 * 
 * 
 */

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

import vertexShader from './shader/raw/vertex.glsl?raw'
import fragmentShader from './shader/raw/fragment.glsl?raw'
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

// 创建原始着色器材质
const rawShaderMaterial = new THREE.RawShaderMaterial({
  vertexShader,
  fragmentShader
})

const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(1, 1, 64, 64),
  rawShaderMaterial
  // new THREE.MeshBasicMaterial({ color: '#00ff00' })
)
scene.add(floor)
console.log(floor )

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

