# Uniswap V3 Deployment Guide

There is a handful of steps to do in order to deploy the Uni V3 fork on a new Autonity chain:

## 1. Deploy the smart contracts

The first step is to deploy the smart contracts from the five repositories in the organization:

- [v3-core](https://github.com/platypus-project/v3-core).
- [v3-periphery](https://github.com/platypus-project/v3-periphery).
- [universal-router](https://github.com/platypus-project/universal-router).
- [swap-router-contracts](https://github.com/platypus-project/swap-router-contracts).
- [v3-staker](https://github.com/platypus-project/v3-staker).

The deployment order is essential. Some repositories require the existing deployment of others.

In order to deploy the smart cotnracts:

1. Clone the repo.
2. Run `npm install` (recommend using `node 18`).
3. Run `npx hardhat compile` to compile the contracts.
4. Update the `hardhat.config.ts` file with the newest RPC endpoint and chainid.
5. Configure `.env` file referencing the `.env.example`.
6. Deploy the contracts with `npx hardhat migrate --network piccadilly --verify` command.

Don't forget to fund the deployer wallet beforehand.

## 2. Deploy the Graph node

In order to deploy the Uni subgraph, we first need to setup the Graph node.

The Graph node is available as a Docker image and can be setup [just like that](https://github.com/platypus-project/developer-edition/blob/main/docker-compose.yml#L3).

You will need to provide the `POSTGRES_USER` and `POSTGRES_PASSWORD` variables.

Also it may be necessary to update the RPC `ethereum` endpoint.

After the node is up, we are particularly interested in three ports:

- `8000` that serves the graphql server for subgraphs queries.
- `8020` that is needed to create and upload subgraphs.
- `5001` that serves the IPFS instance.

The graph node is quite resource hungry, check the VPS requirements [here](https://thegraph.com/docs/en/network/indexing/#what-are-the-hardware-requirements).

## 3. Deploy subgraph to the node


Here are the steps to deploy the Uni subgraph:

1. Clone the [repo](https://github.com/platypus-project/v3-subgraph).
2. Run `npm install`.
3. Update the [yaml config](https://github.com/platypus-project/v3-subgraph/blob/main/subgraph.yaml) file with the required addresses from the smart contracts deployment step.
4. Run `npm run compile` to compile the schema and build the assemblyscript.
5. Update the `$GRAPH_NODE_ENDPOINT` (8020 port), `$IPFS_ENDPOINT` (5001 port), and `$GRAPH_VERSION` (can be arbitrary) env variables.
6. Execute `npm run create` and `npm run deploy` to upload the subgraph to the graph node.

The subgraph should be queryable at the `http://<graph_node_ip>:8000/subgraphs/name/uniswapv3` endpoint.

## 4. Deploy the front end

The front end repo can be found [here](https://github.com/platypus-project/web-client).

To build the repo, first you need to update its configs:

1. Update smart contracts addresses [here](https://github.com/platypus-project/web-client/blob/main/src/constants/addresses.ts).
2. Update the picadilly chainid [here](https://github.com/platypus-project/web-client/blob/main/src/constants/chains.ts).
3. Update the picadilly RPC URL [here](https://github.com/platypus-project/web-client/blob/main/src/constants/networks.ts).
4. Update the WETH address [here](https://github.com/platypus-project/web-client/blob/main/src/constants/tokens.ts#L110).

You may also need to update the token list [here](https://github.com/platypus-project/token-list). This is used to show the default tokens of the Uni front end.

Afterwards, update the `.env` and `.env.production` files with the required subgraphs endpoints.

Then build the repo with Docker.

## Disclaimer

GLHW!
