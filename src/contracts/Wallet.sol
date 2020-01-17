pragma solidity ^0.5.7;

contract Wallet {
  address[] public approvers;
  uint public minLimit;
  struct Transfer {
    uint id;
    uint amount;
    address payable to;
    uint approvals;
    bool sent;
  }
  mapping(uint => Transfer) transfers;
  uint nextId;
  mapping(address => mapping(uint => bool)) approvals;

  constructor(address[] memory _approvers, uint _minLimit) payable public {
    approvers = _approvers;
    minLimit = _minLimit;
  }

  function createTransfer(uint amount, address payable to) onlyApprover() external {
    transfers[nextId] = Transfer(
      nextId,
      amount,
      to,
      0,
      false
    );
    nextId++;
  }

  function sendTransfer(uint id) onlyApprover() external {
    require(transfers[id].sent == false, 'transfer has already been sent');
     if(approvals[msg.sender][id] == false) {
      approvals[msg.sender][id] = true;
      transfers[id].approvals++;
    }
    
    if(transfers[id].approvals >= minLimit) {
      transfers[id].sent = true;
      address payable to = transfers[id].to;
      uint amount = transfers[id].amount;
      to.transfer(amount);
      return;
    }
  }

  modifier onlyApprover() {
    bool allowed = false;
    for(uint i; i < approvers.length; i++) {
      if(approvers[i] == msg.sender) {
        allowed = true;
      }
    }
    require(allowed == true, 'only approver allowed');
    _;
  }
}