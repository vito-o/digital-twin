<template>
  <div id="bigScreen">
    <div class="header">智慧园区</div>
    <div class="main">
      <div class="left">
        <div class="cityEvent">
          <h3>
            <span>热气球控制</span>
          </h3>
          <h1 @click="toggleAction(0)">
            <img src="../assets/bg/bar.svg" class="icon" />
            <span>设置热气球以横穿园区的动画显示</span>
          </h1>
          <h1 @click="toggleAction(1)">
            <img src="../assets/bg/bar.svg" class="icon" />
            <span>设置热气球以环绕园区进行运动</span>
          </h1>
          <div class="footerBoder"></div>
        </div>
        <div class="cityEvent">
          <h3>
            <span>相机控制</span>
          </h3>
          <h1 @click="toggleCamera('default')">
            <img src="../assets/bg/bar.svg" class="icon" />
            <span>默认的相机视角</span>
          </h1>
          <h1 @click="toggleCamera('carcamera_Orientation')">
            <img src="../assets/bg/bar.svg" class="icon" />
            <span>设置相机追随汽车导览园区</span>
          </h1>
          <h1 @click="toggleCamera('rightcamera_Orientation')">
            <img src="../assets/bg/bar.svg" class="icon" />
            <span>查看汽车司机视角</span>
          </h1>
          <h1 @click="toggleCamera('wudao')">
            <img src="../assets/bg/bar.svg" class="icon" />
            <span>查看舞蹈人视角</span>
          </h1>
          <div class="footerBoder"></div>
        </div>
      </div>
      <div class="right">
        <div class="cityEvent list">
          <h3>
            <span>切换园区观览模式</span>
          </h3>
          <ul>
            <li
              v-for="(item, i) in eventList"
              @click="toggleControls(item.code)"
            >
              <h1>
                <div>
                  <img class="icon" src="../assets/bg/dianli.svg" />
                  <span> {{ item.name }} </span>
                </div>
              </h1>
              <p>{{ item.desc }}</p>
            </li>
          </ul>
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

const toggleAction = i => {
  eventHub.emit('actionClick', i)
}
const toggleCamera = name => {
  if (name == 'default') {
    eventHub.emit('wudaoEndClick')
  }
  if (name == 'wudao') {
    name = 'default'
    setTimeout(() => {
      eventHub.emit('wudaoClick')
    }, 50)
  } 
  eventHub.emit("toggleCamera", name);
}
const toggleControls = code => {
  eventHub.emit("toggleControls", code);
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
