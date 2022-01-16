<template>
  <div>

    <v-app-bar
      app
      color="white"
      elevation="1"
    >
      <v-app-bar-nav-icon class="hidden-md-and-up" @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      </v-toolbar-side-icon>
      <img src="/images/logo.png" style="height: 40px; width: auto; margin: 8px"></img>

      <v-spacer></v-spacer>

      <NetworkSwitchBtn></NetworkSwitchBtn>

    </v-app-bar>
  </div>
</template>

<script>
import NetworkSwitchBtn from "@/components/NetworkSwitchBtn"
export default {
  data: () => ({
    // networkId: null,
    drawer: null,
  }),
  components: {
    NetworkSwitchBtn,
  },
  methods: {
    async init() {
      // await new Promise(r => setTimeout(r, 1000))
      // if (window.web3) {
      //   // console.log(window.ethereum)
      //   this.networkId = await window.web3.eth.net.getId()
      // }
    }
  },
  created () {
    this.init()
  }  
}
</script>

<style scoped>
.navbar-link {
  color: rgba(0, 0, 0, 0.87) !important;
  text-decoration: none !important;
}
.nav-draw-link {
  color: #444 !important;
}
</style>
