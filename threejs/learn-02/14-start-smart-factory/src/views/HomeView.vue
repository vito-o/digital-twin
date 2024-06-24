<script setup>
import { onMounted, reactive, ref } from 'vue'
import Scene from '@/components/Scene.vue'
import BigScreen from "@/components/BigScreen.vue";

</script>

<template>
  <div class="home">
    <Scene/>
    <BigScreen></BigScreen>
  </div>
</template>
