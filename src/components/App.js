import React, { Component } from 'react';
import logo from '../logo.png';
import Marvel from '../abis/Marvel.json';
import Web3 from 'web3';
import './App.css';

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      account: '',
      tokens: []
    }
    this.mint = this.mint.bind(this);
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
    const networkId = await web3.eth.net.getId()
    const networkData = Marvel.networks[networkId]
    this.setState({ contractAddress: networkData.address})
    if(networkData) {
      const contract = web3.eth.Contract(Marvel.abi, networkData.address)
      this.setState({ contract })
      const totalSupply = await contract.methods.totalSupply().call();
      console.log(totalSupply)
      for (var i=0; i < totalSupply; i++) {
        const marvelAvatar = await contract.methods.marvelAvatar(i).call();
        console.log(marvelAvatar)
        this.state.tokens.push(marvelAvatar);
        this.setState({
          tokens: this.state.tokens
        })
      }
      console.log(this.state.tokens[0]['color']);
    } else {
      window.alert('Contract not deployed to detected network.')
    }
  }

 async mint(initials, color) {
    await this.state.contract.methods.mint(initials, color).send({ from: this.state.account})
    .once('receipt',  (receipt) => {
        console.log(receipt);
    })
  }


  render() {
    return (
      <div>
        <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
          <a
            className="navbar-brand col-sm-3 col-md-2 mr-0"
            target="_blank"
            rel="noopener noreferrer"
          >
          Marvel Non Fungible Token
          </a>
          <ul className="navbar-nav px-3">
            <li className="nav-item text-nowrap d-none d-sm-none d-sm-block">
              <small className="text-white"><span id="account">{this.state.account}</span></small>
            </li>
          </ul>
        </nav>
        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 d-flex text-center">
              <div className="content mr-auto ml-auto">
              <h1>Issue Token</h1>
                <form onSubmit={(event) => {
                  event.preventDefault()
                  const initials = this.initials.value
                  const color = this.color.value
                  this.mint(initials, color)
                }}>
                  <input
                    type='text'
                    className='form-control mb-1'
                    placeholder='Marvel Character Initials e.g. #IM(Iron Man)'
                    ref={(input) => { this.initials = input }}
                  />
                                   
                 <input
                    type='text'
                    className='form-control mb-1'
                    placeholder='Color e.g. #FFFFFF'
                    ref={(input) => { this.color = input }}
                  />
                  
                  <input
                    type='submit'
                    className='btn btn-block btn-primary'
                    value='MINT'
                  />
                </form>
              </div>
            </main>
            <br/>
            <div className="row text-center">
              {this.state.tokens.map((token, key) =>{
                return (
                  <div key={key} className="col-md-3 mb-3">
                  <div className="token" style = {{ background: token['color']}}>
                    {token['initials']}
                    </div>
                    </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
