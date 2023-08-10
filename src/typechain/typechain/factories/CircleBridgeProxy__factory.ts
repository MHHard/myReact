/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";
import type {
  CircleBridgeProxy,
  CircleBridgeProxyInterface,
} from "../CircleBridgeProxy";

const _abi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "_circleBridge",
        type: "address",
      },
      {
        internalType: "address",
        name: "_feeCollector",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint64[]",
        name: "chainIds",
        type: "uint64[]",
      },
      {
        indexed: false,
        internalType: "int32[]",
        name: "domains",
        type: "int32[]",
      },
    ],
    name: "ChidToDomainUpdated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "sender",
        type: "address",
      },
      {
        indexed: false,
        internalType: "bytes32",
        name: "recipient",
        type: "bytes32",
      },
      {
        indexed: false,
        internalType: "uint64",
        name: "dstChid",
        type: "uint64",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "txFee",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "percFee",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint64",
        name: "nonce",
        type: "uint64",
      },
    ],
    name: "Deposited",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "to",
        type: "address",
      },
    ],
    name: "FeeCollectorUpdated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint64[]",
        name: "chainIds",
        type: "uint64[]",
      },
      {
        indexed: false,
        internalType: "uint32[]",
        name: "feePercs",
        type: "uint32[]",
      },
    ],
    name: "FeePercUpdated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "GovernorAdded",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "GovernorRemoved",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "OwnershipTransferred",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint64[]",
        name: "chainIds",
        type: "uint64[]",
      },
      {
        indexed: false,
        internalType: "uint256[]",
        name: "fees",
        type: "uint256[]",
      },
    ],
    name: "TxFeeUpdated",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_account",
        type: "address",
      },
    ],
    name: "addGovernor",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint64",
        name: "",
        type: "uint64",
      },
    ],
    name: "chidToDomain",
    outputs: [
      {
        internalType: "int32",
        name: "",
        type: "int32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "circleBridge",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address[]",
        name: "_tokens",
        type: "address[]",
      },
      {
        internalType: "address",
        name: "_to",
        type: "address",
      },
    ],
    name: "collectFee",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_amount",
        type: "uint256",
      },
      {
        internalType: "uint64",
        name: "_dstChid",
        type: "uint64",
      },
      {
        internalType: "bytes32",
        name: "_mintRecipient",
        type: "bytes32",
      },
      {
        internalType: "address",
        name: "_burnToken",
        type: "address",
      },
    ],
    name: "depositForBurn",
    outputs: [
      {
        internalType: "uint64",
        name: "_nonce",
        type: "uint64",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint64",
        name: "",
        type: "uint64",
      },
    ],
    name: "dstTxFee",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "feeCollector",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "feePercGlobal",
    outputs: [
      {
        internalType: "uint32",
        name: "",
        type: "uint32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint64",
        name: "",
        type: "uint64",
      },
    ],
    name: "feePercOverride",
    outputs: [
      {
        internalType: "uint32",
        name: "",
        type: "uint32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "governors",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_account",
        type: "address",
      },
    ],
    name: "isGovernor",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_account",
        type: "address",
      },
    ],
    name: "removeGovernor",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "renounceGovernor",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint64[]",
        name: "_chainIds",
        type: "uint64[]",
      },
      {
        internalType: "int32[]",
        name: "_domains",
        type: "int32[]",
      },
    ],
    name: "setChidToDomain",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_feeCollector",
        type: "address",
      },
    ],
    name: "setFeeCollector",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint64[]",
        name: "_chainIds",
        type: "uint64[]",
      },
      {
        internalType: "uint32[]",
        name: "_feePercs",
        type: "uint32[]",
      },
    ],
    name: "setFeePerc",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint64[]",
        name: "_chainIds",
        type: "uint64[]",
      },
      {
        internalType: "uint256[]",
        name: "_fees",
        type: "uint256[]",
      },
    ],
    name: "setTxFee",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_amount",
        type: "uint256",
      },
      {
        internalType: "uint64",
        name: "_dstChid",
        type: "uint64",
      },
    ],
    name: "totalFee",
    outputs: [
      {
        internalType: "uint256",
        name: "_fee",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_txFee",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_percFee",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

const _bytecode =
  "0x60a06040523480156200001157600080fd5b5060405162001ff838038062001ff88339810160408190526200003491620001b8565b80620000403362000083565b600180546001600160a01b0319166001600160a01b03929092169190911790556200006b33620000d3565b5060016003556001600160a01b0316608052620001f0565b600080546001600160a01b038381166001600160a01b0319831681178455604051919092169283917f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e09190a35050565b6001600160a01b03811660009081526002602052604090205460ff1615620001415760405162461bcd60e51b815260206004820152601b60248201527f4163636f756e7420697320616c726561647920676f7665726e6f720000000000604482015260640160405180910390fd5b6001600160a01b038116600081815260026020908152604091829020805460ff1916600117905590519182527fdc5a48d79e2e147530ff63ecdbed5a5a66adb9d5cf339384d5d076da197c40b5910160405180910390a150565b80516001600160a01b0381168114620001b357600080fd5b919050565b60008060408385031215620001cc57600080fd5b620001d7836200019b565b9150620001e7602084016200019b565b90509250929050565b608051611dd7620002216000396000818161017601528181610556015281816105b401526106320152611dd76000f3fe608060405234801561001057600080fd5b506004361061016c5760003560e01c8063a42dce80116100cd578063e43581b811610081578063eecdac8811610066578063eecdac88146103aa578063efcfd8f5146103bd578063f2fde38b146103d057600080fd5b8063e43581b814610350578063ee90fc401461037c57600080fd5b8063c415b95c116100b2578063c415b95c14610302578063e026049c14610315578063e3eece261461031d57600080fd5b8063a42dce80146102dc578063ab9341fd146102ef57600080fd5b80633c4a25d01161012457806343530a811161010957806343530a81146102a55780634c982597146102b85780638da5cb5b146102cb57600080fd5b80633c4a25d01461026a5780633e07d1721461027f57600080fd5b80630bd930b4116101555780630bd930b4146101eb5780631b286896146102105780632fbb00ac1461023e57600080fd5b806301a67b6b14610171578063027bcb87146101b5575b600080fd5b6101987f000000000000000000000000000000000000000000000000000000000000000081565b6040516001600160a01b0390911681526020015b60405180910390f35b6101d86101c3366004611899565b60076020526000908152604090205460030b81565b60405160039190910b81526020016101ac565b6004546101fb9063ffffffff1681565b60405163ffffffff90911681526020016101ac565b61023061021e366004611899565b60066020526000908152604090205481565b6040519081526020016101ac565b61025161024c3660046118d2565b6103e3565b60405167ffffffffffffffff90911681526020016101ac565b61027d61027836600461191a565b6106d1565b005b6101fb61028d366004611899565b60056020526000908152604090205463ffffffff1681565b61027d6102b3366004611981565b610746565b61027d6102c6366004611981565b6108a6565b6000546001600160a01b0316610198565b61027d6102ea36600461191a565b610a1d565b61027d6102fd366004611981565b610af4565b600154610198906001600160a01b031681565b61027d610d68565b61034061032b36600461191a565b60026020526000908152604090205460ff1681565b60405190151581526020016101ac565b61034061035e36600461191a565b6001600160a01b031660009081526002602052604090205460ff1690565b61038f61038a3660046119ed565b610d73565b604080519384526020840192909252908201526060016101ac565b61027d6103b836600461191a565b610df9565b61027d6103cb366004611a1d565b610e6b565b61027d6103de36600461191a565b6110a1565b600060026003540361043c5760405162461bcd60e51b815260206004820152601f60248201527f5265656e7472616e637947756172643a207265656e7472616e742063616c6c0060448201526064015b60405180910390fd5b6002600390815567ffffffffffffffff851660009081526007602052604081205490910b908190036104b05760405162461bcd60e51b815260206004820152601960248201527f64737420646f6d61696e206e6f742072656769737465726564000000000000006044820152606401610433565b60008160030b12156104c0575060005b60008060006104cf8989610d73565b9250925092508289116105245760405162461bcd60e51b815260206004820152600f60248201527f666565206e6f7420636f766572656400000000000000000000000000000000006044820152606401610433565b6105396001600160a01b03871633308c61118f565b6000610545848b611a87565b905061057b6001600160a01b0388167f000000000000000000000000000000000000000000000000000000000000000083611227565b6040516337e9a82760e11b81526004810182905263ffffffff86166024820152604481018990526001600160a01b0388811660648301527f00000000000000000000000000000000000000000000000000000000000000001690636fd3504e906084016020604051808303816000875af11580156105fd573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906106219190611aa0565b95506106586001600160a01b0388167f000000000000000000000000000000000000000000000000000000000000000060006112d9565b60408051338152602081018a905267ffffffffffffffff8b811682840152606082018d90526080820186905260a08201859052881660c082015290517fa2ca2ced575b143e45f6b68b9e9c92fc0ddfc107807c711f5f28ff625fea8e519181900360e00190a15050600160035550919695505050505050565b336106e46000546001600160a01b031690565b6001600160a01b03161461073a5760405162461bcd60e51b815260206004820181905260248201527f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e65726044820152606401610433565b610743816113fa565b50565b3360009081526002602052604090205460ff166107a55760405162461bcd60e51b815260206004820152601660248201527f43616c6c6572206973206e6f7420676f7665726e6f72000000000000000000006044820152606401610433565b8281146107e65760405162461bcd60e51b815260206004820152600f60248201526e0d8cadccee8d040dad2e6dac2e8c6d608b1b6044820152606401610433565b60005b838110156108625782828281811061080357610803611abd565b905060200201356006600087878581811061082057610820611abd565b90506020020160208101906108359190611899565b67ffffffffffffffff1681526020810191909152604001600020558061085a81611ad3565b9150506107e9565b507f3a331334e3690640b58b9d6889de0e68c9fec44c8e586b0f69eaa013f530e40c848484846040516108989493929190611b36565b60405180910390a150505050565b3360009081526002602052604090205460ff166109055760405162461bcd60e51b815260206004820152601660248201527f43616c6c6572206973206e6f7420676f7665726e6f72000000000000000000006044820152606401610433565b8281146109465760405162461bcd60e51b815260206004820152600f60248201526e0d8cadccee8d040dad2e6dac2e8c6d608b1b6044820152606401610433565b60005b838110156109e75782828281811061096357610963611abd565b90506020020160208101906109789190611bad565b6007600087878581811061098e5761098e611abd565b90506020020160208101906109a39190611899565b67ffffffffffffffff1681526020810191909152604001600020805463ffffffff191663ffffffff92909216919091179055806109df81611ad3565b915050610949565b507f99a427604fce28915eae6edfacfd125c0ed4393b0d54e90002f2ef13f120e4f8848484846040516108989493929190611bc8565b33610a306000546001600160a01b031690565b6001600160a01b031614610a865760405162461bcd60e51b815260206004820181905260248201527f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e65726044820152606401610433565b600180546001600160a01b0383811673ffffffffffffffffffffffffffffffffffffffff1983168117909355604080519190921680825260208201939093527f5d16ad41baeb009cd23eb8f6c7cde5c2e0cd5acf4a33926ab488875c37c37f38910160405180910390a15050565b3360009081526002602052604090205460ff16610b535760405162461bcd60e51b815260206004820152601660248201527f43616c6c6572206973206e6f7420676f7665726e6f72000000000000000000006044820152606401610433565b828114610b945760405162461bcd60e51b815260206004820152600f60248201526e0d8cadccee8d040dad2e6dac2e8c6d608b1b6044820152606401610433565b60005b83811015610d3257620f4240838383818110610bb557610bb5611abd565b9050602002016020810190610bca9190611c39565b63ffffffff1610610c1d5760405162461bcd60e51b815260206004820152601860248201527f6665652070657263656e7461676520746f6f206c6172676500000000000000006044820152606401610433565b848482818110610c2f57610c2f611abd565b9050602002016020810190610c449190611899565b67ffffffffffffffff16600003610c9b57828282818110610c6757610c67611abd565b9050602002016020810190610c7c9190611c39565b6004805463ffffffff191663ffffffff92909216919091179055610d20565b828282818110610cad57610cad611abd565b9050602002016020810190610cc29190611c39565b60056000878785818110610cd857610cd8611abd565b9050602002016020810190610ced9190611899565b67ffffffffffffffff1681526020810191909152604001600020805463ffffffff191663ffffffff929092169190911790555b80610d2a81611ad3565b915050610b97565b507f541df5e570cf10ffe04899eebd9eebebd1c54e2bd4af9f24b23fb4a40c6ea00b848484846040516108989493929190611c54565b610d71336114be565b565b67ffffffffffffffff81166000908152600560205260408120548190819063ffffffff16808203610da9575060045463ffffffff165b67ffffffffffffffff85166000908152600660205260409020549250620f4240610dd963ffffffff831688611ca7565b610de39190611cbe565b9150610def8284611ce0565b9350509250925092565b33610e0c6000546001600160a01b031690565b6001600160a01b031614610e625760405162461bcd60e51b815260206004820181905260248201527f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e65726044820152606401610433565b610743816114be565b6001546001600160a01b03163314610ec55760405162461bcd60e51b815260206004820152601160248201527f6e6f742066656520636f6c6c6563746f720000000000000000000000000000006044820152606401610433565b60005b8281101561109b576000848483818110610ee457610ee4611abd565b9050602002016020810190610ef9919061191a565b6001600160a01b031603610fb65760405147906000906001600160a01b0385169061c35090849084818181858888f193505050503d8060008114610f59576040519150601f19603f3d011682016040523d82523d6000602084013e610f5e565b606091505b5050905080610faf5760405162461bcd60e51b815260206004820152601260248201527f73656e64206e6174697665206661696c656400000000000000000000000000006044820152606401610433565b5050611089565b6000848483818110610fca57610fca611abd565b9050602002016020810190610fdf919061191a565b6040516370a0823160e01b81523060048201526001600160a01b0391909116906370a0823190602401602060405180830381865afa158015611025573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906110499190611cf3565b9050611087838287878681811061106257611062611abd565b9050602002016020810190611077919061191a565b6001600160a01b03169190611577565b505b8061109381611ad3565b915050610ec8565b50505050565b336110b46000546001600160a01b031690565b6001600160a01b03161461110a5760405162461bcd60e51b815260206004820181905260248201527f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e65726044820152606401610433565b6001600160a01b0381166111865760405162461bcd60e51b815260206004820152602660248201527f4f776e61626c653a206e6577206f776e657220697320746865207a65726f206160448201527f64647265737300000000000000000000000000000000000000000000000000006064820152608401610433565b610743816115a7565b6040516001600160a01b038085166024830152831660448201526064810182905261109b9085906323b872dd60e01b906084015b60408051601f198184030181529190526020810180517bffffffffffffffffffffffffffffffffffffffffffffffffffffffff167fffffffff0000000000000000000000000000000000000000000000000000000090931692909217909152611604565b604051636eb1769f60e11b81523060048201526001600160a01b038381166024830152600091839186169063dd62ed3e90604401602060405180830381865afa158015611278573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061129c9190611cf3565b6112a69190611ce0565b6040516001600160a01b03851660248201526044810182905290915061109b90859063095ea7b360e01b906064016111c3565b8015806113535750604051636eb1769f60e11b81523060048201526001600160a01b03838116602483015284169063dd62ed3e90604401602060405180830381865afa15801561132d573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906113519190611cf3565b155b6113c55760405162461bcd60e51b815260206004820152603660248201527f5361666545524332303a20617070726f76652066726f6d206e6f6e2d7a65726f60448201527f20746f206e6f6e2d7a65726f20616c6c6f77616e6365000000000000000000006064820152608401610433565b6040516001600160a01b0383166024820152604481018290526113f590849063095ea7b360e01b906064016111c3565b505050565b6001600160a01b03811660009081526002602052604090205460ff16156114635760405162461bcd60e51b815260206004820152601b60248201527f4163636f756e7420697320616c726561647920676f7665726e6f7200000000006044820152606401610433565b6001600160a01b038116600081815260026020908152604091829020805460ff1916600117905590519182527fdc5a48d79e2e147530ff63ecdbed5a5a66adb9d5cf339384d5d076da197c40b591015b60405180910390a150565b6001600160a01b03811660009081526002602052604090205460ff166115265760405162461bcd60e51b815260206004820152601760248201527f4163636f756e74206973206e6f7420676f7665726e6f720000000000000000006044820152606401610433565b6001600160a01b038116600081815260026020908152604091829020805460ff1916905590519182527f1ebe834e73d60a5fec822c1e1727d34bc79f2ad977ed504581cc1822fe20fb5b91016114b3565b6040516001600160a01b0383166024820152604481018290526113f590849063a9059cbb60e01b906064016111c3565b600080546001600160a01b0383811673ffffffffffffffffffffffffffffffffffffffff19831681178455604051919092169283917f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e09190a35050565b6000611659826040518060400160405280602081526020017f5361666545524332303a206c6f772d6c6576656c2063616c6c206661696c6564815250856001600160a01b03166116e99092919063ffffffff16565b8051909150156113f557808060200190518101906116779190611d0c565b6113f55760405162461bcd60e51b815260206004820152602a60248201527f5361666545524332303a204552433230206f7065726174696f6e20646964206e60448201527f6f742073756363656564000000000000000000000000000000000000000000006064820152608401610433565b60606116f88484600085611702565b90505b9392505050565b60608247101561177a5760405162461bcd60e51b815260206004820152602660248201527f416464726573733a20696e73756666696369656e742062616c616e636520666f60448201527f722063616c6c00000000000000000000000000000000000000000000000000006064820152608401610433565b6001600160a01b0385163b6117d15760405162461bcd60e51b815260206004820152601d60248201527f416464726573733a2063616c6c20746f206e6f6e2d636f6e74726163740000006044820152606401610433565b600080866001600160a01b031685876040516117ed9190611d52565b60006040518083038185875af1925050503d806000811461182a576040519150601f19603f3d011682016040523d82523d6000602084013e61182f565b606091505b509150915061183f82828661184a565b979650505050505050565b606083156118595750816116fb565b8251156118695782518084602001fd5b8160405162461bcd60e51b81526004016104339190611d6e565b67ffffffffffffffff8116811461074357600080fd5b6000602082840312156118ab57600080fd5b81356116fb81611883565b80356001600160a01b03811681146118cd57600080fd5b919050565b600080600080608085870312156118e857600080fd5b8435935060208501356118fa81611883565b92506040850135915061190f606086016118b6565b905092959194509250565b60006020828403121561192c57600080fd5b6116fb826118b6565b60008083601f84011261194757600080fd5b50813567ffffffffffffffff81111561195f57600080fd5b6020830191508360208260051b850101111561197a57600080fd5b9250929050565b6000806000806040858703121561199757600080fd5b843567ffffffffffffffff808211156119af57600080fd5b6119bb88838901611935565b909650945060208701359150808211156119d457600080fd5b506119e187828801611935565b95989497509550505050565b60008060408385031215611a0057600080fd5b823591506020830135611a1281611883565b809150509250929050565b600080600060408486031215611a3257600080fd5b833567ffffffffffffffff811115611a4957600080fd5b611a5586828701611935565b9094509250611a689050602085016118b6565b90509250925092565b634e487b7160e01b600052601160045260246000fd5b81810381811115611a9a57611a9a611a71565b92915050565b600060208284031215611ab257600080fd5b81516116fb81611883565b634e487b7160e01b600052603260045260246000fd5b600060018201611ae557611ae5611a71565b5060010190565b8183526000602080850194508260005b85811015611b2b578135611b0f81611883565b67ffffffffffffffff1687529582019590820190600101611afc565b509495945050505050565b604081526000611b4a604083018688611aec565b82810360208401528381527f07ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff841115611b8257600080fd5b8360051b80866020840137016020019695505050505050565b8035600381900b81146118cd57600080fd5b600060208284031215611bbf57600080fd5b6116fb82611b9b565b604081526000611bdc604083018688611aec565b8281036020848101919091528482528591810160005b86811015611c1857611c0384611b9b565b60030b82529282019290820190600101611bf2565b5098975050505050505050565b803563ffffffff811681146118cd57600080fd5b600060208284031215611c4b57600080fd5b6116fb82611c25565b604081526000611c68604083018688611aec565b8281036020848101919091528482528591810160005b86811015611c185763ffffffff611c9485611c25565b1682529282019290820190600101611c7e565b8082028115828204841417611a9a57611a9a611a71565b600082611cdb57634e487b7160e01b600052601260045260246000fd5b500490565b80820180821115611a9a57611a9a611a71565b600060208284031215611d0557600080fd5b5051919050565b600060208284031215611d1e57600080fd5b815180151581146116fb57600080fd5b60005b83811015611d49578181015183820152602001611d31565b50506000910152565b60008251611d64818460208701611d2e565b9190910192915050565b6020815260008251806020840152611d8d816040850160208701611d2e565b601f01601f1916919091016040019291505056fea26469706673582212206282d31bdfaaf0a80eda16fad4410d355e43be1eeda3bdc0990a4666142f0ccb64736f6c63430008110033";

type CircleBridgeProxyConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: CircleBridgeProxyConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class CircleBridgeProxy__factory extends ContractFactory {
  constructor(...args: CircleBridgeProxyConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
    this.contractName = "CircleBridgeProxy";
  }

  deploy(
    _circleBridge: string,
    _feeCollector: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<CircleBridgeProxy> {
    return super.deploy(
      _circleBridge,
      _feeCollector,
      overrides || {}
    ) as Promise<CircleBridgeProxy>;
  }
  getDeployTransaction(
    _circleBridge: string,
    _feeCollector: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(
      _circleBridge,
      _feeCollector,
      overrides || {}
    );
  }
  attach(address: string): CircleBridgeProxy {
    return super.attach(address) as CircleBridgeProxy;
  }
  connect(signer: Signer): CircleBridgeProxy__factory {
    return super.connect(signer) as CircleBridgeProxy__factory;
  }
  static readonly contractName: "CircleBridgeProxy";
  public readonly contractName: "CircleBridgeProxy";
  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): CircleBridgeProxyInterface {
    return new utils.Interface(_abi) as CircleBridgeProxyInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): CircleBridgeProxy {
    return new Contract(address, _abi, signerOrProvider) as CircleBridgeProxy;
  }
}
