const { ethers } = require("ethers");

const VerbalToken = artifacts.require("VerbalToken");
const PodcastContract = artifacts.require("PodcastContract");
const Sessions = artifacts.require("Sessions");
const RewardsContract = artifacts.require("RewardsContract");

module.exports = async function (deployer) {
  // console.log(accounts);
  await deployer.deploy(VerbalToken); // holder address
  // await setInterval(() => console.log("Waiting ...."), 10000);
  await deployer.deploy(PodcastContract);
  // await setInterval(() => console.log("Waiting ...."), 10000);

  await deployer.deploy(Sessions);
  // await setInterval(() => console.log("Waiting ...."), 10000);

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
    sessionsInstance.address,
    verbalTokenInstance.address
  );

  //get rewards contract instance
  const rewardsContractInstance = await RewardsContract.deployed();

  //call init function
  await verbalTokenInstance.initFunction(rewardsContractInstance.address);

  // Log the deployed contract address
  console.log(
    "RewardsContract contract address:",
    rewardsContractInstance.address
  );
};
