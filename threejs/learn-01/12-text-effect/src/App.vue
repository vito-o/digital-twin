<script setup>
import { onMounted, ref } from 'vue'

import * as THREE from 'three'
// 导入轨道控制器
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

// 导入gltf加载器
import { GLTFLoader } from 'three/examples/jsm/loaders/gltfloader'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'
// import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader'

import gsap from 'gsap'

const screenDomRef = ref()

// 场景
const scene = new THREE.Scene()

// 照相机
const camera = new THREE.PerspectiveCamera(
  75,   // 视角
  window.innerWidth / window.innerWidth,
  0.1,  // 近平面
  1000  // 远平面
)
camera.position.set(0, 0, 3)

// 渲染器
const renderer = new THREE.WebGLRenderer({
  antialias: true, // 抗锯齿
  // 对数深度缓冲区
  // logarithmicDepthBuffer: true
})
renderer.setSize(window.innerWidth, window.innerHeight)
// renderer.outputEncoding = THREE.sRGBEncoding;

// 坐标助手 红色代表 X 轴. 绿色代表 Y 轴. 蓝色代表 Z 轴.
const axesHelper = new THREE.AxesHelper(15)
scene.add(axesHelper)

// 控制器
const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true // 设置带阻尼惯性

// 环境
scene.background = new THREE.Color(0xffffff)

const gltfLoader = new GLTFLoader()
// 实例化加载器draco
const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath('/draco/')
gltfLoader.setDRACOLoader(dracoLoader)

let material;

gltfLoader.load('/model/newyear.glb', gltf => {
  let text = gltf.scene.children[0]
  scene.add(text)

  let geometry = text.geometry;
  const position = geometry.attributes.position;
  const vertexCount = position.count;
  const triangleCount = vertexCount / 3;

  const randomDirections = []
  const randomStrengths = []

  for (let i = 0; i < triangleCount; i++) {
    let x = Math.random() * 2 - 1
    let y = Math.random() * 2 - 1
    let z = Math.random() * 2 - 1

    randomDirections.push(x, y, z)
    const str = Math.random()
    randomStrengths.push(str, str, str)
  }

  const randomDirectionsAttribute = new THREE.Float32BufferAttribute(
    new Float32Array(randomDirections), 3
  )
  geometry.setAttribute('randomDirection', randomDirectionsAttribute)

  const randomStrengthsAttribute = new THREE.Float32BufferAttribute(
    new Float32Array(randomStrengths), 1
  )
  geometry.setAttribute('randomStrength', randomStrengthsAttribute)

  // 定义着色器材质
  material = new THREE.ShaderMaterial({
    uniforms: {
      time: { value: 1 },
    },
    vertexShader: `
      attribute vec3 randomDirection;
      attribute float randomStrength;
      uniform float time;
      varying vec3 vPosition;

      void main() {
        vPosition = position;
        vec3 pos = position.xyz;
        pos += randomDirection * randomStrength * time;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos.xyz, 1.0);
      }
    `,
    fragmentShader: `
      varying vec3 vPosition;
      void main() {
        vec3 color = normalize(vPosition)*0.5+0.5;
        color.z = color.z*3.0;
        gl_FragColor = vec4(color,1.0);
      }
    `,
    side: THREE.DoubleSide,
    transparent: true
  })
  text.material = material
})

let showText = false
window.addEventListener('click', () => {
  showText = !showText
})
let clock = new THREE.Clock()
let value = 0;

// 渲染
const animate = () => {
  // clock.getDelta() 获取自 .oldTime 设置后到当前的秒数。 同时将 .oldTime 设置为当前时间。
  // 如果 .autoStart 设置为 true 且时钟并未运行，则该方法同时启动时钟。
  let delta = clock.getDelta()
  if (material) {
    if (showText) {
      value -= delta;
      value = Math.max(value, 0)
      material.uniforms.time.value = value
    } else {
      value += delta
      value = Math.min(value, 1)
      material.uniforms.time.value = value
    }
  }

  renderer.render(scene, camera)
  controls.update()

  requestAnimationFrame(animate)
}

// 监听窗口变化
window.addEventListener('resize', () => {
  // 重置渲染器宽高比
  renderer.setSize(window.innerWidth, window.innerHeight)
  // 重置相机宽高比
  camera.aspect = window.innerWidth / window.innerHeight
  // 更新相机的投影矩阵
  camera.updateProjectionMatrix()
})

onMounted(() => {
  screenDomRef.value.appendChild(renderer.domElement)

  animate()
})
</script>

<template>
  <div class="home">
    <div class="canvas-container" ref="screenDomRef"></div>
  </div>
</template>

<style>

</style>
