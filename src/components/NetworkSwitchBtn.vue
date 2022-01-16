<template>

  <div style="max-width: 200 px;">
    <v-select style="width: 200px;"
      class="mt-5 text-right"
      v-model="selectedNetwork"
      :items="networkOptions"
      item-text="name"
      item-value="id"
      @change="requestNetworkChange"
      label=""
      dense
      chips
      flat
      solo
      return-object
    ></v-select>
  </div>

</template>



<script>
import Moralis from 'moralis'
import {mapActions, mapGetters, mapState} from 'vuex'
export default {
  data: () => ({
    networkId: null,
    moralisChainId: null,
    selectedNetwork: null,
    networkOptions: [
      { id: 1, name: 'Ethereum Mainnet', moralisId: '0x1' },
      { id: 137, name: 'Polygon Mainnet', moralisId: '0x89' },
    ],
  }),
  methods: {
    ...mapActions(['loadNetwork']),
    async init() {
      console.log('networkswitch init')
      await new Promise(r => setTimeout(r, 500))
      if (!window.web3) {
        return
      }
        // console.log(window.ethereum)
      this.networkId = await window.web3.eth.net.getId()
      console.log('web3 networkid:', this.networkId)
      // await Moralis.switchNetwork('0x89')
      // this.moralisChainId = await Moralis.getChainId()
      // console.log('Moralis networkid:', this.moralisChainId)
      if (!this.selectedNetwork || this.selectedNetwork.id != this.networkId) {
        for (let i=0; i<this.networkOptions.length; i++) {
          let option = this.networkOptions[i]
          if (option.id == this.networkId) {
            this.selectedNetwork = option
            break
          }
        }
      }

    },
    async requestNetworkChange () {
      // console.log('requestNetworkChange')
      if (this.selectedNetwork) {
        if (this.networkId !== this.selectedNetwork.id) {
          try {
            await Moralis.switchNetwork(this.selectedNetwork.moralisId)
            this.loadNetwork(true)
          } catch (err) {
            this.init()
          }
        }
      }
    },
  },
  created () {
    this.init()
  }
}
</script>

<style scoped>
</style>
