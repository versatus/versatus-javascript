import { ComputeInputs } from '@versatus/versatus-javascript/lib/types'

import {
  buildBurnInstruction,
  buildCreateInstruction,
  buildMintInstructions,
  buildProgramUpdateField,
  buildTokenDistributionInstruction,
  buildTokenUpdateField,
  buildTransferInstruction,
  buildUpdateInstruction,
} from '@versatus/versatus-javascript/lib/programs/instruction-builders/builder-helpers'
import { THIS } from '@versatus/versatus-javascript/lib/consts'
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
  checkIfValuesAreUndefined,
  formatAmountToHex,
  formatHexToAmount,
  parseAmountToBigInt,
  validate,
  validateAndCreateJsonString,
} from '@versatus/versatus-javascript/lib/utils'

class NonFungibleTokenProgram extends Program {
  constructor() {
    super()
    Object.assign(this.methodStrategies, {
      approve: this.approve.bind(this),
      burn: this.burn.bind(this),
      create: this.create.bind(this),
      mint: this.mint.bind(this),
      transfer: this.transfer.bind(this),
    })
  }

  approve(computeInputs: ComputeInputs) {
    try {
      const { transaction } = computeInputs
      const { transactionInputs, programId } = transaction
      const tokenId = new AddressOrNamespace(new Address(programId))
      const caller = new Address(transaction.from)
      const update = new TokenUpdateField(
        new TokenField('approvals'),
        new TokenFieldValue(
          'insert',
          new ApprovalsValue(
            new ApprovalsExtend([JSON.parse(transactionInputs)])
          )
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
    } catch (e) {
      throw e
    }
  }

  burn(computeInputs: ComputeInputs) {
    try {
      const { transaction } = computeInputs
      const burnInstruction = buildBurnInstruction({
        from: transaction.from,
        caller: transaction.from,
        programId: THIS,
        tokenAddress: transaction.programId,
        amount: transaction.value,
      })

      return new Outputs(computeInputs, [burnInstruction]).toJson()
    } catch (e) {
      throw e
    }
  }

  create(computeInputs: ComputeInputs) {
    try {
      const { transaction } = computeInputs
      const { transactionInputs, from } = transaction
      const txInputs = validate(
        JSON.parse(transactionInputs),
        'unable to parse transactionInputs'
      )

      // metadata
      const totalSupply = txInputs?.totalSupply
      const initializedSupply = txInputs?.initializedSupply
      const symbol = txInputs?.symbol
      const name = txInputs?.name

      // data
      const imgUrl = txInputs?.imgUrl
      const paymentProgramAddress = txInputs?.paymentProgramAddress
      const price = txInputs?.price
      const methods = 'approve,create,burn,mint,update'

      validate(parseFloat(price), 'invalid price')
      validate(
        parseInt(initializedSupply) <= parseInt(totalSupply),
        'invalid supply'
      )

      validate(
        parseInt(formatHexToAmount(formatAmountToHex(initializedSupply))) <= 16,
        'woah partner, too many tokens for beta. 16 max.'
      )

      const metadataStr = validateAndCreateJsonString({
        symbol,
        name,
        totalSupply,
        initializedSupply,
      })

      const addProgramMetadata = buildProgramUpdateField({
        field: 'metadata',
        value: metadataStr,
        action: 'extend',
      })

      const dataStr = validateAndCreateJsonString({
        type: 'non-fungible',
        imgUrl,
        paymentProgramAddress,
        price,
        methods,
      })

      const addProgramData = buildProgramUpdateField({
        field: 'data',
        value: dataStr,
        action: 'extend',
      })

      const programUpdateInstructions = buildUpdateInstruction({
        update: new TokenOrProgramUpdate(
          'programUpdate',
          new ProgramUpdate(new AddressOrNamespace(THIS), [
            addProgramMetadata,
            addProgramData,
          ])
        ),
      })

      const addDataToToken = buildTokenUpdateField({
        field: 'data',
        value: dataStr,
        action: 'extend',
      })

      const distributionInstruction = buildTokenDistributionInstruction({
        programId: THIS,
        initializedSupply,
        to: THIS,
        tokenUpdates: [addDataToToken],
        nonFungible: true,
      })

      const createInstruction = buildCreateInstruction({
        from,
        totalSupply,
        initializedSupply,
        programId: THIS,
        programOwner: from,
        programNamespace: THIS,
        distributionInstruction,
      })

      return new Outputs(computeInputs, [
        createInstruction,
        programUpdateInstructions,
      ]).toJson()
    } catch (e) {
      throw e
    }
  }

  mint(computeInputs: ComputeInputs) {
    try {
      const { transaction } = computeInputs
      const currProgramInfo = validate(
        computeInputs.accountInfo?.programs[transaction.to],
        'token missing from self...'
      )

      const tokenData = validate(
        currProgramInfo?.data,
        'token missing required data to mint...'
      )

      const price = parseInt(tokenData.price)
      const paymentProgramAddress = tokenData.paymentProgramAddress

      const availableTokenIds = validate(
        currProgramInfo?.tokenIds,
        'missing nfts to mint...'
      )

      const quantityAvailable = validate(
        parseInt(availableTokenIds?.length),
        'minted out...'
      )

      const { transactionInputs } = transaction
      const parsedInputMetadata = JSON.parse(transactionInputs)

      const quantity = validate(
        parseInt(parsedInputMetadata?.quantity),
        'please specify a quantity'
      )

      validate(
        quantity <= quantityAvailable,
        'not enough supply for quantity desired'
      )

      const tokenIds = []

      for (let i = 0; i < quantity; i++) {
        tokenIds.push(availableTokenIds[i])
      }

      const amountNeededToMint = parseAmountToBigInt(
        (price * quantity).toString()
      )

      const mintInstructions = buildMintInstructions({
        from: transaction.from,
        programId: transaction.programId,
        paymentTokenAddress: paymentProgramAddress,
        inputValue: amountNeededToMint,
        returnedTokenIds: tokenIds,
      })

      return new Outputs(computeInputs, mintInstructions).toJson()
    } catch (e) {
      throw e
    }
  }

  transfer(computeInputs: ComputeInputs) {
    try {
      const { transaction } = computeInputs
      const { transactionInputs, programId, from, to } = transaction
      const txInputs = validate(
        JSON.parse(transactionInputs),
        'unable to parse transactionInputs'
      )
      const { tokenIds, recipientAddress } = txInputs

      validate(Array.isArray(tokenIds), 'tokenIds must be an array')
      checkIfValuesAreUndefined({ tokenIds, recipientAddress })

      const transferArguments: {
        from: string
        to: string
        tokenAddress: string
        amount?: BigInt
        tokenIds?: string[]
      } = {
        from,
        to: recipientAddress,
        tokenAddress: programId,
        tokenIds: tokenIds,
      }

      const transferToCaller = buildTransferInstruction(transferArguments)

      return new Outputs(computeInputs, [transferToCaller]).toJson()
    } catch (e) {
      throw e
    }
  }
}

const start = (input: ComputeInputs) => {
  try {
    const contract = new NonFungibleTokenProgram()
    return contract.start(input)
  } catch (e) {
    throw e
  }
}

process.stdin.setEncoding('utf8')

let data = ''

process.stdin.on('readable', () => {
  try {
    let chunk

    while ((chunk = process.stdin.read()) !== null) {
      data += chunk
    }
  } catch (e) {
    throw e
  }
})

process.stdin.on('end', () => {
  try {
    const parsedData = JSON.parse(data)
    const result = start(parsedData)
    process.stdout.write(JSON.stringify(result))
  } catch (err) {
    // @ts-ignore
    process.stdout.write(err.message)
  }
})
