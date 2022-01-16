<template>
  <div>

    <Preloader v-show="!initialActivityLoaded" text="loading..."></Preloader>

    <div v-if="initialActivityLoaded">

      <div v-if="ActivityList.length == 0" class="text-center py-7">
        <div v-if="ActivityLoadingError">
          <v-alert dense outlined type="error">{{ ActivityLoadingError }}</v-alert>
        </div>
        <div v-else>
          No Recent Activities
        </div>
      </div>

      <h2 class="text-center mt-4 mb-2">Recent Activities</h2>
      <div class="text-center mt-2 mb-4">(Powered by OpenSea)</div>

      <v-simple-table>
        <template v-slot:default>
        <tbody>

        <EventOpenSea
          v-for="(item, i) in ActivityList"
          :info = "item"
          :key = "'activity-' + i"
          :networkid = "networkid"
          :useraddress = "useraddress"
          :hidenftinfo = "hidenftinfo"
        >
        </EventOpenSea>

        </tbody>
        </template>
      </v-simple-table>

      <div v-if="!allActivityLoaded" class="my-4 text-center">
        <Preloader v-show="activityLoading" text="loading..."></Preloader>
        <v-btn v-show="!activityLoading" @click="getEventListUsingOpenSea">
          Load More Activities <v-icon>mdi-refresh</v-icon>
        </v-btn>
      </div>

    </div>


  </div>
</template>

<script>
import EventOpenSea from "@/components/EventOpenSea"
import Preloader from "@/components/Preloader"
import {mapActions, mapGetters, mapState} from 'vuex'
// import { getCurrentNetworkID, getCurrentAccount } from '@/utils/utils'
import { config } from '@/config'

export default {
  props: {
    networkid: { type: Number },
    batchsize: { type: Number, default: 50 },
    useraddress: { type: String, default: '' },
    contractaddress: { type: String, default: '' },
    tokenid: { type: String, default: '' },
    hidenftinfo: { type: Boolean, default: false },
    multiple: { type: Boolean, default: false },
    listofuseraddress: { type: Array, },
    listofnft: { type: Array, },
  },
  components: {
    Preloader,
    EventOpenSea,
  },
  data: () => ({
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
      this.initialActivityLoaded = false
      this.allActivityLoaded = false
      this.numActivityLoaded = 0
      this.getEventListUsingOpenSea()
    },

    async getEventListUsingOpenSea() {

      if (this.multiple) {
        await this.getMultipleEventsUsingOpenSea()
        return
      }

      this.activityLoading = true

      const offset = this.numActivityLoaded
      const limit = this.batchsize

      this.ActivityLoadingError = null
      this.allActivityLoaded = false

      if (this.numActivityLoaded == 0) {
        this.ActivityList = []
        this.initialActivityLoaded = false
      }

      let apiURL = config.openseaAPI[this.networkid].URLRoot + '/events?'
        + 'limit=' + limit + '&offset=' + offset
      if (this.contractaddress) {
        apiURL += '&asset_contract_address=' + this.contractaddress
      }
      if (this.tokenid) {
        apiURL += '&token_id=' + this.tokenid
      }
      if (this.useraddress) {
        apiURL += '&account_address=' + this.useraddress
      }
      console.log(apiURL)

      try {
        const res = await this.$http.get(apiURL, {
          headers: {
             Accept: 'application/json',
            'X-API-KEY': config.openseaAPIKey
          }
        })
        console.log(res)
        this.initialActivityLoaded = true
        const items = res.body.asset_events
        for (let i = 0; i < items.length; i++) {
          const item = items[i]
          this.ActivityList.push(item)
        }
        this.numActivityLoaded += items.length
        if (items.length < limit) {
          this.allActivityLoaded = true
          this.$emit("all-nft-loaded", this.numActivityLoaded)
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


    async getMultipleEventsUsingOpenSea() {

      console.log('getMultipleEventsUsingOpenSea')

      this.activityLoading = true

      const offset = this.numActivityLoaded
      const limit = this.batchsize

      this.ActivityLoadingError = null
      this.allActivityLoaded = false

      if (this.numActivityLoaded == 0) {
        this.ActivityList = []
        this.initialActivityLoaded = false
      }

      const apiURLRoot = config.openseaAPI[this.networkid].URLRoot + '/events?'
        + 'limit=' + limit + '&offset=' + offset

      try {

        const tasks = []

        // console.log('listofuseraddress', this.listofuseraddress)

        if (this.listofnft && this.listofnft.length > 0) {
          for (let i = 0; i < this.listofnft.length; i++) {
            const item = this.listofnft[i]
            const url = apiURLRoot
              + '&asset_contract_address=' + item.contractAddress
              + '&token_id=' + item.tokenId
            const job = this.callOpenSeaEventApi(url)
            tasks.push(job)
          }
        }

        if (this.listofuseraddress && this.listofuseraddress.length > 0) {
          for (let i = 0; i < this.listofuseraddress.length; i++) {
            const item = this.listofuseraddress[i]
            const url = apiURLRoot
              + '&account_address=' + item
            const job = this.callOpenSeaEventApi(url)
            tasks.push(job)
          }
        }

        // console.log('total tasks: ', tasks.length)

        await Promise.all(tasks)

        this.ActivityList.sort(this.compareOpenSeaEvents)
        this.initialActivityLoaded = true

        // console.log('all tasks done')
        console.log(this.ActivityList)

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

    compareOpenSeaEvents ( a, b ) {
      if ( b.created_date.toLowerCase() < a.created_date.toLowerCase()){
        return -1;
      }
      if ( b.created_date.toLowerCase() > a.created_date.toLowerCase()){
        return 1;
      }
      return 0;
    },

    async callOpenSeaEventApi (apiURL) {

      console.log('callOpenSeaEventApi', apiURL)

      try {
        const res = await this.$http.get(apiURL, {
          headers: {
             Accept: 'application/json',
            'X-API-KEY': config.openseaAPIKey
          }
        })
        // console.log(res)
        const items = res.body.asset_events
        for (let i = 0; i < items.length; i++) {
          const item = items[i]
          this.ActivityList.push(item)
        }
        this.numActivityLoaded += items.length
      } catch (err) {
        console.log(err)
        console.log(err)
        // this.showNotification('error', 'Error occurred!')
      } finally {
        // this.activityLoading = false
      }

    }


  },
  created () {
    this.init()
  },

}
</script>
