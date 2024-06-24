import * as THREE from 'three'
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader'

// 初始化场景
const scene = new THREE.Scene()

// 导入hdr纹理
const hdrLoader = new RGBELoader()
hdrLoader.load('/textures/2k.hdr', envMap => {
  scene.background = envMap
  scene.environment = envMap
  envMap.mapping = THREE.EquirectangularReflectionMapping
  // scene.environment.mapping = THREE.EquirectangularReflectionMapping
})

// 添加平行光
const light = new THREE.DirectionalLight(0xffffff, 2)
light.position.set(10, 100, 10)
scene.add(light)

export default scene;