import { Contract } from './Contract'
import { ComputeInputs } from '../../types'
import { Outputs } from '../Outputs'

import { buildCreateInstruction, buildMintInstructions } from '../../helpers'

/**
 * Class representing a non-fungible token contract, extending the base `Contract` class.
 * It encapsulates the core functionality and properties of a non-fungible token (ERC721-like).
 */
export class NonFungibleTokenContract extends Contract {
  constructor() {
    super()
    this.methodStrategies = {
      mint: this.mint.bind(this),
    }
  }

  create(computeInputs: ComputeInputs) {
    const { transaction } = computeInputs
    const { transactionInputs } = transaction
    const initializedSupply =
      JSON.parse(transactionInputs)?.initializedSupply ?? '0'
    const totalSupply = JSON.parse(transactionInputs)?.totalSupply

    const createInstruction = buildCreateInstruction({
      from: transaction.from,
      initializedSupply: initializedSupply,
      totalSupply: totalSupply,
      programId: 'this',
      programOwner: transaction.from,
      programNamespace: 'this',
    })

    return new Outputs(computeInputs, [createInstruction]).toJson()
  }

  mint(computeInputs: ComputeInputs) {
    const { transaction } = computeInputs
    const tokenId = transaction.transactionInputs
    const tokenMetadata = JSON.parse(transaction.transactionInputs).metadata

    const mintInstructions = buildMintInstructions({
      from: transaction.from,
      programId: transaction.programId,
      paymentTokenAddress: String(transaction.paymentTokenAddress),
      paymentValue: BigInt(String(transaction.paymentValue)),
      returnedValue: BigInt(String(transaction.returnedValue)),
    })

    return new Outputs(computeInputs, mintInstructions).toJson()
  }
}
