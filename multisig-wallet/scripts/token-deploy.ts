import { ethers, network } from "hardhat";
import { deployed, findDeployment } from "../lib/deployment-utils";

async function main() {
  const foundToken = findDeployment("Token", network.name);

  if (!!foundToken) {
    console.log(
      "Token already deployed",
      foundToken.network,
      foundToken.address
    );
    return;
  }

  const Token = await ethers.getContractFactory("Token");
  const token = await Token.deploy();

  await token.deployed();
  console.log("Token deployed to:", token.address);
  deployed({
    name: "Token",
    address: token.address,
    network: network.name,
  });
}
// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
