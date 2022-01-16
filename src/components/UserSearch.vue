<template>

<form onsubmit="visitUserPage">
<v-text-field
  hide-details dense size="46"
  prepend-icon="mdi-account-outline"
  append-outer-icon="mdi-magnify"
  label="Enter User Account Address"
  v-model.address.trim="address"
  placeholder=""
  @click:append-outer="visitUserPage"
  required
></v-text-field>
</form>

</template>

<script>

export default {
  data () {
    return {
      address: null
    }
  },
  computed: {
    shortAddress: function () {
      const frontToKeep = 0
      const endToKeep = 4
      const endIndexStart = this.address.length - endToKeep
      return this.address.substring(0, frontToKeep) + '...' + this.address.substring(endIndexStart)
    }
  },
  methods: {

    visitUserPage() {
      const cleanAddress = this.address.toLowerCase()
      this.$router.push({ name: 'user', params: {userAddress: cleanAddress} })
    },

  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
