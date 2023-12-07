<template>
  <div>
    <k-app :theme="appTheme">
      <NuxtPage/>
    </k-app>
    
  </div>
</template>

<script setup lang="ts">
import { kApp } from 'konsta/vue';

const appTheme = computed(() => getAppTheme());

</script>