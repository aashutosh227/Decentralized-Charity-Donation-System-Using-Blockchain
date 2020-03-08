pragma solidity >=0.4.21 <0.7.0;

contract User{
    mapping(address=>string) public uname;
    mapping(address=>string) public pwd;
    mapping(address=>string) public uType;
    string public name = "User contract";
    string public symbol = "USER";
    
    event Username_Assigned(
        address indexed account,
        string uname
    );
    event Pwd_Assigned(
        address indexed account,
        string pwd
    );

    event Type_Assigned(
        address indexed account,
        string utype
    );

    function setUname(string memory _uname) public returns(bool success){
        uname[msg.sender] = _uname;
        emit Username_Assigned(msg.sender,_uname);
        return true;
    }

    function setPwd(string memory _passwd) public returns(bool success){
        pwd[msg.sender] = _passwd;
        emit Pwd_Assigned(msg.sender,_passwd);
        return true;
    }

    function setUtype(string memory _uType) public returns(bool success){
        uType[msg.sender] = _uType;
        emit Type_Assigned(msg.sender,_uType);
        return true;
    }
}
