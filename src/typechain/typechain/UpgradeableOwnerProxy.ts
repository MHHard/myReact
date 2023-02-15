/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import {
  BaseContract,
  BigNumber,
  BytesLike,
  CallOverrides,
  ContractTransaction,
  Overrides,
  PopulatedTransaction,
  Signer,
  utils,
} from "ethers";
import { FunctionFragment, Result, EventFragment } from "@ethersproject/abi";
import { Listener, Provider } from "@ethersproject/providers";
import { TypedEventFilter, TypedEvent, TypedListener, OnEvent } from "./common";

export interface UpgradeableOwnerProxyInterface extends utils.Interface {
  contractName: "UpgradeableOwnerProxy";
  functions: {
    "gov()": FunctionFragment;
    "initGov(address)": FunctionFragment;
    "proposeChangeProxyAdmin(address,address,address)": FunctionFragment;
    "proposeUpgrade(address,address,address)": FunctionFragment;
    "proposeUpgradeAndCall(address,address,address,bytes)": FunctionFragment;
    "proposeUpgradeTo(address,address)": FunctionFragment;
    "proposeUpgradeToAndCall(address,address,bytes)": FunctionFragment;
  };

  encodeFunctionData(functionFragment: "gov", values?: undefined): string;
  encodeFunctionData(functionFragment: "initGov", values: [string]): string;
  encodeFunctionData(
    functionFragment: "proposeChangeProxyAdmin",
    values: [string, string, string]
  ): string;
  encodeFunctionData(
    functionFragment: "proposeUpgrade",
    values: [string, string, string]
  ): string;
  encodeFunctionData(
    functionFragment: "proposeUpgradeAndCall",
    values: [string, string, string, BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "proposeUpgradeTo",
    values: [string, string]
  ): string;
  encodeFunctionData(
    functionFragment: "proposeUpgradeToAndCall",
    values: [string, string, BytesLike]
  ): string;

  decodeFunctionResult(functionFragment: "gov", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "initGov", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "proposeChangeProxyAdmin",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "proposeUpgrade",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "proposeUpgradeAndCall",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "proposeUpgradeTo",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "proposeUpgradeToAndCall",
    data: BytesLike
  ): Result;

  events: {
    "ChangeProxyAdminProposalCreated(uint256,address,address,address)": EventFragment;
    "UpgradeAndCallProposalCreated(uint256,address,address,address,bytes)": EventFragment;
    "UpgradeProposalCreated(uint256,address,address,address)": EventFragment;
    "UpgradeToAndCallProposalCreated(uint256,address,address,bytes)": EventFragment;
    "UpgradeToProposalCreated(uint256,address,address)": EventFragment;
  };

  getEvent(
    nameOrSignatureOrTopic: "ChangeProxyAdminProposalCreated"
  ): EventFragment;
  getEvent(
    nameOrSignatureOrTopic: "UpgradeAndCallProposalCreated"
  ): EventFragment;
  getEvent(nameOrSignatureOrTopic: "UpgradeProposalCreated"): EventFragment;
  getEvent(
    nameOrSignatureOrTopic: "UpgradeToAndCallProposalCreated"
  ): EventFragment;
  getEvent(nameOrSignatureOrTopic: "UpgradeToProposalCreated"): EventFragment;
}

export type ChangeProxyAdminProposalCreatedEvent = TypedEvent<
  [BigNumber, string, string, string],
  { proposalId: BigNumber; target: string; proxy: string; newAdmin: string }
>;

export type ChangeProxyAdminProposalCreatedEventFilter =
  TypedEventFilter<ChangeProxyAdminProposalCreatedEvent>;

export type UpgradeAndCallProposalCreatedEvent = TypedEvent<
  [BigNumber, string, string, string, string],
  {
    proposalId: BigNumber;
    target: string;
    proxy: string;
    implementation: string;
    data: string;
  }
>;

export type UpgradeAndCallProposalCreatedEventFilter =
  TypedEventFilter<UpgradeAndCallProposalCreatedEvent>;

export type UpgradeProposalCreatedEvent = TypedEvent<
  [BigNumber, string, string, string],
  {
    proposalId: BigNumber;
    target: string;
    proxy: string;
    implementation: string;
  }
>;

export type UpgradeProposalCreatedEventFilter =
  TypedEventFilter<UpgradeProposalCreatedEvent>;

export type UpgradeToAndCallProposalCreatedEvent = TypedEvent<
  [BigNumber, string, string, string],
  {
    proposalId: BigNumber;
    target: string;
    implementation: string;
    data: string;
  }
>;

export type UpgradeToAndCallProposalCreatedEventFilter =
  TypedEventFilter<UpgradeToAndCallProposalCreatedEvent>;

export type UpgradeToProposalCreatedEvent = TypedEvent<
  [BigNumber, string, string],
  { proposalId: BigNumber; target: string; implementation: string }
>;

export type UpgradeToProposalCreatedEventFilter =
  TypedEventFilter<UpgradeToProposalCreatedEvent>;

export interface UpgradeableOwnerProxy extends BaseContract {
  contractName: "UpgradeableOwnerProxy";
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: UpgradeableOwnerProxyInterface;

