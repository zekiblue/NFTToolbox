export default {

  getConfig: state => state.config,
  getNetwork: state => state.network,
  getAccount: state => state.account,
  getUserAccount: state => state.network.userAccount,

}
