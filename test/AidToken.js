var AidToken = artifacts.require("./AidToken.sol");

contract('AidToken', function(accounts){
    var tokenInstance;
    it("initializes the contract with correct values", function(){
        return AidToken.deployed().then(function(instance){
            tokenInstance =instance;
            return tokenInstance.name();
        }).then(function(name){
            assert.equal(name,"AID Token","Has correct Name");
            return tokenInstance.symbol();
        }).then(function(symbol){
            assert.equal(symbol,"AID","Has correct Symbol");
            return tokenInstance.standard();
        }).then(function(standard){
            assert.equal(standard,"AID Token v1.0", "Has Correct Standard");
        });
    });

    it('sets total supply upon deployment', function(){
        return AidToken.deployed().then(function(instance){
            tokenInstance = instance;
            return tokenInstance.totalSupply();
        }).then(function(totalSupply){
            assert.equal(totalSupply.toNumber(),1000000,"sets the total supply to 1000000");
        });
    });

    it('Transfers token ownership', function(){
        return AidToken.deployed().then(function(instance){
            tokenInstance = instance;
            return tokenInstance.transfer.call(accounts[0],99999999999);
        }).then(assert.fail).catch(function(err){
            assert(err.message.indexOf("revert") >= 0, "error message contains revert");
            return tokenInstance.transfer.call(accounts[1],250000, {from: accounts[0]});
        }).then(function(success){
            assert.equal(success,true, "It returns true");
            return tokenInstance.transfer(accounts[1],250000, {from: accounts[0]});
        }).then(function(receipt){
            assert.equal(receipt.logs.length,1,"Triggers 1 event");
            assert.equal(receipt.logs[0].event,"Transfer","Triggers Transfer event");
            assert.equal(receipt.logs[0].args._from, accounts[0],"logs the account the tokens are transfered from");
            assert.equal(receipt.logs[0].args._to, accounts[1], "logs the account the tokens are transfered to");
            assert.equal(receipt.logs[0].args._value, 250000, "logs the amount transfered");
            return tokenInstance.balanceOf(accounts[1]);
        }).then(function(balance){
            assert.equal(balance.toNumber(), 250000, 'Adds the amount to the recieving account');
            return tokenInstance.balanceOf(accounts[0]);
        }).then(function(balance){
            assert.equal(balance.toNumber(), 750000, 'deducts the amount from the sending account');
        });
    });

    it('approves tokens for delegated transfers',function(){
        return AidToken.deployed().then(function(instance){
            tokenInstance = instance;
            return tokenInstance.approve.call(accounts[1],100);
        }).then(function(success){
            assert.equal(success,true,"it returns true");
            return tokenInstance.approve(accounts[1],100);
        }).then(function(receipt){
            assert.equal(receipt.logs.length,1,"triggers 1 event");
            assert.equal(receipt.logs[0].event,"Approval","Triggers Approval event");
            assert.equal(receipt.logs[0].args._owner, accounts[0],"logs the account the tokens are authorized by");
            assert.equal(receipt.logs[0].args._spender, accounts[1], "logs the account the tokens are authorized to");
            assert.equal(receipt.logs[0].args._value, 100, "logs the amount authorized");
            return tokenInstance.allowance(accounts[0],accounts[1]);
        }).then(function(allowance){
            assert.equal(allowance,100,'stores the allowance for delegated transfer');
        });
    });
})