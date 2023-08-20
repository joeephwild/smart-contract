const VerbalToken = artifacts.require("VerbalToken");
const Session = artifacts.require("Sessions");

const truffleAssert = require("truffle-assertions");
const web3 = require("web3");

const BigNumber = web3.BigNumber;

const etherValue = (weiValue) => web3.utils.fromWei(weiValue, "ether");
const weiValue = (number) => web3.utils.toBN(number);
const currentEpochTime = () => Math.floor(Date.now() / 1000);

require("chai").use(require("chai-bignumber")(BigNumber)).should();

contract("Verbal Token", ([deployer, ...accounts]) => {
  beforeEach(async () => {
    this.contractInstance = await VerbalToken.new(accounts[1]);
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
    const getHolder = await this.contractInstance.scheduleASession(
      accounts[2],
      weiValue(timestamp),
      "meetingLink"
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
});
// contract("SimpleStorage", ([deployer, ...accounts]) => {
//     beforeEach(async () => {
//       this.contractInstance = await SimpleStorage.new();
//     });

//     it("should receive 0 address", async () => {
//       const getDeployer = await this.contractInstance.deployer.call();
//       expect(getDeployer).to.equal(deployer);
//     });

//     it("should change the deployer value", async () => {
//       await this.contractInstance.changeDeployer(deployer, { from: deployer });

//       const getDeployer = await this.contractInstance.deployer.call();
//       expect(getDeployer).to.equal(deployer);
//     });

//     it("should fail to change the deployer", async () => {
//       await this.contractInstance.changeDeployer(accounts[1], { from: deployer });

//       await truffleAssert.fails(
//         this.contractInstance.changeDeployer(accounts[1], { from: deployer }),
//         truffleAssert.ErrorType.REVERT,
//         "SimpleStorage: Unauthorized permission"
//       );
//     });

//     it("should deposit eth", async () => {
//       const deposit = web3.utils.toBN(web3.utils.toWei("0.1", "ether"));
//       const tx = await this.contractInstance.depositEth(deposit, {
//         from: deployer,
//         value: deposit,
//       });

//       truffleAssert.eventEmitted(tx, "DepositEvent", (event) => {
//         return (
//           deployer === event["user"] &&
//           web3.utils.toBN(deposit).eq(event["amount"])
//         );
//       });

//       const totalDeposits = await this.contractInstance.listDeposits.call(
//         deployer
//       );
//       expect(1).to.deep.equal(+totalDeposits["totalDeposits"].toString());
//     });

//     it("should fail to deposit eth", async () => {
//       const deposit = web3.utils.toBN(web3.utils.toWei("1001", "ether"));

//       await truffleAssert.fails(
//         this.contractInstance.depositEth(deposit, {
//           from: deployer,
//           value: deposit,
//         }),
//         "Returned error: insufficient funds for gas * price + value"
//       );
//     });

//     it("should fail to withdraw eth", async () => {
//       const withdraw = web3.utils.toBN("0");

//       await truffleAssert.fails(
//         this.contractInstance.withdrawEth(withdraw, {
//           from: deployer,
//           value: withdraw,
//         }),
//         "SimpleStorage: Invalid withdraw amount"
//       );
//     });

//     it("should fail and overflow uint256 when withdraw eth", async () => {
//       const withdraw = web3.utils.toBN("1");

//       await truffleAssert.fails(
//         this.contractInstance.withdrawEth(withdraw, { from: deployer }),
//         truffleAssert.ErrorType.REVERT,
//         "SimpleStorage: Invalid withdraw amount"
//       );
//     });

//     it("should withdraw 0.5 eth", async () => {
//       const amount = web3.utils.toBN(web3.utils.toWei("1", "ether"));
//       await this.contractInstance.depositEth(amount, {
//         from: deployer,
//         value: amount,
//       });

//       let listDeposits = await this.contractInstance.listDeposits.call(deployer);
//       expect(true).to.deep.equal(
//         listDeposits["totalDeposits"].eq(web3.utils.toBN("1"))
//       );

//       const withdraw = web3.utils.toBN(web3.utils.toWei("0.6", "ether"));

//       await this.contractInstance.withdrawEth(withdraw, { from: deployer });
//       listDeposits = await this.contractInstance.listDeposits.call(deployer);
//       expect(true).to.deep.equal(
//         web3.utils
//           .toBN(web3.utils.toWei("0.4", "ether"))
//           .eq(web3.utils.toBN(listDeposits["amount"]))
//       );

//       await truffleAssert.fails(
//         this.contractInstance.withdrawEth(amount, { from: deployer }),
//         truffleAssert.ErrorType.REVERT,
//         "SimpleStorage: Invalid withdraw amount"
//       );
//     });
//   });
