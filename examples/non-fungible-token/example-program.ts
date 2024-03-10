import { ComputeInputs } from '@versatus/versatus-javascript/lib/types'

import {
  buildBurnInstruction,
  buildMintInstructions,
} from '@versatus/versatus-javascript/lib/programs/instruction-builders/builder-helpers'
import {
  ETH_PROGRAM_ADDRESS,
  THIS,
} from '@versatus/versatus-javascript/lib/consts'
import { Program } from '@versatus/versatus-javascript/lib/programs/Program'
import {
  Address,
  AddressOrNamespace,
} from '@versatus/versatus-javascript/lib/programs/Address-Namespace'
import {
  ApprovalsExtend,
  ApprovalsValue,
  TokenField,
  TokenFieldValue,
  TokenOrProgramUpdate,
  TokenUpdate,
  TokenUpdateField,
} from '@versatus/versatus-javascript/lib/programs/Token'
import { TokenUpdateBuilder } from '@versatus/versatus-javascript/lib/programs/instruction-builders/builders'
import { Outputs } from '@versatus/versatus-javascript/lib/programs/Outputs'

class NonFungibleTokenProgram extends Program {
  constructor() {
    super()
    Object.assign(this.methodStrategies, {
      approve: this.approve.bind(this),
      burn: this.burn.bind(this),
      mint: this.mint.bind(this),
    })
  }

  approve(computeInputs: ComputeInputs) {
    const { transaction } = computeInputs
    const { transactionInputs, programId } = transaction
    const tokenId = new AddressOrNamespace(new Address(programId))
    const caller = new Address(transaction.from)
    const update = new TokenUpdateField(
      new TokenField('approvals'),
      new TokenFieldValue(
        'insert',
        new ApprovalsValue(new ApprovalsExtend([JSON.parse(transactionInputs)]))
      )
    )

    const tokenUpdate = new TokenUpdate(
      new AddressOrNamespace(caller),
      tokenId,
      [update]
    )
    const tokenOrProgramUpdate = new TokenOrProgramUpdate(
      'tokenUpdate',
      tokenUpdate
    )
    const updateInstruction = new TokenUpdateBuilder()
      .addTokenAddress(tokenId)
      .addUpdateField(tokenOrProgramUpdate)
      .build()

    return new Outputs(computeInputs, [updateInstruction]).toJson()
  }

  burn(computeInputs: ComputeInputs) {
    const { transaction } = computeInputs
    const burnInstruction = buildBurnInstruction({
      from: transaction.from,
      caller: transaction.from,
      programId: THIS,
      tokenAddress: transaction.programId,
      amount: transaction.value,
    })

    return new Outputs(computeInputs, [burnInstruction]).toJson()
  }

  mint(computeInputs: ComputeInputs) {
    const { transaction } = computeInputs
    const inputTokenAddress = ETH_PROGRAM_ADDRESS
    const inputValue = BigInt(transaction?.value)
    const conversionRate = BigInt(2)
    const returnedValue = inputValue / conversionRate

    const mintInstructions = buildMintInstructions({
      from: transaction.from,
      programId: transaction.programId,
      paymentTokenAddress: inputTokenAddress,
      inputValue: inputValue,
      returnedValue: returnedValue,
    })

    return new Outputs(computeInputs, mintInstructions).toJson()
  }
}

const start = (input: ComputeInputs) => {
  const contract = new NonFungibleTokenProgram()
  return contract.start(input)
}

process.stdin.setEncoding('utf8')

let data = ''

process.stdin.on('readable', () => {
  let chunk
  while ((chunk = process.stdin.read()) !== null) {
    data += chunk
  }
})

process.stdin.on('end', () => {
  try {
    const parsedData = JSON.parse(data)
    const result = start(parsedData)
    process.stdout.write(JSON.stringify(result))
  } catch (err) {
    console.error('Failed to parse JSON input:', err)
  }
})
