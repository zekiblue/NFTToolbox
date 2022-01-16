
function _getCurrentTime() {
  return (new Date()).getTime()
}

//------------------------------------------------------------------
//
//------------------------------------------------------------------
export const fromEtherToWei = function (input, decimals=2) {
  const inputAmount = input.toString()
  const result = window.web3.utils.toWei(inputAmount, 'ether')
  return parseFloat(result).toFixed(decimals)
}

//------------------------------------------------------------------
//
//------------------------------------------------------------------
export const fromWeiToEther = function (input, decimals=2) {
  const inputAmount = input.toString()
  const result = window.web3.utils.fromWei(inputAmount, 'ether')
  return parseFloat(result).toFixed(decimals)
}

//------------------------------------------------------------------
//
//------------------------------------------------------------------
export const getFromLocalStorage = function (key, cacheTime=6000000) {
  const localStored = localStorage.getItem(key)
  if (localStored) {
    const info = JSON.parse(localStored)
    const now = _getCurrentTime()
    if (info.cacheCreated && now - info.cacheCreated < cacheTime) {
      return info
    }
    else {
      localStorage.removeItem(key)
      return null
    }
  }
  else {
    return null
  }
}

//------------------------------------------------------------------
//
//------------------------------------------------------------------
export const saveToLocalStorage = function (key, info, cacheTime=6000000) {
  const now = _getCurrentTime()
  info.cacheCreated = now
  if (localStorage.getItem(key)) {
    localStorage.removeItem(key)
  }
  localStorage.setItem(key, JSON.stringify(info))

}

//------------------------------------------------------------------
//
//------------------------------------------------------------------
export const getCurrentNetworkID = async function () {
  if (!window.web3) {
    console.error("window.web3 not found")
    return null
  }
  const networkId = await window.web3.eth.net.getId()
  return networkId
}

//------------------------------------------------------------------
//
//------------------------------------------------------------------
export const getCurrentAccount = async function () {
  if (!window.web3) {
    console.error("window.web3 not found")
    return null
  }
  const accounts = await window.web3.eth.getAccounts()
  // const accounts = await getWeb3Accounts()
  return accounts[0].toLowerCase()
}

//------------------------------------------------------------------
//
//------------------------------------------------------------------
export const sendTx = async function (txObject, userAddress, toAddress, value) {
  const nonce = await window.web3.eth.getTransactionCount(userAddress);

  const txData = txObject.encodeABI()
  // const networkId = await web3.eth.net.getId()

  const txParams = {
    from: userAddress,
    to: toAddress,
    data: txData,
    value: value,
    // chainId: networkId,
    // gasPrice,
  }

  console.log(txParams)

  try {
    const signedTx = await window.web3.eth.sendTransaction(txParams);
    return window.web3.eth.sendSignedTransaction(signedTx.raw);
  } catch (err) {
    console.log(err)
    return null
  }
}

//------------------------------------------------------------------
//
//------------------------------------------------------------------
export const getWeb3Accounts = () => {
  return new Promise((resolve, reject) => {
    if (window.web3) {
      window.web3.eth.getAccounts((err, accounts) => {
        if(err !== null) return reject(err)
        return resolve(accounts)
      })
    }
    else {
      console.log('No Web3')
      return reject('No Web3')
    }
  })
}


//------------------------------------------------------------------
//
//------------------------------------------------------------------
export const Web3SignMessage = (message, myAddress) => {
  console.log('Web3SignMessage for address: ', myAddress)
  return new Promise((resolve, reject) => {
    if (window.web3) {
      const msg = window.web3.utils.utf8ToHex(message)
      try {
        window.web3.eth.sign(msg, myAddress, (result) => {
          console.log(result)
          return resolve(result)
        })
      } catch (err) {
        return reject(err)
      }
    }
    else {
      console.log('No Web3')
      return reject('No Web3')
    }
  })
}

// -------------------------------------------------------------------
//
// -------------------------------------------------------------------
export const isProductionCode = function () {
	const hostName = window.location.hostname
  if (hostName && !hostName.includes('localhost') && !hostName.includes('app-st')) {
    return true
  }
  else {
    return false
  }
}
