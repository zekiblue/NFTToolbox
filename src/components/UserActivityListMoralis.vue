<template>
  <div>

    <Preloader v-show="!initialActivityLoaded" text="loading..."></Preloader>

    <div v-if="initialActivityLoaded">

      <div v-if="title" class="text-subtitle-1 font-weight-bold text-center mt-4 mb-2">
        {{ title }}
      </div>

      <div v-if="ActivityList.length == 0" class="text-center py-7">
        <div v-if="ActivityLoadingError">
          <v-alert dense outlined type="error">{{ ActivityLoadingError }}</v-alert>
        </div>
        <div v-else>
          No Recent Activities
        </div>
      </div>

      <v-simple-table>
        <template v-slot:default>
        <tbody>
        <UserActivityMoralis
          v-for="(item, i) in ActivityList"
          :info = "item"
          :key = "'activity-' + i"
          :useraddress = "useraddress"
          :networkid = "networkid"
        >
        </UserActivityMoralis>
        </tbody>
        </template>
      </v-simple-table>

      <div v-if="!allActivityLoaded" class="my-4 text-center">
        <Preloader v-show="activityLoading" text="loading..."></Preloader>
        <v-btn v-show="!activityLoading" @click="getUserActivitiesUsingMoralis">
          Load More Activities <v-icon>mdi-refresh</v-icon>
        </v-btn>
      </div>

    </div>


  </div>
</template>

<script>
import Moralis from 'moralis'
import UserActivityMoralis from "@/components/UserActivityMoralis"
import Preloader from "@/components/Preloader"
import {mapActions, mapGetters, mapState} from 'vuex'
// import { getCurrentNetworkID, getCurrentAccount } from '@/utils/utils'
import { config } from '@/config'

export default {
  props: {
    useraddress: { type: String, default: '' },
    networkid: { type: Number },
    batchsize: { type: Number, default: 50 },
    title: { type: String, default: '' },
  },
  components: {
    Preloader,
    UserActivityMoralis,
  },
  data: () => ({
    continuationStr: null,
    activityLoading: false,
    initialActivityLoaded: false,
    numActivityLoaded: 0,
    allActivityLoaded: false,
    ActivityList: [],
    ActivityLoadingError: null,
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
      this.continuationStr = null
      this.initialActivityLoaded = false
      this.allActivityLoaded = false
      this.numActivityLoaded = 0
      this.getUserActivitiesUsingMoralis()
    },

    async getUserActivitiesUsingMoralis() {

      this.activityLoading = true

      const offset = this.numActivityLoaded
      const limit = this.batchsize

      this.ActivityLoadingError = null
      this.allActivityLoaded = false

      if (this.numActivityLoaded == 0) {
        this.ActivityList = []
        this.initialActivityLoaded = false
      }

      let apiURL = this.apiurl
        + '&offset=' + offset
        + '&limit=' + limit
      console.log(apiURL)

      try {

        const moralisNetworkSymbol = config.moralisNetworkSymbol[this.networkid]

        const options = { 
          chain: moralisNetworkSymbol, 
          address: this.useraddress,
          limit: limit,
          offset: offset,
        }
        console.log(options)
        // const res = await Moralis.Web3API.token.getNFTTrades(options)
        const res = await Moralis.Web3API.account.getNFTTransfers(options)
        console.log('moralis activities', res)

        this.initialActivityLoaded = true
        const items = res.result
        for (let i = 0; i < items.length; i++) {
          const item = items[i]
          this.ActivityList.push(item)
        }
        this.numActivityLoaded += items.length
        if (items.length < limit) {
          this.allActivityLoaded = true
          this.$emit("all-activities-loaded", this.numActivityLoaded)
        }
      } catch (err) {
        console.log(err)
        this.ActivityLoadingError = "Error: Loading User Activities Failed."
        this.initialActivityLoaded = true
        this.allActivityLoaded = true
        // this.showNotification('error', 'Error occurred!')
      } finally {
        this.activityLoading = false
      }

    },

  },
  created () {
    this.init()
  },

}
</script>
