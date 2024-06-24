<script setup>
import { onMounted, ref } from 'vue'

import * as THREE from 'three'
// 导入轨道控制器
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

// 导入gltf加载器
import { GLTFLoader } from 'three/examples/jsm/loaders/gltfloader'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader'

import gsap from 'gsap'

const screenDomRef = ref()
const pages = ref()

// 场景
const scene = new THREE.Scene()

// 照相机
const camera = new THREE.PerspectiveCamera(
  45,   // 视角
  window.innerWidth / window.innerWidth,
  0.1,  // 近平面
  1000  // 远平面
)
camera.position.set(0, 0, 10)

// 渲染器
const renderer = new THREE.WebGLRenderer({
  antialias: true, // 抗锯齿
  // 对数深度缓冲区
  // logarithmicDepthBuffer: true
})
renderer.setSize(window.innerWidth, window.innerHeight)
// renderer.outputEncoding = THREE.sRGBEncoding;

// 坐标助手 红色代表 X 轴. 绿色代表 Y 轴. 蓝色代表 Z 轴.
// const axesHelper = new THREE.AxesHelper(15)
// scene.add(axesHelper)

// 控制器
const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true // 设置带阻尼惯性

// 添加灯光
let light1 = new THREE.DirectionalLight(0xffffff, 0.3);
light1.position.set(0, 10, 10);
let light2 = new THREE.DirectionalLight(0xffffff, 0.3);
light1.position.set(0, 10, -10);
let light3 = new THREE.DirectionalLight(0xffffff, 0.8);
light1.position.set(10, 10, 10);
scene.add(light1, light2, light3);

// 背景
let textureLoader = new THREE.TextureLoader()
let envMap = textureLoader.load('/assets/25s.jpg')
envMap.mapping = THREE.EquirectangularReflectionMapping
scene.background = envMap
scene.environment = envMap


const gltfLoader = new GLTFLoader()
// 实例化加载器draco
const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath('/draco/')
gltfLoader.setDRACOLoader(dracoLoader)
gltfLoader.load('/model/xz.glb', gltf => {
  gltf.scene.scale.set(0.1, 0.1, 0.1)
  gltf.scene.position.set(3, 0, 0)
  scene.add(gltf.scene)

  let timeline = gsap.timeline()
  window.addEventListener('mousemove', e => {
    let x = (e.clientX / window.innerWidth) * 2 - 1;  // 水平范围：-1 ~ 1 
    let y = -(e.clientY / window.innerHeight) * 2 + 1; // 垂直范围：-1 ~ 1 
    if (timeline.isActive()) timeline.clear()
   
    timeline.to(gltf.scene.rotation, {
      duration: 0.5,
      x: y,
      y: x,
      duration: 1
    })
  })
})

gltfLoader.load('/model/xq6.glb', gltf => {
  gltf.scene.scale.set(0.05, 0.05, 0.05)
  gltf.scene.position.set(3, -8, 0)
  scene.add(gltf.scene)

  let timeline = gsap.timeline()
  window.addEventListener('mousemove', e => {
    let x = (e.clientX / window.innerWidth) * 2 - 1;  // 水平范围：-1 ~ 1 
    let y = -(e.clientY / window.innerHeight) * 2 + 1; // 垂直范围：-1 ~ 1 

    if (timeline.isActive()) timeline.clear()
    timeline.to(gltf.scene.rotation, {
      duration: 0.5,
      x: y,
      y: x,
      duration: 1
    })
  })
})

gltfLoader.load('/model/gr75.glb', gltf => {
  gltf.scene.position.set(3, -16, 0)
  scene.add(gltf.scene)

  let timeline = gsap.timeline()
  window.addEventListener('mousemove', e => {
    let x = (e.clientX / window.innerWidth) * 2 - 1;  // 水平范围：-1 ~ 1 
    let y = -(e.clientY / window.innerHeight) * 2 + 1; // 垂直范围：-1 ~ 1 

    if (timeline.isActive()) timeline.clear()
    timeline.to(gltf.scene.rotation, {
      duration: 0.5,
      x: y,
      y: x,
      duration: 1
    })
  })
})


