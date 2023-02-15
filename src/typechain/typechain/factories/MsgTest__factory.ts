/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";
import type { MsgTest, MsgTestInterface } from "../MsgTest";

const _abi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "_messageBus",
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
        internalType: "address",
        name: "messageBus",
        type: "address",
      },
    ],
    name: "MessageBusUpdated",
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
        internalType: "uint64",
        name: "srcChainId",
        type: "uint64",
      },
      {
        indexed: false,
        internalType: "uint64",
        name: "nonce",
        type: "uint64",
      },
      {
        indexed: false,
        internalType: "bytes",
        name: "message",
        type: "bytes",
      },
    ],
    name: "MessageReceived",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
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
      {
        indexed: false,
        internalType: "address",
        name: "sender",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint64",
        name: "srcChainId",
        type: "uint64",
      },
      {
        indexed: false,
        internalType: "address",
        name: "receiver",
        type: "address",
      },
      {
        indexed: false,
        internalType: "bytes",
        name: "message",
        type: "bytes",
      },
    ],
    name: "MessageReceivedWithTransfer",
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
        name: "receiver",
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
      {
        indexed: false,
        internalType: "bytes",
        name: "message",
        type: "bytes",
      },
    ],
    name: "Refunded",
    type: "event",
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
    name: "drainToken",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_sender",
        type: "address",
      },
      {
        internalType: "uint64",
        name: "_srcChainId",
        type: "uint64",
      },
      {
        internalType: "bytes",
        name: "_message",
        type: "bytes",
      },
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "executeMessage",
    outputs: [
      {
        internalType: "enum IMessageReceiverApp.ExecutionStatus",
        name: "",
        type: "uint8",
      },
    ],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_sender",
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
        name: "_srcChainId",
        type: "uint64",
      },
      {
        internalType: "bytes",
        name: "_message",
        type: "bytes",
      },
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "executeMessageWithTransfer",
    outputs: [
      {
        internalType: "enum IMessageReceiverApp.ExecutionStatus",
        name: "",
        type: "uint8",
      },
    ],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_sender",
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
        name: "_srcChainId",
        type: "uint64",
      },
      {
        internalType: "bytes",
        name: "_message",
        type: "bytes",
      },
      {
        internalType: "address",
        name: "_executor",
        type: "address",
      },
    ],
    name: "executeMessageWithTransferFallback",
    outputs: [
      {
        internalType: "enum IMessageReceiverApp.ExecutionStatus",
        name: "",
        type: "uint8",
      },
    ],
    stateMutability: "payable",
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
      {
        internalType: "bytes",
        name: "_message",
        type: "bytes",
      },
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "executeMessageWithTransferRefund",
    outputs: [
      {
        internalType: "enum IMessageReceiverApp.ExecutionStatus",
        name: "",
        type: "uint8",
      },
    ],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [],
    name: "messageBus",
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
        name: "_receiver",
        type: "address",
      },
      {
        internalType: "uint64",
        name: "_dstChainId",
        type: "uint64",
      },
      {
        internalType: "bytes",
        name: "_message",
        type: "bytes",
      },
    ],
    name: "sendMessage",
    outputs: [],
    stateMutability: "payable",
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
        internalType: "uint32",
        name: "_maxSlippage",
        type: "uint32",
      },
      {
        internalType: "bytes",
        name: "_message",
        type: "bytes",
      },
      {
        internalType: "enum MsgDataTypes.BridgeSendType",
        name: "_bridgeSendType",
        type: "uint8",
      },
    ],
    name: "sendMessageWithTransfer",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_messageBus",
        type: "address",
      },
    ],
    name: "setMessageBus",
    outputs: [],
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
];

