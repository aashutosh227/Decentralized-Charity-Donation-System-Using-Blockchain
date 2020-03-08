var User = artifacts.require('./User.sol');

contract('User',function(accounts){
    var admin = accounts[0];
    var userInstance;
    it("initializes contract with correct values", function(){
        return User.deployed().then(function(instance){
            userInstance = instance;
            return userInstance.name();
        }).then(function(name){
            assert.equal(name,"User contract");
            return userInstance.symbol();
        }).then(function(symbol){
            assert.equal(symbol,"USER");
        })
    })

    it("sets the user details for the current account address", function(){
        return User.deployed().then(function(instance){
            userInstance=instance;
            return userInstance.setUname("abc", {from:admin});
        }).then(function(receipt){
            assert.equal(receipt.logs.length,1,"Triggers 1 event");
            assert.equal(receipt.logs[0].event,"Username_Assigned","Triggers Username_Assigned event");
            assert.equal(receipt.logs[0].args.account, admin,"logs the account for which username assigned");
            assert.equal(receipt.logs[0].args.uname, "abc", "logs the username which is assigned");
            return userInstance.setPwd("xyz",{from:admin});
        }).then(function(receipt){
            assert.equal(receipt.logs.length,1,"Triggers 1 event");
            assert.equal(receipt.logs[0].event,"Pwd_Assigned","Triggers Pwd_Assigned event");
            assert.equal(receipt.logs[0].args.account, admin,"logs the account for which password assigned");
            assert.equal(receipt.logs[0].args.pwd, "xyz", "logs the password which is assigned");
            return userInstance.setUtype("donor",{from:admin});
        }).then(function(receipt){
            assert.equal(receipt.logs.length,1,"Triggers 1 event");
            assert.equal(receipt.logs[0].event,"Type_Assigned","Triggers Type_Assigned event");
            assert.equal(receipt.logs[0].args.account, admin,"logs the account for which type assigned");
            assert.equal(receipt.logs[0].args.utype, "donor", "logs the type which is assigned");
        });
    });
})