<template>
  <div>

 <Preloader v-show="!initializationDone" text="loading..."></Preloader>

  <v-toolbar v-if="initializationDone" flat dark color="grey darken-2">
    <v-toolbar-title>
      <v-icon class="mb-1" large color="orange lighten-1">mdi-account</v-icon>
      Home
    </v-toolbar-title>

    <v-spacer></v-spacer>

    <UserSearch />

  </v-toolbar>



  <v-container v-if="initializationDone" fluid>

    <div class="px-5">

      <UserInfo
        :address="myAddress"
        :myaddress="myAddress"
        :networkid = "network.id"
        :myfollowers = "account.followerList"
        :myfollowees = "account.followeeList"
        v-on:user-following-change="loadAccount(true)"
      />

      <v-tabs
        v-model="tab"
        background-color="transparent"
        color="black"
        grow
      >
        <v-tab key="tab1" class="orange lighten-4">
          My NFTs
        </v-tab>
        <v-tab key="tab2" class="orange lighten-4">
          My Tokens
        </v-tab>
        <v-tab key="tab3" class="orange lighten-4">
          MY ACTIVITIES
        </v-tab>
      </v-tabs>

      <v-tabs-items v-model="tab">

        <v-tab-item key="tab1" class="">

          <NFTListMoralis v-if="initializationDone">
          </NFTListMoralis>

        </v-tab-item>

        <v-tab-item key="tab2" class="">

          <BalanceListMoralis v-if="initializationDone">
          </BalanceListMoralis>
          
        </v-tab-item>


        <v-tab-item key="tab3">

        </v-tab-item>

      </v-tabs-items>

    </div>

  </v-container>

  </div>
</template>

<script>
import BalanceListMoralis from "@/components/BalanceListMoralis"
import NFTListMoralis from "@/components/NFTListMoralis"
import NFTCardMoralis from "@/components/NFTCardMoralis"
import UserActivityListOpenSea from "@/components/UserActivityListOpenSea"
import UserActivityOpenSea from "@/components/UserActivityOpenSea"
import Preloader from "@/components/Preloader"
import UserSummary from "@/components/UserSummary"
import UserInfo from "@/components/UserInfo"
import UserSearch from "@/components/UserSearch"
import {mapActions, mapGetters, mapState} from 'vuex'
// import { getCurrentNetworkID, getCurrentAccount } from '@/utils/utils'
import { config } from '@/config'

export default {
  components: {
    Preloader,
    BalanceListMoralis,
    NFTListMoralis,
    NFTCardMoralis,
    UserActivityListOpenSea,
    UserActivityOpenSea,
    UserSummary,
    UserInfo,
    UserSearch,
  },
  data: () => ({
    tab: null,
    loading: true,
    initializationDone: false,
    apiURL: {
      myNFTList: null,
      myActivityList: null,
    },
  }),
  computed: {
    ...mapGetters({
      // config: 'getConfig',
      network: 'getNetwork',
      account: 'getAccount',
      myAddress: 'getUserAccount',
    }),
    apiURLForlikedNFTList: function () {
      if (this.initializationDone) {
        let url = config.openseaAPI[this.network.id].URLRoot + '/assets?order_direction=desc'
        for (const item of this.account.nftLikeList) {
          url += '&asset_contract_addresses=' + item.contractAddress
          url += '&token_ids=' + item.tokenId
        }
        return url
      }
      else {
        return null
      }
    },
  },
  methods: {
    ...mapActions(['loadNetwork', 'loadAccount']),
    async init(noCache=false) {
      console.log('home init...')
      this.initializationDone = false
      await this.loadNetwork()
      await this.loadAccount(noCache)
      console.log(this.account)
      console.log('my Address: ' + this.myAddress)

      this.initializationDone = true

      // this.apiURL.myNFTList = config.openseaAPI[this.network.id].URLRoot + '/'
      //           + 'assets?owner=' + this.myAddress

      // this.apiURL.myActivityList = config.openseaAPI[this.network.id].URLRoot + '/'
      //   + 'events?account_address=' + this.myAddress
      //   + '&event_type=successful'
      //   + '&only_opensea=false'

    },


  },
  created () {
    this.init()
  },

}
</script>
