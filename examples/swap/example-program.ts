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
import {
  IComputeInputs,
  IProgram,
} from '@versatus/versatus-javascript/lib/interfaces'

class Swap extends Program {
  constructor() {
    super()
    this.registerContractMethod('create', this.create)
    this.registerContractMethod('swap', this.swap)
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
      const tokenAAddress = validate(txInputs?.tokenAAddress, 'missing token A')
      const tokenBAddress = validate(txInputs?.tokenBAddress, 'missing token B')
      const imgUrl = txInputs?.imgUrl
      const methods = 'approve,create,swap,update'
      const dataStr = validateAndCreateJsonString({
        type: 'lp',
        imgUrl,
        methods,
        tokenAAddress,
        tokenBAddress,
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

  swap(computeInputs: IComputeInputs) {
    try {
      const txInputs = parseTxInputs(computeInputs)
      const transaction = computeInputs.transaction
      const { inputTokenAddress, inputAmount } = txInputs
      validate(inputTokenAddress, 'missing input token')
      validate(inputAmount, 'missing input amount')
      const data = computeInputs.accountInfo.programAccountData
      const tokenAAddress = data.tokenAAddress
      const tokenBAddress = data.tokenBAddress
      const outputTokenAddress =
        inputTokenAddress === tokenAAddress ? tokenBAddress : tokenAAddress
      validate(tokenAAddress, 'missing token A address')
      validate(tokenBAddress, 'missing token B address')
      validate(
        tokenAAddress === inputTokenAddress ||
          tokenBAddress === inputTokenAddress,
        'invalid input token'
      )

      const tokenAProgram = getProgramFromAccount(computeInputs, tokenAAddress)
      const tokenBProgram = getProgramFromAccount(computeInputs, tokenBAddress)
      const tokenABalance = BigInt(tokenAProgram.balance)
      const tokenBBalance = BigInt(tokenBProgram.balance)
      validate(tokenABalance > 0n, 'insufficient token A balance')
      validate(tokenBBalance > 0n, 'insufficient token B balance')

      const inputToken =
        tokenAAddress === inputTokenAddress ? tokenAProgram : tokenBProgram
      const outputToken =
        tokenAAddress === outputTokenAddress ? tokenAProgram : tokenBProgram

      const inputTokenBalance = BigInt(inputToken.balance)
      const outputTokenBalance = BigInt(outputToken.balance)

      const amountIn = validate(
        formatAmountToHex(inputAmount),
        'invalid input amount'
      )
      const feeMultiplier = formatAmountToHex(0.997)
      const amountInWithFee = BigInt(amountIn) * BigInt(feeMultiplier)
      const newBalanceInput =
        inputTokenBalance +
        BigInt(Math.floor(parseFloat(formatVerse(amountInWithFee))))

      const outputAmount =
        outputTokenBalance -
        (inputTokenBalance * outputTokenBalance) / newBalanceInput

      const inputTransferInstruction = buildTransferInstruction({
        from: transaction.from,
        to: THIS,
        tokenAddress: inputTokenAddress,
        amount: BigInt(amountIn),
      })

      const outputTransferInstruction = buildTransferInstruction({
        from: THIS,
        to: transaction.from,
        tokenAddress: outputTokenAddress,
        amount: outputAmount,
      })

      const sendPtInstruction = buildTransferInstruction({
        from: THIS,
        to: transaction.from,
        tokenAddress: transaction.programId,
        amount: BigInt(1),
      })

      return new Outputs(computeInputs, [
        inputTransferInstruction,
        outputTransferInstruction,
        sendPtInstruction,
      ]).toJson()
    } catch (e) {
      throw e
    }
  }
}

Swap.run()

function getProgramFromAccount(
  computeInputs: IComputeInputs,
  programId: string
): IProgram {
  try {
    const programs = computeInputs.accountInfo.programs
    const program = programs[programId]
    validate(program, 'program not found')
    return program
  } catch (e) {
    throw e
  }
}
