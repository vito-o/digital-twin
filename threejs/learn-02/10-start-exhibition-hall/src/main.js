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

import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass'
import { SMAAPass } from 'three/examples/jsm/postprocessing/SMAAPass'

import gsap from 'gsap'

import SpriteCanvas from './SpriteCanvas'

let otherDom = document.querySelector('.other')
otherDom.innerHTML = `
  <div class="mask-wrap">
    <div class="loading"></div>
    <div class="progress">
      <img src="/img/assets/loading.gif" alt="" />
      <span id="p-val">加载中：0%</span>
    </div>
  </div>
`;
let pValDom = otherDom.querySelector('#p-val')

// 场景
const scene = new THREE.Scene()
scene.background = new THREE.Color(0xcccccc)


// 创建相机
const camera = new THREE.PerspectiveCamera(
  45,   // 视角
  window.innerWidth / window.innerWidth,
  0.000001,  // 近平面
  10000  // 远平面
)
// 设置相机位置
camera.position.set(0, 1.5, 12)
// 更新摄像头
camera.aspect = window.innerWidth / window.innerHeight;
// 更新摄像机的投影矩阵
camera.updateProjectionMatrix();


// 场景渲染器
const renderer = new THREE.WebGLRenderer({
  antialias: true,
  logarithmicDepthBuffer: true,  //告诉Three.js使用对数深度缓冲来提高远处物体的深度精度，从而改善渲染质量
  physicallyCorrectLights: true, //正确的物理光照
})
// 更新渲染器
renderer.setSize(window.innerWidth, window.innerHeight);
// 设置渲染器的像素比
renderer.setPixelRatio(window.devicePixelRatio);

renderer.ouputEncoding = THREE.sRGBEncoding;
renderer.toneMapping = THREE.ACESFilmicToneMapping
renderer.toneMappingExposure = 2  //设置曝光度
// Three.js会在渲染前对场景中的所有物体进行排序。这种排序通常基于相机和物体之间的距离，以优化渲染顺序，从而提高渲染性能。
renderer.sortObjects = true;
document.body.appendChild(renderer.domElement)

// 坐标辅助器
// const axesHelper = new THREE.AxesHelper(5)
// scene.add(axesHelper)

// 控制器
// const controls = new OrbitControls(camera, renderer.domElement)
// controls.enableDamping = true // 设置带阻尼的惯性


// 合成效果
const effectComposer = new EffectComposer(renderer)
effectComposer.setSize(window.innerWidth, window.innerHeight)
// 添加渲染通道
const renderPass = new RenderPass(scene, camera)
effectComposer.addPass(renderPass)
// 抗锯齿
const sMAAPass = new SMAAPass()
effectComposer.addPass(sMAAPass)
// ------------------------------------

const textrueLoader = new THREE.TextureLoader()
let envMapBg = textrueLoader.load('/assets/textures/bl.jpg')
envMapBg.mapping = THREE.EquirectangularRefractionMapping
envMapBg.anisotropy = 16;
envMapBg.format = THREE.RGBAFormat;
scene.background = envMapBg
scene.environment = envMapBg


let gltfLoader = new GLTFLoader()
const dracoLoader = new DRACOLoader()
// 设置draco路径
dracoLoader.setDecoderPath('/draco/')
// 设置gltf加载器draco解码器
gltfLoader.setDRACOLoader(dracoLoader)

gltfLoader.load('/model/exhibition-min1.glb', gltf => {
  let floorArr = [];
  gltf.scene.traverse(child => {
    if (child.isLight) {
      child.intensity = 1
    }

    if (child.isMesh && child.material.name.indexOf("Glass") !== -1) {
      child.geometry.computeVertexNormals();
      const cubeMaterial3 = new THREE.MeshPhongMaterial({
        color: 0xffffff,
        envMap: scene.environment,
        refractionRatio: 0.99,
        reflectivity: 0.99,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.6,
      })
      child.material = cubeMaterial3
    }

    if (child.isMesh && child.material.name.indexOf("Floor") !== -1) {
      child.material = new THREE.MeshBasicMaterial({
        map: child.material.map
      })
      floorArr.push(child);
    }
  })

  scene.add(gltf.scene);


  const raycaster = new THREE.Raycaster()
  const mouse = new THREE.Vector2();

  const geometry = new THREE.SphereGeometry(0.2, 32, 32)
  const material = new THREE.MeshBasicMaterial({
    color: 0xff3333,
    side: THREE.DoubleSide,
    transparent: true,
  })
  const plane = new THREE.Mesh(geometry, material)
  scene.add(plane)

  document.addEventListener('mousemove', e => {
    mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;

    plane.visible = false

    raycaster.setFromCamera(mouse, camera)
    let intersects = raycaster.intersectObjects(floorArr)
    if (intersects.length > 0) {
      plane.visible = true
      plane.position.copy(intersects[0].point)
    }
  })

})


