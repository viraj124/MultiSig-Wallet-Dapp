pragma solidity ^0.5.0;

import "../../node_modules/@openzeppelin/contracts/token/ERC721/ERC721Full.sol";


contract Marvel is ERC721Full {

uint256 id;
address owner;

constructor() public ERC721Full("Marvel", "MARVEL") {
   owner = msg.sender;
}

struct character{
    string initials;
    string color;
    bool isMinted;
}

mapping(uint256 => character) public marvelAvatar;


function mint(string memory _initials, string memory _color) public {
     marvelAvatar[id] = character(_initials, _color, false);
     _mint(msg.sender, id);
     id = id + 1;
     marvelAvatar[id].isMinted = true;
}
}