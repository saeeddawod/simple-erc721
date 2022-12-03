const { MerkleTree } = require('merkletreejs');
const keccak256 = require('keccak256');

//in here put the whitelisted addresses. using the same format of the example addresses 
const whitelistAddresses =["0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2", "0x78731D3Ca6b7E34aC0F824c42a7cC18A495cabaB"];

const leafNodes = whitelistAddresses.map(addr => keccak256(addr));
const merkleTree = new MerkleTree(leafNodes, keccak256, { sortPairs: true });
const rootHash = merkleTree.getRoot();

//test
console.log('@@@@@test start@@@');
const claimingAddress = keccak256("0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2");
const hexProof = merkleTree.getHexProof(claimingAddress);
console.log('Whitelist Merkle Tree\n', merkleTree.toString());
console.log("Hex proof just for testing", hexProof);
console.log('rootHash buffer',rootHash);
console.log(merkleTree.verify(hexProof, claimingAddress, rootHash));
console.log('@@@test ended@@@');

//copy pasta the roothash below into setWhitelistMekrel'  
console.log('0x'+rootHash.toString('hex'));
