<script setup>
import { onMounted, ref } from 'vue'
import * as THREE from 'three'

import eventHub from '@/utils/eventHub';
import ThreePlus from './three/index'

let screenDom = ref(null)

const resizeFn = () => {
  let scale = window.innerWidth / 1920
  // screenDom.value.style.transform = `scale(${scale})`
}

onMounted(() => {
  resizeFn()
  window.addEventListener('resize', resizeFn)
})

onMounted(() => {
  // const container = document.querySelector('.canvas-container')
  let threePlus = new ThreePlus('.canvas-container')
  threePlus.setBg("/assets/textures/sky11.hdr")

  // 添加云雾效果
  threePlus.addClouds();

  // 添加海洋
  threePlus.addOcean();

  // 模型加载
  threePlus.gltfLoader('/model/city/metaScene03.glb').then(gltf => {
    let planeGroup = new THREE.Group();
    planeGroup.position.copy(gltf.scene.children[0].position);
    gltf.scene.add(planeGroup);

    gltf.scene.traverse((child) => {
      if (
        child.isMesh &&
        child.material &&
        child.material.name.indexOf("KB3D_DLA_ConcreteRiverRock") != -1
      ) {
        // console.log("地面", child);
        // child.material.color.set(0xffffff);
        // child.material.map = null;
        planeGroup.add(child.clone());
        child.visible = false;
      }
      if (
        child.isMesh &&
        child.material &&
        child.material.name.indexOf("KB3D_DLA_ConcreteScreedTan") != -1
      ) {
        // console.log("墙", child);
        planeGroup.add(child.clone());
        child.visible = false;
      }
      if (
        child.isMesh &&
        child.material &&
        child.material.name.indexOf("KB3D_DLA_ConcretePittedGrayLight") != -1
      ) {
        // console.log("光墙", child);
        planeGroup.add(child.clone());
        child.visible = false;
      }
    });
    threePlus.addPhysics(planeGroup)
    threePlus.scene.add(gltf.scene);
    


    let lightCirclePosition = new THREE.Vector3(-3, -0.3, 15);
    let lightCircle = threePlus.addLightCircle(lightCirclePosition)
    let fireSprite = null;

    fireSprite || (fireSprite = threePlus.addFireSprite())

    // 监听是否进入光圈
    threePlus.physics.onPosition(
      lightCirclePosition,
      () => {
        console.log("触发进入光圈");
        lightCircle.mesh.visible = false;

        let canvasPosition = new THREE.Vector3(-3, 1.3, 18)
        let canvasRotation = new THREE.Euler(0, Math.PI, 0)
        /* let canvasPlane = threePlus.addCanvasPlane(
          '恭喜到达指定位置',
          canvasPosition,
          canvasRotation
        ); */

        let textVideo = threePlus.addTextVideo(
          '恭喜到达指定位置',
          canvasPosition,
          canvasRotation
        );

        
      },
      () => {
        console.log("触发离开光圈");
        lightCircle.mesh.visible = true;
      },
    );

  })

  // 添加灯光
  threePlus.setLight()

  // threePlus.addVideoPlane("/video/test.mp4")
  let dirPlane = threePlus.addVideoPlane(
    '/video/arrow.mp4',
    new THREE.Vector2(2, 2),
    new THREE.Vector3(-1.5, 3, 2),
  );
  dirPlane.mesh.rotation.z = -Math.PI / 2;


  
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
