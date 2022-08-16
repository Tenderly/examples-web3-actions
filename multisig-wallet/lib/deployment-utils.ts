import { Contract } from "ethers";
import { readFileSync, writeFileSync } from "fs";

export type DeploymentRecord = {
  name: string;
  address: string;
  network: string;
  timestamp?: Date;
};

function readDeployments() {
  type Deployments = Record<string, DeploymentRecord[]>;
  const deployments = JSON.parse(
    readFileSync("deployments.json", "utf8").toString()
  ) as unknown as Deployments;
  return deployments;
}

export function deployed(deployment: DeploymentRecord, tag: string = "latest") {
  if (findDeployment(deployed.name, deployment.network, tag)) {
    return;
  }
  const deployments = readDeployments();
  deployment.timestamp = new Date();
  deployments[tag] = [...deployments[tag], deployment];
  writeFileSync("deployments.json", JSON.stringify(deployments, null, 2));
}

export function findDeployment(name: string, network: string, tag = "latest") {
  return readDeployments()[tag].filter(
    (d) => d.name === name && d.network == network
  )[0];
}
