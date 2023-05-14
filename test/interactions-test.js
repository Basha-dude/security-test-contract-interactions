const { expect } = require("chai");
const { ethers } = require("hardhat");


describe("Tx-origin", function () {
  let deployer, attacker, user
   beforeEach(async () => {

    [deployer,attacker, user ] = await ethers.getSigners();

    const SmallWallet = await ethers.getContractFactory("SmallWallet",deployer);
    this.smallWallet = await SmallWallet.deploy();

    await deployer.sendTransaction({to: this.smallWallet.address, value:10000})

   
   
    const AttackerContract = await ethers.getContractFactory("Attacker",attacker);
    this.attackerContract = await AttackerContract.deploy(this.smallWallet.address);

   })
    describe('Small Wallet', () => { 
      it("should accepts deposite",async() => {
        expect(await ethers.provider.getBalance(this.smallWallet.address)).to.eq(10000)
      })
      it("should allow the owner to execute withdrawl",async() => {
       const intialUserBalance = await ethers.provider.getBalance(user.address);
       await this.smallWallet.withdrawAll(user.address);
       expect(await ethers.provider.getBalance(this.smallWallet.address)).to.eq(0)
       expect(await ethers.provider.getBalance(user.address)).to.eq(intialUserBalance.add(10000))
      })
      it("should revert when anyone calls the withdrawl except owner ",async() => {
        await expect( this.smallWallet.connect(attacker).withdrawAll(attacker.address)).to.revertedWith("Caller not authorised")
      })
      
    })
    describe('Attack', () => { 
      it("should drain the victim out if small wallet's owner sends ether",async () => {
        const intialAttackerBalance  =await ethers.provider.getBalance(attacker.address);
        await deployer.sendTransaction({to:this.attackerContract.address,value:1})
        expect(await ethers.provider.getBalance(this.smallWallet.address)).to.eq(0)
        expect(await ethers.provider.getBalance(attacker.address)).to.eq(intialAttackerBalance.add(10000))
      })
     })
 

  


  
   });
