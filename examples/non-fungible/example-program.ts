import {
  buildBurnInstruction,
  buildCreateInstruction,
  buildMintInstructions,
  buildProgramUpdateField,
  buildTokenDistribution,
  buildTokenUpdateField,
  buildTransferInstruction,
  buildUpdateInstruction,
  removeTokenDataKey,
  updateProgramData,
  updateProgramMetadata,
  updateTokenData,
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
  getCurrentSupply,
  onlyOwner,
  parseAmountToBigInt,
  parseAvailableTokenIds,
  parseMetadata,
  parseProgramAccountData,
  parseTxInputs,
  validate,
  validateAndCreateJsonString,
} from '@versatus/versatus-javascript/lib/utils'
import { IComputeInputs } from '@versatus/versatus-javascript/lib/interfaces'

class NonFungible extends Program {
  constructor() {
    super()
    this.registerContractMethod('burn', this.burn)
    this.registerContractMethod('create', this.create)
    this.registerContractMethod('mint', this.mint)
    this.registerContractMethod('transfer', this.transfer)
    this.registerContractMethod('withdraw', this.withdraw)
  }

  burn(computeInputs: IComputeInputs) {
    try {
      const { transaction } = computeInputs
      const tokenIds = parseAvailableTokenIds(computeInputs)
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

  create(computeInputs: IComputeInputs) {
    try {
      const { transaction } = computeInputs
      const { from } = transaction
      const txInputs = parseTxInputs(computeInputs)

      // metadata
      const metadata = parseMetadata(computeInputs)
      const { initializedSupply, totalSupply } = metadata
      const recipientAddress = txInputs?.to ?? transaction.to

      validate(
        parseInt(initializedSupply) <= parseInt(totalSupply),
        'invalid supply'
      )

      // data
      const methods = 'approve,create,burn,mint,transfer,update,withdraw'
      const imgUrls: string[] = txInputs?.imgUrls ? [...txInputs?.imgUrls] : []
      const imgUrl = validate(txInputs?.imgUrl, 'missing imgUrl')
      const collection = validate(txInputs?.collection, 'missing collection')
      const price = validate(
        String(parseFloat(txInputs?.price)),
        'invalid price'
      )
      const paymentProgramAddress = validate(
        txInputs?.paymentProgramAddress,
        'missing payment program address'
      )

      const dataValues = {
        type: 'non-fungible',
        imgUrl,
        paymentProgramAddress,
        price,
        collection,
        methods,
      } as Record<string, string>

      if (imgUrls && imgUrls.length > 0) {
        const parsed = imgUrls
        if (!Array.isArray(parsed)) {
          throw new Error('imgUrls must be an array')
        }
        dataValues.imgUrls = JSON.stringify(parsed)
      }

      const updateMetadata = updateProgramMetadata({
        programAddress: THIS,
        metadata,
      })

      const updateData = updateProgramData({
        programAddress: THIS,
        data: dataValues,
      })

      const distributionInstruction = buildTokenDistribution({
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
        updateMetadata,
        updateData,
      ]).toJson()
    } catch (e) {
      throw e
    }
  }

  mint(computeInputs: IComputeInputs) {
    try {
      const { transaction, accountInfo } = computeInputs
      const { from } = transaction
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

      const amountNeededToMint = parseAmountToBigInt(price * quantity)
      const mintInstructions = buildMintInstructions({
        from: transaction.from,
        programId: transaction.programId,
        paymentTokenAddress: paymentProgramAddress,
        inputValue: amountNeededToMint,
        returnedTokenIds: tokenIds,
      })

      return new Outputs(computeInputs, [...mintInstructions]).toJson()
    } catch (e) {
      throw e
    }
  }

  transfer(computeInputs: IComputeInputs) {
    try {
      const { transaction, accountInfo } = computeInputs
      const { from } = transaction
      const txInputs = parseTxInputs(computeInputs)

      const { recipient, tokenId } = txInputs

      const transferToRecipient = buildTransferInstruction({
        from,
        to: recipient,
        tokenAddress: transaction.programId,
        tokenIds: [tokenId],
      })

      return new Outputs(computeInputs, [transferToRecipient]).toJson()
    } catch (e) {
      throw e
    }
  }

  withdraw(computeInputs: IComputeInputs) {
    try {
      onlyOwner(computeInputs)
      const { transaction } = computeInputs
      const { tokenAddress } = parseTxInputs(computeInputs)
      validate(tokenAddress, 'missing token address')
      const amount = BigInt(
        computeInputs.accountInfo.programs[tokenAddress].balance
      )

      const transferInstruction = buildTransferInstruction({
        from: THIS,
        to: transaction.from,
        tokenAddress,
        amount: amount,
      })

      return new Outputs(computeInputs, [transferInstruction]).toJson()
    } catch (e) {
      throw e
    }
  }
}

NonFungible.run()
