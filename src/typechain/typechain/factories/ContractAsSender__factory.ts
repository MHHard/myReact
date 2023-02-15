/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";
import type {
  ContractAsSender,
  ContractAsSenderInterface,
} from "../ContractAsSender";

const _abi = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "enum BridgeTransferLib.BridgeSendType",
        name: "bridgeSendType",
        type: "uint8",
      },
      {
        indexed: false,
        internalType: "address",
        name: "bridgeAddr",
        type: "address",
      },
    ],
    name: "BridgeUpdated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "depositor",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "token",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "Deposited",
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
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "Paused",
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
    name: "PauserAdded",
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
    name: "PauserRemoved",
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
    name: "Unpaused",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "addPauser",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "enum BridgeTransferLib.BridgeSendType",
        name: "",
        type: "uint8",
      },
    ],
    name: "bridges",
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
        name: "_token",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_amount",
        type: "uint256",
      },
    ],
    name: "deposit",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "isPauser",
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
    inputs: [],
    name: "pause",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "paused",
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
        name: "",
        type: "address",
      },
    ],
    name: "pausers",
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
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    name: "records",
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
        internalType: "bytes",
        name: "_request",
        type: "bytes",
      },
      {
        internalType: "bytes[]",
        name: "_sigs",
        type: "bytes[]",
      },
      {
        internalType: "address[]",
        name: "_signers",
        type: "address[]",
      },
      {
        internalType: "uint256[]",
        name: "_powers",
        type: "uint256[]",
      },
      {
        internalType: "enum BridgeTransferLib.BridgeSendType",
        name: "_bridgeSendType",
        type: "uint8",
      },
    ],
    name: "refund",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "removePauser",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "renouncePauser",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "enum BridgeTransferLib.BridgeSendType",
        name: "_bridgeSendType",
        type: "uint8",
      },
      {
        internalType: "address",
        name: "_addr",
        type: "address",
      },
    ],
    name: "setBridgeAddress",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_receiver",
        type: "address",
      },
      {
        internalType: "address",
        name: "_token",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_amount",
        type: "uint256",
      },
      {
        internalType: "uint64",
        name: "_dstChainId",
        type: "uint64",
      },
      {
        internalType: "uint64",
        name: "_nonce",
        type: "uint64",
      },
      {
        internalType: "uint32",
        name: "_maxSlippage",
        type: "uint32",
      },
      {
        internalType: "enum BridgeTransferLib.BridgeSendType",
        name: "_bridgeSendType",
        type: "uint8",
      },
    ],
    name: "transfer",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "nonpayable",
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
  {
    inputs: [],
    name: "unpause",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

const _bytecode =
  "0x60806040523480156200001157600080fd5b506001600055620000223362000040565b6001805460ff60a01b191690556200003a3362000092565b6200015a565b600180546001600160a01b038381166001600160a01b0319831681179093556040519116919082907f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e090600090a35050565b6001600160a01b03811660009081526002602052604090205460ff1615620001005760405162461bcd60e51b815260206004820152601960248201527f4163636f756e7420697320616c72656164792070617573657200000000000000604482015260640160405180910390fd5b6001600160a01b038116600081815260026020908152604091829020805460ff1916600117905590519182527f6719d08c1888103bea251a4ed56406bd0c3e69723c8a1686e017e7bbe159b6f8910160405180910390a150565b6138bd806200016a6000396000f3fe608060405234801561001057600080fd5b50600436106101005760003560e01c80636b2c0f551161009757806382dc1ec41161006657806382dc1ec4146102645780638456cb59146102775780638da5cb5b1461027f578063f2fde38b1461029057600080fd5b80636b2c0f55146102135780636ef8d66d1461022657806380f51c121461022e57806381cc86771461025157600080fd5b806347e7ef24116100d357806347e7ef24146101b25780635c975abb146101c557806365d67c33146101d75780636701d5141461020057600080fd5b806301e64725146101055780631edeeb231461014b5780633f4ba83a1461016c57806346fbf68e14610176575b600080fd5b61012e610113366004613265565b6004602052600090815260409020546001600160a01b031681565b6040516001600160a01b0390911681526020015b60405180910390f35b61015e6101593660046132de565b6102a3565b604051908152602001610142565b6101746105bb565b005b6101a26101843660046133f4565b6001600160a01b031660009081526002602052604090205460ff1690565b6040519015158152602001610142565b6101746101c036600461340f565b610624565b600154600160a01b900460ff166101a2565b61012e6101e5366004613439565b6003602052600090815260409020546001600160a01b031681565b61017461020e366004613454565b610799565b6101746102213660046133f4565b6108ef565b610174610964565b6101a261023c3660046133f4565b60026020526000908152604090205460ff1681565b61015e61025f36600461349f565b61096d565b6101746102723660046133f4565b610bc7565b610174610c39565b6001546001600160a01b031661012e565b61017461029e3660046133f4565b610ca0565b6000600260005414156102fd5760405162461bcd60e51b815260206004820152601f60248201527f5265656e7472616e637947756172643a207265656e7472616e742063616c6c0060448201526064015b60405180910390fd5b6002600055600154600160a01b900460ff161561034f5760405162461bcd60e51b815260206004820152601060248201526f14185d5cd8589b194e881c185d5cd95960821b60448201526064016102f4565b336103626001546001600160a01b031690565b6001600160a01b0316146103b85760405162461bcd60e51b815260206004820181905260248201527f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e657260448201526064016102f4565b6000600360008460068111156103d0576103d0613529565b60068111156103e1576103e1613529565b81526020810191909152604001600020546001600160a01b031690508061044a5760405162461bcd60e51b815260206004820152601360248201527f756e6b6e6f776e2062726964676520747970650000000000000000000000000060448201526064016102f4565b60006104668c8c8c8c8c8c8c8c6104608d610d8e565b8b610e5e565b60208101519091506001600160a01b031630146104c55760405162461bcd60e51b815260206004820152600e60248201527f696e76616c696420726566756e6400000000000000000000000000000000000060448201526064016102f4565b60808101516000908152600460205260409020546001600160a01b0316806105555760405162461bcd60e51b815260206004820152602760248201527f756e6b6e6f776e207472616e73666572206964206f7220616c7265616479207260448201527f6566756e6465640000000000000000000000000000000000000000000000000060648201526084016102f4565b608082015160009081526004602052604090819020805473ffffffffffffffffffffffffffffffffffffffff191690556060830151908301516105a5916001600160a01b03909116908390610ff2565b505160016000559b9a5050505050505050505050565b3360009081526002602052604090205460ff1661061a5760405162461bcd60e51b815260206004820152601460248201527f43616c6c6572206973206e6f742070617573657200000000000000000000000060448201526064016102f4565b610622611087565b565b600260005414156106775760405162461bcd60e51b815260206004820152601f60248201527f5265656e7472616e637947756172643a207265656e7472616e742063616c6c0060448201526064016102f4565b6002600055600154600160a01b900460ff16156106c95760405162461bcd60e51b815260206004820152601060248201526f14185d5cd8589b194e881c185d5cd95960821b60448201526064016102f4565b336106dc6001546001600160a01b031690565b6001600160a01b0316146107325760405162461bcd60e51b815260206004820181905260248201527f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e657260448201526064016102f4565b6107476001600160a01b03831633308461112d565b604080513381526001600160a01b03841660208201529081018290527f8752a472e571a816aea92eec8dae9baf628e840f4929fbcc2d155e6233ff68a79060600160405180910390a150506001600055565b336107ac6001546001600160a01b031690565b6001600160a01b0316146108025760405162461bcd60e51b815260206004820181905260248201527f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e657260448201526064016102f4565b6001600160a01b0381166108585760405162461bcd60e51b815260206004820152600f60248201527f696e76616c69642061646472657373000000000000000000000000000000000060448201526064016102f4565b806003600084600681111561086f5761086f613529565b600681111561088057610880613529565b815260200190815260200160002060006101000a8154816001600160a01b0302191690836001600160a01b031602179055507fe85507dd8a6159a69bf9f4aa5ae1283824ec9948b7d4a03d5cb457070f312dfc82826040516108e392919061353f565b60405180910390a15050565b336109026001546001600160a01b031690565b6001600160a01b0316146109585760405162461bcd60e51b815260206004820181905260248201527f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e657260448201526064016102f4565b6109618161116b565b50565b6106223361116b565b6000600260005414156109c25760405162461bcd60e51b815260206004820152601f60248201527f5265656e7472616e637947756172643a207265656e7472616e742063616c6c0060448201526064016102f4565b6002600055600154600160a01b900460ff1615610a145760405162461bcd60e51b815260206004820152601060248201526f14185d5cd8589b194e881c185d5cd95960821b60448201526064016102f4565b33610a276001546001600160a01b031690565b6001600160a01b031614610a7d5760405162461bcd60e51b815260206004820181905260248201527f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e657260448201526064016102f4565b600060036000846006811115610a9557610a95613529565b6006811115610aa657610aa6613529565b81526020810191909152604001600020546001600160a01b0316905080610b0f5760405162461bcd60e51b815260206004820152601360248201527f756e6b6e6f776e2062726964676520747970650000000000000000000000000060448201526064016102f4565b6000610b218a8a8a8a8a8a8a8961122b565b6000818152600460205260409020549091506001600160a01b031615610b895760405162461bcd60e51b815260206004820152600d60248201527f7265636f7264206578697374730000000000000000000000000000000000000060448201526064016102f4565b6000818152600460205260409020805473ffffffffffffffffffffffffffffffffffffffff1916331790559150506001600055979650505050505050565b33610bda6001546001600160a01b031690565b6001600160a01b031614610c305760405162461bcd60e51b815260206004820181905260248201527f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e657260448201526064016102f4565b6109618161180e565b3360009081526002602052604090205460ff16610c985760405162461bcd60e51b815260206004820152601460248201527f43616c6c6572206973206e6f742070617573657200000000000000000000000060448201526064016102f4565b6106226118cb565b33610cb36001546001600160a01b031690565b6001600160a01b031614610d095760405162461bcd60e51b815260206004820181905260248201527f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e657260448201526064016102f4565b6001600160a01b038116610d855760405162461bcd60e51b815260206004820152602660248201527f4f776e61626c653a206e6577206f776e657220697320746865207a65726f206160448201527f646472657373000000000000000000000000000000000000000000000000000060648201526084016102f4565b61096181611953565b60006001826006811115610da457610da4613529565b1415610db257506002919050565b6002826006811115610dc657610dc6613529565b1415610dd457506004919050565b6003826006811115610de857610de8613529565b1415610df657506003919050565b6004826006811115610e0a57610e0a613529565b1415610e1857506006919050565b6005826006811115610e2c57610e2c613529565b1480610e4957506006826006811115610e4757610e47613529565b145b15610e5657506005919050565b506000919050565b6040805160a0810182526000808252602082018190529181018290526060810182905260808101919091526001836006811115610e9d57610e9d613529565b1415610ebb57610eb48b8b8b8b8b8b8b8b8a6119b2565b9050610fe4565b6002836006811115610ecf57610ecf613529565b1415610ee657610eb48b8b8b8b8b8b8b8b8a611c11565b6004836006811115610efa57610efa613529565b1415610f1157610eb48b8b8b8b8b8b8b8b8a611e1c565b6003836006811115610f2557610f25613529565b1415610f3c57610eb48b8b8b8b8b8b8b8b8a611f9a565b6006836006811115610f5057610f50613529565b1415610f6757610eb48b8b8b8b8b8b8b8b8a6121a6565b6005836006811115610f7b57610f7b613529565b1415610f9257610eb48b8b8b8b8b8b8b8b8a612439565b60405162461bcd60e51b815260206004820152602160248201527f62726964676520726563656976652074797065206e6f7420737570706f7274656044820152601960fa1b60648201526084016102f4565b9a9950505050505050505050565b6040516001600160a01b03831660248201526044810182905261108290849063a9059cbb60e01b906064015b60408051601f198184030181529190526020810180517bffffffffffffffffffffffffffffffffffffffffffffffffffffffff167fffffffff0000000000000000000000000000000000000000000000000000000090931692909217909152612619565b505050565b600154600160a01b900460ff166110e05760405162461bcd60e51b815260206004820152601460248201527f5061757361626c653a206e6f742070617573656400000000000000000000000060448201526064016102f4565b6001805460ff60a01b191690557f5db9ee0a495bf2e6ff9c91a7834c1ba4fdd244a5e8aa4e537bd38aeae4b073aa335b6040516001600160a01b03909116815260200160405180910390a1565b6040516001600160a01b03808516602483015283166044820152606481018290526111659085906323b872dd60e01b9060840161101e565b50505050565b6001600160a01b03811660009081526002602052604090205460ff166111d35760405162461bcd60e51b815260206004820152601560248201527f4163636f756e74206973206e6f7420706175736572000000000000000000000060448201526064016102f4565b6001600160a01b038116600081815260026020908152604091829020805460ff1916905590519182527fcd265ebaf09df2871cc7bd4133404a235ba12eff2041bb89d9c714a2621c7c7e91015b60405180910390a150565b6000806112426001600160a01b038a16848a6126fe565b600184600681111561125657611256613529565b14156113715760405163a5977fbb60e01b81526001600160a01b038b811660048301528a81166024830152604482018a905267ffffffffffffffff808a1660648401528816608483015263ffffffff871660a483015284169063a5977fbb9060c401600060405180830381600087803b1580156112d257600080fd5b505af11580156112e6573d6000803e3d6000fd5b50506040516bffffffffffffffffffffffff1930606090811b821660208401528e811b821660348401528d901b166048820152605c81018b90526001600160c01b031960c08b811b8216607c8401528a811b8216608484015246901b16608c82015260940191506113549050565b604051602081830303815290604052805190602001209050611801565b600284600681111561138557611385613529565b141561148b576040516308d18d8960e21b81526001600160a01b038a81166004830152602482018a905267ffffffffffffffff808a1660448401528c821660648401528816608483015284169063234636249060a401600060405180830381600087803b1580156113f557600080fd5b505af1158015611409573d6000803e3d6000fd5b50505050308989898d8a466040516020016113549796959493929190606097881b6bffffffffffffffffffffffff19908116825296881b87166014820152602881019590955260c093841b6001600160c01b031990811660488701529290961b909416605084015292811b831660648301529290921b16606c82015260740190565b600384600681111561149f5761149f613529565b14156115b357604051636f3c863f60e11b81526001600160a01b038a81166004830152602482018a90528b8116604483015267ffffffffffffffff8816606483015284169063de790c7e90608401600060405180830381600087803b15801561150757600080fd5b505af115801561151b573d6000803e3d6000fd5b50506040516bffffffffffffffffffffffff1930606090811b821660208401528d811b82166034840152604883018d90528e901b1660688201526001600160c01b031960c08a811b8216607c84015246901b166084820152608c01915061157f9050565b60408051601f19818403018152919052805160209091012090506115ae6001600160a01b038a168460006127bf565b611801565b60048460068111156115c7576115c7613529565b1415611676576040516308d18d8960e21b81526001600160a01b038a81166004830152602482018a905267ffffffffffffffff808a1660448401528c821660648401528816608483015284169063234636249060a401602060405180830381600087803b15801561163757600080fd5b505af115801561164b573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061166f9190613579565b9050611801565b600584600681111561168a5761168a613529565b141561174a5760405163a002930160e01b81526001600160a01b038a81166004830152602482018a905267ffffffffffffffff808a1660448401528c821660648401528816608483015284169063a00293019060a4015b602060405180830381600087803b1580156116fb57600080fd5b505af115801561170f573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906117339190613579565b90506115ae6001600160a01b038a168460006127bf565b600684600681111561175e5761175e613529565b14156117b957604051639e422c3360e01b81526001600160a01b038a81166004830152602482018a905267ffffffffffffffff808a1660448401528c8216606484015288166084830152841690639e422c339060a4016116e1565b60405162461bcd60e51b815260206004820152601e60248201527f6272696467652073656e642074797065206e6f7420737570706f72746564000060448201526064016102f4565b9998505050505050505050565b6001600160a01b03811660009081526002602052604090205460ff16156118775760405162461bcd60e51b815260206004820152601960248201527f4163636f756e7420697320616c7265616479207061757365720000000000000060448201526064016102f4565b6001600160a01b038116600081815260026020908152604091829020805460ff1916600117905590519182527f6719d08c1888103bea251a4ed56406bd0c3e69723c8a1686e017e7bbe159b6f89101611220565b600154600160a01b900460ff16156119185760405162461bcd60e51b815260206004820152601060248201526f14185d5cd8589b194e881c185d5cd95960821b60448201526064016102f4565b6001805460ff60a01b1916600160a01b1790557f62e78cea01bee320cd4e420270b5ea74000d11b0c9f74754ebdbfc544b05a2586111103390565b600180546001600160a01b0383811673ffffffffffffffffffffffffffffffffffffffff19831681179093556040519116919082907f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e090600090a35050565b6040805160a0810182526000808252602082018190529181018290526060810182905260808101919091526040805160a0810182526000808252602082018190529181018290526060810182905260808101919091526000611a498c8c8080601f0160208091040260200160405190810160405280939291908181526020018383808284376000920191909152506128ea92505050565b8051602080830151604080850151606080870151608088015160c0808a0151955198841b6bffffffffffffffffffffffff19908116988a019890985295831b871660348901529290911b9094166048860152605c85019390935291811b6001600160c01b0319908116607c8501524690911b166084830152608c82015290915060ac0160408051601f19818403018152918152815160209283012080855260c08401516080860152838301516001600160a01b039081169386019390935283820151831685830152606080850151908601529051633c64f04b60e01b815291861691633c64f04b91611b419160040190815260200190565b60206040518083038186803b158015611b5957600080fd5b505afa158015611b6d573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190611b919190613592565b611c025760405163cdd1b25d60e01b81526001600160a01b0385169063cdd1b25d90611bcf908f908f908f908f908f908f908f908f90600401613673565b600060405180830381600087803b158015611be957600080fd5b505af1158015611bfd573d6000803e3d6000fd5b505050505b509a9950505050505050505050565b6040805160a0810182526000808252602082018190529181018290526060810182905260808101919091526040805160a0810182526000808252602082018190529181018290526060810182905260808101919091526000611ca88c8c8080601f016020809104026020016040519081016040528093929190818152602001838380828437600092019190915250612a7992505050565b8051602080830151604080850151606080870151608088015193516001600160c01b031960c098891b8116978201979097529490961b90941660288401526bffffffffffffffffffffffff1990841b811660308401529390921b9092166044830152605882015290915060780160408051601f19818403018152918152815160209283012080855260a0840151608080870191909152848301516001600160a01b039081169487019490945260608086015185168785015290850151908601529051631c13568560e31b81529186169163e09ab42891611d8e9160040190815260200190565b60206040518083038186803b158015611da657600080fd5b505afa158015611dba573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190611dde9190613592565b611c0257604051630144352560e71b81526001600160a01b0385169063a21a928090611bcf908f908f908f908f908f908f908f908f90600401613673565b6040805160a0810182526000808252602082018190529181018290526060810182905260808101919091526040805160a0810182526000808252602082018190529181018290526060810182905260808101919091526000611eb38c8c8080601f016020809104026020016040519081016040528093929190818152602001838380828437600092019190915250612bc292505050565b6020808201518251604080850151606080870151608088015160a089015194516bffffffffffffffffffffffff1997841b88169881019890985294821b8616603488015260488701929092521b90921660688401526001600160c01b031960c09190911b16607c830152608482015290915060a40160408051601f19818403018152918152815160209283012080855260a08401516080860152838301516001600160a01b0390811693860193909352835183168583015283820151606086015290516301e6472560e01b8152918616916301e6472591611d8e9160040190815260200190565b6040805160a0810182526000808252602082018190529181018290526060810182905260808101919091526040805160a08101825260008082526020820181905291810182905260608101829052608081019190915260006120318c8c8080601f016020809104026020016040519081016040528093929190818152602001838380828437600092019190915250612d0d92505050565b6020808201518251604080850151606080870151608088015160a089015194516bffffffffffffffffffffffff1997841b88169881019890985294821b8616603488015260488701929092521b90921660688401526001600160c01b031960c09190911b16607c830152608482015290915060a40160408051601f19818403018152918152815160209283012080855260a08401516080860152838301516001600160a01b0390811693860193909352835183168583015283820151606086015290516301e6472560e01b8152918616916301e64725916121189160040190815260200190565b60206040518083038186803b15801561213057600080fd5b505afa158015612144573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906121689190613592565b611c0257604051637c39a18160e11b81526001600160a01b0385169063f873430290611bcf908f908f908f908f908f908f908f908f90600401613673565b6040805160a0810182526000808252602082018190529181018290526060810182905260808101919091526040805160a081018252600080825260208201819052918101829052606081018290526080810191909152600061223d8c8c8080601f016020809104026020016040519081016040528093929190818152602001838380828437600092019190915250612bc292505050565b60a08101516040516301e6472560e01b81529192506001600160a01b038616916301e64725916122739160040190815260200190565b60206040518083038186803b15801561228b57600080fd5b505afa15801561229f573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906122c39190613592565b15612367576020808201518251604080850151606080870151608088015160a089015194516bffffffffffffffffffffffff1997841b88169881019890985294821b86166034880152604887019290925290811b841660688601526001600160c01b031960c09390931b92909216607c850152608484015286901b1660a482015260b8015b60408051601f19818403018152919052805160209091012082526123f6565b604051630144352560e71b81526001600160a01b0385169063a21a9280906123a1908f908f908f908f908f908f908f908f90600401613673565b602060405180830381600087803b1580156123bb57600080fd5b505af11580156123cf573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906123f39190613579565b82525b60a081015160808301526020808201516001600160a01b0390811691840191909152815116604080840191909152015160608201529a9950505050505050505050565b6040805160a0810182526000808252602082018190529181018290526060810182905260808101919091526040805160a08101825260008082526020820181905291810182905260608101829052608081019190915260006124d08c8c8080601f016020809104026020016040519081016040528093929190818152602001838380828437600092019190915250612d0d92505050565b60a08101516040516301e6472560e01b81529192506001600160a01b038616916301e64725916125069160040190815260200190565b60206040518083038186803b15801561251e57600080fd5b505afa158015612532573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906125569190613592565b156125df576020808201518251604080850151606080870151608088015160a089015194516bffffffffffffffffffffffff1997841b88169881019890985294821b86166034880152604887019290925290811b841660688601526001600160c01b031960c09390931b92909216607c850152608484015286901b1660a482015260b801612348565b604051637c39a18160e11b81526001600160a01b0385169063f8734302906123a1908f908f908f908f908f908f908f908f90600401613673565b600061266e826040518060400160405280602081526020017f5361666545524332303a206c6f772d6c6576656c2063616c6c206661696c6564815250856001600160a01b0316612e589092919063ffffffff16565b805190915015611082578080602001905181019061268c9190613592565b6110825760405162461bcd60e51b815260206004820152602a60248201527f5361666545524332303a204552433230206f7065726174696f6e20646964206e60448201527f6f7420737563636565640000000000000000000000000000000000000000000060648201526084016102f4565b604051636eb1769f60e11b81523060048201526001600160a01b038381166024830152600091839186169063dd62ed3e9060440160206040518083038186803b15801561274a57600080fd5b505afa15801561275e573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906127829190613579565b61278c919061376b565b6040516001600160a01b03851660248201526044810182905290915061116590859063095ea7b360e01b9060640161101e565b8015806128485750604051636eb1769f60e11b81523060048201526001600160a01b03838116602483015284169063dd62ed3e9060440160206040518083038186803b15801561280e57600080fd5b505afa158015612822573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906128469190613579565b155b6128ba5760405162461bcd60e51b815260206004820152603660248201527f5361666545524332303a20617070726f76652066726f6d206e6f6e2d7a65726f60448201527f20746f206e6f6e2d7a65726f20616c6c6f77616e63650000000000000000000060648201526084016102f4565b6040516001600160a01b03831660248201526044810182905261108290849063095ea7b360e01b9060640161101e565b6040805160e08101825260008082526020808301829052828401829052606083018290526080830182905260a0830182905260c0830182905283518085019094528184528301849052909190805b60208301515183511015612a715761294f83612e71565b9092509050816001141561297e5761296e61296984612eab565b612f68565b6001600160a01b03168452612938565b81600214156129a65761299361296984612eab565b6001600160a01b03166020850152612938565b81600314156129ce576129bb61296984612eab565b6001600160a01b03166040850152612938565b81600414156129f2576129e86129e384612eab565b612f79565b6060850152612938565b8160051415612a1857612a0483612fb0565b67ffffffffffffffff166080850152612938565b8160061415612a3e57612a2a83612fb0565b67ffffffffffffffff1660a0850152612938565b8160071415612a6257612a58612a5384612eab565b613032565b60c0850152612938565b612a6c838261304a565b612938565b505050919050565b6040805160c08101825260008082526020808301829052828401829052606083018290526080830182905260a0830182905283518085019094528184528301849052909190805b60208301515183511015612a7157612ad783612e71565b90925090508160011415612aff57612aee83612fb0565b67ffffffffffffffff168452612ac0565b8160021415612b2557612b1183612fb0565b67ffffffffffffffff166020850152612ac0565b8160031415612b4d57612b3a61296984612eab565b6001600160a01b03166040850152612ac0565b8160041415612b7557612b6261296984612eab565b6001600160a01b03166060850152612ac0565b8160051415612b9457612b8a6129e384612eab565b6080850152612ac0565b8160061415612bb357612ba9612a5384612eab565b60a0850152612ac0565b612bbd838261304a565b612ac0565b6040805160c08101825260008082526020808301829052828401829052606083018290526080830182905260a0830182905283518085019094528184528301849052909190805b60208301515183511015612a7157612c2083612e71565b90925090508160011415612c4a57612c3a61296984612eab565b6001600160a01b03168452612c09565b8160021415612c7257612c5f61296984612eab565b6001600160a01b03166020850152612c09565b8160031415612c9157612c876129e384612eab565b6040850152612c09565b8160041415612cb957612ca661296984612eab565b6001600160a01b03166060850152612c09565b8160051415612cdf57612ccb83612fb0565b67ffffffffffffffff166080850152612c09565b8160061415612cfe57612cf4612a5384612eab565b60a0850152612c09565b612d08838261304a565b612c09565b6040805160c08101825260008082526020808301829052828401829052606083018290526080830182905260a0830182905283518085019094528184528301849052909190805b60208301515183511015612a7157612d6b83612e71565b90925090508160011415612d9557612d8561296984612eab565b6001600160a01b03168452612d54565b8160021415612dbd57612daa61296984612eab565b6001600160a01b03166020850152612d54565b8160031415612ddc57612dd26129e384612eab565b6040850152612d54565b8160041415612e0457612df161296984612eab565b6001600160a01b03166060850152612d54565b8160051415612e2a57612e1683612fb0565b67ffffffffffffffff166080850152612d54565b8160061415612e4957612e3f612a5384612eab565b60a0850152612d54565b612e53838261304a565b612d54565b6060612e6784846000856130bc565b90505b9392505050565b6000806000612e7f84612fb0565b9050612e8c600882613783565b9250806007166005811115612ea357612ea3613529565b915050915091565b60606000612eb883612fb0565b90506000818460000151612ecc919061376b565b9050836020015151811115612ee057600080fd5b8167ffffffffffffffff811115612ef957612ef96137a5565b6040519080825280601f01601f191660200182016040528015612f23576020820181803683370190505b50602080860151865192955091818601919083010160005b85811015612f5d578181015183820152612f5660208261376b565b9050612f3b565b505050935250919050565b6000612f7382613204565b92915050565b6000602082511115612f8a57600080fd5b6020820151905081516020612f9f91906137bb565b612faa9060086137d2565b1c919050565b602080820151825181019091015160009182805b600a81101561302c5783811a9150612fdd8160076137d2565b82607f16901b85179450816080166000141561301a57612ffe81600161376b565b8651879061300d90839061376b565b9052509395945050505050565b80613024816137f1565b915050612fc4565b50600080fd5b6000815160201461304257600080fd5b506020015190565b600081600581111561305e5761305e613529565b141561306d5761108282612fb0565b600281600581111561308157613081613529565b141561010057600061309283612fb0565b905080836000018181516130a6919061376b565b9052506020830151518351111561108257600080fd5b6060824710156131345760405162461bcd60e51b815260206004820152602660248201527f416464726573733a20696e73756666696369656e742062616c616e636520666f60448201527f722063616c6c000000000000000000000000000000000000000000000000000060648201526084016102f4565b6001600160a01b0385163b61318b5760405162461bcd60e51b815260206004820152601d60248201527f416464726573733a2063616c6c20746f206e6f6e2d636f6e747261637400000060448201526064016102f4565b600080866001600160a01b031685876040516131a79190613838565b60006040518083038185875af1925050503d80600081146131e4576040519150601f19603f3d011682016040523d82523d6000602084013e6131e9565b606091505b50915091506131f982828661322c565b979650505050505050565b6000815160141461321457600080fd5b50602001516c01000000000000000000000000900490565b6060831561323b575081612e6a565b82511561324b5782518084602001fd5b8160405162461bcd60e51b81526004016102f49190613854565b60006020828403121561327757600080fd5b5035919050565b60008083601f84011261329057600080fd5b50813567ffffffffffffffff8111156132a857600080fd5b6020830191508360208260051b85010111156132c357600080fd5b9250929050565b8035600781106132d957600080fd5b919050565b600080600080600080600080600060a08a8c0312156132fc57600080fd5b893567ffffffffffffffff8082111561331457600080fd5b818c0191508c601f83011261332857600080fd5b81358181111561333757600080fd5b8d602082850101111561334957600080fd5b60209283019b509950908b0135908082111561336457600080fd5b6133708d838e0161327e565b909950975060408c013591508082111561338957600080fd5b6133958d838e0161327e565b909750955060608c01359150808211156133ae57600080fd5b506133bb8c828d0161327e565b90945092506133ce905060808b016132ca565b90509295985092959850929598565b80356001600160a01b03811681146132d957600080fd5b60006020828403121561340657600080fd5b612e6a826133dd565b6000806040838503121561342257600080fd5b61342b836133dd565b946020939093013593505050565b60006020828403121561344b57600080fd5b612e6a826132ca565b6000806040838503121561346757600080fd5b613470836132ca565b915061347e602084016133dd565b90509250929050565b803567ffffffffffffffff811681146132d957600080fd5b600080600080600080600060e0888a0312156134ba57600080fd5b6134c3886133dd565b96506134d1602089016133dd565b9550604088013594506134e660608901613487565b93506134f460808901613487565b925060a088013563ffffffff8116811461350d57600080fd5b915061351b60c089016132ca565b905092959891949750929550565b634e487b7160e01b600052602160045260246000fd5b604081016007841061356157634e487b7160e01b600052602160045260246000fd5b9281526001600160a01b039190911660209091015290565b60006020828403121561358b57600080fd5b5051919050565b6000602082840312156135a457600080fd5b81518015158114612e6a57600080fd5b81835281816020850137506000828201602090810191909152601f909101601f19169091010190565b8183526000602080850194508260005b85811015613619576001600160a01b03613606836133dd565b16875295820195908201906001016135ed565b509495945050505050565b81835260007f07ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff83111561365657600080fd5b8260051b8083602087013760009401602001938452509192915050565b608081526000613687608083018a8c6135b4565b82810360208401528088825260208201905060208960051b8301018a60005b8b81101561371a57848303601f190184528135368e9003601e190181126136cc57600080fd5b8d01803567ffffffffffffffff8111156136e557600080fd5b8036038f13156136f457600080fd5b6137028582602085016135b4565b602096870196909550939093019250506001016136a6565b5050848103604086015261372f81898b6135dd565b925050508281036060840152613746818587613624565b9b9a5050505050505050505050565b634e487b7160e01b600052601160045260246000fd5b6000821982111561377e5761377e613755565b500190565b6000826137a057634e487b7160e01b600052601260045260246000fd5b500490565b634e487b7160e01b600052604160045260246000fd5b6000828210156137cd576137cd613755565b500390565b60008160001904831182151516156137ec576137ec613755565b500290565b600060001982141561380557613805613755565b5060010190565b60005b8381101561382757818101518382015260200161380f565b838111156111655750506000910152565b6000825161384a81846020870161380c565b9190910192915050565b602081526000825180602084015261387381604085016020870161380c565b601f01601f1916919091016040019291505056fea264697066735822122084b681b3cba13af7aad533e5f838bebe40ad6108ca9c52e0cb53dc7e90ca35e464736f6c63430008090033";

type ContractAsSenderConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: ContractAsSenderConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class ContractAsSender__factory extends ContractFactory {
  constructor(...args: ContractAsSenderConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
    this.contractName = "ContractAsSender";
  }

  deploy(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractAsSender> {
    return super.deploy(overrides || {}) as Promise<ContractAsSender>;
  }
  getDeployTransaction(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  attach(address: string): ContractAsSender {
    return super.attach(address) as ContractAsSender;
  }
  connect(signer: Signer): ContractAsSender__factory {
    return super.connect(signer) as ContractAsSender__factory;
  }
  static readonly contractName: "ContractAsSender";
  public readonly contractName: "ContractAsSender";
  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): ContractAsSenderInterface {
    return new utils.Interface(_abi) as ContractAsSenderInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): ContractAsSender {
    return new Contract(address, _abi, signerOrProvider) as ContractAsSender;
  }
}
