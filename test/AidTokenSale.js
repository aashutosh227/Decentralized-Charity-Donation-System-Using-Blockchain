const AidTokenSale = artifacts.require("./AidTokenSale.sol");
const AidToken = artifacts.require("./AidToken.sol");

contract('AidTokenSale',function(accounts){
    var tokenInstance;
    var tokenSaleInstance;
    var tokenPrice = 1000000000000000; //in wei
    var admin = accounts[0];
    var buyer = accounts[1];
    var numberOfTokens;
    var tokensAvailable = 750000;

    it("initializes the contract with correct values", function(){
        return AidTokenSale.deployed().then(function(instance){
            tokenSaleInstance = instance;
            return tokenSaleInstance.address;
        }).then(function(address){
            assert.notEqual(address,0x0,"has contract address");
            return tokenSaleInstance.tokenContract();
        }).then(function(address){
            assert.notEqual(address,0x0,"has token contract address");
            return tokenSaleInstance.tokenPrice();
        }).then(function(price){
            assert.equal(price,tokenPrice,"token price is correct")
        })
    });

    it("Allows to buy tokens", function(){
        return AidToken.deployed().then(function(instance){
            tokenInstance = instance;
            return AidTokenSale.deployed();
        }).then(function(instance){
            tokenSaleInstance = instance;
            //Provision 75% of all tokens to the token sale
            return tokenInstance.transfer(tokenSaleInstance.address, tokensAvailable, {from: admin});
        }).then(function(receipt){
            numberOfTokens = 10;
            var value = tokenPrice*numberOfTokens;
            return tokenSaleInstance.buyTokens(numberOfTokens,{from: buyer, value: value});
        }).then(function(receipt){
            assert.equal(receipt.logs.length,1,"Triggers 1 event");
            assert.equal(receipt.logs[0].event,"Sell","Triggers Sell event");
            assert.equal(receipt.logs[0].args._buyer, buyer,"logs the account that purchased tokens");
            assert.equal(receipt.logs[0].args._amount, numberOfTokens, "logs the no. of tokens purchased");
            return tokenSaleInstance.tokensSold();
        }).then(async function(amount){
            assert.equal(amount.toNumber(),10,'increments the no of tokens sold');
            return await tokenInstance.balanceOf(buyer);
        }).then(async function(balance){
            assert.equal(balance.toNumber(),numberOfTokens);
            return await tokenSaleInstance.buyTokens(numberOfTokens,{from: buyer, value: 1});
        }).then(assert.fail).catch(async function(error){
            assert(error.message.indexOf('revert') >= 0, 'msg.value must equal the no of tokens in wei');
            return await tokenSaleInstance.buyTokens(80000,{from: buyer, value: tokenPrice*numberOfTokens});
        }).then(assert.fail).catch(function(error){
            //console.log(error);
            assert(error.message.toString().indexOf('revert') >= 0, 'cannot transfer more tokens than available');
        });
    });

    it("end the token sale", function(){
        return AidToken.deployed().then(function(instance){
            tokenInstance = instance;
            return AidTokenSale.deployed();
        }).then(function(instance){
            tokenSaleInstance = instance;
            return tokenSaleInstance.endSale({from: buyer});
        }).then(assert.fail).catch(function(error){
            assert(error.message.toString().indexOf('revert') >= 0,'must be admin to end sale');
            return tokenSaleInstance.endSale({from: admin});
        }).then(function(receipt){
            return tokenInstance.balanceOf(admin);
        }).then(function(balance){
            assert.equal(balance,999990,"returns all unsold tokens to admin");
            return tokenSaleInstance.tokenPrice();
        }).then(function(price){
            assert.equal(price,0,"token price must be reset to 0");
        });
    });
})