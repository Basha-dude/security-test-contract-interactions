// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;
// Uncomment this line to use console.log
 //import "hardhat/console.sol";

contract SmallWallet  {
  address public owner;

  constructor() {
      owner = tx.origin;
  }

     function withdrawAll(address _recipient) external{
         require(msg.sender == owner,"Caller not authorised");
         payable(_recipient).transfer(address(this).balance);

    }
    
    receive() payable external {}
   
}
