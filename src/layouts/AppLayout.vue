<template>
  <v-app>
    <HeaderApp />

    <v-main>
      <router-view :key="key" />
    </v-main>

    <FooterApp />

  </v-app>
</template>



<script>
import HeaderApp from "@/components/HeaderApp"
import FooterApp from "@/components/FooterApp"

export default {
  components: {
    HeaderApp,
    FooterApp
  },
  data: () => ({

  }),
  computed: {
    key: function () {
      const now = (new Date()).getTime()
      return this.$route.name !== undefined
        ? this.$route.name + '-' + now
        : this.$route + '-' + now
    }
  },
};
</script>
