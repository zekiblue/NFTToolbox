<template>
  <div>

    <Preloader v-show="!dataLoaded" text="loading..."></Preloader>

      <div v-if="dataLoaded" class="text-center py-7">
        <div v-if="loadingError">
          <!-- <v-alert dense outlined type="error">{{ loadingError }}</v-alert> -->
          Could not get NFT lower Price
        </div>
        <div v-else>

          <div v-if="priceData && priceData.price">

            <p>Lowest Price: {{ priceData.price }}</p>

            <p v-if="priceData.buyer_address && priceData.seller_address">

              Buyer:

              <UserSummary
                :address="priceData.buyer_address"
                class="mx-1 my-1"
              ></UserSummary>

              Seller:

              <UserSummary
                :address="priceData.seller_address"
                class="mx-1 my-1"
              ></UserSummary>

            </p>

            <div v-if="priceData.token_ids.length > 0">

              <p class="text-center my-2">NFTs with lowest price</p>

              <p>

                <span class="my-3 mx-3"
                  v-for="(item, index) in priceData.token_ids"
                  :key="index"
                >
                    <NFTShortInfo
                      :contractaddress="priceData.token_address"
                      :tokenid="item"
                      :frontdigits="4"
                      :enddigits="4"
                    ></NFTShortInfo>

                </span>
              </p>


            </div>

          </div>
          <div v-else>
            Cannot get lowest price.
          </div>

        </div>
      </div>

  </div>
</template>

<script>
import Moralis from 'moralis'
import Preloader from "@/components/Preloader"
import UserSummary from "@/components/UserSummary"
import NFTShortInfo from "@/components/NFTShortInfo"
import { fromWeiToEther } from '@/utils/utils'
import { config } from '@/config'

export default {
  props: {
    networkid: { type: Number },
    contractaddress: { type: String },
    days: { type: Number, default: 3 },
  },
  components: {
    Preloader,
    UserSummary,
    NFTShortInfo
  },
  data: () => ({
    priceData: null,
    loading: true,
    dataLoaded: false,
    loadingError: null,
  }),
  computed: {
  },
  methods: {
    async init() {
      this.getLowestNFTPriceUsingMoralis()
    },

    async getLowestNFTPriceUsingMoralis() {

      // console.log('getLowestNFTPriceUsingMoralis')

      this.loading = true
      this.loaded = false

      try {

        const moralisNetworkSymbol = config.moralisNetworkSymbol[this.networkid]

        const options = { 
          chain: moralisNetworkSymbol, 
          address: this.contractaddress,
          days: this.days,
        }
        // console.log(options)
        const res = await Moralis.Web3API.token.getNFTLowestPrice(options)
        console.log('moralis lowest price', res)
        this.priceData = res

        this.dataLoaded = true
      } catch (err) {
        console.log(err)
        this.loadingError = "Error: Loading Lowest Price Failed."
        this.dataLoaded = true
        // this.showNotification('error', 'Error occurred!')
      } finally {
        this.loading = false
      }

    },

  },
  created () {
    this.init()
  },

}
</script>
