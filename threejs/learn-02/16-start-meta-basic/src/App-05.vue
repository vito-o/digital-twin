<script setup>
import { onMounted } from 'vue'
// App05-实例化物体提升性能
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { Octree } from "three/examples/jsm/math/Octree.js";
import { OctreeHelper } from "three/examples/jsm/helpers/OctreeHelper.js";
import { Capsule } from "three/examples/jsm/math/Capsule.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import Stats from "three/examples/jsm/libs/stats.module.js";

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


const geometry = new THREE.TorusKnotGeometry(1, 0.3, 100, 16)
const material = new THREE.MeshBasicMaterial({ color: 0xffff00 })

/* for (let i = 0; i < 1000; i++) {
  const torusKnot = new THREE.Mesh(geometry, material)
  torusKnot.position.set(
    Math.random() * 100 - 50,
    Math.random() * 100 - 50,
    Math.random() * 100 - 50,
  )
  scene.add(torusKnot)
}
 */

// 你可以使用 InstancedMesh 来渲染大量具有相同几何体与材质、但具有不同世界变换的物体。 
// 使用 InstancedMesh 将帮助你减少 draw call 的数量，从而提升你应用程序的整体渲染性能。
const instanceMesh = new THREE.InstancedMesh(geometry, material, 1000)
for (let i = 0; i < 1000; i++) {
  const position = new THREE.Vector3(
    Math.random() * 100 - 50,
    Math.random() * 100 - 50,
    Math.random() * 100 - 50,
  )
  const rotation = new THREE.Euler(
    Math.random() * Math.PI * 2,
    Math.random() * Math.PI * 2,
    Math.random() * Math.PI * 2,
  )
  // 四元数用于表示旋转
  const quaternion = new THREE.Quaternion().setFromEuler(rotation)

  const scale = new THREE.Vector3(
    Math.random() * 0.5 - 0.5,
    Math.random() * 0.5 - 0.5,
    Math.random() * 0.5 - 0.5,
  )
  let matrix = new THREE.Matrix4()
  matrix.compose(position, quaternion, scale)

  instanceMesh.setMatrixAt(i, matrix)
}
scene.add(instanceMesh)



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
