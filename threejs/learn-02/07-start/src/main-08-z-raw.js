import '../style.css'
//效果合成器 - 使用 shaderPass  合并法相贴图
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

// 导入后期效果合成器
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer'

// 导入渲染通道
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass'
import { DotScreenPass } from 'three/examples/jsm/postprocessing/DotScreenPass'
import { SMAAPass } from 'three/examples/jsm/postprocessing/SMAAPass'
import { SSAARenderPass } from 'three/examples/jsm/postprocessing/SSAARenderPass'
import { GlitchPass } from 'three/examples/jsm/postprocessing/GlitchPass'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass'
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass'

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
camera.position.set(0, 0, 3)

// 场景渲染器
const renderer = new THREE.WebGLRenderer({
  antialias: true
})
renderer.setSize(window.innerWidth, window.innerHeight)
// renderer.shadowMap.enabled = true
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


// 合成效果
const effectComposer = new EffectComposer(renderer)
effectComposer.setSize(window.innerWidth, window.innerHeight)

// 添加渲染通道
const renderPass = new RenderPass(scene, camera)
effectComposer.addPass(renderPass)

// 点效果
const dotScreenPass = new DotScreenPass();
dotScreenPass.enabled = false
effectComposer.addPass(dotScreenPass)

// 抗锯齿
const smaaPass = new SMAAPass()
smaaPass.enabled = false
effectComposer.addPass(smaaPass)

// 发光效果
const unrealBloomPass = new UnrealBloomPass()
unrealBloomPass.enabled = false
effectComposer.addPass(unrealBloomPass)

// 屏幕闪动
// const glitchPass = new GlitchPass()
// // glitchPass.enabled = false
// effectComposer.addPass(glitchPass)

const colorParams = {
  r:0,
  g:0,
  b:0
}

const shaderPass = new ShaderPass({
  uniforms: {
    tDiffuse: {
      value: null
    },
    uColor: {
      value: new THREE.Color(colorParams.r, colorParams.g, colorParams.b)
    }
  },
  vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform sampler2D tDiffuse;
    uniform vec3 uColor;

    varying vec2 vUv;

    void main() {
      vec4 color = texture2D(tDiffuse, vUv);
      color.xyz += uColor;
      gl_FragColor = color;
    }
  `
})
effectComposer.addPass(shaderPass)

// 创建GUI
const gui = new GUI();

gui.add(colorParams, 'r', -1, 1).onChange(val => {
  shaderPass.uniforms.uColor.value.r = val;
})
gui.add(colorParams, 'g', -1, 1).onChange(val => {
  shaderPass.uniforms.uColor.value.g = val;
})
gui.add(colorParams, 'b', -1, 1).onChange(val => {
  shaderPass.uniforms.uColor.value.b = val;
})


const gltfLoader = new GLTFLoader();
gltfLoader.load('/models/DamagedHelmet/glTF/DamagedHelmet.gltf', gltf => {
  const mesh = gltf.scene.children[0]
  // mesh.castShadow = true
  scene.add(mesh)
})


const directionLight = new THREE.DirectionalLight('#ffffff', 1)
// directionLight.castShadow = true
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



const textureLoader = new THREE.TextureLoader()
const normalTexture = textureLoader.load('/textures/interfaceNormalMap.png')

const techPass = new ShaderPass({
  uniforms: {
    tDiffuse: {
      value: null
    },
    uNormalMap: {
      value: null
    },
    uTime: {
      value: 0
    }
  },
  vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform sampler2D tDiffuse;
    uniform sampler2D uNormalMap;
    uniform float uTime;

    varying vec2 vUv;

    void main() {
      vec2 newUv = vUv;
      newUv += sin(newUv.x * 10.0 + uTime * 0.5) * 0.03;

      vec4 color = texture2D(tDiffuse, newUv);
      vec4 normalColor = texture2D(uNormalMap, vUv);

      // 设置光线角度
      // normalize: 将数据标准化到0~1范围内，-0.5774, 0.5774, 0.2315
      vec3 lightDirection = normalize(vec3(-5, 5, 2));

      // dot: 点积表示两个向量之间的夹角关系，当两个向量完全平行时，点积达到最大值，当两个向量垂直时，点积为0。
      //      光照计算中，点积值通常用来表示光线和表面法线之间的夹角，即光线与表面的朝向关系。通过点积值，可以判断光线是否正对着表面，以及光线相对于表面的角度。

      // clamp: 函数将点积值限制在0.0和1.1之间
      float lightness = clamp(dot(normalColor.xyz, lightDirection), 0.0, 1.1);

      color.xyz += lightness;
      gl_FragColor = color;
    }
  `
})
techPass.material.uniforms.uNormalMap.value = normalTexture
effectComposer.addPass(techPass)


let clock = new THREE.Clock()
function animate() {
  let elapsedTime = clock.getElapsedTime()
  techPass.material.uniforms.uTime.value = elapsedTime

  controls.update()

  requestAnimationFrame(animate)
  // 渲染
  // renderer.render(scene, camera)
  effectComposer.render()
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