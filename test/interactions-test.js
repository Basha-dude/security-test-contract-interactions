const { expect } = require("chai");
const { ethers } = require("hardhat");


describe("Reentrancy", function () {
  let deployer, attacker, user
  beforeEach(async () => {

    [deployer, user, attacker] = await ethers.getSigners();

    const SavingsAccountV2 = await ethers.getContractFactory("SavingsAccountV2",deployer);
    this.savingsAccountV2 = await SavingsAccountV2.deploy();

    await this.savingsAccountV2.deposite({value: ethers.utils.parseEther("100")})
    await this.savingsAccountV2.connect(user).deposite({value: ethers.utils.parseEther("50")})
   
    const InvestorV2 = await ethers.getContractFactory("InvestorV2",attacker);
    this.investorV2 = await InvestorV2.deploy(this.savingsAccountV2.address);

   })
    describe('SavingsAccountV2', () => { 
      it("should deposit the amount", async () => {
        const deployerbalance = await this.savingsAccountV2.balanceOf(deployer.address)
        expect(await this.savingsAccountV2.balanceOf(deployer.address)).to.eq(ethers.utils.parseEther("100"));
        const userbalance = await this.savingsAccountV2.balanceOf(deployer.address)
        expect(await this.savingsAccountV2.balanceOf(user.address)).to.eq(ethers.utils.parseEther("50"));
      })
    })
   it("should with draw the amount", async () => {
    await this.savingsAccountV2.withdraw();
    const deployerbalance = await this.savingsAccountV2.balanceOf(deployer.address)
    let userbalance = await this.savingsAccountV2.balanceOf(user.address);
     expect(deployerbalance).to.eq(0);
     expect(userbalance).to.eq(ethers.utils.parseEther("50"));
   

   
     
  })
  it("InvestorV2 Attack", async () => {
    console.log("before attacker",await ethers.provider.getBalance(attacker.address));
    const owner = await ethers.provider.getStorageAt(this.investorV2.address,0)
    console.log("OWNER IS ",owner)
    console.log("deployer IS ",deployer.address)
    console.log("user IS ",user.address)
    console.log("attacker IS ",attacker.address)
    await this.investorV2.attack({value: ethers.utils.parseEther("10")});
    console.log("savings account",await ethers.provider.getBalance(this.savingsAccountV2.address))
    console.log("before attacker",await ethers.provider.getBalance(attacker.address));
  })

  


  
   });
