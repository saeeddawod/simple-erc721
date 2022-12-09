// SPDX-License-Identifier: MIT

// Amended by HashLips

pragma solidity >=0.7.0 <0.9.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";

contract NFT is ERC721Enumerable, Ownable {
    using Strings for uint256;

    string baseURI;
    string public baseExtension = ".json";
    uint256 public publicMintcost = 0.04 ether;
    uint256 public whitelistMintCost = 0.01 ether;
    uint256 public whiteListMaxMintAmount = 2;
    mapping(address => uint256) public whiteListMintCount;
    bytes32 public whiteListmerkleRoot;

    uint256 public maxSupply;
    bool public revealed = false;
    string public notRevealedUri;

    bool public publicMintStatus = false;
    bool public whitelistMintStatus = false;


    constructor(
        string memory _name,
        string memory _symbol,
        string memory _initNotRevealedUri,
        uint256  _maxSupply
    ) ERC721(_name, _symbol) {
        setNotRevealedURI(_initNotRevealedUri);
        _safeMint(msg.sender, 1);
        setMaxMintSupply(_maxSupply);
    }

    // internal
    function _baseURI() internal view virtual override returns (string memory) {
        return baseURI;
    }

    // public mint
    function mint(uint256 _mintAmount) public payable {
        uint256 supply = totalSupply();
        require(publicMintStatus);
        require(_mintAmount > 0);
        require(supply + _mintAmount <= maxSupply);
        if (msg.sender != owner()) {
            require(msg.value >= publicMintcost * _mintAmount);
        }
        for (uint256 i = 1; i <= _mintAmount; i++) {
            _safeMint(msg.sender, supply + i);
        }
    }

    //whitelist mint
    function whitelistMint(uint256 _mintAmount, bytes32[] calldata _merkleProof)
        public
        payable
    {
        uint256 supply = totalSupply();
        require(whitelistMintStatus);
        require(_mintAmount > 0);
        require(_mintAmount <= whiteListMaxMintAmount);
        require(supply + _mintAmount <= maxSupply);
        bytes32 leaf = keccak256(abi.encodePacked(_msgSender()));
        require(
            MerkleProof.verify(_merkleProof, whiteListmerkleRoot, leaf),
            "Invalid proof!"
        );

        require(
            _mintAmount > 0 &&
                whiteListMintCount[msg.sender] + _mintAmount <=
                whiteListMaxMintAmount,
            "Amount bigger than allowed max mint!"
        );

        if (msg.sender != owner()) {
            require(msg.value >= whitelistMintCost * _mintAmount);
        }

        for (uint256 i = 1; i <= _mintAmount; i++) {
            whiteListMintCount++
            _safeMint(msg.sender, supply + i);
        }
    }

    function walletOfOwner(address _owner)
        public
        view
        returns (uint256[] memory)
    {
        uint256 ownerTokenCount = balanceOf(_owner);
        uint256[] memory tokenIds = new uint256[](ownerTokenCount);
        for (uint256 i; i < ownerTokenCount; i++) {
            tokenIds[i] = tokenOfOwnerByIndex(_owner, i);
        }
        return tokenIds;
    }

    function tokenURI(uint256 tokenId)
        public
        view
        virtual
        override
        returns (string memory)
    {
        require(
            _exists(tokenId),
            "ERC721Metadata: URI query for nonexistent token"
        );

        if (revealed == false) {
            return notRevealedUri;
        }

        string memory currentBaseURI = _baseURI();
        return
            bytes(currentBaseURI).length > 0
                ? string(
                    abi.encodePacked(
                        currentBaseURI,
                        tokenId.toString(),
                        baseExtension
                    )
                )
                : "";
    }

    //only owner
    function reveal() public onlyOwner {
        revealed = true;
    }

    function setPublicMintCost(uint256 _newCost) public onlyOwner {
        publicMintcost = _newCost;
    }

    function setWhitelistMintCost(uint256 _newCost) public onlyOwner {
        whitelistMintCost = _newCost;
    }

    function setmaxWhiteListMintAmount(uint256 _newmaxMintAmount) public onlyOwner {
        whiteListMaxMintAmount = _newmaxMintAmount;
    }

    function setNotRevealedURI(string memory _notRevealedURI) public onlyOwner {
        notRevealedUri = _notRevealedURI;
    }

    function setBaseURI(string memory _newBaseURI) public onlyOwner {
        baseURI = _newBaseURI;
    }

    function setBaseExtension(string memory _newBaseExtension)
        public
        onlyOwner
    {
        baseExtension = _newBaseExtension;
    }

    function setPublicMintStatus(bool _state) public onlyOwner {
        publicMintStatus = _state;
    }

    function setWhitelistMintStatus(bool _state) public onlyOwner {
        whitelistMintStatus = _state;
    }

    function setWhiteListMerkleRoot(bytes32 _merkleRoot) public onlyOwner {
        whiteListmerkleRoot = _merkleRoot;
    }

    function setMaxMintSupply(uint256 _maxSupply) public onlyOwner {
        maxSupply = _maxSupply;
    }
    
    function withdraw() public payable onlyOwner {
        (bool os, ) = payable(owner()).call{value: address(this).balance}("");
        require(os);
    }
}
