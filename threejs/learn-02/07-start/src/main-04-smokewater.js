import '../style.css'
// 着色器打造烟雾水云效果

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

import vertexShader from './shader/smokewater/vertex.glsl?raw'
import fragmentShader from './shader/smokewater/fragment.glsl?raw'

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
camera.position.set(0, 1, 2)

// 场景渲染器
const renderer = new THREE.WebGLRenderer({
  antialias: true
})
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 0.1

document.body.appendChild(renderer.domElement)


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

let params = {
  // 设置波浪的频率
  uWaresFrequency: 14,
  // 波浪的高低
  uScale: 0.03,
  uNoiseFrequency: 10,
  uNoiseScale: 1.5,
  uXzScale: 1.5,
  uLowColor: "#ff0000",
  uHighColor: "#ffff00",
  uXspeed: 1,
  uZspeed: 1,
  uNoiseSpeed: 1,
  uOpacity: 1,
  uTime: 0,
}

const shaderMaterial = new THREE.ShaderMaterial({
  vertexShader,
  fragmentShader,
  uniforms: {
    uWaresFrequency: {
      value: params.uWaresFrequency
    },
    uScale: {
      value: params.uScale
    },
    uNoiseFrequency: {
      value: params.uNoiseFrequency
    },
    uNoiseScale: {
      value: params.uNoiseScale
    },
    uXzScale: {
      value: params.uXzScale
    },
    uLowColor: {
      value: new THREE.Color(params.uLowColor)
    },
    uHighColor: {
      value: new THREE.Color(params.uHighColor)
    },
    uXspeed: {
      value: params.uXspeed
    },
    uZspeed: {
      value: params.uZspeed
    },
    uNoiseSpeed: {
      value: params.uNoiseSpeed
    },
    uOpacity: {
      value: params.uOpacity
    },
    uTime: {
      value: params.uTime
    }
  },
  side: THREE.DoubleSide,
  transparent: true
})

const gui = new GUI();

gui.add(params, 'uWaresFrequency', 1, 100).step(0.1).onChange(val => {
  shaderMaterial.uniforms.uWaresFrequency.value = val;
})
gui.add(params, 'uScale', 0, 0.2).step(0.001).onChange(val => {
  shaderMaterial.uniforms.uScale.value = val;
})
gui.add(params, 'uNoiseFrequency', 1, 100).step(0.1).onChange(val => {
  shaderMaterial.uniforms.uNoiseFrequency.value = val;
})
gui.add(params, 'uNoiseScale', 0, 5).step(0.001).onChange(val => {
  shaderMaterial.uniforms.uNoiseScale.value = val;
})
gui.add(params, 'uXzScale', 0, 5).step(0.1).onChange(val => {
  shaderMaterial.uniforms.uXzScale.value = val;
})
gui.addColor(params, 'uLowColor').onFinishChange(val => {
  shaderMaterial.uniforms.uLowColor.value = new THREE.Color(val);
})
gui.addColor(params, 'uHighColor').onFinishChange(val => {
  shaderMaterial.uniforms.uHighColor.value = new THREE.Color(val);
})

gui.add(params, 'uXspeed', 0, 5).step(0.001).onChange(val => {
  shaderMaterial.uniforms.uXspeed.value = val;
})
gui.add(params, 'uZspeed', 0, 5).step(0.001).onChange(val => {
  shaderMaterial.uniforms.uZspeed.value = val;
})
gui.add(params, 'uNoiseSpeed', 0, 5).step(0.001).onChange(val => {
  shaderMaterial.uniforms.uNoiseSpeed.value = val;
})
gui.add(params, 'uOpacity', 0, 1).step(0.001).onChange(val => {
  shaderMaterial.uniforms.uOpacity.value = val;
})


const plane = new THREE.Mesh(
  new THREE.PlaneGeometry(1, 1, 512, 512),
  shaderMaterial
)
plane.rotation.x = - Math.PI / 2;
scene.add(plane)

const clock = new THREE.Clock()
function animate() {
  let time = clock.getElapsedTime()
  shaderMaterial.uniforms.uTime.value = time

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



