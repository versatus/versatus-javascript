import {
  buildBurnInstruction,
  buildCreateInstruction,
  buildMintInstructions,
  buildProgramUpdateField,
  buildTokenDistribution,
  buildTokenUpdateField,
  buildTransferInstruction,
  buildUpdateInstruction,
} from '@versatus/versatus-javascript/lib/programs/instruction-builders/builder-helpers'
import { THIS } from '@versatus/versatus-javascript/lib/consts'
import {
  Program,
  ProgramUpdate,
} from '@versatus/versatus-javascript/lib/programs/Program'
import { AddressOrNamespace } from '@versatus/versatus-javascript/lib/programs/Address-Namespace'
import { TokenOrProgramUpdate } from '@versatus/versatus-javascript/lib/programs/Token'
import { Outputs } from '@versatus/versatus-javascript/lib/programs/Outputs'
import {
  checkIfValuesAreUndefined,
  formatAmountToHex,
  formatVerse,
  onlyOwner,
  parseAmountToBigInt,
  parseTxInputs,
  validate,
  validateAndCreateJsonString,
} from '@versatus/versatus-javascript/lib/utils'
import { IComputeInputs } from '@versatus/versatus-javascript/lib/interfaces'

class FungibleTokenProgram extends Program {
  constructor() {
    super()
    this.registerContractMethod('burn', this.burn)
    this.registerContractMethod('create', this.create)
    this.registerContractMethod('mint', this.mint)
    this.registerContractMethod('withdraw', this.withdraw)
  }

  burn(computeInputs: IComputeInputs) {
    try {
      const { transaction } = computeInputs
      const { from, programId, value } = transaction

      checkIfValuesAreUndefined({ from, programId, value })

      const burnInstruction = buildBurnInstruction({
        from: from,
        caller: from,
        programId: THIS,
        tokenAddress: programId,
        amount: value,
      })

      return new Outputs(computeInputs, [burnInstruction]).toJson()
    } catch (e) {
      throw e
    }
  }

  create(computeInputs: IComputeInputs) {
    try {
      const { transaction } = computeInputs
      const { transactionInputs, from, to } = transaction
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
      const metadataStr = validateAndCreateJsonString({
        symbol,
        name,
        totalSupply: formatAmountToHex(totalSupply),
      })

      // data
      const imgUrl = txInputs?.imgUrl
      const paymentProgramAddress = txInputs?.paymentProgramAddress
      const conversionRate = txInputs?.conversionRate
      const methods = 'approve,create,burn,mint,update'
      const dataStr = validateAndCreateJsonString({
        type: 'fungible',
        imgUrl,
        paymentProgramAddress,
        conversionRate,
        methods,
      })

      const addTokenMetadata = buildTokenUpdateField({
        field: 'metadata',
        value: metadataStr,
        action: 'extend',
      })

      const addTokenData = buildTokenUpdateField({
        field: 'data',
        value: dataStr,
        action: 'extend',
      })

      const addProgramData = buildProgramUpdateField({
        field: 'data',
        value: dataStr,
        action: 'extend',
      })

      const distributionInstruction = buildTokenDistribution({
        programId: THIS,
        initializedSupply: formatAmountToHex(initializedSupply),
        to: recipientAddress ?? to,
        tokenUpdates: [addTokenMetadata, addTokenData],
      })

      const createAndDistributeInstruction = buildCreateInstruction({
        from,
        initializedSupply: formatAmountToHex(initializedSupply),
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

  mint(computeInputs: IComputeInputs) {
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

      const paymentProgramAddress = tokenData.paymentProgramAddress
      const inputValue = BigInt(transaction.value)
      const conversionRate = tokenData.conversionRate
      const returnedValue = BigInt(
        //@ts-ignore
        formatVerse(inputValue * parseAmountToBigInt(conversionRate.toString()))
      )

      checkIfValuesAreUndefined({
        paymentProgramAddress,
        inputValue,
        conversionRate,
        returnedValue,
      })

      const mintInstructions = buildMintInstructions({
        from: transaction.from,
        programId: transaction.programId,
        paymentTokenAddress: paymentProgramAddress,
        inputValue: inputValue,
        returnedValue: returnedValue,
      })

      return new Outputs(computeInputs, mintInstructions).toJson()
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

FungibleTokenProgram.run()
