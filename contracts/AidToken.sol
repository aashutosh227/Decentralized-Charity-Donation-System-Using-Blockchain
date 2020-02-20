pragma solidity >=0.4.21 <0.7.0;

contract AidToken  {

    uint256 public totalSupply;
    string public name = "AID Token";
    string public symbol = "AID";
    string public standard = "AID Token v1.0";
    mapping(address => uint256) public balanceOf;
    mapping(address => mapping(address => uint256)) public allowance;

    event Transfer(
        address indexed _from,
        address indexed _to,
        uint256 _value
    );

    event Approval(
        address indexed _owner,
        address indexed _spender,
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

    //Approve
    function approve(address _spender, uint256 _value) public payable returns(bool success){

        allowance[msg.sender][_spender] = _value;
        emit Approval(msg.sender,_spender,_value);
        return true;
    }

    //TransferFrom
    function transferFrom(address _from, address _to, uint256 _value) public payable returns(bool success){
        require(_value <= balanceOf[_from],"transfer amount should be less than balance");
        //Require allowance is big enough
        require(_value <= allowance[_from][msg.sender],"transfer amount should be less than allowance");

        balanceOf[_from] -= _value;
        balanceOf[_to] += _value;

        allowance[_from][msg.sender] -= _value;

        emit Transfer(_from,_to,_value);
        return true;
    }
} 