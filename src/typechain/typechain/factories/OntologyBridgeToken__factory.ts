/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";
import type {
  OntologyBridgeToken,
  OntologyBridgeTokenInterface,
} from "../OntologyBridgeToken";

const _abi = [
  {
    inputs: [
      {
        internalType: "string",
        name: "name_",
        type: "string",
      },
      {
        internalType: "string",
        name: "symbol_",
        type: "string",
      },
      {
        internalType: "address",
        name: "bridge_",
        type: "address",
      },
      {
        internalType: "address",
        name: "wrapper_",
        type: "address",
      },
      {
        internalType: "address",
        name: "canonical_",
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
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "Approval",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "bridge",
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
        indexed: true,
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "Transfer",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
    ],
    name: "allowance",
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
    inputs: [
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "approve",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
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
    name: "balanceOf",
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
    name: "bridge",
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
        name: "_from",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_amount",
        type: "uint256",
      },
    ],
    name: "burn",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "canonical",
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
    name: "decimals",
    outputs: [
      {
        internalType: "uint8",
        name: "",
        type: "uint8",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "subtractedValue",
        type: "uint256",
      },
    ],
    name: "decreaseAllowance",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "getOwner",
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
        name: "spender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "addedValue",
        type: "uint256",
      },
    ],
    name: "increaseAllowance",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_amount",
        type: "uint256",
      },
    ],
    name: "mint",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "name",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
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
    name: "renounceOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "symbol",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "totalSupply",
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
    inputs: [
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "transfer",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "transferFrom",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
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
    inputs: [
      {
        internalType: "address",
        name: "_bridge",
        type: "address",
      },
    ],
    name: "updateBridge",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "wrapper",
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
];

