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
  threePlus.camera.position.set(0, 5, 12)
  threePlus.camera.lookAt(0, 2, 0)
  threePlus.control.target.set(0, 2, 0)
  // threePlus.setBg('/assets/textures/25s.jpg')

  // 添加坐标轴
  threePlus.addAxis3d()

  let data = [
    {
      value: 3.5,
      name: "第一季度",
    },
    {
      value: 3.0,
      name: "第二季度",
    },
    {
      value: 2.5,
      name: "第三季度",
    },
    {
      value: 2.0,
      name: "第四季度",
    },
  ];
  // 创建条形图
  //threePlus.addBar3d(data);

  // threePlus.addPolyline3d();

  threePlus.addPie3d(data)

  threePlus.setLight();

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
