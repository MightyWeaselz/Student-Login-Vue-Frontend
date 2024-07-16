<script setup>
import { onUnmounted, ref, provide, watch } from 'vue';

  onUnmounted( () => {
    localStorage.clear()
    sessionStorage.clear()
    sessionStorage.setItem("hasPermission", false)
  });

  const token = ref(null);
  const headerConfig = {headers: {Authorization:  null} }
  const baseUrl = process.env.VUE_APP_BASE_URL;

  watch(() => token.value ,(value) => {
      	alert("headerConfig wird gechanged")
      headerConfig.headers.Authorization = `Bearer ${value}`
    });

  provide('token', token);
  provide('headerConfig', headerConfig);
  provide('baseUrl', baseUrl);
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