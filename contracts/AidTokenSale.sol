pragma solidity >=0.4.21 <0.7.0;

import "./AidToken.sol";

contract AidTokenSale {
    address admin;
    AidToken public tokenContract;
    uint256 public tokenPrice;

    constructor(AidToken _tokenContract, uint256 _tokenPrice) public{

        //Assign an admin
        admin = msg.sender;
        //Token Contract
        tokenContract = _tokenContract;
        //Token Price
        tokenPrice = _tokenPrice;

    }
} 