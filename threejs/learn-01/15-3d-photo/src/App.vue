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
  90,   // 视角
  window.innerWidth / window.innerWidth,
  0.1,  // 近平面
  1000  // 远平面
)
camera.position.set(0, 0, 6)

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

/*const gltfLoader = new GLTFLoader()
// 实例化加载器draco
const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath('/draco/')
gltfLoader.setDRACOLoader(dracoLoader)
gltfLoader.load('/assets/ew8.glb', gltf => {
}) */

// 纹理
const texturelLoader = new THREE.TextureLoader()
const texture = texturelLoader.load('/assets/cat.jpg')
const depthTexture = texturelLoader.load('/assets/cat_depth.jpg')

// 鼠标坐标
const mouse = new THREE.Vector2()

// 创建平面
const geometry = new THREE.PlaneGeometry(19.2, 12)
// const material = new THREE.MeshBasicMaterial({ map: texture })
const material = new THREE.ShaderMaterial({
  uniforms: {
    uTime: { value: 0 },
    uTexture: { value: texture },
    uDepthTexture: { value: depthTexture },
    uMouse: { value: mouse },
  },
  vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform sampler2D uTexture;
    uniform sampler2D uDepthTexture;
    uniform vec2 uMouse;
    varying vec2 vUv;
    uniform float uTime;
    void main() {
      vec4 color = texture2D(uTexture, vUv);
      vec4 depth = texture2D(uDepthTexture, vUv);
      float depthValue = depth.r;
      float x = vUv.x + (uMouse.x+sin(uTime))*0.01*depthValue;
      float y = vUv.y + (uMouse.y+cos(uTime))*0.01*depthValue;
      vec4 newColor = texture2D(uTexture, vec2(x, y));
      gl_FragColor = newColor;
    }
  `
})


const plane = new THREE.Mesh(geometry, material)
scene.add(plane)

// 渲染
const animate = () => {
  material.uniforms.uMouse.value = mouse
  material.uniforms.uTime.value = performance.now() / 1000

  renderer.render(scene, camera)
  // controls.update()
  requestAnimationFrame(animate)
}

window.addEventListener("mousemove", (event) => {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
});

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
