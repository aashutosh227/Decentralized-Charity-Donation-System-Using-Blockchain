var Aid = artifacts.require("./Aid.sol");

contract('Aid', function(accounts){
    var admin = accounts[0];
    var aidInstance;

    it("sets the quotation by the NGO", function(){
        return Aid.deployed().then(function(instance){
            aidInstance = instance;
            return aidInstance.setQuotation(accounts[9],"abc","xyz",1000);
        }).then(function(receipt){
            assert.equal(receipt.logs.length,1,"Triggers 1 event");
            assert.equal(receipt.logs[0].event,"Quotation","Triggers Quotation event");
            assert.equal(receipt.logs[0].args._address, accounts[0],"logs the address of ngo ");
            assert.equal(receipt.logs[0].args._subject, "abc", "logs the subject which is assigned");
            assert.equal(receipt.logs[0].args._description, "xyz", "logs the description which is assigned");
            assert.equal(receipt.logs[0].args.id, 0,
            "logs the address of ngo ");
            return aidInstance.getItemAddress(receipt.logs[0].args.id);
        }).then(function(addr){
            assert.equal(addr,accounts[9],"logs the ngo requirement address");
        })
    })
    
})