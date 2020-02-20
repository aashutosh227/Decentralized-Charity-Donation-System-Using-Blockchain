const AidToken = artifacts.require("AidToken");

module.exports = function(deployer) {
  deployer.deploy(AidToken,1000000);
};