import '../style.css'
//打造3d全屏滚动官网

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
  45,   // 视角
  window.innerWidth / window.innerWidth,
  0.1,  // 近平面
  1000  // 远平面
)
// 设置相机位置
camera.position.set(0, 0, 18)

// 场景渲染器
const renderer = new THREE.WebGLRenderer({
  antialias: true,
  alpha: true
})
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)
renderer.shadowMap.enabled = true;
renderer.physicallyCorrectLights = true
// ------------------------------------

// 坐标辅助器
// const axesHelper = new THREE.AxesHelper(5)
// scene.add(axesHelper)

// 控制器
// const controls = new OrbitControls(camera, renderer.domElement)
// // 设置带阻尼的惯性
// controls.enableDamping = true


// const textureLoader = new THREE.TextureLoader()

// 添加一千个立方体
const cubeGeometry = new THREE.BoxGeometry(2, 2, 2)
const cubeMaterial = new THREE.MeshBasicMaterial({ wireframe: true })
const redMaterial = new THREE.MeshBasicMaterial({color: '#ff0000'})

let cubeArr = []
let cubeGroup = new THREE.Group()

for(let i= 0; i < 5; i++) {
  for(let j= 0; j < 5; j++) {
    for(let k= 0; k < 5; k++) {
      const cube = new THREE.Mesh(cubeGeometry, cubeMaterial)
      cube.position.set(i * 2 - 4, j * 2 - 4, k * 2 - 4)
      cubeGroup.add(cube)
      cubeArr.push(cube)
    }
  }  
}
scene.add(cubeGroup)

// 创建三角形酷炫物体
let sjxGroup = new THREE.Group()
for(let i = 0; i < 50; i++) {
  const geometry = new THREE.BufferGeometry()
  const positionArray = new Float32Array(9)
  for(let j = 0; j < 9; j++) {
    if (j % 3 == 1) {
      positionArray[j] = Math.random() * 10 - 5
    } else {
      positionArray[j] = Math.random() * 10 - 5
    }
  }
  geometry.setAttribute('position', new THREE.BufferAttribute(positionArray, 3))
  let color = new THREE.Color(Math.random(), Math.random(), Math.random())
  let material = new THREE.MeshBasicMaterial({
    color: color,
    transparent: true,
    opacity: 0.5,
    side: THREE.DoubleSide
  })
  let sjxMesh = new THREE.Mesh(geometry, material)
  sjxGroup.add(sjxMesh)
}
sjxGroup.position.set(0, -30, 0)
scene.add(sjxGroup)

// 弹跳小球
const sphereGroup = new THREE.Group();
const sphereGeometry = new THREE.SphereGeometry(1, 20, 20)
const sphererMaterial = new THREE.MeshStandardMaterial({side: THREE.DoubleSide})
const sphere = new THREE.Mesh(sphereGeometry, sphererMaterial)
sphere.castShadow = true
sphereGroup.add(sphere)

// 弹跳小球-平面
const planeGeometry = new THREE.PlaneGeometry(20, 20)
const plane = new THREE.Mesh(planeGeometry, sphererMaterial)
plane.position.set(0, -1, 0)
plane.rotation.x = -Math.PI / 2
plane.receiveShadow = true
sphereGroup.add(plane)

// 弹跳小球-灯光
const light = new THREE.AmbientLight(0xffffff, 1)
sphereGroup.add(light)

const smallBall = new THREE.Mesh(
  new THREE.SphereGeometry(0.1, 20, 20),
  new THREE.MeshBasicMaterial({color: 0xff0000})
)
smallBall.position.set(2, 2, 2)

// 点光源
const pointLight = new THREE.PointLight(0xff0000, 3)
pointLight.castShadow = true
// pointLight.shadow.radius = 20
// pointLight.shadow.mapSize.set(512, 512)
// pointLight.decay = 0
smallBall.add(pointLight)
sphereGroup.add(smallBall)

sphereGroup.position.set(0, -60, 0)
scene.add(sphereGroup)

let arrGroup = [cubeGroup, sjxGroup, sphereGroup]

// 创建投影射线对象
const raycaster = new THREE.Raycaster()
// 鼠标的位置对象
const mouse = new THREE.Vector2()

// 监听鼠标位置
window.addEventListener('mousemove', e => {
  mouse.x = e.clientX / window.innerWidth - 0.5
  mouse.y = e.clientY / window.innerHeight - 0.5
})

// 监听鼠标点击位置
window.addEventListener('click', e => {
  mouse.x = (e.clientX / window.innerWidth) * 2 - 1
  mouse.y = -((e.clientY / window.innerHeight) * 2 - 1)

  raycaster.setFromCamera(mouse, camera)
  let result = raycaster.intersectObjects(cubeArr)
  result.forEach(item => item.object.material = redMaterial)
})



// 设置时钟
const clock = new THREE.Clock()

function animate() {
  let deltaTime = clock.getDelta()
  // console.log(deltaTime)

  camera.position.y = -(window.scrollY / window.innerHeight) * 30
  // camera.position.x += (mouse.x * 10 - camera.position.x) * deltaTime * 5
  // console.log(mouse.x * 10, '\t', camera.position.x, '\t', (mouse.x * 10 - camera.position.x) * deltaTime * 5)
  camera.position.x += (mouse.x * 10 - camera.position.x) * deltaTime * 5
  // console.log(camera.position.x)
  requestAnimationFrame(animate)
  // 渲染
  renderer.render(scene, camera)
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


gsap.to(cubeGroup.rotation, {
  x:  '+=' + Math.PI * 2,
  y:  '+=' + Math.PI * 2,
  duration: 12,
  ease: 'power2.inOut',
  repeat: -1
})

gsap.to(sjxGroup.rotation, {
  x:  '-=' + Math.PI * 2,
  y:  '+=' + Math.PI * 2,
  duration: 12,
  ease: 'power2.inOut',
  repeat: -1
})
gsap.to(smallBall.position, {
  x: -3,
  duration: 6,
  ease: 'power2.out',
  repeat: -1,
  yoyo: true
})
gsap.to(smallBall.position, {
  y: 0,
  duration: 0.5,
  ease: 'power2.inOut',
  repeat: -1,
  yoyo: true
})

let currentPage = 0
window.addEventListener('scroll', () => {
  const newPage = Math.round(window.scrollY / window.innerHeight)

  if (newPage != currentPage) {
    currentPage = newPage
    gsap.to(arrGroup[currentPage].rotation, {
      z: '+=' + Math.PI * 2,
      x: '+=' + Math.PI * 2,
      duration: 2,
      onComplete: () => {
        console.log('旋转完成')
      }
    })

    gsap.fromTo(
      `.page${currentPage} h1`,
      { x: -300 },
      { x: 0, rotate: "+=360", duration: 1 }
    );

  }
})