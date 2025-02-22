import { FANTOM_TOKEN } from "../../helpers";
import { createMockTokenMarketData, createMockVaultMetadata } from "../../test-utils/factories";
import { mergeZapPropsWithAddressables } from "./mergeZapPropsWithAddressables";

describe("mergeZapPropsWithAddressables", () => {
  it("should set the zapper properties on an addressable", async () => {
    const vaultMetadataMock = {
      zappable: createMockVaultMetadata({
        displayName: "Zappable",
        address: "0x16de59092dae5ccf4a1e6439d611fd0653f0bd01", // not checksummed
      }),
      notZappable: createMockVaultMetadata({
        displayName: "Not Zappable",
        address: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
      }),
    };

    const vaultTokenMarketDataMock = {
      zappable: createMockTokenMarketData({
        label: "Zappable",
        address: "0x16de59092dAE5CcF4A1E6439D611fd0653f0Bd01", // checksummed
      }),
      notInVaults: createMockTokenMarketData({
        label: "Not in Vaults",
        address: "0xd6aD7a6750A7593E092a9B218d66C0A814a3436e",
      }),
      random: createMockTokenMarketData({ label: "Random", address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48" }),
    };

    const actual = mergeZapPropsWithAddressables({
      addressables: [vaultMetadataMock.zappable, vaultMetadataMock.notZappable],
      supportedVaultAddresses: [
        vaultTokenMarketDataMock.zappable.address,
        vaultTokenMarketDataMock.notInVaults.address,
        vaultTokenMarketDataMock.random.address,
      ],
      zapInType: "zapperZapIn",
      zapOutType: "zapperZapOut",
    });

    expect(actual.length).toEqual(2);
    expect(actual).toEqual(
      expect.arrayContaining([
        {
          ...vaultMetadataMock.zappable,
          allowZapIn: true,
          allowZapOut: true,
          zapInWith: "zapperZapIn",
          zapOutWith: "zapperZapOut",
        },
        {
          ...vaultMetadataMock.notZappable,
          allowZapIn: false,
          allowZapOut: false,
          zapInWith: undefined,
          zapOutWith: undefined,
        },
      ])
    );
  });

  it("should set the ftmApeZap properties on an addressable", async () => {
    const vaultMetadataMock = {
      ftm: createMockVaultMetadata({
        displayName: "Zappable",
        address: FANTOM_TOKEN.address,
      }),
      notZappable: createMockVaultMetadata({
        displayName: "Not Zappable",
        address: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
      }),
    };

    const actual = mergeZapPropsWithAddressables({
      addressables: [vaultMetadataMock.ftm, vaultMetadataMock.notZappable],
      supportedVaultAddresses: [FANTOM_TOKEN.address],
      zapInType: "ftmApeZap",
      zapOutType: "ftmApeZap",
    });

    expect(actual.length).toEqual(2);
    expect(actual).toEqual(
      expect.arrayContaining([
        {
          ...vaultMetadataMock.ftm,
          allowZapIn: true,
          allowZapOut: true,
          zapInWith: "ftmApeZap",
          zapOutWith: "ftmApeZap",
        },
        {
          ...vaultMetadataMock.notZappable,
          allowZapIn: false,
          allowZapOut: false,
          zapInWith: undefined,
          zapOutWith: undefined,
        },
      ])
    );
  });
});
