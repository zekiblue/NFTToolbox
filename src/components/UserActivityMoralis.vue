<template>
<tr class="text-body-2">

  <td>
    {{ timeStamp }}
  </td>

  <td>
    {{ info.transaction_type }}
  </td>

  <td>
      <span v-if="info.from_address">
        <UserSummary v-if="info.from_address != useraddress.toLowerCase()"
            :address="info.from_address"
            class="mx-1 my-1"
        ></UserSummary>
        <v-icon v-if="info.from_address == useraddress.toLowerCase()" color="success">mdi-account</v-icon>
      </span>
  </td>

  <td>
      {{ info.amount }}
  </td>

  <td>
      <span v-if="info.to_address">
        <UserSummary v-if="info.to_address != useraddress.toLowerCase()"
            :address="info.to_address"
            class="mx-1 my-1"
        ></UserSummary>
        <v-icon v-if="info.to_address == useraddress.toLowerCase()" color="success">mdi-account</v-icon>
      </span>
  </td>
   

</tr>
</template>

<script>
import { config } from '@/config'
import UserSummary from "@/components/UserSummary"
import { fromWeiToEther } from '@/utils/utils'
export default {
  props: {
    info: { type: Object },
    networkid: { type: Number },
    useraddress: { type: String, default: '' },
  },
  data () {
    return {
    }
  },
  components: {
    UserSummary,
  },
  computed: {
    // eventNameDisplay: function() {
    //   if (this.info.type ) {
    //     return this.info.type
    //   }
    //   else {
    //     return ''
    //   }
    // },
    // nameDisplay: function() {
    //   if (this.info.asset && this.info.asset.name) {
    //     return this.info.asset.name
    //   }
    //   else if (this.info.asset_bundle && this.info.asset_bundle.name) {
    //     return '[Bundle] ' + this.info.asset_bundle.name
    //   }
    //   else {
    //     return null
    //   }
    // },
    // imageDisplay: function() {
    //   if (this.info.asset && this.info.asset.image_thumbnail_url) {
    //     return this.info.asset.image_thumbnail_url
    //   }
    //   else if (this.info.asset_bundle && this.info.asset_bundle.assets
    //     && this.info.asset_bundle.assets[0] && this.info.asset_bundle.assets[0].image_thumbnail_url) {
    //     return this.info.asset_bundle.assets[0].image_thumbnail_url
    //   }
    //   else {
    //     return null
    //   }
    // },
    // priceDisplay: function() {
    //   if (this.info.event_type == 'successful') {
    //     if (this.info.total_price) {
    //       return fromWeiToEther(this.info.total_price, 4)
    //     }
    //     else {
    //       return ''
    //     }
    //   }
    //   else {
    //     if (this.info.ending_price) {
    //       return fromWeiToEther(this.info.ending_price, 4)
    //     }
    //     else {
    //       return ''
    //     }
    //   }
    // },
    timeStamp: function () {
      if (this.info.block_timestamp) {
          return this.info.block_timestamp.substr(0,10)
      }
      else {
          return ''
      }
    },
    // accountFrom: function () {
    //   if (this.info.event_type == 'successful') {
    //     if (this.info.seller && this.info.seller.address) {
    //       return this.info.seller.address.toLowerCase()
    //     }
    //     else {
    //       return null
    //     }
    //   }
    //   else {
    //     if (this.info.from_account && this.info.from_account.address) {
    //       return this.info.from_account.address.toLowerCase()
    //     }
    //     else {
    //       return null
    //     }
    //   }
    // },
    // accountTo: function () {
    //   if (this.info.event_type == 'successful') {
    //     if (this.info.winner_account && this.info.winner_account.address) {
    //       return this.info.winner_account.address.toLowerCase()
    //     }
    //     else {
    //       return null
    //     }
    //   }
    //   else {
    //     if (this.info.to_account && this.info.to_account.address) {
    //       return this.info.to_account.address.toLowerCase()
    //     }
    //     else {
    //       return null
    //     }
    //   }
    // },
    opensea_url: function () {
      const openseaRootURL = config.openseaURL[this.networkid].assetPage
      const openseaRef = config.openseaURL[this.networkid].affiliateAddress
      if (this.info.asset && this.info.asset && this.info.asset.asset_contract.address && this.info.asset.token_id) {
        return openseaRootURL + this.info.asset.asset_contract.address + '/' + this.info.asset.token_id + '?ref=' + openseaRef
      }
      else if (this.info.asset_bundle && this.info.asset_bundle.permalink) {
        return  this.info.asset_bundle.permalink + '?ref=' + openseaRef
      }
      else {
        return '#'
      }

    },
    // myAddress: function () {
    //   return this.$store.state.userAddress
    // },
  },
  methods: {

    async init() {
      // console.log(this.info)
    },

  },
  created () {
    this.init()
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
