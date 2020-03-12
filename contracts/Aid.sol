pragma solidity >=0.4.21 <0.7.0;

contract Aid{
    struct quotation{
        uint id;
        address ngo_address;
        string subject;
        string description;
        bool approved;
    }
    uint256 id;
    mapping(address=>quotation) public qList;
    mapping(uint=>address) public itemAddress;
    address[] public quotation_address;

    constructor() public{
        id = 0;
    }

    event Quotation(
        address indexed _address,
        string _subject,
        string _description
    );

    function setQuotation(address _address, string memory subject, string memory description) 
        public payable returns(uint256 qid){
        id += 1;
        quotation memory quotDetail;
        quotDetail.ngo_address = msg.sender;
        quotDetail.subject = subject;
        quotDetail.description = description;
        quotDetail.approved = true;
        quotation_address.push(_address);
        qList[_address] = quotDetail;
        emit Quotation(qList[_address].ngo_address, qList[_address].subject, qList[_address].description);
        return id;
    }
}