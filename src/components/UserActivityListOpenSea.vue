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
        <UserActivityOpenSea
          v-for="(item, i) in ActivityList"
          :info = "item"
          :key = "'activity-' + i"
          :useraddress = "useraddress"
          :networkid = "network.id"
          :hidenftinfo = "hidenftinfo"
        >
        </UserActivityOpenSea>
        </tbody>
        </template>
      </v-simple-table>

      <div v-if="!allActivityLoaded" class="my-4 text-center">
        <Preloader v-show="activityLoading" text="loading..."></Preloader>
        <v-btn v-show="!activityLoading" @click="getUserActivitiesUsingOpenSea">
          Load More Activities <v-icon>mdi-refresh</v-icon>
        </v-btn>
      </div>

    </div>


  </div>
</template>

<script>
import UserActivityOpenSea from "@/components/UserActivityOpenSea"
import Preloader from "@/components/Preloader"
import {mapActions, mapGetters, mapState} from 'vuex'
// import { getCurrentNetworkID, getCurrentAccount } from '@/utils/utils'
import { config } from '@/config'

export default {
  props: {
    apiurl: { type: String },
    batchsize: { type: Number, default: 50 },
    title: { type: String, default: '' },
    useraddress: { type: String, default: '' },
    hidenftinfo: { type: Boolean, default: false },
  },
  components: {
    Preloader,
    UserActivityOpenSea,
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
      this.getUserActivitiesUsingOpenSea()
    },

    async getUserActivitiesUsingOpenSea() {

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
        const res = await this.$http.get(apiURL)
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

  },
  created () {
    this.init()
  },

}
</script>
