import { ComputeInputs } from '@versatus/versatus-javascript/lib/types'

import {
  buildBurnInstruction,
  buildCreateInstruction,
  buildMintInstructions,
  buildProgramUpdateField,
  buildTokenDistributionInstruction,
  buildTokenUpdateField,
  buildUpdateInstruction,
} from '@versatus/versatus-javascript/lib/programs/instruction-builders/builder-helpers'
import {
  ETH_PROGRAM_ADDRESS,
  THIS,
} from '@versatus/versatus-javascript/lib/consts'
import {
  Program,
  ProgramUpdate,
} from '@versatus/versatus-javascript/lib/programs/Program'
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
import {
  formatVerse,
  getUndefinedProperties,
} from '@versatus/versatus-javascript/lib/utils'

class FungibleTokenProgram extends Program {
  constructor() {
    super()
    Object.assign(this.methodStrategies, {
      approve: this.approve.bind(this),
      burn: this.burn.bind(this),
      create: this.create.bind(this),
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

  create(computeInputs: ComputeInputs) {
    try {
      const { transaction } = computeInputs
      const { transactionInputs, from } = transaction
      const txInputs = JSON.parse(transactionInputs)
      if (!txInputs) {
        throw new Error('missing token input datas')
      }

      const totalSupply = formatVerse(txInputs?.totalSupply)
      const initializedSupply = formatVerse(txInputs?.initializedSupply)
      const to = txInputs?.to ?? from
      const symbol = txInputs?.symbol
      const name = txInputs?.name

      // data
      const imgUrl = txInputs?.imgUrl
      const paymentProgramAddress = txInputs?.paymentProgramAddress
      const price = txInputs?.price

      const undefinedProperties = getUndefinedProperties({
        imgUrl,
        paymentProgramAddress,
        price,
        totalSupply,
        initializedSupply,
        symbol,
        name,
      })
      if (undefinedProperties.length > 0) {
        throw new Error(
          `The following properties are undefined: ${undefinedProperties.join(
            ', '
          )}`
        )
      }

      const metadataStr = JSON.stringify({ symbol, name, totalSupply })

      const updateTokenMetadata = buildTokenUpdateField({
        field: 'metadata',
        value: metadataStr,
        action: 'extend',
      })

      const distributionInstruction = buildTokenDistributionInstruction({
        programId: THIS,
        initializedSupply,
        to,
        tokenUpdates: [updateTokenMetadata],
      })

      const createAndDistributeInstruction = buildCreateInstruction({
        from,
        initializedSupply,
        totalSupply,
        programId: THIS,
        programOwner: from,
        programNamespace: THIS,
        distributionInstruction,
      })

      const addProgramMetadata = buildProgramUpdateField({
        field: 'metadata',
        value: metadataStr,
        action: 'extend',
      })

      const dataStr = JSON.stringify({
        type: 'non-fungible',
        imgUrl,
        paymentProgramAddress,
        price,
      })

      const addProgramData = buildProgramUpdateField({
        field: 'data',
        value: dataStr,
        action: 'extend',
      })

      const programUpdateInstruction = buildUpdateInstruction({
        update: new TokenOrProgramUpdate(
          'programUpdate',
          new ProgramUpdate(new AddressOrNamespace(THIS), [
            addProgramMetadata,
            addProgramData,
          ])
        ),
      })

      return new Outputs(computeInputs, [
        createAndDistributeInstruction,
        programUpdateInstruction,
      ]).toJson()
    } catch (e) {
      throw e
    }
  }

  mint(computeInputs: ComputeInputs) {
    const { transaction } = computeInputs
    const currProgramInfo = computeInputs.accountInfo?.programs[transaction.to]
    if (!currProgramInfo) {
      throw new Error('token missing from self...')
    }

    const tokenData = currProgramInfo.data
    if (!tokenData) {
      throw new Error('token missing required data to mint...')
    }

    const price = parseInt(tokenData.price)
    const paymentProgramAddress = tokenData.paymentProgramAddress

    const inputValue = BigInt(transaction?.value)
    const conversionRate = BigInt(price)
    const returnedValue = inputValue / conversionRate

    const mintInstructions = buildMintInstructions({
      from: transaction.from,
      programId: transaction.programId,
      paymentTokenAddress: paymentProgramAddress,
      inputValue: inputValue,
      returnedValue: returnedValue,
    })

    return new Outputs(computeInputs, mintInstructions).toJson()
  }
}

const start = (input: ComputeInputs) => {
  const contract = new FungibleTokenProgram()
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
