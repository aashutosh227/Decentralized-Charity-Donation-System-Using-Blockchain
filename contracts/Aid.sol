pragma solidity >=0.4.21 <0.7.0;

import "./User.sol";

contract Aid{
    User public user;
    struct quotation{
        uint256 id;
        address ngo_address;
        string subject;
        string description;
        bool approved;
        uint256 fund_reqd;
        uint256 fund_del;
    }
    uint256 id;
    mapping(address=>quotation) public qList;
    mapping(uint256=>address) public itemAddress;
    address[] public quotation_address;

    constructor() public{
        id = 0;
    }

    event Quotation(
        address indexed _address,
        string _subject,
        string _description,
        uint256 id
    );

    function setQuotation(address _address, string memory subject, string memory description, 
    uint256 fund_reqd) public payable returns(uint256 qid){
        qid = id;
        id += 1;
        //Create a variable of type  quotation struct
        quotation memory quotDetail;
        //Set the data into to object variable
        quotDetail.id = qid;
        quotDetail.ngo_address = msg.sender;
        quotDetail.subject = subject;
        quotDetail.description = description;
        quotDetail.approved = false;
        quotDetail.fund_reqd = fund_reqd;
        quotDetail.fund_del = 0;

        //Push the address of ngo  
        quotation_address.push(_address);
        itemAddress[qid] = _address;
        qList[_address] = quotDetail;
        emit Quotation(qList[_address].ngo_address, qList[_address].subject,
        qList[_address].description, qid);
        return qid;
    }

    function getItemAddress(uint256 qid) public view returns(address _addr){
        _addr = quotation_address[qid];
        return _addr;
    }

    
}