const { ethers } = require("ethers");

async function fetchAccountAddresses() {
  const provider = new ethers.JsonRpcProvider("http://localhost:9545"); // Update with your Ganache RPC URL
  const accounts = await provider.listAccounts();
  return accounts;
}

const VerbalToken = artifacts.require("VerbalToken");
const PodcastContract = artifacts.require("PodcastContract");
const Sessions = artifacts.require("Sessions");
const RewardsContract = artifacts.require("RewardsContract");

module.exports = async function (deployer, network) {
  if (network == "development") {
    const accounts = await fetchAccountAddresses();
    // console.log(accounts);
    await deployer.deploy(VerbalToken, accounts[0].address); // holder address
    await deployer.deploy(PodcastContract);
    await deployer.deploy(Sessions);
  }

  // Get the deployed contract instance
  const verbalTokenInstance = await VerbalToken.deployed();
  const podcastContractInstance = await PodcastContract.deployed();
  const sessionsInstance = await Sessions.deployed();

  // Log the deployed contract address
  console.log("VerbalToken contract address:", verbalTokenInstance.address);
  console.log(
    "PodcastContract contract address:",
    podcastContractInstance.address
  );
  console.log("Sessions contract address:", sessionsInstance.address);

  //use required values to deploy rewards contract

  await deployer.deploy(
    RewardsContract,
    podcastContractInstance.address,
    sessionsInstance.address
  );

  //get rewards contract instance
  const rewardsContractInstance = await RewardsContract.deployed();

  // Log the deployed contract address
  console.log(
    "RewardsContract contract address:",
    rewardsContractInstance.address
  );
};
