const Express = require('express')
const Promise = require('bluebird')
const Web3 = require('web3')

const app = Express()
const web3 = new Web3('ws://parity:8545')
Promise.promisifyAll(web3)

const kleinABI = require('./IKB.json')
const kleinContract = web3.eth.contract(kleinABI)
const kleinInstance = kleinContract.at('0x88ae96845e157558ef59e9ff90e766e22e480390')

app.get('/', function (req, res) {
  let contract
  kleinInstance.currentSeries.call().then(currentSeries => {
    contract.currentSeries = currentSeries.toNumber()
    return kleinInstance.issuedToDate.call()
  }).then(issuedToDate => {
    contract.issuedToDate = issuedToDate.toNumber()
    return kleinInstance.series.call(contract.currentSeries)
  }).then(series => {
    contract.price = series[0].toNumber()
    return kleinInstance.burnedToDate.call()
  }).then(burnedToDate => {
    contract.burnedToDate = burnedToDate.toNumber()
    return kleinInstance.maxSupplyPossible.call()
  }).then(maxSupplyPossible => {
    contract.maxSupplyPossible = maxSupplyPossible.toNumber()
    return kleinInstance.balanceOf.call(kleinInstance.address)
  }).then(contractBalance => {
    contract.contractBalance = contractBalance.toNumber()
    res.send(contract)
  }).catch(error => {
    console.error(error)
  })
})

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})
