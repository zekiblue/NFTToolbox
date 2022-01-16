import { config } from '@/config'

const network = {
  lastLoadTime: null,
  hasMetaMask: false,
  networkSupported: false,
  id: null,
  name: '',
  metaMaskLoggedIn: false,
  userAccount: null,
}

const account = {
  lastLoadTime: null,
  nftHighlightList: [],
  nftLikeList: [],
  followerList: [],
  followeeList: [],
}

export default {
  config,
  network,
  account,
}