gltfLoader.load('/model/moon.glb', gltf => {
  let moon = gltf.scene.children[0];

  for (let j = 0; j < 10; j++) {

    let moonInstance = new THREE.InstancedMesh(
      moon.geometry,
      moon.material,
      50
    )
    for (let i = 0; i < 50; i++) {
      let x = Math.random() * 1000 - 500;
      let y = Math.random() * 1000 - 500;
      let z = Math.random() * 1000 - 500;
  
      let matrix = new THREE.Matrix4()
      let size = Math.random() * 10 - 8;
      matrix.makeScale(size, size, size)
      matrix.makeTranslation(x, y, z)
      moonInstance.setMatrixAt(i, matrix)
      
    }
    gsap.to(moonInstance.position, {
      duration: Math.random() * 10 + 2,
      z: -1000,
      ease: 'linear',
      repeat: -1
    })
    
    scene.add(moonInstance)
  }
  
})


// 渲染
const animate = () => {
  requestAnimationFrame(animate)

  renderer.render(scene, camera)
  // controls.update()
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

let page = 0
let timeline = gsap.timeline()
window.addEventListener('mousewheel', e => {
  if (e.wheelDelta < 0) {
    page++;
    if (page > 2) {
      page = 2;
    }
  }
  if (e.wheelDelta > 0) {
    page--;
    if (page < 0) {
      page = 0;
    }
  }
  if (!timeline.isActive()) {
    timeline.to(camera.position, {
      duration: 0.5,
      y: -page * 8,
      duration: 1
    })
    gsap.to(pages.value, {
      duration: 0.5,
      y: -window.innerHeight * page,
      duration: 1
    })
  }
})

let imgList = [
  {src: new URL('./assets/lcdm.png', import.meta.url).href}
]
</script>

<template>
  <div class="home">
    <img :src="imgList[0].src" alt="">
    <div class="canvas-container" ref="screenDomRef"></div>
    <div class="header">
      <div class="logo"></div>
      <div class="menu">
        <a class="menuItem">首页</a>
      </div>
    </div>
    <div class="pages" ref="pages">
      <div class="page">
        <h2 class="title">前端</h2>
        <p>轻松、好玩、有趣掌握前沿硬核前端技术</p>
      </div>
      <div class="page">
        <h2 class="title">WEB 3D可视化</h2>
        <p>领略WEB 3D的魅力，让页面无比酷炫</p>
      </div>
      <div class="page">
        <h2 class="title">ThreeJS框架</h2>
        <p>让前端开发3D效果更方便</p>
      </div>
    </div>
  </div>
</template>

<style>
* {
  margin: 0;
  padding: 0;
}
body {
  background-color: #000;
}
.canvas-container {
  width: 100vw;
  height: 100vh;
}
.home {
  width: 100vw;
  height: 100vh;
  transform-origin: 0 0;
}
.header {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.header .logo {
  height: 100px;
  width: 300px;
  /* background-image: url("./assets/lcdm.png"); */
  background-size: 60%;
  background-position: center;
  background-repeat: no-repeat;
}
.canvas-container {
  width: 100%;
  height: 100%;
}
.menu {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-right: 50px;
}
.menuItem {
  padding: 0 15px;
  text-decoration: none;
  color: #fff;
  font-weight: 900;
  font-size: 15px;
}
.loading {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-image: url(./assets/loading.jpg);
  background-size: cover;
  filter: blur(50px);
  z-index: 100;
}
.progress {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 101;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 20px;
  color: #fff;
}
.progress > img {
  padding: 0 15px;
}

/* .title {
  width: 380px;
  height: 40px;
  position: fixed;
  right: 100px;
  top: 50px;
  background-color: rgba(0, 0, 0, 0.5);
  line-height: 40px;
  text-align: center;
  color: #fff;
  border-radius: 5px;
  z-index: 110;
} */
.pages {
  display: flex;
  flex-direction: column;
  position: fixed;
  top: 0;
  left: 0;
}
.pages .page {
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  color: #fff;
  padding: 15%;
  box-sizing: border-box;
}
.pages .page .title {
  font-size: 50px;
  font-weight: 900;
  margin-bottom: 20px;
}
.pages .page p {
  font-size: 25px;
}
</style>
