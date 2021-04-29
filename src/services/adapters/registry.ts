import { ChainId } from "../../chain";
import { Address, ContractService } from "../../common";
import { Context } from "../../context";
import { structArray } from "../../struct";

import {
  Position,
  VaultStatic,
  VaultDynamic,
  VaultV2Static,
  VaultV2Dynamic,
  ERC20
} from "../../types";

export interface IRegistryAdapter {
  assetsStatic(): Promise<VaultStatic[]>;
  assetsDynamic(): Promise<VaultDynamic[]>;
  positionsOf(address: Address, addresses?: Address[]): Promise<Position[]>;
  tokens(): Promise<ERC20[]>;
}

export const RegistryV2AdapterAbi = [
  "function assetsStatic() public view returns (" +
    "tuple(address address, string typeId, string name, string version," +
    "tuple(address address, string name, string symbol, uint256 decimals) token" +
    ")[] memory)",
  "function assetsStatic(address[] memory) public view returns (" +
    "tuple(address address, string typeId, string name, string version," +
    "tuple(address address, string name, string symbol, uint256 decimals) token" +
    ")[] memory)",
  "function assetsDynamic() public view returns (" +
    "tuple(address address, string typeId, address tokenId," +
    "tuple(uint256 amount, uint256 amountUsdc) underlyingTokenBalance," +
    "tuple(string symbol, uint256 pricePerShare, bool migrationAvailable, address latestVaultAddress, uint256 depositLimit, bool emergencyShutdown) metadata" +
    ")[] memory)",
  "function assetsDynamic(address[] memory) public view returns (" +
    "tuple(address address, string typeId, address tokenId," +
    "tuple(uint256 amount, uint256 amountUsdc) underlyingTokenBalance," +
    "tuple(string symbol, uint256 pricePerShare, bool migrationAvailable, address latestVaultAddress, uint256 depositLimit, bool emergencyShutdown) metadata" +
    ")[] memory)",
  "function assetsPositionsOf(address) public view returns (" +
    "tuple(address assetId, address tokenId, string typeId, uint256 balance," +
    "tuple(uint256 amount, uint256 amountUsdc) underlyingTokenBalance," +
    "tuple(address owner, address spender, uint256 amount)[] tokenAllowances," +
    "tuple(address owner, address spender, uint256 amount)[] assetAllowances" +
    ")[] memory)",
  "function assetsPositionsOf(address, address[] memory) public view returns (" +
    "tuple(address assetId, address tokenId, string typeId, uint256 balance," +
    "tuple(uint256 amount, uint256 amountUsdc) underlyingTokenBalance," +
    "tuple(address owner, address spender, uint256 amount)[] tokenAllowances," +
    "tuple(address owner, address spender, uint256 amount)[] assetAllowances" +
    ")[] memory)",
  "function tokens() public view returns (" +
    "tuple(address address, string name, string symbol, uint256 decimals)" +
    "[] memory)"
];

export class RegistryV2Adapter<T extends ChainId> extends ContractService
  implements IRegistryAdapter {
  static abi = RegistryV2AdapterAbi;

  constructor(chainId: T, ctx: Context) {
    super(
      ctx.address("registryV2Adapter") ??
        RegistryV2Adapter.addressByChain(chainId),
      chainId,
      ctx
    );
  }

  static addressByChain(chainId: ChainId): string {
    switch (chainId) {
      case 1:
        return "0xE75E51566C5761896528B4698a88C92A54B3C954";
      case 250:
        return "0xE75E51566C5761896528B4698a88C92A54B3C954";
    }
    throw new TypeError(
      `RegistryV2Adapter does not have an address for chainId ${chainId}`
    );
  }

  async assetsStatic(addresses?: Address[]): Promise<VaultV2Static[]> {
    if (addresses) {
      return await this.contract["assetsStatic(address[])"](addresses).then(
        structArray
      );
    }
    return await this.contract["assetsStatic()"]().then(structArray);
  }

  async assetsDynamic(addresses?: Address[]): Promise<VaultV2Dynamic[]> {
    if (addresses) {
      return await this.contract["assetsDynamic(address[])"](addresses).then(
        structArray
      );
    }
    return await this.contract["assetsDynamic()"]().then(structArray);
  }

  async positionsOf(
    address: Address,
    addresses?: Address[]
  ): Promise<Position[]> {
    if (addresses) {
      return await this.contract["assetsPositionsOf(address,address[])"](
        address,
        addresses
      ).then(structArray);
    }
    return await this.contract["assetsPositionsOf(address)"](address).then(
      structArray
    );
  }

  async tokens(): Promise<ERC20[]> {
    return await this.contract.tokens().then(structArray);
  }
}
