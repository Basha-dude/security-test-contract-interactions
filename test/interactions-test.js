const { expect } = require("chai");
const { ethers } = require("hardhat");


describe("DoS", function () {
  let deployer, attacker, user
   beforeEach(async () => {

    [deployer,attacker, user ] = await ethers.getSigners();

    const Auction = await ethers.getContractFactory("Auction",deployer);
    this.auction = await Auction.deploy();

    this.auction.bid({ value:100});

   
   
    

   })
    describe('Auction', () => { 
      it("If bid is the lower than the highest bid",async() => {
      await expect( this.auction.connect(user).bid({value :50})).to.be.revertedWith("bid not high enough")
    })
    })


    describe('If bid is higher than the highest bid' , () => { 
      it(" is should accept it and update the higest bid",async () => {
        await  this.auction.connect(user).bid({value :150});
        expect(await this.auction.highestBid()).to.eq(150)
       
      })
      it(" is should make the msg.sender as the current leader",async () => {
        await  this.auction.connect(user).bid({value :150});
        expect(await this.auction.currentLeader()).to.eq(user.address)
       
      })
      it(" it should previou  currentleader and highest bid to refunds ",async () => {
        await  this.auction.connect(user).bid({value :150});
       
          [addr,amount ] = await this.auction.refunds(0);
        expect(addr).to.eq(deployer.address);
        expect(amount).to.eq(100);
      })
     })
     describe('When callin the refund all ', () => { 
       it("should refund the bidders that did'nt win",async() => {
        await  this.auction.connect(user).bid({value :150});
        await this.auction.bid({ value:200});
        const userBalanceBefore = await ethers.provider.getBalance(user.address);
        await this.auction.refundAll();
        const userBalanceAfter = await ethers.provider.getBalance(user.address);
        expect( userBalanceAfter).to.eq(userBalanceBefore.add(150))
       })
       it("  Should revert if the amount of computaion hits the  block gas limit",async () => {
        await  this.auction.connect(user).bid({value :150});
        expect(await this.auction.currentLeader()).to.eq(user.address)
        await 
      })
      })
 
    })
  


  
  