  queryFilter<TEvent extends TypedEvent>(
    event: TypedEventFilter<TEvent>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TEvent>>;

  listeners<TEvent extends TypedEvent>(
    eventFilter?: TypedEventFilter<TEvent>
  ): Array<TypedListener<TEvent>>;
  listeners(eventName?: string): Array<Listener>;
  removeAllListeners<TEvent extends TypedEvent>(
    eventFilter: TypedEventFilter<TEvent>
  ): this;
  removeAllListeners(eventName?: string): this;
  off: OnEvent<this>;
  on: OnEvent<this>;
  once: OnEvent<this>;
  removeListener: OnEvent<this>;

  functions: {
    gov(overrides?: CallOverrides): Promise<[string]>;

    initGov(
      _gov: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    proposeChangeProxyAdmin(
      _target: string,
      _proxy: string,
      _newAdmin: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    proposeUpgrade(
      _target: string,
      _proxy: string,
      _implementation: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    proposeUpgradeAndCall(
      _target: string,
      _proxy: string,
      _implementation: string,
      _data: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    proposeUpgradeTo(
      _target: string,
      _implementation: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    proposeUpgradeToAndCall(
      _target: string,
      _implementation: string,
      _data: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;
  };

  gov(overrides?: CallOverrides): Promise<string>;

  initGov(
    _gov: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  proposeChangeProxyAdmin(
    _target: string,
    _proxy: string,
    _newAdmin: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  proposeUpgrade(
    _target: string,
    _proxy: string,
    _implementation: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  proposeUpgradeAndCall(
    _target: string,
    _proxy: string,
    _implementation: string,
    _data: BytesLike,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  proposeUpgradeTo(
    _target: string,
    _implementation: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  proposeUpgradeToAndCall(
    _target: string,
    _implementation: string,
    _data: BytesLike,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  callStatic: {
    gov(overrides?: CallOverrides): Promise<string>;

    initGov(_gov: string, overrides?: CallOverrides): Promise<void>;

    proposeChangeProxyAdmin(
      _target: string,
      _proxy: string,
      _newAdmin: string,
      overrides?: CallOverrides
    ): Promise<void>;

    proposeUpgrade(
      _target: string,
      _proxy: string,
      _implementation: string,
      overrides?: CallOverrides
    ): Promise<void>;

    proposeUpgradeAndCall(
      _target: string,
      _proxy: string,
      _implementation: string,
      _data: BytesLike,
      overrides?: CallOverrides
    ): Promise<void>;

    proposeUpgradeTo(
      _target: string,
      _implementation: string,
      overrides?: CallOverrides
    ): Promise<void>;

    proposeUpgradeToAndCall(
      _target: string,
      _implementation: string,
      _data: BytesLike,
      overrides?: CallOverrides
    ): Promise<void>;
  };

  filters: {
    "ChangeProxyAdminProposalCreated(uint256,address,address,address)"(
      proposalId?: null,
      target?: null,
      proxy?: null,
      newAdmin?: null
    ): ChangeProxyAdminProposalCreatedEventFilter;
    ChangeProxyAdminProposalCreated(
      proposalId?: null,
      target?: null,
      proxy?: null,
      newAdmin?: null
    ): ChangeProxyAdminProposalCreatedEventFilter;

    "UpgradeAndCallProposalCreated(uint256,address,address,address,bytes)"(
      proposalId?: null,
      target?: null,
      proxy?: null,
      implementation?: null,
      data?: null
    ): UpgradeAndCallProposalCreatedEventFilter;
    UpgradeAndCallProposalCreated(
      proposalId?: null,
      target?: null,
      proxy?: null,
      implementation?: null,
      data?: null
    ): UpgradeAndCallProposalCreatedEventFilter;

    "UpgradeProposalCreated(uint256,address,address,address)"(
      proposalId?: null,
      target?: null,
      proxy?: null,
      implementation?: null
    ): UpgradeProposalCreatedEventFilter;
    UpgradeProposalCreated(
      proposalId?: null,
      target?: null,
      proxy?: null,
      implementation?: null
    ): UpgradeProposalCreatedEventFilter;

    "UpgradeToAndCallProposalCreated(uint256,address,address,bytes)"(
      proposalId?: null,
      target?: null,
      implementation?: null,
      data?: null
    ): UpgradeToAndCallProposalCreatedEventFilter;
    UpgradeToAndCallProposalCreated(
      proposalId?: null,
      target?: null,
      implementation?: null,
      data?: null
    ): UpgradeToAndCallProposalCreatedEventFilter;

    "UpgradeToProposalCreated(uint256,address,address)"(
      proposalId?: null,
      target?: null,
      implementation?: null
    ): UpgradeToProposalCreatedEventFilter;
    UpgradeToProposalCreated(
      proposalId?: null,
      target?: null,
      implementation?: null
    ): UpgradeToProposalCreatedEventFilter;
  };

  estimateGas: {
    gov(overrides?: CallOverrides): Promise<BigNumber>;

    initGov(
      _gov: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    proposeChangeProxyAdmin(
      _target: string,
      _proxy: string,
      _newAdmin: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    proposeUpgrade(
      _target: string,
      _proxy: string,
      _implementation: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    proposeUpgradeAndCall(
      _target: string,
      _proxy: string,
      _implementation: string,
      _data: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    proposeUpgradeTo(
      _target: string,
      _implementation: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    proposeUpgradeToAndCall(
      _target: string,
      _implementation: string,
      _data: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    gov(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    initGov(
      _gov: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    proposeChangeProxyAdmin(
      _target: string,
      _proxy: string,
      _newAdmin: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    proposeUpgrade(
      _target: string,
      _proxy: string,
      _implementation: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    proposeUpgradeAndCall(
      _target: string,
      _proxy: string,
      _implementation: string,
      _data: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    proposeUpgradeTo(
      _target: string,
      _implementation: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    proposeUpgradeToAndCall(
      _target: string,
      _implementation: string,
      _data: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;
  };
}
