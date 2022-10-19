import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import { ethers } from "hardhat";

import { MultiSigWallet } from "../typechain-types";
const multisigAddress = "0xb071fef2e0f6fbe5ea3267205655d038af22b903";

const attach = async () => {
  const multisigWallet = await ethers.getContractAt(
    "MultiSigWallet",
    multisigAddress
  );

  return multisigWallet;
};

describe("multisig scenario", async () => {
  let multisigWallet: MultiSigWallet;

  before(async () => {
    multisigWallet = await loadFixture(attach);
  });

  it("", async () => {
    console.log("Test");
    expect(await multisigWallet.getOwners()).to.length(3, "!3 owners");
  });
});
