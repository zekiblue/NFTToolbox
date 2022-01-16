<template>
  <div>

    <v-app-bar
      app
      color="white"
      elevation="1"
    >
      <v-app-bar-nav-icon class="hidden-md-and-up" @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      <img src="/images/logo.png" style="height: 40px; width: auto; margin: 8px"></img>

      <v-spacer></v-spacer>

      <NetworkSwitchBtn></NetworkSwitchBtn>

       <v-toolbar-items class="hidden-sm-and-down">
        <v-btn text>
          <router-link class="navbar-link" :to="{name: 'app-home'}">Home</router-link>
        </v-btn>
      </v-toolbar-items>

       <v-toolbar-items class="hidden-sm-and-down">
        <v-btn text>
          <router-link class="navbar-link" :to="{name: 'watchlist'}">Watchlist</router-link>
        </v-btn>
      </v-toolbar-items>

       <v-toolbar-items class="hidden-sm-and-down">
        <v-btn text>
          <router-link class="navbar-link" :to="{name: 'search'}">Search</router-link>
        </v-btn>
      </v-toolbar-items>

       <v-toolbar-items class="hidden-sm-and-down">
        <v-btn text>
          <router-link class="navbar-link" :to="{name: 'logout'}">Logout</router-link>
        </v-btn>
      </v-toolbar-items>

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
  color: #CCC !important;
  text-decoration: none;
}
.nav-draw-link {
  color: #444 !important;
}
</style>
