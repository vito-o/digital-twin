<script setup>
import { onMounted } from 'vue'
// App08-球体镜面反射 - 立方体
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { Octree } from "three/examples/jsm/math/Octree.js";
import { OctreeHelper } from "three/examples/jsm/helpers/OctreeHelper.js";
import { Capsule } from "three/examples/jsm/math/Capsule.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import Stats from "three/examples/jsm/libs/stats.module.js";
// import * as BufferGeometryUtils from "three/examples/jsm/utils/BufferGeometryUtils.js";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x88ccee)
// scene.fog = new THREE.Fog(0x88ccee, 0, 50)

const camera = new THREE.PerspectiveCamera(70, window.innerWidth/window.innerHeight, 0.001, 1000)
camera.position.set(0, 5, 10);

const renderer = new THREE.WebGLRenderer({
  antialias: true
})
renderer.setPixelRatio(window.devicePixelRatio)
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.VSMShadowMap
renderer.outputEncoding = THREE.sRGBEncoding
renderer.toneMapping = THREE.ACESFilmicToneMapping

const stats = new Stats();
stats.domElement.style.position = "absolute";
stats.domElement.style.top = "0px";

let controls = new OrbitControls(camera, renderer.domElement);

const hdrLoader = new RGBELoader();
hdrLoader.load("./hdr/023.hdr", (texture) => {
  texture.mapping = THREE.EquirectangularReflectionMapping;
  texture.format = THREE.RGBAFormat;
  scene.background = texture;
  scene.environment = texture;

  sphereMaterial.envMap = cubeRenderTarget.texture;
});


const sphereGeometry = new THREE.SphereGeometry(1, 32, 32)
const sphereMaterial = new THREE.MeshPhysicalMaterial({
  color: 0xffffff,
  transparent: true,
  roughness: 0,
  metalness: 1,
})
let sphere = new THREE.Mesh(sphereGeometry, sphereMaterial)
sphere.position.set(0, 0, 0)
scene.add(sphere)


const cubeGeometry = new THREE.BoxGeometry(1, 1, 1)
const cubeMaterial = new THREE.MeshBasicMaterial({
  color: 0xffffff
})
const cube = new THREE.Mesh(cubeGeometry, cubeMaterial)
cube.position.set(-3, 0, 0)
scene.add(cube)


// 创建cubeTarget
const cubeRenderTarget = new THREE.WebGLCubeRenderTarget(512)
const cubeCamera = new THREE.CubeCamera(0.1, 1000, cubeRenderTarget)


const clock = new THREE.Clock();
const animate = () => {
  let delta = clock.getDelta();
 
  controls.update()

  cubeCamera.update(renderer, scene);
  renderer.render(scene, camera)

  requestAnimationFrame(animate)
}


onMounted(() => {
  const container = document.getElementById('container')

  container.appendChild(renderer.domElement)

  container.appendChild(stats.domElement);

  animate()

  console.log(renderer)
})

window.addEventListener('resize', () => {
  // 更新摄像头
  camera.aspect = window.innerWidth / window.innerHeight
  // 更新摄像机的投影矩阵
  camera.updateProjectionMatrix()
  // 更新渲染器
  renderer.setPixelRatio(window.devicePixelRatio)
  // 设置渲染器的像素比
  renderer.setSize(window.innerWidth, window.innerHeight)
})
</script>

<template>
  <div id="container"></div>
</template>

<style scoped>
#container {
  width: 100vw;
  height: 100vh;
}
</style>
