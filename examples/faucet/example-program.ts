import {
  Program,
  ProgramUpdate,
} from '@versatus/versatus-javascript/lib/programs/Program'
import { Outputs } from '@versatus/versatus-javascript/lib/programs/Outputs'

import {
  buildCreateInstruction,
  buildProgramUpdateField,
  buildTransferInstruction,
  buildUpdateInstruction,
} from '@versatus/versatus-javascript/lib/programs/instruction-builders/builder-helpers'
import { THIS } from '@versatus/versatus-javascript/lib/consts'
import {
  checkIfValuesAreUndefined,
  parseAmountToBigInt,
  parseProgramAccountData,
  parseTxInputs,
  validate,
  validateAndCreateJsonString,
} from '@versatus/versatus-javascript/lib/utils'
import { TokenOrProgramUpdate } from '@versatus/versatus-javascript/lib/programs/Token'
import { AddressOrNamespace } from '@versatus/versatus-javascript/lib/programs/Address-Namespace'
import { IComputeInputs } from '@versatus/versatus-javascript/lib/interfaces'

export class FaucetProgram extends Program {
  constructor() {
    super()
    Object.assign(this.methodStrategies, {
      addProgram: this.addProgram.bind(this),
      create: this.create.bind(this),
      faucet: this.faucet.bind(this),
    })
  }

  addProgram(computeInputs: IComputeInputs) {
    try {
      const { transaction, accountInfo } = computeInputs
      const { transactionInputs, from } = transaction
      const accountData = parseProgramAccountData(computeInputs)

      const txInputs = validate(
        JSON.parse(transactionInputs),
        'transaction inputs not parsable'
      )

      const {
        programAddress,
        faucetAmount,
        amountToAdd,
        addressTimeoutMinutes,
      } = txInputs

      checkIfValuesAreUndefined({
        programAddress,
        faucetAmount,
        amountToAdd,
        addressTimeoutMinutes,
      })

      const transferToFaucetInstruction = buildTransferInstruction({
        from: from,
        to: 'this',
        tokenAddress: programAddress,
        amount: parseAmountToBigInt(amountToAdd),
      })

      const faucetUpdate = buildProgramUpdateField({
        field: 'data',
        value: JSON.stringify({
          ...accountData,
          [programAddress]: JSON.stringify({
            config: `${faucetAmount}-${addressTimeoutMinutes}`,
            recipients: {},
          }),
        }),
        action: 'extend',
      })

      const faucetDataUpdateInstruction = buildUpdateInstruction({
        update: new TokenOrProgramUpdate(
          'programUpdate',
          new ProgramUpdate(new AddressOrNamespace(THIS), [faucetUpdate])
        ),
      })

      return new Outputs(computeInputs, [
        transferToFaucetInstruction,
        faucetDataUpdateInstruction,
      ]).toJson()
    } catch (e) {
      throw e
    }
  }
  create(computeInputs: IComputeInputs) {
    try {
      const { transaction } = computeInputs
      const { transactionInputs } = transaction

      const txInputs = validate(
        JSON.parse(transactionInputs),
        'unable to parse transactionInputs'
      )

      // metadata
      const symbol = txInputs?.symbol
      const name = txInputs?.name

      const metadataStr = validateAndCreateJsonString({
        symbol,
        name,
      })

      const addProgramMetadata = buildProgramUpdateField({
        field: 'metadata',
        value: metadataStr,
        action: 'extend',
      })

      // data
      const imgUrl = txInputs?.imgUrl
      const methods = 'addProgram,create,faucet,update'

      const dataStr = validateAndCreateJsonString({
        type: 'faucet',
        imgUrl,
        methods,
      })

      const addProgramData = buildProgramUpdateField({
        field: 'data',
        value: dataStr,
        action: 'extend',
      })

      // instructions
      const programDataUpdateInstruction = buildUpdateInstruction({
        update: new TokenOrProgramUpdate(
          'programUpdate',
          new ProgramUpdate(new AddressOrNamespace(THIS), [addProgramData])
        ),
      })

      const programMetadataUpdateInstruction = buildUpdateInstruction({
        update: new TokenOrProgramUpdate(
          'programUpdate',
          new ProgramUpdate(new AddressOrNamespace(THIS), [addProgramMetadata])
        ),
      })

      const createInstruction = buildCreateInstruction({
        from: transaction.from,
        programId: THIS,
        programOwner: transaction.from,
        programNamespace: THIS,
      })

      return new Outputs(computeInputs, [
        createInstruction,
        programMetadataUpdateInstruction,
        programDataUpdateInstruction,
      ]).toJson()
    } catch (e) {
      throw e
    }
  }
  faucet(computeInputs: IComputeInputs) {
    try {
      const { to, programToSend } = parseTxInputs(computeInputs)
      checkIfValuesAreUndefined({
        to,
        programToSend,
      })

      const accountData = parseProgramAccountData(computeInputs)
      const token = validate(JSON.parse(accountData[programToSend]), 'No token')

      const amount = token.config?.split('-')[0]
      const addressTimeoutMinutes = token.config?.split('-')[1]

      const amountToFaucet = parseAmountToBigInt(amount)

      checkIfValuesAreUndefined({
        amountToFaucet,
        addressTimeoutMinutes,
      })

      const recipients = validate(
        token.recipients,
        'No recipients object found.  Faucet is not initialized'
      )

      const faucetRecipientCanClaim = canClaimTokens(
        to,
        recipients,
        addressTimeoutMinutes
      )

      if (!faucetRecipientCanClaim) {
        throw new Error('Recipient has already claimed tokens')
      }

      const currentTime = new Date().getTime()
      const faucetRecipientsUpdate = buildProgramUpdateField({
        field: 'data',
        value: JSON.stringify({
          ...accountData,
          [programToSend]: JSON.stringify({
            config: `${amount}-${addressTimeoutMinutes}`,
            recipients: {
              ...recipients,
              [to]: currentTime,
            },
          }),
        }),
        action: 'extend',
      })

      const programUpdates = [faucetRecipientsUpdate]

      const faucetDataUpdateInstruction = buildUpdateInstruction({
        update: new TokenOrProgramUpdate(
          'programUpdate',
          new ProgramUpdate(new AddressOrNamespace(THIS), programUpdates)
        ),
      })

      const transferToCaller = buildTransferInstruction({
        from: 'this',
        to: to,
        tokenAddress: programToSend,
        amount: amountToFaucet,
      })

      return new Outputs(computeInputs, [
        transferToCaller,
        faucetDataUpdateInstruction,
      ]).toJson()
    } catch (e) {
      throw e
    }
  }
}

function canClaimTokens(
  recipientAddress: string,
  recipients: any,
  cycleTimeMin: string = '1'
) {
  const currentTime = new Date().getTime()
  const lastClaimTime = recipients[recipientAddress]
  if (lastClaimTime === undefined) {
    return true
  }

  const parsedCycleTimeMin = parseInt(cycleTimeMin)
  const oneHour = 60 * 1000 * parsedCycleTimeMin
  const timeSinceLastClaim = currentTime - lastClaimTime
  return timeSinceLastClaim >= oneHour
}

FaucetProgram.run()
