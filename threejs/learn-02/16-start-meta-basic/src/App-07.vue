<script setup>
import { onMounted } from 'vue'
// App07-透明球与虹彩效果
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
  });

const sphereGeometry = new THREE.SphereGeometry(1, 32, 32)
const sphereMaterial = new THREE.MeshPhysicalMaterial({
  color: 0xffffff,
  transmission: 1,
  transparent: true,
  roughness: 0,
  reflectivity: 1,
  ior: 2.33,
  iridescence: 1,
  iridescenceIOR: 1.33
})

let mesh = new THREE.Mesh(sphereGeometry, sphereMaterial)
scene.add(mesh)



const clock = new THREE.Clock();
const animate = () => {
  let delta = clock.getDelta();
 
  controls.update()

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
