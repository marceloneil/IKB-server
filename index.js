const express = require('express')
const cors = require('cors')
const Web3 = require('web3')

const app = express()
const web3 = new Web3('ws://geth:8546')

app.use(cors())

const kleinABI = require('./IKB.json')
const kleinContract = new web3.eth.Contract(kleinABI)
kleinContract.options.address = '0x88ae96845e157558ef59e9ff90e766e22e480390'

app.get('/', function (req, res) {
  let contract = {}
  kleinContract.methods.currentSeries().call().then(currentSeries => {
    contract.currentSeries = currentSeries
    return kleinContract.methods.issuedToDate().call()
  }).then(issuedToDate => {
    contract.issuedToDate = issuedToDate
    return kleinContract.methods.series(contract.issuedToDate).call()
  }).then(series => {
    contract.price = series[0]
    return kleinContract.methods.burnedToDate().call()
  }).then(burnedToDate => {
    contract.burnedToDate = burnedToDate
    return kleinContract.methods.maxSupplyPossible().call()
  }).then(maxSupplyPossible => {
    contract.maxSupplyPossible = maxSupplyPossible
    return kleinContract.methods.balanceOf(kleinContract.options.address).call()
  }).then(contractBalance => {
    contract.contractBalance = contractBalance
    res.send(contract)
  }).catch(error => {
    res.send(error)
  })
})

app.listen(3000, () => {
  console.log('IKB server listening on port 3000!')
})
