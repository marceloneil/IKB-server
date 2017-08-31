const express = require('express')
const Web3 = require('web3')

const app = express()
const web3 = new Web3('ws://parity:8545')

app.get('/', function (req, res) {
  res.send('Hello World!')
})

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})
