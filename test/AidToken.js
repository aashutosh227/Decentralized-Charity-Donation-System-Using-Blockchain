var AidToken = artifacts.require("./AidToken.sol");

contract('AidToken', function(accounts){

    it('sets total supply upon deployment', function(){
        return AidToken.deployed().then(function(instance){
            tokenInstance = instance;
            return tokenInstance.totalSupply();
        }).then(function(totalSupply){
            assert.equal(totalSupply.toNumber(),1000000,"sets the total supply to 1000000");
        });
    });
})