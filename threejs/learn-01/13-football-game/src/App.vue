<script setup>
import { onMounted, ref } from 'vue'

import * as THREE from 'three'
// 导入轨道控制器
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

// 导入gltf加载器
import { GLTFLoader } from 'three/examples/jsm/loaders/gltfloader'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'
// import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader'

import * as CANNON from 'cannon-es'
import gsap from 'gsap'

const screenDomRef = ref()

const percentage = ref(10)

gsap.to(percentage, {
  duration: 1,
  value: 50,
  ease: 'linear',
  repeat: -1,
  onUpdate: () => {
    percentage.value = Math.floor(percentage.value)
  }
})

// 场景
const scene = new THREE.Scene()

// 照相机
const camera = new THREE.PerspectiveCamera(
  75,   // 视角
  window.innerWidth / window.innerWidth,
  0.1,  // 近平面
  100  // 远平面
)
camera.position.set(4, 2, 0)

// 渲染器
const renderer = new THREE.WebGLRenderer({
  antialias: true, // 抗锯齿
  // 对数深度缓冲区
  // logarithmicDepthBuffer: true
})
renderer.setSize(window.innerWidth, window.innerHeight)
// 设置色调映射
renderer.toneMapping = THREE.ACESFilmicToneMapping //电影效果
renderer.toneMappingExposure = 0.5; // 设置亮度为1
renderer.shadowMap.enabled = true

// 坐标助手 红色代表 X 轴. 绿色代表 Y 轴. 蓝色代表 Z 轴.
const axesHelper = new THREE.AxesHelper(15)
scene.add(axesHelper)

// 控制器
const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true // 设置带阻尼惯性

// 环境
const textuelLoader = new THREE.TextureLoader()
textuelLoader.load('/texture/outdoor.jpg', texture => {
  texture.mapping = THREE.EquirectangularReflectionMapping
  scene.background = texture
  scene.environment = texture
  scene.backgroundBlurriness = 0.3
})

// 添加聚光灯
const spotLight = new THREE.SpotLight(0xffffff)
spotLight.position.set(10, 50, 0)
spotLight.castShadow = true
spotLight.intensity = 10
spotLight.decay = 0.3
spotLight.shadow.bias = -0.00008; //减小自阴影
spotLight.shadow.mapSize.width = 2048
spotLight.shadow.mapSize.height = 2048
spotLight.shadow.camera.near = 0.5;
spotLight.shadow.camera.far = 500;
spotLight.shadow.camera.fov = 30;
scene.add(spotLight)

// 初始化物理世界
const world = new CANNON.World()
// 设置重力
world.gravity.set(0, -0.82, 0)

let ball, ballbody;

const gltfLoader = new GLTFLoader()
// 实例化加载器draco
const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath('/draco/')
gltfLoader.setDRACOLoader(dracoLoader)

gltfLoader.load('/model/playground02.glb', gltf => {

  let model = gltf.scene
  console.log(model)
  model.traverse(child => {
    if (child.isMesh && child.name.search(/Solid/) == -1) {
      child.castShadow = true
      child.receiveShadow = true;

      //trimesh类型
      const trimesh = new CANNON.Trimesh(
        child.geometry.attributes.position.array,
        child.geometry.index.array
      )
      // 创建刚体
      const trimeshBody = new CANNON.Body({
        mass: 0,
        shape: trimesh
      })
      // 获取世界位置和旋转给到物理世界
      trimeshBody.position.copy(child.getWorldPosition(new THREE.Vector3()))
      trimeshBody.quaternion.copy(child.getWorldQuaternion(new THREE.Quaternion()))

      world.addBody(trimeshBody)

      //开始球门消失
      if (child.name == 'door') {
        child.material = new THREE.MeshBasicMaterial({
          color: 0xffffff,
          opacity: 0, 
          transparent: true,
        })
      }
    }

    if (child.name == 'Soccer_Ball') {
      ball = child

      // 创建物理世界的球
      const ballShape = new CANNON.Sphere(0.15)
      // 创建刚体
      ballbody = new CANNON.Body({
        mass: 1, //质量
        position: new CANNON.Vec3(0, 5, 0),
        shape: ballShape
      })
      // 添加刚体到物理世界
      world.addBody(ballbody)
    }

    // 延迟两秒后，将球的位置还原
    setTimeout(() => {
      ballbody.position.set(0, 5, 0)
      ballbody.velocity.set(0, 0, 0)
      ballbody.angularVelocity.set(0, 0, 0)
    }, 2000)

  })

  scene.add(model)
})

let clock = new THREE.Clock()
// 渲染
const animate = () => {
  let delta = clock.getDelta() //获取间隔时间
  // 更新物理世界
  world.step(delta)

  if (ball && ballbody) {
    ball.position.copy(ballbody.position)
    // quaternion 表示对象局部旋转的Quaternion（四元数）
    // 在Three.js中，Object3D的quaternion属性是用来表示对象的旋转的一种方式。Quaternion是一种四元数，用于表示三维空间中的旋转。与使用欧拉角或旋转矩阵相比，四元数具有一些优点，特别是在处理旋转时不会出现万向节锁问题（Gimbal Lock），并且在进行插值运算时表现更好。
    ball.quaternion.copy(ballbody.quaternion)
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


let isClick = false
window.addEventListener('click', () => {
  if (isClick) return;

  let p = percentage.value

  ballbody.applyForce(
    new CANNON.Vec3(-5*p*.5, 3*p*.5, (Math.random() - 0.5)*p), //力的大小
    ballbody.position,           //球的位置
  )

  setTimeout(() => {
    isClick = false
    ballbody.position.set(0, 5, 0)
    ballbody.velocity.set(0, 0, 0)
    ballbody.angularVelocity.set(0, 0, 0)
  }, 5000)
})


onMounted(() => {
  screenDomRef.value.appendChild(renderer.domElement)

  animate()
})
</script>

<template>
  <div class="home">
    <h1>力度：{{ percentage }}%</h1>
    <div class="canvas-container" ref="screenDomRef"></div>
  </div>
</template>

<style>
h1{
  position: fixed;
  left: 0;
  top: 0;
  z-index: 10;
}
</style>
