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

      <v-chip v-if="networkId && networkId == 1"
        class="ma-2"
        color="light-blue darken-2"
        text-color="white"
      >Ethereum Mainnet</v-chip>
      <v-chip v-if="networkId && networkId == 4"
        class="ma-2"
        color="grey"
        text-color="white"
      >Rinkeby Testnet</v-chip>
      <v-chip v-if="networkId && networkId == 137"
        class="ma-2"
        color="green"
        text-color="white"
      >Polygon</v-chip>

    </v-app-bar>
  </div>
</template>

<script>
export default {
  data: () => ({
    networkId: null,
    drawer: null,
  }),
  methods: {
    async init() {
      await new Promise(r => setTimeout(r, 1000))
      if (window.web3) {
        // console.log(window.ethereum)
        this.networkId = await window.web3.eth.net.getId()
      }
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
