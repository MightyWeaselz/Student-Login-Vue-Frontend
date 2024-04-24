<script setup>
import { onUnmounted } from 'vue';

  onUnmounted( () => {
    localStorage.clear()
    sessionStorage.clear()
  });
  </script>


<template>
  <RouterView />
</template>

<style>
    /* Entferne den Standardabstand des Körpers */
    body, html {
        margin: 0;
        padding: 0;
    }
</style>