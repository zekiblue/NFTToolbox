<template>
<tr class="text-body-2">

    <td v-show="useraddress">
      <v-chip v-if="eventNameDisplay.toLowerCase() == 'buy'" color="green" text-color="white" small>
        {{ eventNameDisplay }}
      </v-chip>
      <v-chip v-if="eventNameDisplay.toLowerCase() == 'sell'" color="amber darken-3" text-color="white" small>
        {{ eventNameDisplay }}
      </v-chip>
    </td>

    <td v-show="!hidenftinfo">
      <v-list-item v-if="imageDisplay" :to="{ name: 'nft', params: { contractAddress: info.asset.asset_contract.address, tokenId: info.asset.token_id } }">
        <v-img
        :src="imageDisplay"
        :aspect-ratio="1/1"
        width="40" height="40"
        >
          <template v-slot:placeholder>
            <v-row
              class="fill-height ma-0"
              align="center"
              justify="center"
            >
              <v-progress-circular
                indeterminate
                color="grey lighten-3"
              ></v-progress-circular>
            </v-row>
          </template>
        </v-img>
      </v-list-item>
    </td>

    <td v-show="!hidenftinfo">
      <v-list-item v-if="nameDisplay"
        :to="{ name: 'nft', params: { contractAddress: info.asset.asset_contract.address, tokenId: info.asset.token_id } }" 
        class="text-body-2">
        {{ nameDisplay }}
      </v-list-item>
    </td>

    <td class="text-center text-no-wrap">

      <span v-if="accountFrom">
        <UserSummary v-if="accountFrom != useraddress.toLowerCase()"
            :address="accountFrom"
            class="mx-1 my-1"
        ></UserSummary>
        <v-icon v-if="accountFrom == useraddress.toLowerCase()" color="success">mdi-account</v-icon>
      </span>

      <v-icon color="success">mdi-arrow-right</v-icon>

      <span  v-if="accountTo">
        <UserSummary v-if="accountTo != useraddress.toLowerCase()"
            :address="accountTo"
            class="mx-1 my-1"
        ></UserSummary>
        <v-icon v-if="accountTo == useraddress.toLowerCase()" color="success">mdi-account</v-icon>
      </span>

    </td>

    <td class="text-center text-body-2 px-1 text-no-wrap">
      {{ priceDisplay }} ETH
    </td>

    <td class="text-center text-body-2 px-1 text-no-wrap">
      <span v-if="info.quantity"> {{ info.quantity }}</span>
    </td>

    <td class="text-center text-body-2 text-no-wrap">
        {{ timeStamp }}
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
    hidenftinfo: { type: Boolean, default: false },
  },
  data () {
    return {
    }
  },
  components: {
    UserSummary,
  },
  computed: {
    eventNameDisplay: function() {
      if (this.info.event_type == 'successful') {
        if (this.accountFrom == this.useraddress.toLowerCase()) {
          return "Sell"
        }
        else if (this.accountTo == this.useraddress.toLowerCase()) {
          return "Buy"
        }
        else {
          return 'Sale'
        }
      }
      else {
        return this.info.event_type
      }
    },
    nameDisplay: function() {
      if (this.info.asset && this.info.asset.name) {
        return this.info.asset.name
      }
      else if (this.info.asset_bundle && this.info.asset_bundle.name) {
        return '[Bundle] ' + this.info.asset_bundle.name
      }
      else {
        return null
      }
    },
    imageDisplay: function() {
      if (this.info.asset && this.info.asset.image_thumbnail_url) {
        return this.info.asset.image_thumbnail_url
      }
      else if (this.info.asset_bundle && this.info.asset_bundle.assets
        && this.info.asset_bundle.assets[0] && this.info.asset_bundle.assets[0].image_thumbnail_url) {
        return this.info.asset_bundle.assets[0].image_thumbnail_url
      }
      else {
        return null
      }
    },
    priceDisplay: function() {
      if (this.info.event_type == 'successful') {
        if (this.info.total_price) {
          return fromWeiToEther(this.info.total_price, 4)
        }
        else {
          return ''
        }
      }
      else {
        if (this.info.ending_price) {
          return fromWeiToEther(this.info.ending_price, 4)
        }
        else {
          return ''
        }
      }
    },
    timeStamp: function () {
      if (this.info.created_date) {
          return this.info.created_date.substr(0,10)
      }
      else {
          return ''
      }
    },
    accountFrom: function () {
      if (this.info.event_type == 'successful') {
        if (this.info.seller && this.info.seller.address) {
          return this.info.seller.address.toLowerCase()
        }
        else {
          return null
        }
      }
      else {
        if (this.info.from_account && this.info.from_account.address) {
          return this.info.from_account.address.toLowerCase()
        }
        else {
          return null
        }
      }
    },
    accountTo: function () {
      if (this.info.event_type == 'successful') {
        if (this.info.winner_account && this.info.winner_account.address) {
          return this.info.winner_account.address.toLowerCase()
        }
        else {
          return null
        }
      }
      else {
        if (this.info.to_account && this.info.to_account.address) {
          return this.info.to_account.address.toLowerCase()
        }
        else {
          return null
        }
      }
    },
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
