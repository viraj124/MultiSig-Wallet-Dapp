const Marvel = artifacts.require('./Marvel.sol');

require('chai')
  .use(require('chai-as-promised'))
  .should()

contract('Marvel', ([deployer]) => {
    let marvel, result
    
    before(async() => {
        marvel = await Marvel.deployed()
    })

    describe('deployment', async() => {
        it('Address Check', async() => {
            const address = await marvel.address
            assert.notEqual(address, '')
        }) 
    })

    describe('Minting NFT', async() => {
        it("Mint Operation conducted Successfully", async() => {
            result = await marvel.mint('IM', '#FFFFFF', { from : deployer})
        })

        it("Unsuccessfull Mint Operation", async() => {
            //duplicate token
            result = await marvel.mint('IM', '#FFFF56', { from : deployer}).should.be.rejected;
        })

    })
})