pragma solidity >=0.4.21 <0.7.0;

contract AidToken  {

    uint256 public totalSupply;
    string public name = "AID Token";
    string public symbol = "AID";
    string public standard = "AID Token v1.0";
    mapping(address => uint256) public balanceOf;

    event Transfer(
        address indexed _from,
        address indexed _to,
        uint256 _value
    );

    constructor(uint256 _initialSupply) public {
        balanceOf[msg.sender] = _initialSupply;
        totalSupply = _initialSupply;
    }

    //Transfer
    function transfer(address _to, uint256 _value) public payable returns(bool success){
        //Exception if account doesn;t have enough balance
        require(balanceOf[msg.sender] >= _value);
        //Transfer the amount
        balanceOf[msg.sender] -= _value;
        balanceOf[_to] += _value;

        //Transfer Event
        emit Transfer(msg.sender,_to,_value);

        return true;
    }
} 