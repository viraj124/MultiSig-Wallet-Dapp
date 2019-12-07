const Marvel = artifacts.require("Marvel");

module.exports = function(deployer) {
  deployer.deploy(Marvel);
};
