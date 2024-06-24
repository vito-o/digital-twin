import '../style.css'
//修改物理光照材质制作人物被打效果
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
  90,   // 视角
  window.innerWidth / window.innerWidth,
  0.1,  // 近平面
  1000  // 远平面
)
// 设置相机位置
camera.position.set(0, 0, 10)

// 场景渲染器
const renderer = new THREE.WebGLRenderer({
  antialias: true
})
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.shadowMap.enabled = true
// renderer.outputEncoding = THREE.sRGBEncoding
// renderer.toneMapping = THREE.ACESFilmicToneMapping
// renderer.toneMappingExposure = 0.1
document.body.appendChild(renderer.domElement)

// ------------------------------------
// 重置相机宽高比
camera.aspect = window.innerWidth / window.innerHeight
camera.updateProjectionMatrix()
// 重置渲染器宽高比
renderer.setSize(window.innerWidth, window.innerHeight)
// ------------------------------------

// 坐标辅助器
const axesHelper = new THREE.AxesHelper(5)
scene.add(axesHelper)

// 控制器
const controls = new OrbitControls(camera, renderer.domElement)
// 设置带阻尼的惯性
controls.enableDamping = true


const textureLoader = new THREE.TextureLoader()
// 加载模型纹理
const modelTexture = textureLoader.load('models/LeePerrySmith/color.jpg')
// 加载模型的法向纹理
const normalTexture = textureLoader.load('models/LeePerrySmith/normal.jpg')

const customUniforms = {
  uTime: {
    value: 0
  }
}

const material = new THREE.MeshStandardMaterial({
  map: modelTexture,
  normalMap: normalTexture
})
material.onBeforeCompile = shader => {
  shader.uniforms.uTime = customUniforms.uTime
  shader.vertexShader = shader.vertexShader.replace(
    '#include <common>',
    `
    #include <common>

    mat2 rotate2d(float _angle){
      return mat2(cos(_angle),-sin(_angle),
                  sin(_angle),cos(_angle));
    }
    uniform float uTime;
    `
  )

  shader.vertexShader = shader.vertexShader.replace(
    '#include <beginnormal_vertex>',
    `
    #include <beginnormal_vertex>
    float angle = sin(position.y+uTime) *0.5;
    mat2 rotateMatrix = rotate2d(angle);
    objectNormal.xz = rotateMatrix * objectNormal.xz;
    `
  )

  shader.vertexShader = shader.vertexShader.replace(
    '#include <begin_vertex>',
    `
    #include <begin_vertex>
    // float angle = sin(position.y) *0.5;
    // mat2 rotateMatrix = rotate2d(angle);
    transformed.xz = rotateMatrix * transformed.xz;
    `
  )
}

const depthMaterial = new THREE.MeshDepthMaterial({
  depthPacking: THREE.RGBADepthPacking
})
depthMaterial.onBeforeCompile = shader => {
  // console.log(shader.vertexShader);
  // console.log(shader.fragmentShader);
  shader.uniforms.uTime = customUniforms.uTime
  shader.vertexShader = shader.vertexShader.replace(
    '#include <common>',
    `
    #include <common>

    mat2 rotate2d(float _angle){
      return mat2(cos(_angle),-sin(_angle),
                  sin(_angle),cos(_angle));
    }
    uniform float uTime;
    `
  )

  shader.vertexShader = shader.vertexShader.replace(
    "#include <begin_vertex>",
    `
    #include <begin_vertex>
    float angle = sin(position.y+uTime) *0.5;
    mat2 rotateMatrix = rotate2d(angle);
    transformed.xz = rotateMatrix * transformed.xz;
    `
  )
}


const gltfLoader = new GLTFLoader();
gltfLoader.load('/models/LeePerrySmith/LeePerrySmith.glb', gltf => {
  const mesh = gltf.scene.children[0]
  mesh.material = material
  mesh.castShadow = true
  // 自定义深度材质 (主要是用来修改阴影用的)
  mesh.customDepthMaterial = depthMaterial
  scene.add(mesh)
})


const plane = new THREE.Mesh(
  new THREE.PlaneGeometry(20, 20),
  new THREE.MeshStandardMaterial()
)
plane.position.set(0, 0, -6)
plane.receiveShadow = true
scene.add(plane)


const directionLight = new THREE.DirectionalLight('#ffffff', 1)
directionLight.castShadow = true
directionLight.position.set(0, 0, 200)
scene.add(directionLight)


const cubeTextureLoader = new THREE.CubeTextureLoader();
const envMapTexture = cubeTextureLoader.load([
  '/textures/environmentMaps/0/px.jpg',
  '/textures/environmentMaps/0/nx.jpg',
  '/textures/environmentMaps/0/py.jpg',
  '/textures/environmentMaps/0/ny.jpg',
  '/textures/environmentMaps/0/pz.jpg',
  '/textures/environmentMaps/0/nz.jpg',
])
scene.environment = envMapTexture
scene.background = envMapTexture


let clock = new THREE.Clock()
function animate() {
  let elapsedTime = clock.getElapsedTime()
  customUniforms.uTime.value = elapsedTime

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

// 创建GUI
const gui = new GUI();


