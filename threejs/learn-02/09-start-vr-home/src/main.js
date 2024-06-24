import '../style.css'
//morph
// 变形动画 - 花苗到开花的过程

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

import gsap from 'gsap'

// 场景
const scene = new THREE.Scene()


// 创建相机
const camera = new THREE.PerspectiveCamera(
  75,   // 视角
  window.innerWidth / window.innerWidth,
  0.1,  // 近平面
  1000  // 远平面
)
// 设置相机位置
camera.position.set(0, 0, 0)


// 场景渲染器
const renderer = new THREE.WebGLRenderer({
  antialias: true,
  alpha: true
})
// renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)
renderer.shadowMap.enabled = true;

// 更新摄像头
camera.aspect = window.innerWidth / window.innerHeight;
//   更新摄像机的投影矩阵
camera.updateProjectionMatrix();
//   更新渲染器
renderer.setSize(window.innerWidth, window.innerHeight);
//   设置渲染器的像素比
renderer.setPixelRatio(window.devicePixelRatio);
// renderer.physicallyCorrectLights = true
// ------------------------------------

// 坐标辅助器
const axesHelper = new THREE.AxesHelper(5)
scene.add(axesHelper)

// 控制器
// const controls = new OrbitControls(camera, renderer.domElement)
// // 设置带阻尼的惯性
// controls.enableDamping = true
/* 
const rgbeLoader = new RGBELoader()
rgbeLoader.load("/textures/038.hdr", texture => {
  texture.mapping = THREE.EquirectangularReflectionMapping
  scene.background = texture
  scene.environment = texture
})

let gltfLoader = new GLTFLoader()

const dracoLoader = new DRACOLoader()
// 设置draco路径
dracoLoader.setDecoderPath('/draco/')
// 设置gltf加载器draco解码器
gltfLoader.setDRACOLoader(dracoLoader)

gltfLoader.load('/model/f4.glb', gltf => {
  scene.add(gltf.scene)
}) */

let otherDom = document.querySelector('.other')
otherDom.innerHTML = `
  <div class="map">
    <div class="tag"></div>
    <img src="/img/assets/map.gif" alt="" />
  </div>

  <div class="mask-wrap">
    <div class="loading"></div>
    <div class="progress">
      <img src="/img/assets/loading.gif" alt="" />
      <span id="p-val">新房奔跑中：0%</span>
    </div>
    <div class="title">VR全景看房</div>
  </div>
`;
let pValDom = otherDom.querySelector('#p-val')


let tagDom = document.querySelector('.tag')
tagDom.style.cssText = `transform: translate(100px, 110px)`;

function moveTag(name) {
  let positions = {
    '客厅': [100, 110],
    '厨房': [180, 190],
    '阳台': [50, 50],
  }
  if (positions[name]) {
    gsap.to(tagDom, {
      duration: 0.5, 
      x: positions[name][0],
      y: positions[name][1],
      ease: "power3.inOut",
    })
  }
}

// -------------------------------------------------------------------------

let isMouseDown = false;

document.body.addEventListener('mousedown', () => isMouseDown = true, false)
document.body.addEventListener('mouseup', () => isMouseDown = false, false)
document.body.addEventListener('mouseout', () => isMouseDown = false, false)
document.body.addEventListener('mousemove', (event) => {
  if (isMouseDown) {
    camera.rotation.y += event.movementX * 0.002;
    camera.rotation.x += event.movementY * 0.002;
    camera.rotation.order = 'YXZ'
  }

}, false)


const textureLoader = new THREE.TextureLoader()

class Room {
  constructor(
    name, 
    roomIndex, 
    textureUrl, 
    position = new THREE.Vector3(0, 0, 0),
    euler = new THREE.Euler(0, 0, 0)
  ) {
    this.name = name;

    const geometry = new THREE.BoxGeometry(10, 10, 10)
    geometry.scale(1, 1, -1)

    let arr = [
      `${roomIndex}_l`,
      `${roomIndex}_r`,
      `${roomIndex}_u`,
      `${roomIndex}_d`,
      `${roomIndex}_b`,
      `${roomIndex}_f`,
    ]
    let boxMaterial = [];
    arr.forEach(text => {
      const texture = textureLoader.load(textureUrl + text + '.jpg')
      if (text == `${roomIndex}_d` || text == `${roomIndex}_u`) {
        texture.rotation = Math.PI
        texture.center = new THREE.Vector2(0.5, 0.5)
      }
      boxMaterial.push(
        new THREE.MeshBasicMaterial({
          map: texture,
          transparent: true,
          // opacity: 0.8,
          depthWrite: true,
          depthTest: true,
        })
      )
    })
    let cube = new THREE.Mesh(geometry, boxMaterial)
    cube.position.copy(position)
    cube.rotation.copy(euler)
    scene.add(cube)
  }
}

