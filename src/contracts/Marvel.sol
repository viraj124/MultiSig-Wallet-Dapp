pragma solidity ^0.5.0;

import "../../node_modules/@openzeppelin/contracts/token/ERC721/ERC721Full.sol";


contract Marvel is ERC721Full {

uint256 id;
address owner;
string[] initials;

constructor() public ERC721Full("Marvel", "MARVEL") {
   owner = msg.sender;
}
modifier onlyOwner {
        require(msg.sender == owner);
        _;
    }

event Minted(
    string initials,
    string colour
);

struct character{
    string initials;
    string color;
    bool isMinted;
}

mapping(uint256 => character) public marvelAvatar;


function mint(string memory _initials, string memory _color) public onlyOwner {
     require(!isExistingToken(_initials), "No Duplicate Tokens Allowed");
     marvelAvatar[id] = character(_initials, _color, false);
     _mint(msg.sender, id);
     id = id + 1;
     marvelAvatar[id].isMinted = true;
     initials.push(_initials);
     emit Minted(_initials, _color);
}

function isExistingToken(string memory _initials) internal returns (bool) {
    for(uint256 i = 0; i < initials.length; i++){
       if(keccak256(abi.encodePacked((initials[i]))) == keccak256(abi.encodePacked((_initials)))) {
            return true;
        }
    }
    return false;
}
}