const _bytecode =
  "0x60806040523480156200001157600080fd5b5060405162002318380380620023188339810160408190526200003491620000b5565b6200003f3362000065565b600180546001600160a01b0319166001600160a01b0392909216919091179055620000e7565b600080546001600160a01b038381166001600160a01b0319831681178455604051919092169283917f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e09190a35050565b600060208284031215620000c857600080fd5b81516001600160a01b0381168114620000e057600080fd5b9392505050565b61222180620000f76000396000f3fe6080604052600436106100bc5760003560e01c80638da5cb5b11610074578063a1a227fa1161004e578063a1a227fa146101aa578063c81739cd146101ca578063f2fde38b146101dd57600080fd5b80638da5cb5b146101455780639c649fdf146101775780639d4323be1461018a57600080fd5b80635ab7afc6116100a55780635ab7afc61461010c5780637767b8d71461011f5780637cd2bffc1461013257600080fd5b80630bcb4982146100c1578063547cad12146100ea575b600080fd5b6100d46100cf366004611998565b6101fd565b6040516100e19190611a22565b60405180910390f35b3480156100f657600080fd5b5061010a610105366004611a4a565b6102d2565b005b6100d461011a366004611a84565b61039c565b61010a61012d366004611b1b565b610404565b6100d4610140366004611c96565b6104bc565b34801561015157600080fd5b506000546001600160a01b03165b6040516001600160a01b0390911681526020016100e1565b6100d4610185366004611d26565b610599565b34801561019657600080fd5b5061010a6101a5366004611d73565b6106bb565b3480156101b657600080fd5b5060015461015f906001600160a01b031681565b61010a6101d8366004611d9f565b61073c565b3480156101e957600080fd5b5061010a6101f8366004611a4a565b6107d8565b6001546000906001600160a01b0316331461025f5760405162461bcd60e51b815260206004820152601960248201527f63616c6c6572206973206e6f74206d657373616765206275730000000000000060448201526064015b60405180910390fd5b60008061026e85870187611e02565b90925090506102876001600160a01b03891683896108c9565b7f28b3e4c963e8ed6cdcdd38aa916a725939823a99bbfa73fe91297cbd65076ebd828989846040516102bc9493929190611eaa565b60405180910390a1506001979650505050505050565b336102e56000546001600160a01b031690565b6001600160a01b03161461033b5760405162461bcd60e51b815260206004820181905260248201527f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e65726044820152606401610256565b6001805473ffffffffffffffffffffffffffffffffffffffff19166001600160a01b0383169081179091556040519081527f3f8223bcd8b3b875473e9f9e14e1ad075451a2b5ffd31591655da9a01516bf5e9060200160405180910390a150565b6001546000906001600160a01b031633146103f95760405162461bcd60e51b815260206004820152601960248201527f63616c6c6572206973206e6f74206d65737361676520627573000000000000006044820152606401610256565b979650505050505050565b6104196001600160a01b03881633308961095e565b600033848460405160200161043093929190611f0f565b604051602081830303815290604052905061046889898989600160149054906101000a900467ffffffffffffffff168a87893461099c565b5060018054600160a01b900467ffffffffffffffff1690601461048a83611f51565b91906101000a81548167ffffffffffffffff021916908367ffffffffffffffff16021790555050505050505050505050565b6001546000906001600160a01b031633146105195760405162461bcd60e51b815260206004820152601960248201527f63616c6c6572206973206e6f74206d65737361676520627573000000000000006044820152606401610256565b600080848060200190518101906105309190611f79565b90925090506105496001600160a01b03891683896108c9565b7f853d38177348cfc87290e96c941a5fb96dc3da8a07c31163ddffe4da6661b76f88888b89868660405161058296959493929190612006565b60405180910390a150600198975050505050505050565b6001546000906001600160a01b031633146105f65760405162461bcd60e51b815260206004820152601960248201527f63616c6c6572206973206e6f74206d65737361676520627573000000000000006044820152606401610256565b6000806106058587018761205c565b915091508167ffffffffffffffff16655af3107a400114156106695760405162461bcd60e51b815260206004820152600d60248201527f696e76616c6964206e6f6e6365000000000000000000000000000000000000006044820152606401610256565b8167ffffffffffffffff16655af3107a4002141561068657600080fd5b7f2bc20c63cdcc1b0e6aeb64fcaaf7ea3c8b999228a4a9ed2a2df1d2e17dd12520888884846040516102bc9493929190612078565b336106ce6000546001600160a01b031690565b6001600160a01b0316146107245760405162461bcd60e51b815260206004820181905260248201527f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e65726044820152606401610256565b6107386001600160a01b03831633836108c9565b5050565b6000600160149054906101000a900467ffffffffffffffff168383604051602001610769939291906120b4565b60408051808303601f1901815291905260018054919250600160a01b90910467ffffffffffffffff1690601461079e83611f51565b91906101000a81548167ffffffffffffffff021916908367ffffffffffffffff160217905550506107d1858583346109d3565b5050505050565b336107eb6000546001600160a01b031690565b6001600160a01b0316146108415760405162461bcd60e51b815260206004820181905260248201527f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e65726044820152606401610256565b6001600160a01b0381166108bd5760405162461bcd60e51b815260206004820152602660248201527f4f776e61626c653a206e6577206f776e657220697320746865207a65726f206160448201527f64647265737300000000000000000000000000000000000000000000000000006064820152608401610256565b6108c6816109ef565b50565b6040516001600160a01b03831660248201526044810182905261095990849063a9059cbb60e01b906064015b60408051601f198184030181529190526020810180517bffffffffffffffffffffffffffffffffffffffffffffffffffffffff167fffffffff0000000000000000000000000000000000000000000000000000000090931692909217909152610a4c565b505050565b6040516001600160a01b03808516602483015283166044820152606481018290526109969085906323b872dd60e01b906084016108f5565b50505050565b60006109c58a8a8a8a8a8a8a8a600160009054906101000a90046001600160a01b03168b610b31565b9a9950505050505050505050565b600154610996908590859085906001600160a01b031685610c57565b600080546001600160a01b0383811673ffffffffffffffffffffffffffffffffffffffff19831681178455604051919092169283917f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e09190a35050565b6000610aa1826040518060400160405280602081526020017f5361666545524332303a206c6f772d6c6576656c2063616c6c206661696c6564815250856001600160a01b0316610cc29092919063ffffffff16565b8051909150156109595780806020019051810190610abf91906120d8565b6109595760405162461bcd60e51b815260206004820152602a60248201527f5361666545524332303a204552433230206f7065726174696f6e20646964206e60448201527f6f742073756363656564000000000000000000000000000000000000000000006064820152608401610256565b60006001846006811115610b4757610b47611a0c565b1415610b6557610b5e8b8b8b8b8b8b8b8a8a610cdb565b90506109c5565b6002846006811115610b7957610b79611a0c565b1480610b9657506004846006811115610b9457610b94611a0c565b145b15610bac57610b5e848c8c8c8c8c8b8a8a610ef3565b6003846006811115610bc057610bc0611a0c565b1480610bdd57506005846006811115610bdb57610bdb611a0c565b145b80610bf957506006846006811115610bf757610bf7611a0c565b145b15610c0f57610b5e848c8c8c8c8c8b8a8a61122b565b60405162461bcd60e51b815260206004820152601960248201527f6272696467652074797065206e6f7420737570706f72746564000000000000006044820152606401610256565b604051634f9e72ad60e11b81526001600160a01b03831690639f3ce55a908390610c89908990899089906004016120fa565b6000604051808303818588803b158015610ca257600080fd5b505af1158015610cb6573d6000803e3d6000fd5b50505050505050505050565b6060610cd184846000856115d8565b90505b9392505050565b600080836001600160a01b03166382980dc46040518163ffffffff1660e01b815260040160206040518083038186803b158015610d1757600080fd5b505afa158015610d2b573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610d4f919061212c565b9050610d656001600160a01b038b16828b611715565b60405163a5977fbb60e01b81526001600160a01b038c811660048301528b81166024830152604482018b905267ffffffffffffffff808b1660648401528916608483015263ffffffff881660a483015282169063a5977fbb9060c401600060405180830381600087803b158015610ddb57600080fd5b505af1158015610def573d6000803e3d6000fd5b50506040516bffffffffffffffffffffffff1930606090811b821660208401528f811b821660348401528e901b166048820152605c81018c90526001600160c01b031960c08c811b8216607c8401528b811b8216608484015246901b16608c820152600092506094019050604051602081830303815290604052805190602001209050600086511115610ee457846001600160a01b0316634289fbb3858e8c86868c6040518763ffffffff1660e01b8152600401610eb1959493929190612149565b6000604051808303818588803b158015610eca57600080fd5b505af1158015610ede573d6000803e3d6000fd5b50505050505b9b9a5050505050505050505050565b60008060028b6006811115610f0a57610f0a611a0c565b1415610f8857836001600160a01b031663d8257d176040518163ffffffff1660e01b815260040160206040518083038186803b158015610f4957600080fd5b505afa158015610f5d573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610f81919061212c565b9050610ffc565b836001600160a01b031663c66a9c5a6040518163ffffffff1660e01b815260040160206040518083038186803b158015610fc157600080fd5b505afa158015610fd5573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610ff9919061212c565b90505b6110106001600160a01b038a16828a611715565b600060028c600681111561102657611026611a0c565b1415611149576040516308d18d8960e21b81526001600160a01b038b81166004830152602482018b905267ffffffffffffffff808b1660448401528d821660648401528916608483015283169063234636249060a401600060405180830381600087803b15801561109657600080fd5b505af11580156110aa573d6000803e3d6000fd5b50505050308a8a8a8e8b4660405160200161112c9796959493929190606097881b6bffffffffffffffffffffffff19908116825296881b87166014820152602881019590955260c093841b6001600160c01b031990811660488701529290961b909416605084015292811b831660648301529290921b16606c82015260740190565b6040516020818303038152906040528051906020012090506111ee565b6040516308d18d8960e21b81526001600160a01b038b81166004830152602482018b905267ffffffffffffffff808b1660448401528d821660648401528916608483015283169063234636249060a401602060405180830381600087803b1580156111b357600080fd5b505af11580156111c7573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906111eb919061218b565b90505b855115610ee457604051634289fbb360e01b81526001600160a01b03861690634289fbb3908690610eb1908f908d90889088908e90600401612149565b60008060038b600681111561124257611242611a0c565b14156112c057836001600160a01b031663dfa2dbaf6040518163ffffffff1660e01b815260040160206040518083038186803b15801561128157600080fd5b505afa158015611295573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906112b9919061212c565b9050611334565b836001600160a01b03166395b12c276040518163ffffffff1660e01b815260040160206040518083038186803b1580156112f957600080fd5b505afa15801561130d573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190611331919061212c565b90505b6113486001600160a01b038a16828a611715565b600060038c600681111561135e5761135e611a0c565b141561145b57604051636f3c863f60e11b81526001600160a01b038b81166004830152602482018b90528c8116604483015267ffffffffffffffff8916606483015283169063de790c7e90608401600060405180830381600087803b1580156113c657600080fd5b505af11580156113da573d6000803e3d6000fd5b50506040516bffffffffffffffffffffffff1930606090811b821660208401528e811b82166034840152604883018e90528f901b1660688201526001600160c01b031960c08b811b8216607c84015246901b166084820152608c01915061143e9050565b6040516020818303038152906040528051906020012090506115c3565b60058c600681111561146f5761146f611a0c565b141561151e5760405163a002930160e01b81526001600160a01b038b81166004830152602482018b905267ffffffffffffffff808b1660448401528d821660648401528916608483015283169063a00293019060a401602060405180830381600087803b1580156114df57600080fd5b505af11580156114f3573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190611517919061218b565b90506115c3565b604051639e422c3360e01b81526001600160a01b038b81166004830152602482018b905267ffffffffffffffff808b1660448401528d8216606484015289166084830152831690639e422c339060a401602060405180830381600087803b15801561158857600080fd5b505af115801561159c573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906115c0919061218b565b90505b6111ee6001600160a01b038b168360006117d6565b6060824710156116505760405162461bcd60e51b815260206004820152602660248201527f416464726573733a20696e73756666696369656e742062616c616e636520666f60448201527f722063616c6c00000000000000000000000000000000000000000000000000006064820152608401610256565b6001600160a01b0385163b6116a75760405162461bcd60e51b815260206004820152601d60248201527f416464726573733a2063616c6c20746f206e6f6e2d636f6e74726163740000006044820152606401610256565b600080866001600160a01b031685876040516116c391906121a4565b60006040518083038185875af1925050503d8060008114611700576040519150601f19603f3d011682016040523d82523d6000602084013e611705565b606091505b50915091506103f9828286611901565b604051636eb1769f60e11b81523060048201526001600160a01b038381166024830152600091839186169063dd62ed3e9060440160206040518083038186803b15801561176157600080fd5b505afa158015611775573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190611799919061218b565b6117a391906121c0565b6040516001600160a01b03851660248201526044810182905290915061099690859063095ea7b360e01b906064016108f5565b80158061185f5750604051636eb1769f60e11b81523060048201526001600160a01b03838116602483015284169063dd62ed3e9060440160206040518083038186803b15801561182557600080fd5b505afa158015611839573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061185d919061218b565b155b6118d15760405162461bcd60e51b815260206004820152603660248201527f5361666545524332303a20617070726f76652066726f6d206e6f6e2d7a65726f60448201527f20746f206e6f6e2d7a65726f20616c6c6f77616e6365000000000000000000006064820152608401610256565b6040516001600160a01b03831660248201526044810182905261095990849063095ea7b360e01b906064016108f5565b60608315611910575081610cd4565b8251156119205782518084602001fd5b8160405162461bcd60e51b815260040161025691906121d8565b6001600160a01b03811681146108c657600080fd5b60008083601f84011261196157600080fd5b50813567ffffffffffffffff81111561197957600080fd5b60208301915083602082850101111561199157600080fd5b9250929050565b6000806000806000608086880312156119b057600080fd5b85356119bb8161193a565b945060208601359350604086013567ffffffffffffffff8111156119de57600080fd5b6119ea8882890161194f565b90945092505060608601356119fe8161193a565b809150509295509295909350565b634e487b7160e01b600052602160045260246000fd5b6020810160038310611a4457634e487b7160e01b600052602160045260246000fd5b91905290565b600060208284031215611a5c57600080fd5b8135610cd48161193a565b803567ffffffffffffffff81168114611a7f57600080fd5b919050565b600080600080600080600060c0888a031215611a9f57600080fd5b8735611aaa8161193a565b96506020880135611aba8161193a565b955060408801359450611acf60608901611a67565b9350608088013567ffffffffffffffff811115611aeb57600080fd5b611af78a828b0161194f565b90945092505060a0880135611b0b8161193a565b8091505092959891949750929550565b60008060008060008060008060e0898b031215611b3757600080fd5b8835611b428161193a565b97506020890135611b528161193a565b965060408901359550611b6760608a01611a67565b9450608089013563ffffffff81168114611b8057600080fd5b935060a089013567ffffffffffffffff811115611b9c57600080fd5b611ba88b828c0161194f565b90945092505060c089013560078110611bc057600080fd5b809150509295985092959890939650565b634e487b7160e01b600052604160045260246000fd5b604051601f8201601f1916810167ffffffffffffffff81118282101715611c1057611c10611bd1565b604052919050565b600067ffffffffffffffff821115611c3257611c32611bd1565b50601f01601f191660200190565b600082601f830112611c5157600080fd5b8135611c64611c5f82611c18565b611be7565b818152846020838601011115611c7957600080fd5b816020850160208301376000918101602001919091529392505050565b60008060008060008060c08789031215611caf57600080fd5b8635611cba8161193a565b95506020870135611cca8161193a565b945060408701359350611cdf60608801611a67565b9250608087013567ffffffffffffffff811115611cfb57600080fd5b611d0789828a01611c40565b92505060a0870135611d188161193a565b809150509295509295509295565b600080600080600060808688031215611d3e57600080fd5b8535611d498161193a565b9450611d5760208701611a67565b9350604086013567ffffffffffffffff8111156119de57600080fd5b60008060408385031215611d8657600080fd5b8235611d918161193a565b946020939093013593505050565b60008060008060608587031215611db557600080fd5b8435611dc08161193a565b9350611dce60208601611a67565b9250604085013567ffffffffffffffff811115611dea57600080fd5b611df68782880161194f565b95989497509550505050565b60008060408385031215611e1557600080fd5b8235611e208161193a565b9150602083013567ffffffffffffffff811115611e3c57600080fd5b611e4885828601611c40565b9150509250929050565b60005b83811015611e6d578181015183820152602001611e55565b838111156109965750506000910152565b60008151808452611e96816020860160208601611e52565b601f01601f19169290920160200192915050565b60006001600160a01b03808716835280861660208401525083604083015260806060830152611edc6080830184611e7e565b9695505050505050565b81835281816020850137506000828201602090810191909152601f909101601f19169091010190565b6001600160a01b0384168152604060208201526000611f32604083018486611ee6565b95945050505050565b634e487b7160e01b600052601160045260246000fd5b600067ffffffffffffffff80831681811415611f6f57611f6f611f3b565b6001019392505050565b60008060408385031215611f8c57600080fd5b8251611f978161193a565b602084015190925067ffffffffffffffff811115611fb457600080fd5b8301601f81018513611fc557600080fd5b8051611fd3611c5f82611c18565b818152866020838501011115611fe857600080fd5b611ff9826020830160208601611e52565b8093505050509250929050565b60006001600160a01b038089168352876020840152808716604084015267ffffffffffffffff8616606084015280851660808401525060c060a083015261205060c0830184611e7e565b98975050505050505050565b6000806040838503121561206f57600080fd5b611e2083611a67565b6001600160a01b0385168152600067ffffffffffffffff808616602084015280851660408401525060806060830152611edc6080830184611e7e565b67ffffffffffffffff84168152604060208201526000611f32604083018486611ee6565b6000602082840312156120ea57600080fd5b81518015158114610cd457600080fd5b6001600160a01b038416815267ffffffffffffffff83166020820152606060408201526000611f326060830184611e7e565b60006020828403121561213e57600080fd5b8151610cd48161193a565b60006001600160a01b03808816835267ffffffffffffffff8716602084015280861660408401525083606083015260a060808301526103f960a0830184611e7e565b60006020828403121561219d57600080fd5b5051919050565b600082516121b6818460208701611e52565b9190910192915050565b600082198211156121d3576121d3611f3b565b500190565b602081526000610cd46020830184611e7e56fea2646970667358221220e4f0b12843f5fa7332a24ad509d5773e1fe0c20763758b669b56febfcb183c3a64736f6c63430008090033";

type MsgTestConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: MsgTestConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class MsgTest__factory extends ContractFactory {
  constructor(...args: MsgTestConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
    this.contractName = "MsgTest";
  }

  deploy(
    _messageBus: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<MsgTest> {
    return super.deploy(_messageBus, overrides || {}) as Promise<MsgTest>;
  }
  getDeployTransaction(
    _messageBus: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(_messageBus, overrides || {});
  }
  attach(address: string): MsgTest {
    return super.attach(address) as MsgTest;
  }
  connect(signer: Signer): MsgTest__factory {
    return super.connect(signer) as MsgTest__factory;
  }
  static readonly contractName: "MsgTest";
  public readonly contractName: "MsgTest";
  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): MsgTestInterface {
    return new utils.Interface(_abi) as MsgTestInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): MsgTest {
    return new Contract(address, _abi, signerOrProvider) as MsgTest;
  }
}
