<template>
  <v-footer
    color="black"
    dark
    class="text-center"
  >

  <v-container>
    <v-layout>
      <v-flex pa-10>
        <small>© Copyright by NFT Toolbox</small>
        <div v-if="isProductionCode" class="text-center">
          <div v-html="statCounterTrackingCode"></div>
        </div>

      </v-flex>
    </v-layout>
  </v-container>

  </v-footer>

</template>

<script>
import { config } from '@/config'
import { isProductionCode } from '@/utils/utils'
export default {
  data () {
    return {
      config: config,
      statCounterTrackingCode: '<img class="statcounter" src="https://c.statcounter.com/12531905/0/acbdb3d6/1/">'
    }
  },
  computed: {
    isProductionCode: isProductionCode
  },
}
</script>