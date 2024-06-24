<script setup>
import { onMounted, ref } from 'vue'

import eventHub from '@/utils/eventHub';

let screenDom = ref(null)


onMounted(() => {
})



</script>

<template>
  <div class="home" ref="screenDom">
    <div class="canvas-container">
      <video src="http://vod.v.jstv.com/2024/06/06/JSTV_JSGGNEW_1717674142820_17lD5oW_188.mp4" controls style="width:200px;height: 200px;"/>
      <video src="https://vodpub6.v.news.cn/yqfbzx-original/20240605/2024060517ccce412e584941a3c348c79513343d_XxjwszC007033_20240605_CBMFN0A001.mp4" controls style="width:200px;height: 200px;"/>
      <video src="https://cn-sccd-ct-01-09.bilivideo.com/live-bvc/803012/live_8243871_5578787_2500/index.m3u8?expires=1717726629&len=0&oi=1035100768&pt=web&qn=0&trid=10070aba618b881d43a0a80670b350514a46&sigparams=cdn,expires,len,oi,pt,qn,trid&cdn=cn-gotcha01&sign=08e4b0e45524caaffc9668923169a1cb&sk=5bf07b9bbe6df2e0a6bc476fe3d9a6428617d9898e213141a6c9950622479373&flvsk=4207df3de646838b084f14f252be3afff667c581244ae1db28bc7b2502fd9756&p2p_type=1&sl=1&free_type=0&mid=97162903&sid=cn-sccd-ct-01-09&chash=1&bmt=1&sche=ban&bvchls=1&score=11&pp=rtmp&source=onetier&trace=911&site=f87046eec2ca5fd3412f1d4b1a46ba17&qp=ca_250&zoneid_l=151437313&sid_l=live_8243871_5578787_2500&order=1" controls style="width:200px;height: 200px;"/>
    </div>

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
