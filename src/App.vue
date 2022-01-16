<template>
  <v-app>
    <router-view :key="$route.fullPath" />
  </v-app>
</template>

<script>
export default {
  data: () => ({

  }),
};
</script>

<style>
body {
  background-color: #EDEDED;
}
</style>
