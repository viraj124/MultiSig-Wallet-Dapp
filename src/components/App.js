import React, { Component } from 'react';
import Wallet from '../abis/Wallet.json';
import Web3 from 'web3';
import './App.css';

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      account: ''
    }
    this.executeTransaction = this.executeTransaction.bind(this);
  }

  async componentWillMount() {
    await this.loadWeb3()
    await this.loadBlockchainData()
  }

  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    }
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    }
    else {
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }
  }

  async loadBlockchainData() {
    const web3 = window.web3
    // Load account
    const accounts = await web3.eth.getAccounts()
    this.setState({
        account: accounts[0]
    })
    //My Ropston Addresses
    const contractAddress = '0xaf2019bd11fce1ba40cf15eb0e6a6fbb90b0f1b6';
    const contract = web3.eth.Contract(Wallet.abi, contractAddress)
    this.setState({ contract })
    const abi = {
        "constant": false,
        "inputs": [
          {
            "name": "_i",
            "type": "uint256"
          }
        ],
        "name": "uint2str",
        "outputs": [
          {
            "name": "_uintAsString",
            "type": "string"
          }
        ],
        "payable": true,
        "stateMutability": "payable",
        "type": "function"
      }
    
    const args = [
      "100"
    ]
    var data = await web3.eth.abi.encodeFunctionCall(abi, args)
    console.log(data)

    //This is will just create a transaction with some metadata, but it won't be executed until a minimum approval limit is reached
    //This would be called when you refresh the browser or go to the url
    //destination contract address is a Sample Contract used for now you can find it in the contract folder.
    await contract.methods.submitTransaction("0xdb5f3aff7df77ef5e5353f5ccf725e911eb37442", 0, data).send({ from: this.state.account})
    .once('receipt',  (receipt) => {
      console.log(receipt);
    })

  }
//called by the approvers to approve and it would be executed when all approvals complete



  render() {
    return (
      <div>
       Multi Sig Wallet
      </div>
    );
  }
}

export default App;
