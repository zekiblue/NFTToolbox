<template>
<div>
<v-container fluid class="cover-banner pt-5">
  <v-layout row>
    <v-flex xs12 md6 pa-5 class="hidden-sm-and-down">
      <div class="text-center">
        <!--
        <v-icon dark color="#b0f9b2" style="font-size: 300px">home</v-icon>
      -->
      <v-img :aspect-ratio="1/1"
        class="mx-auto"
        style="padding: 120px; max-width: 400px;"
        src="/images/toolbox.png" />
      </div>
    </v-flex>
    <v-flex xs12 md6 pa-5>
      <div class="mx-auto text-center" style="max-width: 500px">
        <h1 style="color: #FFF; margin-top: 40px; margin-bottom: 20px">Powerful Tools to Take Your NFT Experience to Another Level</h1>
        <LoginForm />
      </div>
    </v-flex>
  </v-layout>
</v-container>

<v-container>
  <div class="mx-auto text-center my-4" style="max-width: 800px; color: rgb(155, 155, 155);">
    <h2>NFT Toolbox is a suite of online tools for NFT collection, NFT discovery and NFT trading.</h2>
  </div>
</v-container>


<div style="max-width: 900px; margin-top: 10px; margin-bottom: 30px; padding-top: 30px; padding-bottom: 30px" class="mx-auto mb-4" >
  <v-row>
    <v-col class="pa-5 blue lighten-4 rounded-xl mx-2">
      <h1 class="mb-3 text-center">Discovery</h1>
      <ul class="text-subtitle-1">
        <li>Search NFTs with Text or Image</li>
        <li>AI based NFT Counterfeit Detection</li>
      </ul>
    </v-col>
    <v-col class="pa-5 blue lighten-4 rounded-xl mx-2">
      <h1 class="mb-3 text-center">Tracking</h1>
      <ul class="text-subtitle-1">
        <li>Account Watchlist: Keep Track of Other NFT Collectors or Traders</li>
        <li>NFT Watchlist: Keep Track of NFTs That You Are Interested</li>
      </ul>
    </v-col>
    <v-col class="pa-5 blue lighten-4 rounded-xl mx-2">
      <h1 class="mb-3 text-center">Trading</h1>
      <ul class="text-subtitle-1">
        <li>Discover the Lowest Prices for NFTs</li>
      </ul>
    </v-col>
  </v-row>
</div>

<div class="lime lighten-5 mx-auto text-center my-4" style="margin-top: 30px; padding-top: 60px; padding-bottom: 60px">
  <h1 class="grey--text mb-6">Powered By</h1>
  <v-row style="max-width: 900px;" class="mx-auto">
    <v-col class="px-3 py-5 text-center mx-2">
      <v-img src="https://dl.airtable.com/.attachments/4e08415264067efd3bb33bcb4462ad5c/a696f75c/MoralisLogo_Dark.svg" style="max-width: 200px"></v-img>
    </v-col>
    <v-col class="px-3 py-5 text-center mx-2">
      <v-img src="https://dl.airtable.com/.attachments/9fa8964d59adf40e8b3b34fe6a5c6351/b1c6fbba/Group.svg" style="max-width: 200px"></v-img>
    </v-col>
    <v-col class="px-3 py-5 text-center mx-2">
      <v-img src="https://dl.airtable.com/.attachments/e262113402d7d2644f1fedb9b36470cf/9e58ab8d/opensea.svg" style="max-width: 200px"></v-img>
    </v-col>
  </v-row>
</div>


</div>
</template>

<script>
import LoginForm from "@/components/LoginForm"
export default {
  components: {
    LoginForm
  }

};
</script>

<style scoped>
.cover-banner {
  /*background-color: #ffe8db;*/
  background: linear-gradient(0deg, rgba(52,176,222,1) 0%, rgba(13,104,171,1) 100%);
}
</style>
