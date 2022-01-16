import { config } from '@/config'
import { getWeb3Accounts } from '@/utils/utils'
import Vue from 'vue'
import * as Web3 from 'web3'
import Moralis from 'moralis'

// --------------------------------------------------------
function _getCurrentTime() {
  return (new Date()).getTime()
}



export default {

 // ---------------------------------------------------------------------
  // loadNetwork
  //----------------------------------------------------------------------
  async loadNetwork ({commit, state, dispatch}, noCache=false) {

    // console.log('Action: loadNetwork')

    const now = _getCurrentTime()
    if (!noCache && state.network.lastLoadTime && now - state.network.lastLoadTime <= config.cacheTime.network) {
      return
    }


    // Non-dapp browsers...
    if (!window.web3) {
      throw new Error('No Web3')
    }

    // console.log(window.web3)
    console.log('Using Web3 Version: ', window.web3.version)

    // Get Network Info
    const networkId = await window.web3.eth.net.getId()

    let networkName = null
    console.log('networkID: ', networkId)

    if (config.supportedNetworks[networkId]) {
      networkName = config.supportedNetworks[networkId]
    }
    else {
      throw new Error('Network not supported')
    }

    // Get User Account
    try {
      const accounts = await window.web3.eth.getAccounts()
      const myAccount = accounts[0].toLowerCase()

      const network = {
        lastLoadTime: now,
        id: networkId,
        name: networkName,
        userAccount: myAccount,
      }

      commit('setNetwork', network)

    } catch (err) {
      console.log(err)
    }


    return
  },

  // ---------------------------------------------------------------------
  // loadAccount
  //----------------------------------------------------------------------
  async loadAccount ({commit, state, dispatch}, noCache=false) {

    console.log('Action: loadAccount')
    if (noCache) {
      console.log('loadAccount No Cache')
    }

    const now = _getCurrentTime()
    if (!noCache && state.account.lastLoadTime && now - state.account.lastLoadTime <= config.cacheTime.account) {
      // console.log('no need to reload account')
      return
    }

    if (!state.network.lastLoadTime) {
      await dispatch('loadNetwork')
    }
    if (!state.network.userAccount) {
      throw new Error ("Cannot get userAccount")
    }
    const networkId = state.network.id
    const myAddress = state.network.userAccount

    const account = {
      lastLoadTime: null,
      nftLikeList: [],
      followeeList: [],
    }

    const currentUser = Moralis.User.current()

    // Get User Following Info
    try {
      const accountFollowed = await currentUser.get('accountFollowed')
      if (accountFollowed) {
          account.followeeList = accountFollowed
      }
      // else {
      //   account.followeeList = []
      // }
    } catch (err) {
      console.log(err)
      throw new Error ("Cannot get User following info")
    }

    // Get NFT following
    try {
      let columnName = 'nftFollowed'
      if (networkId == 137) {
        columnName = 'nftFollowedPolygon'
      }
      const nftFollowed = await currentUser.get(columnName)
      if (nftFollowed) {
          account.nftLikeList = nftFollowed
      }
      // else {
      //   account.nftLikeList = []
      // }
    } catch (err) {
      console.log(err)
      throw new Error ("Cannot get User following info")
    }

    account.lastLoadTime = now

    console.log('account', account)

    commit('setAccount', account)

  },

}


