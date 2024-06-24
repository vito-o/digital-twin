<template>
  <div id="bigScreen">
    <div class="header">智慧工厂</div>
    <div class="main">
      <div class="left">
        <div class="cityEvent">
          <h3 @click="showWall">
            <img src="../assets/bg/bar.svg" class="icon" />
            <span>厂房外形展示</span>
          </h3>
          <div class="footerBoder"></div>
        </div>
        <div class="cityEvent">
          <h3 @click="showAll">
            <img src="../assets/bg/bar.svg" class="icon" />
            <span>厂房分层展开</span>
          </h3>
          <div class="footerBoder"></div>
        </div>
        <div class="cityEvent">
          <h3 @click="showFloor1">
            <img src="../assets/bg/bar.svg" class="icon" />
            <span>展示第一层楼</span>
          </h3>
          <div class="footerBoder"></div>
        </div>
        <div class="cityEvent">
          <h3 @click="showFloor2">
            <img src="../assets/bg/bar.svg" class="icon" />
            <span>展示第二层楼</span>
          </h3>
          <div class="footerBoder"></div>
        </div>
       
      </div>
      <div class="right">
        <div class="cityEvent" @click="flatFighter">
          <h3>
            <img class="icon" src="../assets/bg/bar.svg" alt="" />
            <span> 展开飞机 </span>
          </h3>

          <div class="footerBorder"></div>
        </div>

        <div class="cityEvent" @click="recoverFighter">
          <h3>
            <img class="icon" src="../assets/bg/bar.svg" alt="" />
            <span> 恢复飞机 </span>
          </h3>

          <div class="footerBorder"></div>
        </div>

        <div class="cityEvent" @click="pointsFighter">
          <h3>
            <img class="icon" src="../assets/bg/bar.svg" alt="" />
            <span> 粒子特效 </span>
          </h3>

          <div class="footerBorder"></div>
        </div>

        <div class="cityEvent" @click="pointsBlast">
          <h3>
            <img class="icon" src="../assets/bg/bar.svg" alt="" />
            <span> 粒子爆炸 </span>
          </h3>

          <div class="footerBorder"></div>
        </div>

        <div class="cityEvent" @click="pointsBack">
          <h3>
            <img class="icon" src="../assets/bg/bar.svg" alt="" />
            <span> 粒子复原 </span>
          </h3>

          <div class="footerBorder"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import eventHub from "@/utils/eventHub";
import { ref, onMounted, onUnmounted } from "vue";

const eventList = ref([
  {
    code: 'Orbit',
    name: '轨道观览',
    desc: '可以锁定目标建筑和园区进行轨道式360°查看'
  },
  {
    code: 'Fly',
    name: '飞行观览',
    desc: '可以使用飞行模式进行园区进行观览'
  },
  {
    code: 'FirstPerson',
    name: '第一人称',
    desc: '可以使用第一人称模式进行园区进行观览'
  },
])

let isShowAll = false
const showAll = () => {
  if (!isShowAll) {
    eventHub.emit('showAll')
    isShowAll = true
  } else {
    eventHub.emit('hideAll')
    isShowAll = false
  }
}
const showWall = () => {
  eventHub.emit('showWall')
}
const showFloor1 = () => {
  eventHub.emit('showFloor1')
}
const showFloor2 = () => {
  eventHub.emit('showFloor2')
}


const flatFighter = () => {
  eventHub.emit('flatFighter')
}
const recoverFighter = () => {
  eventHub.emit('recoverFighter')
}
const pointsFighter = () => {
  eventHub.emit('pointsFighter')
}
const pointsBlast = () => {
  eventHub.emit('pointsBlast')
}
const pointsBack = () => {
  eventHub.emit('pointsBack')
}



onMounted(() => {
  window.addResize()
})

onUnmounted(() => {
  window.unbindResize()
})
</script>

<style scoped>
#bigScreen {
  width: 100vw;
  height: 100vh;
  position: fixed;
  z-index: 100;

  left: 0;
  top: 0;
  pointer-events: none;
  display: flex;
  flex-direction: column;
}

.header {
  width: 48rem;
  height: 2.5rem;
  background-image: url(@/assets/bg/title.png);
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  text-align: center;
  color: rgb(226, 226, 255);
  font-size: 1.2rem;
}

.main {
  /* flex: 1; */
  display: flex;
  justify-content: space-between;
}

.left {
  width: 4rem;
  /* background-color: rgb(255,255,255,0.5); */
  background-image: url(@/assets/bg/line_img.png);
  background-repeat: no-repeat;
  background-size: contain;
  background-position: right center;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0.4rem 0;
}

.right {
  width: 4rem;
  /* background-color: rgb(255,255,255,0.5); */
  background-image: url(@/assets/bg/line_img.png);
  background-repeat: no-repeat;
  background-size: contain;
  background-position: left center;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0.4rem 0;
}

.cityEvent {
  position: relative;
  width: 3.5rem;
  /* height: 3rem; */
  margin-bottom: 0.5rem;
  background-image: url(@/assets/bg/bg_img03.png);
  background-repeat: repeat;
  pointer-events: auto;
}

.cityEvent::before {
  width: 0.4rem;
  height: 0.4rem;
  position: absolute;
  left: 0;
  top: 0;
  border-top: 4px solid rgb(34, 133, 247);
  border-left: 4px solid rgb(34, 133, 247);
  content: "";
  display: block;
}

.cityEvent::after {
  width: 0.4rem;
  height: 0.4rem;
  position: absolute;
  right: 0;
  top: 0;
  border-top: 4px solid rgb(34, 133, 247);
  border-right: 4px solid rgb(34, 133, 247);
  content: "";
  display: block;
}
.footerBorder {
  position: absolute;
  bottom: 0;
  bottom: 0;
  width: 3.5rem;
  height: 0.4rem;
}
.footerBorder::before {
  width: 0.4rem;
  height: 0.4rem;
  position: absolute;
  left: 0;
  top: 0;
  border-bottom: 4px solid rgb(34, 133, 247);
  border-left: 4px solid rgb(34, 133, 247);
  content: "";
  display: block;
}

.footerBorder::after {
  width: 0.4rem;
  height: 0.4rem;
  position: absolute;
  right: 0;
  top: 0;
  border-bottom: 4px solid rgb(34, 133, 247);
  border-right: 4px solid rgb(34, 133, 247);
  content: "";
  display: block;
}

.icon {
  width: 40px;
  height: 40px;
}

.cityEvent h1 span {
  flex: 1;
}

h1 {
  color: #fff;
  display: flex;
  align-items: center;
  padding: 0 0.3rem 0.3rem;
  justify-content: space-between;
  font-size: 0.3rem;
}
h3 {
  color: #fff;
  display: flex;
  align-items: center;
  padding: 0.3rem 0.3rem;
  font-size: .4rem;
}

h1 > div {
  display: flex;
  align-items: center;
}
h1 span.time {
  font-size: 0.2rem;
  font-weight: normal;
}

.cityEvent li > p {
  color: #eee;
  padding: 0rem 0.3rem 0.3rem;
  font-size: .4rem;
}
.list h1 {
  padding: 0.1rem 0.3rem;
}
.cityEvent.list ul {
  pointer-events: auto;
  cursor: pointer;
}

.cityEvent li.active h1 {
  color: red;
}
.cityEvent li.active p {
  color: red;
}

ul,
li {
  list-style: none;
}
</style>
