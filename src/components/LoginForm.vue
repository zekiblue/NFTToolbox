
<template>
<div>

  <!-- Loading -->
  <div v-if="!initializationDone">
    <Preloader />
  </div>

  <!-- initializationDone -->
  <div v-else>

      <!-- Wallet not available -->
      <div v-if="!walletAvailable">
        <v-card class="mx-auto" max-width="400"  color="#a3e6ff">
          <v-card-text class="pa-7 text-center">
            <div class="text-center mb-4">
              <v-icon large color="error">mdi-alert-circle-outline</v-icon>
            </div>
            <div>
              Please Install MetaMask Plugin First.
            </div>
          </v-card-text>
        </v-card>
       </div>


      <!-- Network Not Supported -->
      <div v-if="walletAvailable && !networkSupported">
        <v-card class="mx-auto" max-width="400" color="#a3e6ff">
          <v-card-text class="pa-7 text-center">
            <div class="text-center mb-4">
              <v-icon large color="error">mdi-alert-circle-outline</v-icon>
            </div>
            <div>
              Sorry, this network is Not Supported. Please use Mainet or Rinkeby.
            </div>
          </v-card-text>
        </v-card>
      </div>


       <!-- Login with wallet -->
       <div v-if="walletAvailable && networkSupported">

        <v-card class="mx-auto" max-width="400"  color="#a3e6ff" :loading="loading">

          <v-card-text class="pa-7 text-center">
            <div class="headline text-center mb-3">Log in</div>
            <div class="mb-3">Please Sign Wallet</div>

            <v-btn large rounded color="primary"
              @click="loginWithWallet"
              :disabled="loading"
            >
              Login Using MetaMask
            </v-btn>
            <div v-show="error.login" class="login-error-section mt-2">
              {{ error.login }}
            </div>

          </v-card-text>
        </v-card>

      </div>

    </div><!-- v-else: geoBanned -->

  </div><!-- v-else: initializationDone -->

</div>
</template>

<script>
import { config } from '@/config'
import Preloader from "@/components/Preloader"
import {mapActions, mapGetters, mapState} from 'vuex'
import Moralis from 'moralis'
export default {
  components: {
    Preloader,
  },
  data: () => ({
    config: config,
    initializationDone: false,
    loading: false,
    error: {
      loginWithWallet: null,
    },
  }),
  computed: {
    ...mapGetters({
      network: 'getNetwork',
      myAddress: 'getUserAccount',
    }),
    currentNetworkID: function() {
      if (window.ethereum) {
        return parseInt(window.ethereum.networkVersion)
      }
      else {
        return null
      }
    },
    walletAvailable: function () {
      return window.ethereum
    },
  },
  methods: {
    ...mapActions(['loadNetwork']),
    async init() {
      // console.log('window.ethereum', window.ethereum)
      this.initializationDone = false
      this.networkSupported = await this.isNetworkSupported()

      if (this.walletAvailable && this.networkSupported) {
        await this.loadNetwork(true)
      }
      this.initializationDone = true
    },

    isWalletConnected() {
      // return window.Moralis && window.Moralis.User.current()
      return window.ethereum && window.ethereum.selectedAddress
    },

    async isNetworkSupported() {
      if (window.ethereum) {
        const networkId = await window.web3.eth.net.getId()
        console.log('network id', networkId)
        // const networkId = parseInt(window.ethereum.networkVersion)
        if (config.supportedNetworks[networkId]) {
          return true
        }
        else {
          return false
        }
      }
      else {
        return false
      }
    },

    async loginWithWallet() {

        this.loading = true
        this.error.loginWithWallet = null

        // let user = Moralis.User.current();
        // if (!user) {
        try {
          console.log('will run Moralis Web3 Auth')
          const user = await Moralis.Web3.authenticate()
          console.log("logged in user:", user);
          // console.log(user.get("ethAddress"));
          console.log("Moralis User Id", user.id);

          const userId = user.id;
          const ethAddress = user.get("ethAddress");

          localStorage.setItem(config.localStorageKey.login, userId)
          this.loading = false;

          await this.loadNetwork()

          console.log(this.network)
        // console.log('defaultAccount', defaultAccount)

          if (this.$route.query && this.$route.query.redirect &&
            !this.$route.query.redirect.toLowerCase().includes('logout') &&
            !this.$route.query.redirect.toLowerCase().includes('login')) {
            const redirectPath = this.$route.query.redirect
            console.log('redirect: ' + redirectPath)
            this.$router.push({ path: redirectPath})
          }
          else {
            // console.log('redirect: ' + config.defaultRedirect.appHome)
            this.$router.push({ name: config.defaultRedirect.appHome })
          }

        } catch(error) {
          console.log(error);
          this.error.loginWithWallet = "Wallect Connection Error"
        };
        // }

    },

    logout () {
      this.$store.state.myAddress = null
      localStorage.removeItem(config.localStorageKey.login)
      this.$router.push({ name: config.defaultRedirect.publicHome })
    },

  },
  created () {
    this.init()
  }
}
</script>

<style scoped>
.login-error-section {
  background-color: #FFCCBC;
  padding: 10px;
  font-size: 0.8rem;
  line-height: 1.2rem;
}
</style>
