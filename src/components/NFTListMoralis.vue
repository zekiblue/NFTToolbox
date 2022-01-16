<template>
  <div>

    <Preloader v-show="!initialNFTLoaded" text="loading..."></Preloader>

    <div v-if="initialNFTLoaded">

      <div v-if="title" class="text-subtitle-1 font-weight-bold text-center mt-4 mb-2">
        {{ title }}
        <span v-if="allNFTLoaded" class="mx-1">
          ({{NFTList.length}})
        </span>
      </div>

      <div v-if="NFTList.length == 0"  class="text-center py-7">
        <div v-if="NFTLoadingError">
          <v-alert dense outlined type="error">{{ NFTLoadingError }}</v-alert>
        </div>
        <div v-else>
          No NFTs
        </div>
      </div>

      <v-layout wrap>
        <v-flex
          v-for="(item, i) in NFTList"
          :key="item.token_address + ':' + item.token_id"
          md3 sm4 xs12
        >

        <NFTCardMoralis
          :info = "item"
          :key = "'nftcard' + i"
          :myaddress = "myAddress"
          :networkid = "network.id"
          :mynftlikelist = "account.nftLikeList"
          v-on:token-like-change="handleLikeChange"
        >
        </NFTCardMoralis>

        </v-flex>
      </v-layout>

      <div v-if="!allNFTLoaded" class="my-4 text-center">
        <Preloader v-show="NFTLoading" text="loading..."></Preloader>
        <v-btn v-show="!NFTLoading" @click="getUserNFTsUsingMoralis">
          Load More NFTs <v-icon>mdi-refresh</v-icon>
        </v-btn>
      </div>

    </div>

  </div>
</template>

<script>
import Moralis from 'moralis'
import NFTCardMoralis from "@/components/NFTCardMoralis"
import Preloader from "@/components/Preloader"
// import { getCurrentNetworkID, getCurrentAccount } from '@/utils/utils'
import {mapActions, mapGetters, mapState} from 'vuex'
import { config } from '@/config'

export default {
  props: {
    useraddress: { type: String },
    batchsize: { type: Number, default: 50 },
    allownftremoval: { type: Boolean, default: false },
    title: { type: String, default: '' },
  },
  data: () => ({
    NFTLoading: false,
    initialNFTLoaded: false,
    numNFTLoaded: 0,
    allNFTLoaded: false,
    NFTList: [],
    NFTLoadingError: null,
  }),
  components: {
    Preloader,
    NFTCardMoralis,
  },
  computed: {
    ...mapGetters({
      // config: 'getConfig',
      network: 'getNetwork',
      account: 'getAccount',
      myAddress: 'getUserAccount',
    }),
  },
  methods: {
    ...mapActions(['loadNetwork', 'loadAccount']),
    async init() {
      console.log('NFTListMoralis init....')
      this.initialNFTLoaded = false
      this.allNFTLoaded = false
      this.numNFTLoaded = 0
      await this.loadNetwork()
      await this.loadAccount()

      this.getUserNFTsUsingMoralis()
    },

    async handleLikeChange(data) {
      // if (this.allownftremoval) {
      //   if (data && data.type && data.type == 'removed') {
      //     // console.log('NEED To REMOVE')
      //     // console.log(data)
      //     this.removeNFTFromList(data.contractAddress, data.token_id)
      //   }
      // }
      // this.loadAccount(true)
    },

    removeNFTFromList (contractAddress, tokenId) {
      // const newList = []
      // for (const item of this.NFTList) {
      //   if (item.asset_contract.address.toLowerCase() != contractAddress ||
      //       item.token_id != tokenId) {
      //     newList.push(item)
      //   }
      // }
      // this.NFTList = newList
    },

    async getUserNFTsUsingMoralis() {

      this.NFTLoading = true

      const offset = this.numNFTLoaded
      const limit = this.batchsize

      this.NFTLoadingError = null
      this.allNFTLoaded = false

      if (this.numNFTLoaded == 0) {
        this.NFTList = []
        this.initialNFTLoaded = false
      }

      try {

        const moralisNetworkSymbol = config.moralisNetworkSymbol[this.network.id]

        let userAddress = null
        if (this.useraddress) {
          userAddress = this.useraddress.toLowerCase()
        }
        else {
          userAddress = this.myAddress
        }
        const options = {
          chain: moralisNetworkSymbol,
          address: userAddress,
          limit: limit,
          offset: offset,
        }
        const res = await Moralis.Web3API.account.getNFTs(options)
        console.log('moralis NFTs', res)

        this.initialNFTLoaded = true
        const items = res.result
        for (let i = 0; i < items.length; i++) {
          const item = items[i]
          if (item.metadata) {
            item.metadata = JSON.parse(item.metadata)
          }
          this.NFTList.push(item)
        }
        console.log('NFTList', this.NFTList)
        this.numNFTLoaded += items.length
        if (items.length < limit) {
          this.allNFTLoaded = true
          this.$emit("all-nft-loaded", this.numNFTLoaded)
        }
        // console.log(this.NFTList)
      } catch (err) {
        console.log(err)
        this.NFTLoadingError = "Error: Getting NFT List Failed."
        this.initialNFTLoaded = true
        this.allNFTLoaded = true
        // this.showNotification('error', 'Error occurred!')
      } finally {
        this.NFTLoading = false
      }

    },

  },
  created () {
    this.init()
  },

}
</script>
