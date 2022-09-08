import { BigNumber, BytesLike } from "ethers";
import { ethers, network } from "hardhat";
import { findDeployment } from "../lib/deployment-utils";

async function main() {
  const deployedMultiSig = findDeployment("MultiSigWallet", network.name);
  const deployedToken = findDeployment("Token", network.name);
  if (!deployedMultiSig) {
    console.log("Multi Sig not deployed, can't play, run multisig-deploy.ts");
    return;
  }
  console.log({ deployedMultiSig, deployedToken });
  const multisigWallet = await ethers.getContractAt(
    "MultiSigWallet",
    deployedMultiSig.address,
    ethers.provider.getSigner("0xf7ddedc66b1d482e5c38e4730b3357d32411e5dd")
  );

  console.log("Default signer", await ethers.provider.getSigner().getAddress());

  const token = await ethers.getContractAt("Token", deployedToken.address);
  const VALUE = ethers.utils.hexValue(ethers.utils.parseEther("0.1"));
  const tx = await token.populateTransaction.stake({
    value: VALUE,
  });

  console.log("Internal TX", tx);

  const msig = await multisigWallet.submitTransaction(
    token.address,
    (tx.value as BigNumber).toHexString(),
    tx.data as BytesLike
  );

  const reciept = await msig.wait();

  const subm = reciept.events?.filter((e) => e.event == "TxSubmission");

  // @ts-ignore
  const latestTxIdx = (subm[0].args[1] as BigNumber).toNumber();

  console.log(
    `Submitted (IDX: ${latestTxIdx}, TX: ${reciept.transactionHash})`
  );

  // Get signers
  const [first, second, third] = [
    "0xF7dDedc66B1d482e5C38E4730B3357d32411e5Dd",
    "0x3a55A1e7cf75dD8374de8463530dF721816F1411",
    "0xeDed260BFDCDf6Dc0f564b3e4AB5CeA805bBA10B",
  ].map((addr) => ethers.provider.getSigner(addr));

  // Confirm 1
  const conf1tx = await multisigWallet
    .connect(second)
    .confirmTransaction(latestTxIdx);
  await conf1tx.wait();
  console.log("Confirmation 1");

  // Confirm 2
  const conf2tx = await multisigWallet
    .connect(third)
    .confirmTransaction(latestTxIdx);
  await conf2tx.wait();
  console.log("Confirmation 2");

  // Fund the wallet before executing the TX
  const fundingWalletTx = await second.sendTransaction({
    to: multisigWallet.address,
    value: VALUE,
  });
  await fundingWalletTx.wait();

  // Execute the TX
  const execTx = await multisigWallet
    .connect(first)
    .executeTransaction(latestTxIdx, { gasLimit: 100000 });
  await execTx.wait();

  console.log(`Executed (IDX: ${latestTxIdx}, TX: ${reciept.transactionHash})`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
