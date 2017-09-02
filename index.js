const Express = require('express')
const Promise = require('bluebird')
const Web3 = require('web3')

const app = Express()
const web3 = new Web3()
web3.setProvider(new web3.providers.HttpProvider('ws://parity:8545'))

const kleinABI = require('./IKB.json')
const kleinContract = new web3.eth.Contract(kleinABI)
console.log(kleinContract)
const test = kleinContract.at('0x88ae96845e157558ef59e9ff90e766e22e480390')
kleinContract.options.address = '0x88ae96845e157558ef59e9ff90e766e22e480390'

app.get('/', function (req, res) {
  let contract
  console.log(kleinContract)
  console.log(kleinContract.methods.currentSeries)
  console.log(kleinContract.call)
  kleinContract.methods.currentSeries.call().then(currentSeries => {
    contract.currentSeries = currentSeries.toNumber()
    return kleinContract.issuedToDate.call()
  }).then(issuedToDate => {
    contract.issuedToDate = issuedToDate.toNumber()
    return kleinContract.series.call(contract.currentSeries)
  }).then(series => {
    contract.price = series[0].toNumber()
    return kleinContract.burnedToDate.call()
  }).then(burnedToDate => {
    contract.burnedToDate = burnedToDate.toNumber()
    return kleinContract.maxSupplyPossible.call()
  }).then(maxSupplyPossible => {
    contract.maxSupplyPossible = maxSupplyPossible.toNumber()
    return kleinContract.balanceOf.call(kleinContract.address)
  }).then(contractBalance => {
    contract.contractBalance = contractBalance.toNumber()
    res.send(contract)
  }).catch(error => {
    res.send(error)
  })
})

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})
