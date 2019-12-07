const Market = artifacts.require('./Market.sol');

contract('Market', ([deployer, buyer, seller]) => {
    let market
    
    before(async() => {
        market = await Market.deployed()
    })

    describe('deployment', async() => {
        it('Address Check', async() => {
            const address = await market.address
            assert.notEqual(address, '')
        }) 
    })

    describe('Product', async() => {
        let product, pcount
        before(async() => {
            product = await market.createProduct('One Plus', web3.utils.towei('1', 'Ether'), { from : seller})
            pcount = await market.productCount;
        })

        it("Contract Properties Verification", async() => {
            assert.equal(pcount, 1)
            const event = product.logs[0].args
            assert.equal(event.name, 'One Plus', "Verifying Product Name")
        })
       
    })

    describe('Product Sale', async() => {
        let product, pcount
        before(async() => {
            result = await market.buyProduct(1, {from: buyer})
            pcount = await market.productCount
        })
        it("Buy Function Validations", async() => {
            const event = result.logs[0].args
            assert.equal(event.owner, buyer)
            assert.equal(event.purchased, true)
        })
    })



})