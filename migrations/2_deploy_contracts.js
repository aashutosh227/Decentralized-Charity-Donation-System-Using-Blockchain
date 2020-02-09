const AidToken = artifacts.require("AidToken");

module.exports = function(deployer) {
  deployer.deploy(AidToken);
};