const VerbalToken = artifacts.require("VerbalToken");
const Session = artifacts.require("Sessions");
const PodcastContract = artifacts.require("PodcastContract");
const RewardsContract = artifacts.require("RewardsContract");

const truffleAssert = require("truffle-assertions");
const Web3 = require("web3");
const web3 = new Web3("https://127.0.0.1:9545");

const BigNumber = web3.BigNumber;

const etherValue = (weiValue) => web3.utils.fromWei(weiValue, "ether");
const weiValue = (number) => web3.utils.toBN(number);
const currentEpochTime = () => Math.floor(Date.now() / 1000);

const ipfsHash = "ipfsHashDemo";
require("chai").use(require("chai-bignumber")(BigNumber)).should();

contract("Verbal Token", ([deployer, ...accounts]) => {
  beforeEach(async () => {
    this.contractInstance = await VerbalToken.new();

    await this.contractInstance.initFunction(accounts[1]);
  });

  it("should assign Holder as address passed", async () => {
    const getHolder = await this.contractInstance.Holder.call();
    expect(getHolder).to.equal(accounts[1]);
  });

  it("Holder should have all ERC20 tokens", async () => {
    // Get the balance of the account with tokens and total supply
    const accountBalance = etherValue(
      await this.contractInstance.balanceOf(accounts[1])
    );
    const totalSupply = etherValue(await this.contractInstance.totalSupply());

    console.log("Holder account balance is _____________", accountBalance);
    console.log("token balance is _____________", totalSupply);
    // Check if the balance  equal to total Supply
    accountBalance.should.be.equal(totalSupply);
  });
});
contract("Session Contract", ([deployer, ...accounts]) => {
  beforeEach(async () => {
    this.contractInstance = await Session.new();
  });

  it("should schedule a session correctly", async () => {
    const timestamp = currentEpochTime().toString();

    // register a mentor
    await this.contractInstance.registerMentorPrice(weiValue(1), {
      from: accounts[2],
    });

    await this.contractInstance.scheduleASession(
      accounts[2],
      weiValue(timestamp),
      "meetingLink",
      {
        value: weiValue(1),
      }
    );
    //now we check to ensure all state variables were updated correctly
    //first fetch the session details
    const userSessions = await this.contractInstance.getUserSessions(deployer);

    const sessionDetails = await this.contractInstance.getSessionDetails(
      userSessions[0]
    );

    expect(sessionDetails.mentor).to.equal(accounts[2]);
    expect(sessionDetails.student).to.equal(deployer);
    expect(sessionDetails.isAccepted).to.equal(false);
    expect(Number(sessionDetails.timeStamp.toString())).to.equal(
      Number(timestamp)
    );
    expect(sessionDetails.meetingLink).to.equal("meetingLink");
    // console.log("SESSION DETAILS_____", sessionDetails);
  });

  it("should allow mentor and student cancel session", async () => {
    let userSessions, sessionDetails;
    const getUserSessions = async () => {
      userSessions = await this.contractInstance.getUserSessions(deployer);
    };

    const getSessionDetails = async () => {
      sessionDetails = await this.contractInstance.getSessionDetails(
        userSessions[0]
      );
    };
    const timestamp = currentEpochTime().toString();
    const timestamp2 = (currentEpochTime() + 20).toString();
    // register a mentor
    await this.contractInstance.registerMentorPrice(weiValue(1), {
      from: accounts[2],
    });
    //schedule a session
    await this.contractInstance.scheduleASession(
      accounts[2],
      weiValue(timestamp),
      "meetingLink",
      { value: weiValue(1) }
    );
    await getUserSessions();
    await getSessionDetails();

    //mentor accepts session
    await this.contractInstance.acceptSession(userSessions[0], {
      from: accounts[2],
    });
    //now we check to ensure all state variables were updated correctly
    await getUserSessions();
    await getSessionDetails();
    expect(sessionDetails.isAccepted).to.equal(true);

    //now we cancel same session using mentor account
    await this.contractInstance.cancelSession(userSessions[0], {
      from: accounts[2],
    });
    //now we check to ensure all state variables were updated correctly
    await getUserSessions();
    await getSessionDetails();
    expect(sessionDetails.isAccepted).to.equal(false);

    // // REPEAT SAME SESSION BUT USE STUDENT ACCOUNT TO CANCEL SESSION
    // //schedule a session
    // await this.contractInstance.scheduleASession(
    //   accounts[2],
    //   weiValue(timestamp2),
    //   "meetingLink",
    //   { value: weiValue(1) }
    // );
    // await getUserSessions();
    // await getSessionDetails();

    // //mentor accepts session
    // await this.contractInstance.acceptSession(userSessions[1], {
    //   from: accounts[2],
    // });
    // //now we cancel same session using student account
    // await this.contractInstance.cancelSession(userSessions[1]);
    // //now we check to ensure all state variables were updated correctly
    // await getUserSessions();
    // await getSessionDetails();
    // expect(sessionDetails.isAccepted).to.equal(false);
  });
});
contract("Podcast Contract", ([deployer, ...accounts]) => {
  beforeEach(async () => {
    this.contractInstance = await PodcastContract.new();
  });

  it("should upload a podcast correctly", async () => {
    await this.contractInstance.uploadPodcast(ipfsHash, weiValue(1));
    //now we check to ensure all state variables were updated correctly
    //first fetch the spodcast details
    const userPodcasts = await this.contractInstance.getUserPodcasts(deployer);

    const podcastDetails = await this.contractInstance.getPodcastInfo(
      userPodcasts[0]
    );

    expect(podcastDetails.ipfsHash).to.equal(ipfsHash);
    expect(podcastDetails.owner).to.equal(deployer);
    expect(podcastDetails.amount).to.equal("1");
    expect(podcastDetails.supporters.length).to.equal(0);
  });

  it("should allow a user support a podcast", async () => {
    await this.contractInstance.uploadPodcast(ipfsHash, weiValue(1));
    //now we support the podcast with anther account
    //first fetch the spodcast details
    const userPodcasts = await this.contractInstance.getUserPodcasts(deployer);
    // const deployerInitialBalance = await web3.eth.getBalance(deployer);
    //support
    await this.contractInstance.supportPodcast(userPodcasts[0], {
      from: accounts[1],
      value: weiValue(1),
    });
    //check owners account after
    // const deployerLaterBalance = await web3.eth.getBalance(deployer);

    // expect(deployerLaterBalance).to.be.greater.than(deployerInitialBalance);

    const podcastDetails = await this.contractInstance.getPodcastInfo(
      userPodcasts[0]
    );

    expect(podcastDetails.supporters.length).to.equal(1);
    expect(podcastDetails.totalSupport).to.equal("1");
    expect(podcastDetails.supporters[0]).to.equal(accounts[1]);
  });
});
contract("Rewards Contract", ([deployer, ...accounts]) => {
  beforeEach(async () => {
    this.tokenContractInstance = await VerbalToken.new();
    this.sessionContractInstance = await Session.new();
    this.podcastContractInstance = await PodcastContract.new();

    this.rewardsContractInstance = await RewardsContract.new(
      this.podcastContractInstance.address,
      this.sessionContractInstance.address,
      this.tokenContractInstance.address
    );

    await this.tokenContractInstance.initFunction(
      this.rewardsContractInstance.address
    );
  });

  it("should reward for user who uploads podcast", async () => {
    await this.podcastContractInstance.uploadPodcast(ipfsHash, weiValue(1));
    //now we check to ensure all state variables were updated correctly
    await this.rewardsContractInstance.checkAndReward(deployer);
    const userNewBalance = await this.tokenContractInstance.balanceOf(deployer);
    expect(Number(userNewBalance)).to.equal(1);
  });
  it("should reward for user who supports podcast", async () => {
    await this.podcastContractInstance.uploadPodcast(ipfsHash, weiValue(1));
    const userPodcasts = await this.contractInstance.getUserPodcasts(deployer);
    // const deployerInitialBalance = await web3.eth.getBalance(deployer);
    //support
    await this.podcastContractInstance.supportPodcast(userPodcasts[0], {
      from: accounts[1],
      value: weiValue(1),
    });

    console.log("accounts 1 _______________", accounts[1]);
    //now we check to ensure all state variables were updated correctly
    await this.rewardsContractInstance.checkAndReward(accounts[1]);
    const userNewBalance = await this.tokenContractInstance.balanceOf(
      accounts[1]
    );
    expect(Number(userNewBalance)).to.equal(2);
  });
  it("should reward for user who attended session and mentored session", async () => {
    const timestamp = currentEpochTime().toString();

    // register a mentor
    await this.sessionContractInstance.registerMentorPrice(weiValue(1), {
      from: accounts[2],
    });
    //schedule a session
    await this.sessionContractInstance.scheduleASession(
      accounts[2],
      weiValue(timestamp),
      "meetingLink",
      { value: weiValue(1) }
    );

    //first fetch the session details
    const userSessions = await this.sessionContractInstance.getUserSessions(
      deployer
    );

    //mentor accepts session
    await this.sessionContractInstance.acceptSession(userSessions[0], {
      from: accounts[2],
    });
    //reward session scheduler
    await this.rewardsContractInstance.checkAndReward(deployer);
    //reward session mentor
    await this.rewardsContractInstance.checkAndReward(accounts[2]);
    const attenderBalance = await this.tokenContractInstance.balanceOf(
      deployer
    );
    const mentorBalance = await this.tokenContractInstance.balanceOf(
      accounts[2]
    );
    expect(Number(attenderBalance)).to.equal(1);
    expect(Number(mentorBalance)).to.equal(2);
  });
});