const _bytecode =
  "0x60c06040523480156200001157600080fd5b5060405162001b3238038062001b32833981016040819052620000349162000295565b8451859085906200004d90600390602085019062000105565b5080516200006390600490602084019062000105565b505050620000806200007a620000af60201b60201c565b620000b3565b600680546001600160a01b0319166001600160a01b039485161790559082166080521660a05250620003749050565b3390565b600580546001600160a01b038381166001600160a01b0319831681179093556040519116919082907f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e090600090a35050565b828054620001139062000337565b90600052602060002090601f01602090048101928262000137576000855562000182565b82601f106200015257805160ff191683800117855562000182565b8280016001018555821562000182579182015b828111156200018257825182559160200191906001019062000165565b506200019092915062000194565b5090565b5b8082111562000190576000815560010162000195565b634e487b7160e01b600052604160045260246000fd5b600082601f830112620001d357600080fd5b81516001600160401b0380821115620001f057620001f0620001ab565b604051601f8301601f19908116603f011681019082821181831017156200021b576200021b620001ab565b816040528381526020925086838588010111156200023857600080fd5b600091505b838210156200025c57858201830151818301840152908201906200023d565b838211156200026e5760008385830101525b9695505050505050565b80516001600160a01b03811681146200029057600080fd5b919050565b600080600080600060a08688031215620002ae57600080fd5b85516001600160401b0380821115620002c657600080fd5b620002d489838a01620001c1565b96506020880151915080821115620002eb57600080fd5b50620002fa88828901620001c1565b9450506200030b6040870162000278565b92506200031b6060870162000278565b91506200032b6080870162000278565b90509295509295909350565b600181811c908216806200034c57607f821691505b602082108114156200036e57634e487b7160e01b600052602260045260246000fd5b50919050565b60805160a051611767620003cb600039600081816101e70152818161045b0152818161081b0152610850015260008181610306015281816105a0015281816105f10152818161087201526108c601526117676000f3fe608060405234801561001057600080fd5b50600436106101775760003560e01c8063715018a6116100d8578063a457c2d71161008c578063dd62ed3e11610066578063dd62ed3e14610328578063e78cea9214610361578063f2fde38b1461037457600080fd5b8063a457c2d7146102db578063a9059cbb146102ee578063ac210cc71461030157600080fd5b80638da5cb5b116100bd5780638da5cb5b146102af57806395d89b41146102c05780639dc29fac146102c857600080fd5b8063715018a61461029f578063893d20e8146102a757600080fd5b8063313ce5671161012f57806340c10f191161011457806340c10f191461024e5780636eb382121461026157806370a082311461027657600080fd5b8063313ce56714610221578063395093511461023b57600080fd5b806318160ddd1161016057806318160ddd146101bd57806323b872dd146101cf57806326afaadd146101e257600080fd5b806306fdde031461017c578063095ea7b31461019a575b600080fd5b610184610387565b6040516101919190611534565b60405180910390f35b6101ad6101a8366004611583565b610419565b6040519015158152602001610191565b6002545b604051908152602001610191565b6101ad6101dd3660046115ad565b610431565b6102097f000000000000000000000000000000000000000000000000000000000000000081565b6040516001600160a01b039091168152602001610191565b610229610457565b60405160ff9091168152602001610191565b6101ad610249366004611583565b6104ef565b6101ad61025c366004611583565b61052e565b61027461026f3660046115e9565b61066d565b005b6101c16102843660046115e9565b6001600160a01b031660009081526020819052604090205490565b610274610728565b61020961078e565b6005546001600160a01b0316610209565b6101846107a2565b6101ad6102d6366004611583565b6107b1565b6101ad6102e9366004611583565b610950565b6101ad6102fc366004611583565b610a05565b6102097f000000000000000000000000000000000000000000000000000000000000000081565b6101c1610336366004611604565b6001600160a01b03918216600090815260016020908152604080832093909416825291909152205490565b600654610209906001600160a01b031681565b6102746103823660046115e9565b610a13565b60606003805461039690611637565b80601f01602080910402602001604051908101604052809291908181526020018280546103c290611637565b801561040f5780601f106103e45761010080835404028352916020019161040f565b820191906000526020600020905b8154815290600101906020018083116103f257829003601f168201915b5050505050905090565b600033610427818585610af5565b5060019392505050565b60003361043f858285610c1a565b61044a858585610cac565b60019150505b9392505050565b60007f00000000000000000000000000000000000000000000000000000000000000006001600160a01b031663313ce5676040518163ffffffff1660e01b815260040160206040518083038186803b1580156104b257600080fd5b505afa1580156104c6573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906104ea9190611672565b905090565b3360008181526001602090815260408083206001600160a01b038716845290915281205490919061042790829086906105299087906116ab565b610af5565b6006546000906001600160a01b031633146105905760405162461bcd60e51b815260206004820152601460248201527f63616c6c6572206973206e6f742062726964676500000000000000000000000060448201526064015b60405180910390fd5b61059a3083610ea9565b6105c5307f000000000000000000000000000000000000000000000000000000000000000084610af5565b6040516373565be560e11b81523060048201526001600160a01b038481166024830152604482018490527f0000000000000000000000000000000000000000000000000000000000000000169063e6acb7ca90606401602060405180830381600087803b15801561063557600080fd5b505af1158015610649573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061042791906116c3565b6005546001600160a01b031633146106c75760405162461bcd60e51b815260206004820181905260248201527f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e65726044820152606401610587565b6006805473ffffffffffffffffffffffffffffffffffffffff19166001600160a01b0383169081179091556040519081527fe1694c0b21fdceff6411daed547c7463c2341b9695387bc82595b5b9b1851d4a9060200160405180910390a150565b6005546001600160a01b031633146107825760405162461bcd60e51b815260206004820181905260248201527f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e65726044820152606401610587565b61078c6000610f88565b565b60006104ea6005546001600160a01b031690565b60606004805461039690611637565b6006546000906001600160a01b0316331461080e5760405162461bcd60e51b815260206004820152601460248201527f63616c6c6572206973206e6f74206272696467650000000000000000000000006044820152606401610587565b6108436001600160a01b037f000000000000000000000000000000000000000000000000000000000000000016843085610fe7565b6108976001600160a01b037f0000000000000000000000000000000000000000000000000000000000000000167f00000000000000000000000000000000000000000000000000000000000000008461107f565b60405163c08fc9cb60e01b81523060048201526001600160a01b038481166024830152604482018490526000917f00000000000000000000000000000000000000000000000000000000000000009091169063c08fc9cb90606401602060405180830381600087803b15801561090c57600080fd5b505af1158015610920573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061094491906116c3565b90506104278482611140565b3360008181526001602090815260408083206001600160a01b0387168452909152812054909190838110156109ed5760405162461bcd60e51b815260206004820152602560248201527f45524332303a2064656372656173656420616c6c6f77616e63652062656c6f7760448201527f207a65726f0000000000000000000000000000000000000000000000000000006064820152608401610587565b6109fa8286868403610af5565b506001949350505050565b600033610427818585610cac565b6005546001600160a01b03163314610a6d5760405162461bcd60e51b815260206004820181905260248201527f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e65726044820152606401610587565b6001600160a01b038116610ae95760405162461bcd60e51b815260206004820152602660248201527f4f776e61626c653a206e6577206f776e657220697320746865207a65726f206160448201527f64647265737300000000000000000000000000000000000000000000000000006064820152608401610587565b610af281610f88565b50565b6001600160a01b038316610b575760405162461bcd60e51b8152602060048201526024808201527f45524332303a20617070726f76652066726f6d20746865207a65726f206164646044820152637265737360e01b6064820152608401610587565b6001600160a01b038216610bb85760405162461bcd60e51b815260206004820152602260248201527f45524332303a20617070726f766520746f20746865207a65726f206164647265604482015261737360f01b6064820152608401610587565b6001600160a01b0383811660008181526001602090815260408083209487168084529482529182902085905590518481527f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b92591015b60405180910390a3505050565b6001600160a01b038381166000908152600160209081526040808320938616835292905220546000198114610ca65781811015610c995760405162461bcd60e51b815260206004820152601d60248201527f45524332303a20696e73756666696369656e7420616c6c6f77616e63650000006044820152606401610587565b610ca68484848403610af5565b50505050565b6001600160a01b038316610d285760405162461bcd60e51b815260206004820152602560248201527f45524332303a207472616e736665722066726f6d20746865207a65726f20616460448201527f64726573730000000000000000000000000000000000000000000000000000006064820152608401610587565b6001600160a01b038216610d8a5760405162461bcd60e51b815260206004820152602360248201527f45524332303a207472616e7366657220746f20746865207a65726f206164647260448201526265737360e81b6064820152608401610587565b6001600160a01b03831660009081526020819052604090205481811015610e195760405162461bcd60e51b815260206004820152602660248201527f45524332303a207472616e7366657220616d6f756e742065786365656473206260448201527f616c616e636500000000000000000000000000000000000000000000000000006064820152608401610587565b6001600160a01b03808516600090815260208190526040808220858503905591851681529081208054849290610e509084906116ab565b92505081905550826001600160a01b0316846001600160a01b03167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef84604051610e9c91815260200190565b60405180910390a3610ca6565b6001600160a01b038216610eff5760405162461bcd60e51b815260206004820152601f60248201527f45524332303a206d696e7420746f20746865207a65726f2061646472657373006044820152606401610587565b8060026000828254610f1191906116ab565b90915550506001600160a01b03821660009081526020819052604081208054839290610f3e9084906116ab565b90915550506040518181526001600160a01b038316906000907fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef9060200160405180910390a35050565b600580546001600160a01b0383811673ffffffffffffffffffffffffffffffffffffffff19831681179093556040519116919082907f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e090600090a35050565b6040516001600160a01b0380851660248301528316604482015260648101829052610ca69085906323b872dd60e01b906084015b60408051601f198184030181529190526020810180517bffffffffffffffffffffffffffffffffffffffffffffffffffffffff167fffffffff000000000000000000000000000000000000000000000000000000009093169290921790915261128b565b604051636eb1769f60e11b81523060048201526001600160a01b038381166024830152600091839186169063dd62ed3e9060440160206040518083038186803b1580156110cb57600080fd5b505afa1580156110df573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061110391906116c3565b61110d91906116ab565b6040516001600160a01b038516602482015260448101829052909150610ca690859063095ea7b360e01b9060640161101b565b6001600160a01b0382166111a05760405162461bcd60e51b815260206004820152602160248201527f45524332303a206275726e2066726f6d20746865207a65726f206164647265736044820152607360f81b6064820152608401610587565b6001600160a01b038216600090815260208190526040902054818110156112145760405162461bcd60e51b815260206004820152602260248201527f45524332303a206275726e20616d6f756e7420657863656564732062616c616e604482015261636560f01b6064820152608401610587565b6001600160a01b03831660009081526020819052604081208383039055600280548492906112439084906116dc565b90915550506040518281526000906001600160a01b038516907fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef90602001610c0d565b505050565b60006112e0826040518060400160405280602081526020017f5361666545524332303a206c6f772d6c6576656c2063616c6c206661696c6564815250856001600160a01b03166113709092919063ffffffff16565b80519091501561128657808060200190518101906112fe91906116f3565b6112865760405162461bcd60e51b815260206004820152602a60248201527f5361666545524332303a204552433230206f7065726174696f6e20646964206e60448201527f6f742073756363656564000000000000000000000000000000000000000000006064820152608401610587565b606061137f8484600085611387565b949350505050565b6060824710156113ff5760405162461bcd60e51b815260206004820152602660248201527f416464726573733a20696e73756666696369656e742062616c616e636520666f60448201527f722063616c6c00000000000000000000000000000000000000000000000000006064820152608401610587565b6001600160a01b0385163b6114565760405162461bcd60e51b815260206004820152601d60248201527f416464726573733a2063616c6c20746f206e6f6e2d636f6e74726163740000006044820152606401610587565b600080866001600160a01b031685876040516114729190611715565b60006040518083038185875af1925050503d80600081146114af576040519150601f19603f3d011682016040523d82523d6000602084013e6114b4565b606091505b50915091506114c48282866114cf565b979650505050505050565b606083156114de575081610450565b8251156114ee5782518084602001fd5b8160405162461bcd60e51b81526004016105879190611534565b60005b8381101561152357818101518382015260200161150b565b83811115610ca65750506000910152565b6020815260008251806020840152611553816040850160208701611508565b601f01601f19169190910160400192915050565b80356001600160a01b038116811461157e57600080fd5b919050565b6000806040838503121561159657600080fd5b61159f83611567565b946020939093013593505050565b6000806000606084860312156115c257600080fd5b6115cb84611567565b92506115d960208501611567565b9150604084013590509250925092565b6000602082840312156115fb57600080fd5b61045082611567565b6000806040838503121561161757600080fd5b61162083611567565b915061162e60208401611567565b90509250929050565b600181811c9082168061164b57607f821691505b6020821081141561166c57634e487b7160e01b600052602260045260246000fd5b50919050565b60006020828403121561168457600080fd5b815160ff8116811461045057600080fd5b634e487b7160e01b600052601160045260246000fd5b600082198211156116be576116be611695565b500190565b6000602082840312156116d557600080fd5b5051919050565b6000828210156116ee576116ee611695565b500390565b60006020828403121561170557600080fd5b8151801515811461045057600080fd5b60008251611727818460208701611508565b919091019291505056fea2646970667358221220c12c5dd530ab065f615e24e73805c80d266816efa9ad247726718f2eb25c427164736f6c63430008090033";

type OntologyBridgeTokenConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: OntologyBridgeTokenConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class OntologyBridgeToken__factory extends ContractFactory {
  constructor(...args: OntologyBridgeTokenConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
    this.contractName = "OntologyBridgeToken";
  }

  deploy(
    name_: string,
    symbol_: string,
    bridge_: string,
    wrapper_: string,
    canonical_: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<OntologyBridgeToken> {
    return super.deploy(
      name_,
      symbol_,
      bridge_,
      wrapper_,
      canonical_,
      overrides || {}
    ) as Promise<OntologyBridgeToken>;
  }
  getDeployTransaction(
    name_: string,
    symbol_: string,
    bridge_: string,
    wrapper_: string,
    canonical_: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(
      name_,
      symbol_,
      bridge_,
      wrapper_,
      canonical_,
      overrides || {}
    );
  }
  attach(address: string): OntologyBridgeToken {
    return super.attach(address) as OntologyBridgeToken;
  }
  connect(signer: Signer): OntologyBridgeToken__factory {
    return super.connect(signer) as OntologyBridgeToken__factory;
  }
  static readonly contractName: "OntologyBridgeToken";
  public readonly contractName: "OntologyBridgeToken";
  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): OntologyBridgeTokenInterface {
    return new utils.Interface(_abi) as OntologyBridgeTokenInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): OntologyBridgeToken {
    return new Contract(address, _abi, signerOrProvider) as OntologyBridgeToken;
  }
}
