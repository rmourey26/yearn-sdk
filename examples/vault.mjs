import { JsonRpcProvider } from "@ethersproject/providers";
import Table from "cli-table3";

import { Yearn } from "../dist/index.js";
import { Addresses, YearnGovernance } from "./common.mjs";

const url = process.env.WEB3_PROVIDER || "http://localhost:8545";
const provider = new JsonRpcProvider(url);

const yearn = new Yearn(1, {
  provider,
  addresses: Addresses,
  cache: { useCache: false },
});

async function main() {
  const result = await yearn.strategies.getHarvests("0x342491C093A640c7c2347c4FFA7D8b9cBC84D1EB", 14342009);
  console.log(result);
  // const vaults = await yearn.vaults.get();

  // const vaultsTable = new Table();
  // vaultsTable.push(...vaults.map(vault => [vault.metadata.displayName, vault.address, vault.typeId]));

  // console.log("V1 & V2 vaults:");
  // console.log(vaultsTable.toString());

  // const positions = await yearn.vaults.positionsOf(YearnGovernance);

  // const positionsTable = new Table();
  // positionsTable.push(
  //   ...positions.map(position => {
  //     const vault = vaults.find(vault => vault.address === position.assetAddress);
  //     return [vault.name, position.balance];
  //   })
  // );

  // console.log("Yearn Multisig vault positions:");
  // console.log(positionsTable.toString());
}

main();
