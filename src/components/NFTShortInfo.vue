<template>
<span>
  <v-chip v-if="!isNullAddress" :id="'nft-minimum-info-' + contractaddress + ':' + tokenid" :to="{ name: 'nft', params: {contractAddress: contractaddress, tokenId: tokenid } }">
    <v-icon left color="success">mdi-image-outline</v-icon>
    <span>{{ shortAddress }} | {{ shortId }}</span>
  </v-chip>
  <v-chip v-if="isNullAddress">
    <v-icon left color="success">mdi-account-outline</v-icon>
    <span>NULL</span>
  </v-chip>
</span>
</template>

<script>

export default {
  props: {
    contractaddress: { type: String },
    tokenid: { type: String },
    fulladdress: { type: Boolean, default: false },
    frontdigits: { type: Number, default: 0 },
    enddigits: { type: Number, default: 4 },
  },
  data () {
    return {}
  },
  computed: {
    shortAddress: function () {
      const frontToKeep = parseInt(this.frontdigits)
      const endToKeep = parseInt(this.enddigits)
      const endIndexStart = this.contractaddress.length - endToKeep
      return this.contractaddress.substring(0, frontToKeep) + '...' + this.contractaddress.substring(endIndexStart)
    },
    shortId: function () {
      const frontToKeep = parseInt(this.frontdigits)
      const endToKeep = parseInt(this.enddigits)
      const endIndexStart = this.tokenid.length - endToKeep
      if (this.tokenid.length <= frontToKeep + endToKeep + 3) {
        return this.tokenid
      }
      else {
        return this.tokenid.substring(0, frontToKeep) + '...' + this.tokenid.substring(endIndexStart)
      }
    },
    isMyself: function() {
      return (this.myaddress && this.myaddress.toLowerCase() == this.contractaddress.toLowerCase())
    },
    isNullAddress: function () {
      if (!this.contractaddress) {
        return true
      }
      else if (this.contractaddress.toLowerCase() == '0x0000000000000000000000000000000000000000') {
        return true
      }
      else {
        return false
      }
    }
  },
  methods: {
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
