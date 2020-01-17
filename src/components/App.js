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
    const contractAddress = '0xFc7E8d7cDD608EBDA4523DEFa9E2DC5bfBe19c53';
    const to = '0x293f6495D7056FB207Dd0FD843C8599daa707F34'
    const contract = web3.eth.Contract(Wallet.abi, contractAddress)
    this.setState({ contract })
    //This is will just create a transaction with some metadata, but it won't be executed until a minimum approval limit is reached
    await contract.methods.createTransfer("10000000000000000", to).send({ from: this.state.account})
    .once('receipt',  (receipt) => {
      console.log(receipt);
    })

  }
//called by the approvers to approve and it would be executed when all approvals complete
 async executeTransaction(txId) {
  await this.state.contract.methods.sendTransfer(1).send({ from: this.state.account})
  .once('receipt',  (receipt) => {
    console.log(receipt);
})
  }


  render() {
    return (
      <div>
        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 d-flex text-center">
              <div className="content mr-auto ml-auto">
                <form onSubmit={(event) => {
                  event.preventDefault()
                  this.executeTransaction(1)
                }}>
                  <input
                    type='submit'
                    className='btn btn-block btn-primary'
                    value='Execute Transfer'
                  />
                </form>
              </div>
            </main>
            <br/>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
