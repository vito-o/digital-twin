import '../style.css'
//银河系

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

import vertexShader from './shader/point/p03_vertex.glsl?raw'
import fragmentShader from './shader/point/p03_fragment.glsl?raw'


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
camera.position.set(0, 0, 40)

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
let texture1 = textureLoader.load('/textures/particles/9.png')
let texture2 = textureLoader.load('/textures/particles/10.png')
let texture3 = textureLoader.load('/textures/particles/11.png')

const params = {
  count: 10000,
  size: 0.1,
  radius: 8, 
  branch: 5,
  color: '#ff6030',
  endColor: '#61aeee',
  rotateScale: 0.3
}

const galaxyColor = new THREE.Color(params.color)
const outGalaxyColor = new THREE.Color(params.endColor)

let geometry = null
let material = null
const generateGalaxy = () => {
  // 生成顶点
  geometry = new THREE.BufferGeometry()
  // 生成随机位置
  const positions = new Float32Array(params.count * 3)
  // 生成顶点颜色
  const colors = new Float32Array(params.count * 3)
  // 图案属性
  const imgIndex = new Float32Array(params.count)
  const scales = new Float32Array(params.count)

  // 循环生成点
  for(let i = 0; i < params.count; i++) {
    let current = i * 3;
    // 当前点应该在哪个分支的的角度上
    const branchAngel = (i % params.branch) * ((2 * Math.PI) / params.branch)
    // 当前点距离圆心的距离
    const distance = Math.random() * params.radius * Math.pow(Math.random(), 3)
      
    const randomX = Math.pow(Math.random() * 2 - 1, 3) * (params.radius - distance) / 5;
    const randomY = Math.pow(Math.random() * 2 - 1, 3) * (params.radius - distance) / 5;
    const randomZ = Math.pow(Math.random() * 2 - 1, 3) * (params.radius - distance) / 5;

    positions[current] = Math.cos(branchAngel + distance*params.rotateScale) * distance + randomX
    positions[current + 1] = 0  + randomY;
    positions[current + 2] = Math.sin(branchAngel + distance*params.rotateScale) * distance + randomZ;
    
    // 混合颜色，形成渐变色
    const mixColor = galaxyColor.clone()
    mixColor.lerp(outGalaxyColor, distance / params.radius)

    colors[current] = mixColor.r
    colors[current + 1] = mixColor.g
    colors[current + 2] = mixColor.b

    // 顶点的大小
    scales[i] = Math.random()
    // 根据索引值设置的不同的图案
    imgIndex[i] = i % 3;
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))

  geometry.setAttribute('aScale', new THREE.BufferAttribute(scales, 1))
  geometry.setAttribute('imgIndex', new THREE.BufferAttribute(imgIndex, 1))

  /* material = new THREE.PointsMaterial({
    transparent: true,
    map: texture1,
    alphaMap: texture1,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    size: params.size,
    color: new THREE.Color(params.color),
    // 是否使用顶点着色。默认值为false。
    vertexColors: true,
  }) */

  material = new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    transparent: true,
    depthWrite: false,
    // blending 被设置为 THREE.AdditiveBlending，这是 Three.js 中的一种混合模式。
    // AdditiveBlending 特别适用于创建发光效果，因为它将材质的颜色与背景颜色相加，
    // 从而产生一种明亮的效果，就像光线穿过半透明的幻灯片一样。
    // 这种混合模式通常用于实现霓虹灯效果、激光或其他需要发光的视觉元素。

    blending: THREE.AdditiveBlending,
    // 是否使用顶点着色。默认值为false。
    vertexColors: true,
    uniforms: {
      uTexture1: {
        value: texture1
      },
      uTexture2: {
        value: texture2
      },
      uTexture3: {
        value: texture3
      },
      uTime: {
        value: 0
      },
    }
  })

  const point = new THREE.Points(geometry, material)
  scene.add(point)
}

generateGalaxy()


// 设置时钟 
const clock = new THREE.Clock()

function animate() {
  const elapsedTime = clock.getElapsedTime()
  material.uniforms.uTime.value = elapsedTime

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


