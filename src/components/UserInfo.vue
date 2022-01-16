<template>
  <div>

  <div class="mb-3 pa-2 grey lighten-4">
      <v-row>

        <v-col cols="6" sm="2">

          <v-avatar
            class="ma-5 align-center"
            size="100"
          >
          <v-img src="/images/account-head.png"></v-img>
          </v-avatar>

        </v-col>

        <v-col cols="12" sm="10">

          <v-card-title
            class="headline"
          >
            <v-chip v-show="isMyself"
              class="ma-2"
              color="green"
              text-color="white"
            >
              Me
            </v-chip>
            {{ address }}

            <v-btn icon small v-if="etherscanURL" :href="etherscanURL" target="_blank">
              <v-icon small>mdi-open-in-new</v-icon>
            </v-btn>

          </v-card-title>

          <v-card-subtitle v-text="address"></v-card-subtitle>


          <div v-if="isMyself">

            <span>{{ myfollowees.length }} Following: </span>
            <span v-if="myfollowees.length > 0">
              <UserSummary
                v-for="(item, i) in myfollowees"
                :key="i"
                :address="item"
                class="mx-1 my-1"
              ></UserSummary>
            </span>

          </div>


          <v-card-actions>

            <span v-if="!isMyself && imFollowingThisUser == false">
              <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn small rounded outlined color="grey darken-2"
                    @click="followUser" :disabled="followLoading"
                    v-bind="attrs"v-on="on"
                  >
                    <v-icon>mdi-eye-plus</v-icon> &nbsp; Add to Watchlist
                  </v-btn>
                </template>
                <span><small>Click to follow this user</small></span>
              </v-tooltip>
            </span>

            <span v-if="!isMyself && imFollowingThisUser == true">
              <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn small rounded depressed color="amber darken-3"
                    style="color: white !important"
                    @click="unfollowUser" :disabled="followLoading"
                    v-bind="attrs" v-on="on"
                  >
                    <v-icon>mdi-eye</v-icon> &nbsp; Watched
                  </v-btn>
                </template>
                <span><small>Click to remove from watchlist</small></span>
              </v-tooltip>
            </span>

          </v-card-actions>

        </v-col>
    </v-row>


  </div>



  </div>
</template>

<script>
import Moralis from 'moralis'
import { config } from '@/config'
import UserSummary from "@/components/UserSummary"
import UserSearch from "@/components/UserSearch"
export default {
  props: ['address', 'myaddress', 'networkid', 'myfollowers', 'myfollowees'],
  data () {
    return {
      followLoading: false,
      showSearch: false,
      followUserSuccess: false,
      unfollowUserSuccess: false,
    }
  },
  components: {
    UserSummary,
    UserSearch
  },
  computed: {
    isMyself: function () {
      return this.address.toLowerCase() == this.myaddress.toLowerCase()
    },
    imFollowingThisUser: function () {
      if (this.followUserSuccess === true) {
        return true
      }
      else if (this.unfollowUserSuccess === true) {
        return false
      }
      else {
        return this.myfollowees.includes(this.address)
      }
    },
    thisUserIsFollowingMe: function () {
      return this.myfollowers.includes(this.address)
    },
    shortAddress: function () {
      const frontToKeep = 6
      const endToKeep = 4
      const endIndexStart = this.address.length - endToKeep
      return this.address.substring(0, frontToKeep) + '...' + this.address.substring(endIndexStart)
    },
    etherscanURL: function () {
      return config.network[this.networkid].accountURL + this.address.toLowerCase()
    }
  },
  methods: {

    async followUser () {
      this.followLoading = true
      this.followUserSuccess = false
      this.unfollowUserSuccess = false

      try {
        const currentUser = Moralis.User.current()
        const addressToAdd = this.address.toLowerCase()
        currentUser.addUnique('accountFollowed', addressToAdd)
        await currentUser.save()
        this.followUserSuccess = true
        this.$emit("user-following-change")
      } catch (err) {
        console.error(err)
      } finally {
        this.followLoading = false
      }
    },

    async unfollowUser () {
      this.followLoading = true
      this.followUserSuccess = false
      this.unfollowUserSuccess = false

      try {
        const currentUser = Moralis.User.current()
        const addressToRemove = this.address.toLowerCase()
        currentUser.remove('accountFollowed', addressToRemove)
        await currentUser.save()
        this.unfollowUserSuccess = true
        this.$emit("user-following-change")
      } catch (err) {
        console.error(err)
      } finally {
        this.followLoading = false
      }

      // console.log('unfollowUserSuccess: ' + this.unfollowUserSuccess)
    },

  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
