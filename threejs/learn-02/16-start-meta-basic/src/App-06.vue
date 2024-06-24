<script setup>
import { onMounted } from 'vue'
// App06-合并物体提升性能 BufferGeometryUtils.mergeGeometries
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { Octree } from "three/examples/jsm/math/Octree.js";
import { OctreeHelper } from "three/examples/jsm/helpers/OctreeHelper.js";
import { Capsule } from "three/examples/jsm/math/Capsule.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import Stats from "three/examples/jsm/libs/stats.module.js";
import * as BufferGeometryUtils from "three/examples/jsm/utils/BufferGeometryUtils.js";

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


// 创建一个平面
const planeGeometry = new THREE.PlaneGeometry(20, 20, 1, 1)
const planeMaterial = new THREE.MeshBasicMaterial({
  color: 0xffffff,
  side: THREE.DoubleSide
})
const plane = new THREE.Mesh(planeGeometry, planeMaterial)
plane.receiveShadow = true
plane.rotation.x = - Math.PI / 2;
scene.add(plane)


// const geometry = new THREE.TorusKnotGeometry(1, 0.3, 100, 16)
const material = new THREE.MeshBasicMaterial({ color: 0xffff00 })
let geometries = []
for (let i = 0; i < 1000; i++) {
  const geometry = new THREE.TorusKnotGeometry(
    0.5 + Math.random() * 0.5,
    0.3, 
    50 + parseInt(Math.random() * 50),
    16
  )
  const matrix4 = new THREE.Matrix4();
  matrix4.makeRotationX(Math.random() * Math.PI)
  matrix4.makeRotationY(Math.random() * Math.PI)
  matrix4.makeRotationZ(Math.random() * Math.PI)

  matrix4.makeScale(
    Math.random() * 0.5 + 0.5,
    Math.random() * 0.5 + 0.5,
    Math.random() * 0.5 + 0.5,
  )

  matrix4.makeTranslation(
    Math.random() * 100 - 50,
    Math.random() * 100 - 50,
    Math.random() * 100 - 50,
  )
  geometry.applyMatrix4(matrix4)
  geometries.push(geometry)
}
let mergeGeometry = BufferGeometryUtils.mergeGeometries(geometries)
let mesh = new THREE.Mesh(mergeGeometry, material)
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
