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
  formatHexToAmount,
  getCurrentImgUrls,
  getCurrentSupply,
  parseAmountToBigInt,
  parseAvailableTokenIds,
  parseMetadata,
  parseProgramAccountData,
  parseTokenData,
  parseTxInputs,
  validate,
  validateAndCreateJsonString,
} from '@versatus/versatus-javascript/lib/utils'

class NonFungible extends Program {
  constructor() {
    super()
    this.registerContractMethod('burn', this.burn)
    this.registerContractMethod('create', this.create)
    this.registerContractMethod('mint', this.mint)
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
      const { from } = transaction
      const txInputs = parseTxInputs(computeInputs)
      let currSupply = getCurrentSupply(computeInputs)

      // metadata
      const metadata = parseMetadata(computeInputs)
      const { initializedSupply, totalSupply } = metadata
      const recipientAddress = txInputs?.to ?? transaction.to

      // data
      const imgUrl = txInputs?.imgUrl
      const imgUrls: string[] = txInputs?.imgUrls ? [...txInputs?.imgUrls] : []
      const collection = txInputs?.collection
      const currentSupply = (
        currSupply + parseInt(initializedSupply)
      ).toString()

      const price = txInputs?.price
      const paymentProgramAddress = txInputs?.paymentProgramAddress
      const methods = 'approve,create,burn,mint,update'

      validate(collection, 'missing collection')
      validate(parseFloat(price), 'invalid price')
      validate(
        parseInt(initializedSupply) <= parseInt(totalSupply),
        'invalid supply'
      )

      const metadataStr = validateAndCreateJsonString(metadata)

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
        currentSupply,
        methods,
      } as Record<string, string>

      if (imgUrls && imgUrls.length > 0) {
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
        currentSupply,
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
      const accountData = parseProgramAccountData(computeInputs)
      const txInputs = parseTxInputs(computeInputs)
      const availableTokenIds = parseAvailableTokenIds(computeInputs)

      const price = parseFloat(accountData.price)
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

      const tokens: Record<string, string> = {}
      for (let i = 0; i < tokenIds.length; i++) {
        const tokenIdStr = parseInt(formatHexToAmount(tokenIds[i])).toString()
        const imgUrl =
          accountData.imgUrls &&
          JSON.parse(accountData.imgUrls)?.length > 0 &&
          JSON.parse(accountData.imgUrls)[tokenIdStr].imgUrl
            ? JSON.parse(accountData.imgUrls)[tokenIdStr].imgUrl
            : accountData.imgUrl
        tokens[`${tokenIdStr}-ownerAddress`] = transaction.from
        tokens[`${tokenIdStr}-imgUrl`] = imgUrl
      }

      const dataStr = validateAndCreateJsonString({
        ...accountData,
        ...tokens,
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
      throw new Error('Method not implemented.')
    } catch (e) {
      throw e
    }
  }
}

NonFungible.run()
