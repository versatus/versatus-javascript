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
  TokenOrProgramUpdate,
  TokenUpdate,
} from '@versatus/versatus-javascript/lib/programs/Token'
import { Outputs } from '@versatus/versatus-javascript/lib/programs/Outputs'
import {
  checkIfValuesAreUndefined,
  formatAmountToHex,
  formatHexToAmount,
  parseAmountToBigInt,
  parseAvailableTokenIds,
  parseProgramInfo,
  parseTokenData,
  parseTxInputs,
  validate,
  validateAndCreateJsonString,
} from '@versatus/versatus-javascript/lib/utils'

class Pokeball extends Program {
  constructor() {
    super()
    Object.assign(this.methodStrategies, {
      burn: this.burn.bind(this),
      create: this.create.bind(this),
      mint: this.mint.bind(this),
      transfer: this.transfer.bind(this),
    })
  }

  burn(computeInputs: ComputeInputs) {
    try {
      const { transaction } = computeInputs
      const { transactionInputs, from } = transaction
      const txInputs = validate(
        JSON.parse(transactionInputs),
        'unable to parse transactionInputs'
      )

      const tokenIds = validate(txInputs.tokenIds, 'missing tokenIds...')

      const burnInstruction = buildBurnInstruction({
        from: transaction.from,
        caller: transaction.from,
        programId: THIS,
        tokenAddress: transaction.programId,
        tokenIds,
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
      const recipientAddress = txInputs?.to ?? transaction.to

      // data
      const imgUrl = txInputs?.imgUrl
      const imgUrls = txInputs?.imgUrls
      const collection = txInputs?.collection
      const price = txInputs?.price
      const paymentProgramAddress = txInputs?.paymentProgramAddress
      const methods = 'approve,create,burn,mint,update'

      validate(collection, 'missing collection')
      validate(parseFloat(price), 'invalid price')
      validate(
        parseInt(initializedSupply) <= parseInt(totalSupply),
        'invalid supply'
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

      const dataValues = {
        type: 'non-fungible',
        imgUrl,
        paymentProgramAddress,
        price,
        methods,
      } as Record<string, string>

      // if we have an array of imgUrls, we'll add them here
      if (imgUrls) {
        const parsed = imgUrls
        if (!Array.isArray(parsed)) {
          throw new Error('imgUrls must be an array')
        }
        dataValues.imgUrls = JSON.stringify(parsed)
      }

      const dataStr = validateAndCreateJsonString(dataValues)

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

      const distributionInstruction = buildTokenDistributionInstruction({
        programId: THIS,
        initializedSupply,
        to: recipientAddress,
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
      const { transaction, accountInfo } = computeInputs
      const programInfo = parseProgramInfo(computeInputs)
      const tokenData = parseTokenData(computeInputs)
      const txInputs = parseTxInputs(computeInputs)
      const availableTokenIds = parseAvailableTokenIds(computeInputs)

      const price = parseFloat(tokenData.price)
      const paymentProgramAddress =
        accountInfo.programAccountData.paymentProgramAddress

      const quantityAvailable = validate(
        availableTokenIds?.length,
        'minted out...'
      )

      const quantity = validate(
        parseInt(txInputs?.quantity),
        'please specify a quantity'
      )

      validate(
        quantity <= quantityAvailable,
        'not enough supply for quantity desired'
      )

      const tokenIds: string[] = []
      for (let i = 0; i < quantity; i++) {
        tokenIds.push(availableTokenIds[i])
      }

      const tokenMap: Record<string, any> = {}
      for (let i = 0; i < tokenIds.length; i++) {
        const tokenIdStr = parseInt(formatHexToAmount(tokenIds[i])).toString()
        const imgUrl = tokenData.imgUrls
          ? JSON.parse(tokenData.imgUrls)[tokenIdStr].imgUrl
          : tokenData.imgUrl
        tokenMap[tokenIdStr] = JSON.stringify({
          ownerAddress: transaction.from,
          imgUrl,
        })
      }

      const dataStr = validateAndCreateJsonString({
        ...tokenData,
        tokenMap: JSON.stringify(tokenMap),
      })

      const updateTokenIds = buildTokenUpdateField({
        field: 'data',
        value: dataStr,
        action: 'extend',
      })

      const tokenUpdateInstruction = buildUpdateInstruction({
        update: new TokenOrProgramUpdate(
          'tokenUpdate',
          new TokenUpdate(
            new AddressOrNamespace(new Address(transaction.from)),
            new AddressOrNamespace(THIS),
            [updateTokenIds]
          )
        ),
      })

      const amountNeededToMint = parseAmountToBigInt(price * quantity)

      const mintInstructions = buildMintInstructions({
        from: transaction.from,
        programId: transaction.programId,
        paymentTokenAddress: paymentProgramAddress,
        inputValue: amountNeededToMint,
        returnedTokenIds: tokenIds,
      })

      return new Outputs(computeInputs, [
        ...mintInstructions,
        tokenUpdateInstruction,
      ]).toJson()
    } catch (e) {
      throw e
    }
  }

  transfer(computeInputs: ComputeInputs) {
    try {
      const { transaction } = computeInputs
      const { transactionInputs, programId, from, to } = transaction
      const programInfo = parseProgramInfo(computeInputs)
      const tokenData = parseTokenData(computeInputs)
      const txInputs = parseTxInputs(computeInputs)
      const { tokenIds, recipientAddress } = txInputs

      validate(Array.isArray(tokenIds), 'tokenIds must be an array')
      checkIfValuesAreUndefined({ tokenIds, recipientAddress })

      const callerTokenMap = JSON.parse(tokenData.tokenMap)

      const tokenMap: Record<string, any> = {}
      for (let i = 0; i < tokenIds.length; i++) {
        const tokenIdStr = parseInt(formatHexToAmount(tokenIds[i])).toString()
        const token = tokenData.tokenMap[tokenIdStr]
        const imgUrl = token.imgUrl
        tokenMap[tokenIdStr] = JSON.stringify({
          ownerAddress: recipientAddress,
          imgUrl,
        })
        delete callerTokenMap[tokenIdStr]
      }

      const callerDataStr = validateAndCreateJsonString({
        ...tokenData,
        tokenMap: JSON.stringify(callerTokenMap),
      })

      const dataStr = validateAndCreateJsonString({
        ...tokenData,
        tokenMap: JSON.stringify(tokenMap),
      })

      const updateTokenIds = buildTokenUpdateField({
        field: 'data',
        value: dataStr,
        action: 'extend',
      })

      const tokenUpdateInstruction = buildUpdateInstruction({
        update: new TokenOrProgramUpdate(
          'tokenUpdate',
          new TokenUpdate(
            new AddressOrNamespace(new Address(recipientAddress)),
            new AddressOrNamespace(THIS),
            [updateTokenIds]
          )
        ),
      })

      const callerUpdateInstruction = buildUpdateInstruction({
        update: new TokenOrProgramUpdate(
          'tokenUpdate',
          new TokenUpdate(
            new AddressOrNamespace(new Address(transaction.from)),
            new AddressOrNamespace(THIS),
            [updateTokenIds]
          )
        ),
      })

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

      return new Outputs(computeInputs, [
        transferToCaller,
        callerUpdateInstruction,
        tokenUpdateInstruction,
      ]).toJson()
    } catch (e) {
      throw e
    }
  }
}

const start = (input: ComputeInputs) => {
  try {
    const contract = new Pokeball()
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
