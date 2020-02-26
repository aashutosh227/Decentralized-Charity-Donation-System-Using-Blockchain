pragma solidity >=0.4.21 <0.7.0;

import "./AidToken.sol";

contract AidTokenSale {
    address admin;
    AidToken public tokenContract;
    uint256 public tokenPrice;
    uint256 public tokensSold;

    event Sell(
        address indexed _buyer,
        uint256 _amount
    );

    constructor(AidToken _tokenContract, uint256 _tokenPrice) public{

        //Assign an admin
        admin = msg.sender;
        //Token Contract
        tokenContract = _tokenContract;
        //Token Price
        tokenPrice = _tokenPrice;

    }

    function multiply(uint256 x, uint256 y) internal pure returns(uint256 z){
        require(y == 0 || (z = x * y) / y == x, "SafeMath Multiplication");
    }

    function buyTokens(uint256 _numberOfTokens) public payable {
        //Require that value is equal to tokens
        require(msg.value == multiply(_numberOfTokens,tokenPrice),"Value in wei is equal to number of tokens");
        //Require that contract has enough tokens
        require(tokenContract.balanceOf(address(this)) >= _numberOfTokens,
        'cannot transfer more tokens than available');
        //Require that the transfer is successful
        require(tokenContract.transfer(msg.sender, _numberOfTokens),"Ensure successful transfer");
        //Keep Track of TokenSold
        tokensSold += _numberOfTokens;
        //Trigger sell event
        emit Sell(msg.sender,_numberOfTokens);
    }

    function endSale() public payable{
        //Require admin
        require(msg.sender == admin, "must be admin to end sale");
        //Transfering remaining dapp tokens to the admin
        require(tokenContract.transfer(admin, tokenContract.balanceOf(address(this))),
        "transfers remaining tokens back to admin");
        //Destroy Contract
        selfdestruct(msg.sender);
    }
} 