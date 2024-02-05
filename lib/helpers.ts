import {
  BurnInstructionBuilder,
  CreateInstructionBuilder,
  TokenDistributionBuilder,
  TransferInstructionBuilder,
} from './classes/builders'
import { AddressOrNamespace, StatusValue } from './classes/utils'
import Address from './classes/Address'
import { ApprovalsExtend, ApprovalsValue } from './classes/Approvals'
import {
  TokenDataValue,
  TokenDistribution,
  TokenField,
  TokenFieldValue,
  TokenMetadataExtend,
  TokenMetadataInsert,
  TokenMetadataRemove,
  TokenUpdateField,
} from './classes/Token'

import { TokenFieldValues } from './types'

export function bigIntToHexString(bigintValue: BigInt): string {
  let hexString = bigintValue.toString(16)
  hexString = hexString.padStart(64, '0')
  return '0x' + hexString
}

export function buildBurnInstruction({
  from,
  caller,
  programId,
  tokenAddress,
  amount,
}: {
  from: string
  caller: string
  programId: string
  tokenAddress: string
  amount: string
}) {
  return new BurnInstructionBuilder()
    .setProgramId(new AddressOrNamespace(new Address(programId)))
    .setCaller(new Address(caller))
    .setTokenAddress(new Address(tokenAddress))
    .setBurnFromAddress(new AddressOrNamespace(new Address(from)))
    .setAmount(bigIntToHexString(BigInt(amount)))
    .build()
}

export function buildCreateInstruction({
  programId,
  initializedSupply,
  totalSupply,
  programOwner,
  programNamespace,
  distributionInstruction,
}: {
  programId: string
  from: string
  initializedSupply: string
  totalSupply: string
  programOwner: string
  programNamespace: string
  distributionInstruction?: TokenDistribution
}) {
  if (distributionInstruction) {
    return new CreateInstructionBuilder()
      .setProgramId(new AddressOrNamespace(new Address(programId)))
      .setTotalSupply(bigIntToHexString(BigInt(totalSupply)))
      .setInitializedSupply(bigIntToHexString(BigInt(initializedSupply)))
      .addTokenDistribution(distributionInstruction)
      .setProgramOwner(new Address(programOwner))
      .setProgramNamespace(
        new AddressOrNamespace(new Address(programNamespace))
      )
      .build()
  }
  return new CreateInstructionBuilder()
    .setProgramId(new AddressOrNamespace(new Address(programId)))
    .setTotalSupply(bigIntToHexString(BigInt(totalSupply)))
    .setInitializedSupply(bigIntToHexString(BigInt(initializedSupply)))
    .setProgramOwner(new Address(programOwner))
    .setProgramNamespace(new AddressOrNamespace(new Address(programNamespace)))
    .build()
}

export function buildTokenDistributionInstruction({
  programId,
  initializedSupply,
  caller,
  tokenUpdates,
}: {
  programId: string
  initializedSupply: string
  caller: string
  tokenUpdates: TokenUpdateField[]
}) {
  return new TokenDistributionBuilder()
    .setProgramId(new AddressOrNamespace(new Address(programId)))
    .setAmount(bigIntToHexString(BigInt(initializedSupply)))
    .setReceiver(new AddressOrNamespace(new Address(caller)))
    .extendUpdateFields(tokenUpdates)
    .build()
}

export function buildMintInstructions({
  from,
  programId,
  paymentTokenAddress,
  paymentValue,
  returnedValue,
}: {
  from: string
  programId: string
  paymentTokenAddress: string
  paymentValue: BigInt
  returnedValue: BigInt
}) {
  const transferToProgram = buildTransferInstruction({
    from: from,
    to: 'this',
    tokenAddress: paymentTokenAddress,
    amount: paymentValue,
  })

  const transferToCaller = buildTransferInstruction({
    from: 'this',
    to: from,
    tokenAddress: programId,
    amount: returnedValue,
  })

  return [transferToProgram, transferToCaller]
}

export function buildTransferInstruction({
  from,
  to,
  tokenAddress,
  amount,
}: {
  from: string
  to: string
  tokenAddress: string
  amount: BigInt
}) {
  const toAddressOrNamespace = new AddressOrNamespace(new Address(to))
  const fromAddressOrNamespace = new AddressOrNamespace(new Address(from))
  const tokenAddressOrNamespace = new Address(tokenAddress)
  return new TransferInstructionBuilder()
    .setTransferFrom(fromAddressOrNamespace)
    .setTransferTo(toAddressOrNamespace)
    .setAmount(bigIntToHexString(amount))
    .setTokenAddress(tokenAddressOrNamespace)
    .build()
}

export function buildTokenUpdateField({
  field,
  value,
  action,
}: {
  field: TokenFieldValues
  value: string
  action: 'extend' | 'insert' | 'remove'
}): TokenUpdateField | Error {
  let tokenFieldValueType:
    | TokenDataValue
    | TokenMetadataExtend
    | TokenMetadataInsert
    | TokenMetadataRemove
    | StatusValue
    | ApprovalsValue
    | ApprovalsExtend
  if (field === 'metadata') {
    if (action === 'extend') {
      tokenFieldValueType = new TokenMetadataExtend(JSON.parse(value))
    } else if (action === 'insert') {
      const [key, insertValue] = JSON.parse(value).split(':')
      tokenFieldValueType = new TokenMetadataInsert(key, insertValue)
    } else if (action === 'remove') {
      tokenFieldValueType = new TokenMetadataRemove(value)
    } else {
      return new Error('Invalid action')
    }
  } else {
    return new Error('Invalid field')
  }

  return new TokenUpdateField(
    new TokenField(field),
    new TokenFieldValue(field, tokenFieldValueType)
  )
}