class SpritText {
  constructor(text, position) {
    this.callbacks = []

    const canvas = document.createElement('canvas')
    canvas.width = 1024
    canvas.height = 1024
    const context = canvas.getContext('2d')
    context.fillStyle = 'rgba(100, 100, 100, 0.7)'
    context.fillRect(0, 256, 1024, 512)
    context.textAlign = 'center'
    context.textBaseline = 'middle'
    context.font = 'bold 200px Arial'
    context.fillStyle = 'white'
    context.fillText(text, 512, 512)

    const material = new THREE.SpriteMaterial({
      map: new THREE.CanvasTexture(canvas),
      transparent: true,
      depthWrite: true
    })
    const sprite = new THREE.Sprite(material)
    sprite.scale.set(0.5, 0.5, 0.5)
    sprite.position.copy(position)
    
    this.sprite = sprite
    sprite.renderOrder = 1
    scene.add(sprite)

    let mouse = new THREE.Vector2()
    let raycaster = new THREE.Raycaster()
    window.addEventListener('click', (event) => {
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
      raycaster.setFromCamera(mouse, camera)
      let intersects = raycaster.intersectObject(sprite)

      if (intersects.length > 0) {
        this.callbacks.forEach((callback) => {
          callback();
        });
      }
    })
  }

  onClick(callback) {
    this.callbacks.push(callback)
  }
}

// 创建客厅
let liveroomPosition = new THREE.Vector3(0, 0, 0)
let liveroom = new Room('客厅', 0, '/img/livingroom/', liveroomPosition)

// 创建厨房
let kitchenPosition = new THREE.Vector3(-5, 0, -10)
let kitchenEuler = new THREE.Euler(0, -Math.PI / 2, 0)
let kitchen = new Room('厨房', 3, '/img/kitchen/', kitchenPosition, kitchenEuler)

// 创建客厅到厨房精灵文字
let kitchenTextPosition = new THREE.Vector3(-1, 0, -3)
let kitchenText = new SpritText('厨房', kitchenTextPosition)
kitchenText.onClick(() => {
  // 让相机移动到厨房
  gsap.to(camera.position, {
    duration: 1,
    x: kitchenPosition.x,
    y: kitchenPosition.y,
    z: kitchenPosition.z,
  })
  moveTag('厨房')
})

// 创建厨房回客厅精灵文字
let kitchenBackTextPosition = new THREE.Vector3(-4, 0, -6)
let kitchenBackText = new SpritText('客厅', kitchenBackTextPosition)
kitchenBackText.onClick(() => {
  // 让相机移动到客厅
  gsap.to(camera.position, {
    duration: 1,
    x: liveroomPosition.x,
    y: liveroomPosition.y,
    z: liveroomPosition.z,
  })
  moveTag('客厅')
})

// 创建阳台
let balconyPosition = new THREE.Vector3(0, 0, 15)
// let balconyEuler = new THREE.Euler(0, -Math.PI / 2, 0)
let balcony = new Room('阳台', 8, '/img/balcony/', balconyPosition)

// 创建到阳台的精灵文字
let balconyTextPosition = new THREE.Vector3(0, 0, 3)
let balconyText = new SpritText('阳台', balconyTextPosition)
balconyText.onClick(() => {
  // 让相机移动到阳台
  gsap.to(camera.position, {
    duration: 1,
    x: balconyPosition.x,
    y: balconyPosition.y,
    z: balconyPosition.z,
  })
  moveTag('阳台')
})

// 创建阳台返回客厅的精灵文字
let balconyBackTextPosition = new THREE.Vector3(-1, 0, 11)
let balconyBackText = new SpritText('客厅', balconyBackTextPosition)
balconyBackText.onClick(() => {
  // 让相机移动到客厅
  gsap.to(camera.position, {
    duration: 1,
    x: liveroomPosition.x,
    y: liveroomPosition.y,
    z: liveroomPosition.z,
  })
  moveTag('客厅')
})


THREE.DefaultLoadingManager.onProgress = (item, loaded, total) => {
  let progress = new Number((loaded / total) * 100)
  // otherDom
  pValDom.innerHTML = `新房奔跑中：${progress.toFixed(2)}%`

  if (progress >= 100) {
    otherDom.querySelector('.mask-wrap').remove()
  }
}

// 设置时钟
const clock = new THREE.Clock()

function animate() {
  let deltaTime = clock.getElapsedTime()

  requestAnimationFrame(animate)
  // 渲染
  renderer.render(scene, camera)

  // controls.update()
}

animate()



// 监听窗口变化
window.addEventListener('resize', () => {
  // 更新摄像头
  camera.aspect = window.innerWidth / window.innerHeight;
  //   更新摄像机的投影矩阵
  camera.updateProjectionMatrix();
  //   更新渲染器
  renderer.setSize(window.innerWidth, window.innerHeight);
  //   设置渲染器的像素比
  renderer.setPixelRatio(window.devicePixelRatio);
})

// 创建GUI
// const gui = new GUI();

