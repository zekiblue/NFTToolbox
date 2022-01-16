<template>
  <div>

 <Preloader v-show="!initializationDone" text="loading..."></Preloader>

  <v-toolbar v-if="initializationDone" flat dark color="grey darken-2">
    <v-toolbar-title class="ml-4 mr-4">
      Watchlist
    </v-toolbar-title>

    <v-menu offset-y>
      <template v-slot:activator="{ on, attrs }">
        <v-btn small
          class="mr-4"
          color="grey lighten-2"
          dark outlined
          v-bind="attrs"
          v-on="on"
        >
        Account Watchlist
        </v-btn>
      </template>
      <v-list>

        <v-list-item
          dense
          key="me"
        >
          <v-list-item-title class="text-center">
            <UserSummary
              markself
              :address="myAddress"
              :myaddress="myAddress"
              :frontdigits="4"
              :enddigits="4"
            ></UserSummary>
          </v-list-item-title>
        </v-list-item>

        <v-list-item
          dense
          v-for="(item, index) in account.followeeList"
          :key="index"
        >
          <v-list-item-title class="text-center">
            <UserSummary
              :address="item"
              :frontdigits="4"
              :enddigits="4"
            ></UserSummary>
          </v-list-item-title>
        </v-list-item>

      </v-list>
    </v-menu>

    <v-menu offset-y class="mr-2">
      <template v-slot:activator="{ on, attrs }">
        <v-btn small
          color="grey lighten-2"
          dark outlined
          v-bind="attrs"
          v-on="on"
        >
        NFT Watchlist
        </v-btn>
      </template>
      <v-list>

        <v-list-item
          dense
          v-for="(item, index) in account.nftLikeList"
          :key="index"
        >
          <v-list-item-title class="text-center">
            <NFTShortInfo
              :contractaddress="item.contractAddress"
              :tokenid="item.tokenId"
              :frontdigits="4"
              :enddigits="4"
            ></NFTShortInfo>
          </v-list-item-title>
        </v-list-item>

      </v-list>
    </v-menu>





  </v-toolbar>



  <v-container v-if="initializationDone" fluid>

    <div class="px-5">

      <v-tabs
        v-model="tab"
        background-color="transparent"
        color="black"
        grow
      >
        <v-tab key="tab1" class="grey lighten-4">
          Account Watchlist
        </v-tab>
        <v-tab key="tab2" class="grey lighten-4">
          NFT Watchlist
        </v-tab>
      </v-tabs>

      <v-tabs-items v-model="tab">

        <v-tab-item key="tab1" class="">

          <h2 class="text-center mt-4">Account Watchlist</h2>
          <div class="text-center mb-4">(Powered by Moralis)</div>

          <div v-if="account.followeeList.length == 0" class="text-center py-7">
              Account Watchlist Currently Empty
          </div>


          <v-slide-group v-if="account.followeeList.length > 0" class="blue lighten-5 pa-3 text-center mx-auto mt-4"
            multiple
            show-arrows
          >
            <v-slide-item
              v-for="(item, index) in account.followeeList"
              :key="index"
              v-slot="{ active, toggle }"
            >

              <UserSummary class="ma-2"
                :address="item"
                :frontdigits="4"
                :enddigits="4"
              ></UserSummary>

            </v-slide-item>

          </v-slide-group>


          <EventListOpenSea v-if="initializationDone"
            :listofuseraddress="account.followeeList"
            :networkid="network.id"
            multiple
          >
          </EventListOpenSea>


        </v-tab-item>


        <v-tab-item key="tab2">

          <h2 class="text-center mt-4">NFT Watchlist</h2>
          <div class="text-center mb-4">(Powered by Moralis)</div>

          <div v-if="account.nftLikeList.length == 0" class="text-center py-7">
              NFT Watchlist Currently Empty
          </div>

          <v-slide-group v-if="account.nftLikeList.length > 0" class="blue lighten-5 pa-3 mx-auto mt-4"
            multiple
            show-arrows
          >
            <v-slide-item
              v-for="(item, index) in account.nftLikeList"
              :key="index"
              v-slot="{ active, toggle }"
            >

              <NFTShortInfo class="ma-2"
                :contractaddress="item.contractAddress"
                :tokenid="item.tokenId"
                :frontdigits="4"
                :enddigits="4"
              ></NFTShortInfo>

            </v-slide-item>

          </v-slide-group>


          <EventListOpenSea v-if="initializationDone"
            :listofnft="account.nftLikeList"
            :networkid="network.id"
            multiple
          >
          </EventListOpenSea>

        </v-tab-item>

      </v-tabs-items>

    </div>

  </v-container>

  </div>
</template>

<script>
import Moralis from 'moralis'
import BalanceListMoralis from "@/components/BalanceListMoralis"
import NFTListMoralis from "@/components/NFTListMoralis"
import NFTListNFTPort from "@/components/NFTListNFTPort"
import UserActivityListNFTPort from "@/components/UserActivityListNFTPort"
import UserActivityListMoralis from "@/components/UserActivityListMoralis"
import EventListOpenSea from "@/components/EventListOpenSea"
import Preloader from "@/components/Preloader"
import UserSummary from "@/components/UserSummary"
import NFTShortInfo from "@/components/NFTShortInfo"
import UserInfo from "@/components/UserInfo"
import UserSearch from "@/components/UserSearch"
import {mapActions, mapGetters, mapState} from 'vuex'
// import { getCurrentNetworkID, getCurrentAccount } from '@/utils/utils'
import { config } from '@/config'

export default {
  components: {
    Preloader,
    BalanceListMoralis,
    NFTListNFTPort,
    NFTListMoralis,
    UserActivityListNFTPort,
    UserActivityListMoralis,
    EventListOpenSea,
    UserSummary,
    NFTShortInfo,
    UserInfo,
    UserSearch,
  },
  data: () => ({
    tab: null,
    loading: true,
    initializationDone: false,
    apiURL: {
      NFTList: null,
      activityList: null,
    },
    userAddress: null,
    thisIsMyself: false,
  }),
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
      console.log('user init...')
      this.initializationDone = false
      await this.loadNetwork()
      await this.loadAccount()
      console.log(this.account)
      console.log('my Address: ' + this.myAddress)

      if ('userAddress' in this.$route.params) {
        this.userAddress = this.$route.params.userAddress
        if (this.userAddress == this.myAddress) {
          this.thisIsMyself = true
        }
        else {
          this.thisIsMyself = false
        }
      }
      else {
        this.userAddress = this.myAddress
      }
      console.log('userAddress', this.userAddress)

      // const currentUser = Moralis.User.current()
      // console.log('currentUser', currentUser)
      // const accountFollowed = currentUser.get('accountFollowed')
      // // const accountFollowed = currentUser.get('accountFollowed')
      // currentUser.addUnique('accountFollowed', '0xa679c6154b8d4619af9f83f0bf9a13a680e01ecf')
      // await currentUser.save()
      // console.log('accountFollowed', currentUser.accountFollowed)


      this.initializationDone = true

      let chainName = 'ethereum'
      if (this.network.id == 137) {
        chainName = 'polygon'
      }
      this.apiURL.NFTList = config.NFTPortAPI.URLRoot
                + '/v0/accounts/' + this.userAddress
               + '?include=metadata&chain=' + chainName
                // + '&order_direction=desc'

      this.apiURL.activityList = config.NFTPortAPI.URLRoot + '/'
        + 'events?account_address=' + this.userAddress
        + '&event_type=successful'
        + '&only_opensea=false'

    },


  },
  created () {
    this.init()
  },

}
</script>
