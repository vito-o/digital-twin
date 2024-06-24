<script setup>
import { onMounted, reactive, ref } from 'vue'
import Scene from '@/components/Scene.vue'
import BigScreen from "@/components/BigScreen.vue";

import { getSmartCityInfo, getSmartCityList } from "@/api";
import gsap from "gsap";

const dataInfo = reactive({
  iot: { number: 0 },
  event: { number: 0 },
  power: { number: 0 },
  test: { number: 0 },
})

onMounted(() => {
  changeInfo()
  getEventList();
})

const changeInfo = async () => {
  let res = await getSmartCityInfo();
  for (let key in dataInfo) {
    dataInfo[key].name = res.data.data[key].name;
    dataInfo[key].unit = res.data.data[key].unit;
    gsap.to(dataInfo[key], {
      number: res.data.data[key].number,
      duration: 1,
    });
  }
}

const eventList = ref([]);
const getEventList = async () => {
  let result = await getSmartCityList();
  eventList.value = result.data.list;
}

</script>

<template>
  <div class="home">
    <Scene :eventList="eventList"/>
    <BigScreen :dataInfo="dataInfo" :eventList="eventList"></BigScreen>
  </div>
</template>
