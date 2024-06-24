<script setup>
import { onMounted, ref } from 'vue'

import * as THREE from 'three'
// 导入轨道控制器
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

// 导入gltf加载器
import { GLTFLoader } from 'three/examples/jsm/loaders/gltfloader'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'
// import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader'

import vertexShader from './shader/vertexShader.glsl?raw'
import fragmentShader from './shader/fragmentShader.glsl?raw'

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
camera.position.set(0, 5, 10)

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

// 环境光
const ambientLight = new THREE.AmbientLight(0xffffff, 1)
scene.add(ambientLight)

// 平行光1
const directionLight1 = new THREE.DirectionalLight(0xffffff, 0.5)
directionLight1.position.set(1, 10, 1)
scene.add(directionLight1)
// 平行光2
const directionLight2 = new THREE.DirectionalLight(0xffffff, 0.5)
directionLight2.position.set(-1, -1, -1)
scene.add(directionLight2)

let mixer, dd, els, wkl, path;
let curvePath;

const gltfLoader = new GLTFLoader()
// 实例化加载器draco
const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath('/draco/')
gltfLoader.setDRACOLoader(dracoLoader)
gltfLoader.load('/assets/ew8.glb', gltf => {

  els = gltf.scene.children[0]
  path = gltf.scene.children[2]
  wkl = gltf.scene.children[1]
  dd = gltf.scene.children[3]

  scene.add(els, wkl, dd)

  // 根据点创建曲线
  const points = []
  for (let i = path.geometry.attributes.position.count - 1; i >= 0; i--) {
    points.push(
      new THREE.Vector3(
        path.geometry.attributes.position.array[i * 3],
        path.geometry.attributes.position.array[i * 3 + 1],
        path.geometry.attributes.position.array[i * 3 + 2],
      )
    )
  }
  curvePath = new THREE.CatmullRomCurve3(points)
})

/* // 创建平面添加到场景中
const planeGeometry = new THREE.PlaneGeometry(2, 2)
const planeMaterial = new THREE.ShaderMaterial({
  uniforms: {
    iResolution: {
      value: new THREE.Vector2(window.innerWidth, window.innerHeight),
    },
    iTime: {
      value: 0,
    },
    iChannel0: {
      value: new THREE.TextureLoader().load("/assets/ichannel0.png"),
    },
    iChannel1: {
      value: new THREE.TextureLoader().load("/assets/ichannel1.png"),
    },
    iChannel2: {
      value: new THREE.TextureLoader().load("/assets/ichannel2.png"),
    },
    iMouse: {
      value: new THREE.Vector2(0, 0),
    },
  },
  vertexShader: vertexShader,
  fragmentShader: fragmentShader,
  transparent: true,
  blending: THREE.AdditiveBlending,
  side: THREE.DoubleSide
})
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
scene.add(plane); */

const params = {
  iTime: {
    value: 0
  }
}
const spriteMaterial = new THREE.SpriteMaterial({
  color: 0xffffff,
  blending: THREE.AdditiveBlending
})
spriteMaterial.onBeforeCompile = shader => {
  shader.uniforms.iResolution = {
    value: new THREE.Vector2(window.innerWidth, window.innerHeight),
  }
  shader.uniforms.iTime = params.iTime
  shader.uniforms.iChannel0 = {
    value: new THREE.TextureLoader().load('/assets/iChannel0.png')
  }
  shader.uniforms.iChannel1 = {
    value: new THREE.TextureLoader().load('/assets/iChannel1.png')
  }
  shader.uniforms.iChannel2 = {
    value: new THREE.TextureLoader().load('/assets/iChannel2.png')
  }
  shader.uniforms.iMouse = { value: new THREE.Vector2(0, 0) }

  shader.vertexShader = shader.vertexShader.replace(
    "#include <common>",
    `
    #include <common>
    varying vec2 vUv;
    `
  );
  shader.vertexShader = shader.vertexShader.replace(
    "#include <uv_vertex>",
    `
    #include <uv_vertex>
    vUv = uv;
    `
  );
  shader.fragmentShader = fragmentShader;
}
const sprite = new THREE.Sprite(spriteMaterial)
sprite.position.set(-5.5, 0.8, 0)
// scene.add(sprite)

// 添加声音
const listener = new THREE.AudioListener()
const sound = new THREE.Audio(listener)
new THREE.AudioLoader().load('/assets/bomb.mp3', buffer => {
  sound.setBuffer(buffer)
  sound.setVolume(0.3)
})

const clock = new THREE.Clock()
// 渲染
const animate = () => {
  // 每次消耗时间
  const delay = clock.getDelta()
  // 总共消耗时间
  const time = clock.getElapsedTime()
  // t 为 0 ~ 5 秒
  let t = time % 5
  // t 为 0 ~ 1 秒
  t /= 5;

  if (curvePath) {
    // getPointAt 曲线上的位置。必须在[0,1]范围内
    const point = curvePath.getPointAt(t);
    // 通过point设置模型dd的位置
    // 获取点的切线 
    // 返回t处的单位向量切线。如果派生曲线未实现其 切线求导，将使用相距一个小三角形的两个点来求与其实际梯度的近似值
    // const tangent = curvePath.getTangentAt(t)
    dd.position.set(point.x, point.y, point.z)
    // 设置模型的朝向
    if (t + 0.01 < 1) {
      const point1 = curvePath.getPointAt(t + 0.01)
      dd.lookAt(point1)
    }

    if (t > 0.95) {
      scene.add(sprite)
      if (!sound.isPlaying) {
        sound.play()
      }
    }
  }

  params.iTime.value = t * 10;

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
