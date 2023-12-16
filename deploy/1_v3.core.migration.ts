import { Deployer, Reporter } from '@solarity/hardhat-migrate'

import { UniswapV3Factory__factory } from '../typechain'

const ONE_BP_FEE = 100
const ONE_BP_TICK_SPACING = 1

export = async (deployer: Deployer) => {
  const factory = await deployer.deploy(UniswapV3Factory__factory)

  await factory.enableFeeAmount(ONE_BP_FEE, ONE_BP_TICK_SPACING)
  console.info(`UniswapV3Factory added a new fee tier ${ONE_BP_FEE / 100} bps with tick spacing ${ONE_BP_TICK_SPACING}`)

  if (process.env.FACTORY_OWNER) {
    await factory.setOwner(process.env.FACTORY_OWNER)
  }

  Reporter.reportContracts(['UniswapV3Factory', factory.address])
}