// 添加灯光
const ambientLight = new THREE.AmbientLight(0xffffff, 1)
scene.add(ambientLight)

const light1 = new THREE.DirectionalLight(0xffffff, 0.3)
light1.position.set(0, 10, 10)
const light2 = new THREE.DirectionalLight(0xffffff, 0.3)
light2.position.set(0, 10, -10)
const light3 = new THREE.DirectionalLight(0xffffff, 0.8)
light3.position.set(10, 10, 10)
light1.castShadow = true
light2.castShadow = true
light3.castShadow = true
scene.add(light1, light2, light3)


let isKeyDown = false;
document.addEventListener('mousedown', () => {isKeyDown = true})
document.addEventListener('mouseup', () => {isKeyDown = false})
document.addEventListener('mouseout', () => {isKeyDown = false})
document.addEventListener('mousemove', (e) => {
  if (isKeyDown) {
    camera.rotation.y += e.movementX * 0.002
    camera.rotation.x += e.movementY * 0.002
    camera.rotation.order = 'YXZ'    
  }
})


let clickFn = (event, mesh) => {
  gsap.to(camera.position, {
    x: event.intersects[0].point.x,
    z: event.intersects[0].point.z,
    y: event.intersects[0].point.y + 1,
    duration: 1,
    onComplete() {
      camera.lookAt(0, 0, 0);
    }
  });
};

const texture = new THREE.TextureLoader().load('/textures/effect/jj.png')
texture.magFilter = THREE.NearestFilter
texture.minFilter = THREE.NearestFilter
let plane = new THREE.CircleGeometry(1, 32)
let material = new THREE.MeshBasicMaterial({
  map: texture,
  alphaMap: texture,
  side: THREE.DoubleSide
})


let mesh1 = new THREE.Mesh(plane, material)
mesh1.position.set(-12, -1, 4)
mesh1.rotation.x = -Math.PI / 2;
scene.add(mesh1)

let spriteText1 = addSpriteText(
  '展馆中庭', 
  new THREE.Vector3(-12, 0, 4), 
);
spriteText1.onClick((e) => clickFn(e, mesh1))


let mesh2 = new THREE.Mesh(plane, material)
mesh2.position.set(-7, -1, 9)
mesh2.rotation.x = -Math.PI / 2;
scene.add(mesh2)

let spriteText2 = addSpriteText(
  '黄金展品', 
  new THREE.Vector3(-7, 0, 9), 
);
spriteText2.onClick((e) => clickFn(e, mesh2))


let mesh3 = new THREE.Mesh(plane, material)
mesh3.position.set(-12, -1, -5)
mesh3.rotation.x = -Math.PI / 2;
scene.add(mesh3)

let spriteText3 = addSpriteText(
  '科技纽带', 
  new THREE.Vector3(-12, 0, -5), 
);
spriteText3.onClick((e) => clickFn(e, mesh3))


let mesh4 = new THREE.Mesh(plane, material)
mesh4.position.set(2, -1, 4)
mesh4.rotation.x = -Math.PI / 2;
scene.add(mesh4)

let spriteText4 = addSpriteText(
  '球形战机', 
  new THREE.Vector3(2, 0, 4), 
);
spriteText4.onClick((e) => clickFn(e, mesh4))


THREE.DefaultLoadingManager.onProgress = (item, loaded, total) => {
  let progress = new Number((loaded / total) * 100)
  pValDom.innerHTML = `加载中：${progress.toFixed(2)}%`
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
  effectComposer.render()

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


function addSpriteText(text, position) {
  let spriteText = new SpriteCanvas(camera, text, position)
  scene.add(spriteText.mesh)
  return spriteText
}