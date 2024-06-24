import '../style.css'

import * as THREE from 'three'
import gsap from 'gsap'

// 导入轨道控制器
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

// 导入gltf加载器
import { GLTFLoader } from 'three/examples/jsm/loaders/gltfloader'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'
// hdr加载器
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader'
import { Water } from 'three/examples/jsm/objects/Water2'

// 场景
const scene = new THREE.Scene()

// 创建照相机
const camera = new THREE.PerspectiveCamera(
  75,   // 视角
  window.innerWidth / window.innerWidth,
  0.1,  // 近平面
  1000  // 远平面
)
camera.position.set(-3.23, 2.98, 4.06)
camera.lookAt(0, 0, 0)

// 渲染器
const renderer = new THREE.WebGLRenderer({
  antialias: true, // 设置抗锯齿
})
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)
// 设置色调映射
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.toneMapping = THREE.ACESFilmicToneMapping
renderer.toneMappingExposure = 0.5
// 渲染器允许阴影
renderer.shadowMap.enabled = true

// 控制器
const controls = new OrbitControls(camera, renderer.domElement)
controls.target.set(-8, 2, 0)
controls.enableDamping = true // 设置带阻尼惯性

// 坐标助手 红色代表 X 轴. 绿色代表 Y 轴. 蓝色代表 Z 轴.
const axesHelper = new THREE.AxesHelper(5)
scene.add(axesHelper)

const gltfLoader = new GLTFLoader()
// 实例化加载器draco
const dracoLoader = new DRACOLoader() 
dracoLoader.setDecoderPath('/draco/')
gltfLoader.setDRACOLoader(dracoLoader)

// 加载背景
const rgbeLoader = new RGBELoader()
rgbeLoader.load('/textures/sky.hdr', envMap => {
  // 设置球形贴图
  envMap.mapping = THREE.EquirectangularReflectionMapping
  scene.background = envMap
  scene.environment = envMap
})

// 加载水面
const waterGeometry = new THREE.CircleGeometry(300, 32)
const water = new Water(waterGeometry, {
  textureWidth: 1024,
  textureHeight: 1024,
  color: 0xeeeeff,
  flowDirection: new THREE.Vector2(1, 1),
  scale: 100
})
water.rotation.x = -Math.PI / 2
water.position.y = -0.4
scene.add(water)

gltfLoader.load('/model/scene.glb', gltf => {
  gltf.scene.traverse(child => {
    if (child.name === 'Plane') child.visible = false

    if (child.isMesh) {
      child.castShadow = true
      child.receiveShadow = true
    }
  })
  scene.add(gltf.scene)
})

// 添加平行光
const light = new THREE.DirectionalLight(0xffffff, 1)
light.position.set(0, 50, 0)
scene.add(light)

// 添加屋内-点光源
const pointLight = new THREE.PointLight(0xffffff, 100)
pointLight.position.set(0.5, 2.3, 0)
pointLight.castShadow = true
scene.add(pointLight)

// 创建点光源组
const pointLightGroup = new THREE.Group()
pointLightGroup.position.set(-8, 2.5, -1.5)
let pointLightArr = []
let radius = 3
for (let i = 0; i < 3; i++) {
  let ball = new THREE.Mesh(
    new THREE.SphereGeometry(.2, 16, 16),
    new THREE.MeshStandardMaterial({ 
      color: 0xffffff,
      emissive: 0xffffff,
      emissiveIntensity: 10
    })
  )
  ball.position.set(
    radius * Math.cos((i * 2 * Math.PI) / 3),
    Math.cos((i * 2 * Math.PI) / 3),
    radius * Math.sin((i * 2 * Math.PI) / 3)
  )
  pointLightArr.push(ball)

  let pointLight = new THREE.PointLight(0xffffff, 10)
  ball.add(pointLight)
  pointLightGroup.add(ball)
}
scene.add(pointLightGroup)

// 使用补间函数，从0到2Π，使灯泡旋转
let options = { angle: 0 }
gsap.to(options, {
  angle: Math.PI * 2,
  duration: 10,
  repeat: -1,
  ease: 'linear',
  onUpdate: () => {
    pointLightGroup.rotation.y = options.angle
    pointLightArr.forEach((item, i) => {
      item.position.set(
        radius * Math.cos((i * 2 * Math.PI) / 3),
        Math.cos((i * 2 * Math.PI) / 3 + options.angle * 5),
        radius * Math.sin((i * 2 * Math.PI) / 3)
      )
    })
  }
})

