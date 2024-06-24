import '../style.css'
//1.应用顶点着色打造绚丽多彩的星空

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
// 设置相机位置
camera.position.set(0, 0, 10)


// 场景渲染器
const renderer = new THREE.WebGLRenderer({
  antialias: true
})
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

// ------------------------------------
// 重置相机宽高比
camera.aspect = window.innerWidth / window.innerHeight
camera.updateProjectionMatrix()
// 重置渲染器宽高比
renderer.setSize(window.innerWidth, window.innerHeight)
// ------------------------------------

// 坐标辅助器
const axesHelper = new THREE.AxesHelper(5)
scene.add(axesHelper)

// 控制器
const controls = new OrbitControls(camera, renderer.domElement)
// 设置带阻尼的惯性
controls.enableDamping = true

let textureLoader = new THREE.TextureLoader()
let textures = textureLoader.load('/textures/particles/8.png')

/* const sphereGeometry = new THREE.SphereGeometry(3, 20, 20)
const pointMaterial = new THREE.PointsMaterial()
const points = new THREE.Points(sphereGeometry, pointMaterial)
scene.add(points)
delete sphereGeometry.attributes.uv;
pointMaterial.size = 0.2
pointMaterial.color.set(0x00ffff)
// pointMaterial.sizeAttenuation = false //关闭深度衰减
pointMaterial.map = textures 
pointMaterial.alphaMap = textures
pointMaterial.transparent = true
// 透明图片的透明部分会遮挡后面的 point,可以通过设置depthWrite为false调整该问题
pointMaterial.depthWrite = false 
// 当两个points叠加是,让两个点的颜色叠加
pointMaterial.blending = THREE.AdditiveBlending */


const particlesGeometry = new THREE.BufferGeometry()
const count = 5000
// 设置缓冲区数组
const positions = new Float32Array(count * 3)
const colors = new Float32Array(count * 3)

// 设置顶点
for(let i = 0; i < count * 3; i++) {
  positions[i] = Math.random() * 10 - 5 ;
  colors[i] = Math.random()
}
particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))

const pointMaterial = new THREE.PointsMaterial()
pointMaterial.size = 0.2
// pointMaterial.color.set(0x00ffff)
pointMaterial.map = textures 
pointMaterial.alphaMap = textures
pointMaterial.transparent = true
// 透明图片的透明部分会遮挡后面的 point,可以通过设置depthWrite为false调整该问题
pointMaterial.depthWrite = false 
// 当两个points叠加是,让两个点的颜色叠加
pointMaterial.blending = THREE.AdditiveBlending
// 是否使用顶点着色。默认值为false。 此引擎支持RGB或者RGBA两种顶点颜色，取决于缓冲 attribute 使用的是三分量（RGB）还是四分量（RGBA）。
pointMaterial.vertexColors = true;

const points = new THREE.Points(particlesGeometry, pointMaterial)
scene.add(points)



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

// 创建GUI
const gui = new GUI();


