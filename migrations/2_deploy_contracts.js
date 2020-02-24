const AidToken = artifacts.require("AidToken");
const AidTokenSale = artifacts.require("AidTokenSale");

module.exports = function(deployer) {
  deployer.deploy(AidToken,1000000).then(function(){
      //Token price is 0.001 ether
      var tokenPrice = 1000000000000000; //in wei and equivalent to 0.001 ether
      return deployer.deploy(AidTokenSale,AidToken.address,tokenPrice);
  });
};