// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;
// Uncomment this line to use console.log
 import "hardhat/console.sol";
import "@openzeppelin/contracts/utils/Address.sol";

contract SavingsAccountV2 {
    using Address for address payable;
    mapping (address => uint) public balanceOf;

    function deposite()  external payable {
        balanceOf[msg.sender] += msg.value;

    }
     function withdraw() external {
        console.log("");
        console.log("RentraancyVictim's balance:",address(this).balance);
         console.log("RentraancyAttacker's balance:", balanceOf[msg.sender]);
            
        uint256 amountDeposited = balanceOf[msg.sender];
        balanceOf[msg.sender] = 0;
         payable(msg.sender).sendValue(amountDeposited);
        
         
        

    }
   
}
