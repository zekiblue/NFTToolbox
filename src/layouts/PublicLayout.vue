<template>
  <v-app>
    <HeaderPublic />

    <v-main>
      <router-view :key="key" />
    </v-main>

    <FooterPublic />

  </v-app>
</template>



<script>
import HeaderPublic from "@/components/HeaderPublic"
import FooterPublic from "@/components/FooterPublic"

export default {
  components: {
    HeaderPublic,
    FooterPublic
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
