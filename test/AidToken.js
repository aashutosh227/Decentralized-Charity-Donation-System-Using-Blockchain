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

    it('handles delegated token transfer',function(){
        return AidToken.deployed().then(function(instance){
            tokenInstance = instance;
            fromAccount = accounts[2];
            toAccount = accounts[3];
            spendingAccount = accounts[4];
            //Firstly transfer some tokens to the fromAccount
            return tokenInstance.transfer(fromAccount,100,{from:accounts[0]});
        }).then(async function(receipt){
            //Approve the spendingAccount to spend 10 tokens from fromAccount
            return await tokenInstance.approve(spendingAccount,10,{from: fromAccount});
        }).then(async function(receipt){
            //Try transfering something larger than the sender's balance
            return await tokenInstance.transferFrom(fromAccount,toAccount,999,{from: spendingAccount});
        }).then(assert.fail).catch(async function(err){
            assert(err.message.indexOf("revert") >= 0,"cannot transfer more than balance");
            //console.log(typeof(err.message));
            return await tokenInstance.transferFrom(fromAccount, toAccount, 20, {from: spendingAccount});
        }).then(assert.fail).catch(async function(err){
            assert(err.message.indexOf("revert") >= 0,"cannot transfer more than approved");
            return await tokenInstance.transferFrom.call(fromAccount, toAccount, 10, {from: spendingAccount});
        }).then(async function(success){
            assert.equal(success,true);
            return await tokenInstance.transferFrom(fromAccount, toAccount, 10, {from: spendingAccount});           
        }).then(async function(receipt){
            assert.equal(receipt.logs.length,1,"triggers 1 event");
            assert.equal(receipt.logs[0].event,"Transfer","Triggers Transfer event");
            assert.equal(receipt.logs[0].args._from, fromAccount,"logs the account the tokens are transfered from");
            assert.equal(receipt.logs[0].args._to, toAccount, "logs the account the tokens are transfered to");
            assert.equal(receipt.logs[0].args._value, 10, "logs the amount transfered");
            return await tokenInstance.balanceOf(fromAccount);
        }).then(async function(balance){
            assert.equal(balance.toNumber(),90,"deducts amount from the sending account");
            return await tokenInstance.balanceOf(toAccount);
        }).then(async function(balance){
            assert.equal(balance.toNumber(),10,"adds amount to receiving account");
            return await tokenInstance.allowance(fromAccount,spendingAccount);
        }).then(function(allowance){
            assert.equal(allowance.toNumber(),0);
        });
    });
})