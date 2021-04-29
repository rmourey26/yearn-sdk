import { Address, Integer, Usdc } from "../common";
import { Metadata, TypeId } from "./metadata";

export interface Position {
  assetId: Address;
  tokenId: Address;
  typeId: string;
  balance: Integer;
  underlyingTokenBalance: TokenAmount;
  assetAllowances: Allowance[];
  tokenAllowances: Allowance[];
}

export interface Allowance {
  owner: Address;
  spender: Address;
  amount: Integer;
}

export interface ERC20 {
  address: Address;
  name: string;
  symbol: string;
  decimals: Integer;
}

export interface TokenAmount {
  amount: Integer;
  amountUsdc: Usdc;
}

export interface Token extends ERC20 {
  icon?: string;
  price: Integer;
  supported: {
    zapper?: boolean;
  };
}

export type Icon = string | undefined;
export type IconMap<T extends Address> = { [K in T]: Icon };

/// Assets

export interface AssetStatic<T extends TypeId> {
  address: Address;
  typeId: T;
  name: string;
  version: string;
  token: ERC20;
}

export interface AssetDynamic<T extends TypeId> {
  address: Address;
  typeId: T;
  tokenId: Address;
  underlyingTokenBalance: TokenAmount;
  metadata: Metadata[T];
}

export type Asset<T extends TypeId> = AssetStatic<T> &
  AssetDynamic<T> & { typeId: T };

export type GenericAsset = Asset<"VAULT_V1"> | Asset<"VAULT_V2">;
