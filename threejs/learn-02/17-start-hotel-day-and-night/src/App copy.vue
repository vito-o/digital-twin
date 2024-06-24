<script setup>
import { onMounted, ref } from 'vue'
import * as THREE from 'three'

import eventHub from '@/utils/eventHub';
import ThreePlus from './three/index'

let screenDom = ref(null)

const resizeFn = () => {
  let scale = window.innerWidth / 1920
}

onMounted(() => {
  resizeFn()
  window.addEventListener('resize', resizeFn)
})

onMounted(() => {
  let threePlus = new ThreePlus('.canvas-container')
  let bgPromise = threePlus.setBg("/assets/textures/023.hdr")

  // 添加海洋
  threePlus.addOcean();

  // 模型加载
  threePlus.gltfLoader('/model/building-min02.glb').then(gltf => {
    let vetroMaterial = null;
    gltf.scene.traverse(child => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
        child.material.shadowSide = THREE.BackSide;
      }
      if (child.isMesh && child.name == "Plane") {
        child.visible = false;
      }
      if (child.isMesh && child.material.name == "Vetro" && !vetroMaterial) {
        vetroMaterial = child.material;
      }
    })

    let video = document.createElement('video')
    video.src = '/textures/video/sucai01.mp4'
    video.autoplay = true;
    video.loop = true;
    video.muted = true;
    video.play();
    let videoTextrue = new THREE.VideoTexture(video)
    bgPromise.then(texture => {
      threePlus.addSphereSky(
        () => {
          if (vetroMaterial) vetroMaterial.emissive = new THREE.Color(0x000000)
          threePlus.unrealBloomPass.enabled = false
        },
      () => {
          console.log(vetroMaterial)
          if (vetroMaterial) vetroMaterial.emissive = new THREE.Color(0x99cc99)
          if (vetroMaterial) vetroMaterial.emissiveMap = videoTextrue;
          if (vetroMaterial) vetroMaterial.emissiveIntensity = 1;
          threePlus.unrealBloomPass.enabled = true
        },
      )
    })

    threePlus.scene.add(gltf.scene);
  });

})

</script>

<template>
  <div class="home" ref="screenDom">
    <div class="canvas-container"></div>
  </div>
</template>

<style scoped>
.home {
  width: 100vw;
  height: 100vh;
  transform-origin: 0 0;
}
.canvas-container {
  width: 100%;
  height: 100%;
}
</style>