// 渲染
function animate() {
  requestAnimationFrame(animate)
  // 渲染
  renderer.render(scene, camera)
  controls.update()
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

// 使用补间动画移动相机
let timeLine1 = gsap.timeline()
let timeLine2 = gsap.timeline()

// 定义相机移动函数
function translateCamera(position, target) {
  timeLine1.to(camera.position, {
    x: position.x,
    y: position.y,
    z: position.z,
    duration: 1,
    ease: 'power2.inOut'
  })
  timeLine2.to(controls.target, {
    x: target.x,
    y: target.y,
    z: target.z,
    duration: 1,
    ease: 'power2.inOut'
  })
}

let scenes = [
  {
    text: '圣诞快乐',
    callback: () => {
      // 执行函数切换位置
      translateCamera(
        new THREE.Vector3(-3.23, 3, 4.06), 
        new THREE.Vector3(-8, 2, 0)
      )
    }
  },
  {
    text: '新年快乐',
    callback: () => {
      // 执行函数切换位置
      translateCamera(
        new THREE.Vector3(-7, 0, 23), 
        new THREE.Vector3(0, 0, 0)
      )
    }
  },
  {
    text: '除夕快乐',
    callback: () => {
      // 执行函数切换位置
      translateCamera(
        new THREE.Vector3(10, 3, 0),
        new THREE.Vector3(5, 2, 0), 
      )
      
    }
  },
  {
    text: '元宵快乐',
    callback: () => {
      // 执行函数切换位置
      translateCamera(
        new THREE.Vector3(7, 0, 23),
        new THREE.Vector3(0, 0, 0), 
      )
      makeHeart()
      
    }
  },
  {
    text: '元宵快乐2',
    callback: () => {
      // 执行函数切换位置
      translateCamera(
        new THREE.Vector3(-20, 1.3, 6.6),
        new THREE.Vector3(5, 2, 0), 
      )
      randomStars()
    }
  },
]

let index = 0
let isAnimate = false
window.addEventListener('wheel', e => {
  if (isAnimate) return
  isAnimate = true

  if (e.deltaY > 0) {
    index++;

    if (index > scenes.length - 1) {
      index = 0
    }
  }
  scenes[index].callback()
  setTimeout(() => isAnimate = false, 1000)
})


// 实例化创建满天星星
let starsInstance = new THREE.InstancedMesh(
  new THREE.SphereGeometry(0.1, 32, 32),
  new THREE.MeshStandardMaterial({
    color: 0xffffff,
    emissive: 0xffffff,
    emissiveIntensity: 10,
  }),
  100
)

// 星星随机到天上
let startArr = []
let endArr = []

for(let i = 0; i < 100; i++) {
  let x = Math.random() * 100 - 50;
  let y = Math.random() * 100 - 50;
  let z = Math.random() * 100 - 50;
  startArr.push(new THREE.Vector3(x, y, z))

  let matrix = new THREE.Matrix4()
  matrix.setPosition(x, y, z)
  starsInstance.setMatrixAt(i, matrix)
}

scene.add(starsInstance)

// 创建爱心路径
let heartShape = new THREE.Shape()
heartShape.moveTo(25, 25);
heartShape.bezierCurveTo(25, 25, 20, 0, 0, 0);
heartShape.bezierCurveTo(-30, 0, -30, 35, -30, 35);
heartShape.bezierCurveTo(-30, 55, -10, 77, 25, 95);
heartShape.bezierCurveTo(60, 77, 80, 55, 80, 35);
heartShape.bezierCurveTo(80, 35, 80, 0, 50, 0);
heartShape.bezierCurveTo(35, 0, 25, 25, 25, 25);
// scene.add(heartShape)
let center = new THREE.Vector3(0, 2, 10)
for(let i = 0; i < 100; i++) {
  let point = heartShape.getPoint(i / 100)
  endArr.push(new THREE.Vector3(
    point.x * 0.1 + center.x, 
    point.y * 0.1 + center.y, 
    center.z
  ))
}

// 创建爱心动画
function makeHeart() {
  let params = {
    time: 0
  }

  gsap.to(params, {
    time: 1,
    duration: 1,
    onUpdate: () => {
      for(let i = 0; i < 100; i++) {
        let x = startArr[i].x + (endArr[i].x - startArr[i].x) * params.time;
        let y = startArr[i].y + (endArr[i].y - startArr[i].y) * params.time;
        let z = startArr[i].z + (endArr[i].z - startArr[i].z) * params.time;
        let matrix = new THREE.Matrix4()
        matrix.setPosition(x, y, z)
        starsInstance.setMatrixAt(i, matrix)
      }
      starsInstance.instanceMatrix.needsUpdate = true
    }
  })
}

function randomStars() {
  let params = {
    time: 0
  }

  gsap.to(params, {
    time: 1,
    duration: 1,
    onUpdate: () => {
      for(let i = 0; i < 100; i++) {
        let x = endArr[i].x + (startArr[i].x - endArr[i].x) * params.time;
        let y = endArr[i].y + (startArr[i].y - endArr[i].y) * params.time;
        let z = endArr[i].z + (startArr[i].z - endArr[i].z) * params.time;
        let matrix = new THREE.Matrix4()
        matrix.setPosition(x, y, z)
        starsInstance.setMatrixAt(i, matrix)
      }
      starsInstance.instanceMatrix.needsUpdate = true
    }
  })
}