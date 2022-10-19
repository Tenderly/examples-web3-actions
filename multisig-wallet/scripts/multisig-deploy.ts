import { ethers, network } from "hardhat";
import { deployed, findDeployment } from "../lib/deployment-utils";

async function main() {
  const foundMultiSig = findDeployment("MultiSigWallet", network.name);
  if (!!foundMultiSig) {
    console.log("Multisig wallet already deployed", foundMultiSig);
    return;
  }

  const owners = (await ethers.provider.listAccounts()).slice(0, 3);
  // deploy the contract MultiSigWallet
  const MultiSigWallet = await ethers.getContractFactory("MultiSigWallet");
  const multiSigWallet = await MultiSigWallet.deploy(owners, 1);
  await multiSigWallet.deployed();
  deployed({
    name: "MultiSigWallet",
    address: multiSigWallet.address,
    network: network.name,
  });
  console.log("MultiSigWallet deployed to:", multiSigWallet.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
