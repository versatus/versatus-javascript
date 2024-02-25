import {
  BurnInstructionBuilder,
  CreateInstructionBuilder,
  TokenDistributionBuilder,
  TransferInstructionBuilder,
  UpdateInstructionBuilder,
} from './classes/builders'
import {
  AddressOrNamespace,
  StatusValue,
  TokenOrProgramUpdate,
} from './classes/utils'
import Address from './classes/Address'
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

import {
  ProgramFieldValues,
  ProgramUpdateValueTypes,
  TokenFieldValues,
  TokenUpdateValueTypes,
} from './types'
import {
  ProgramDataExtend,
  ProgramDataInsert,
  ProgramDataRemove,
  ProgramField,
  ProgramFieldValue,
  ProgramMetadataExtend,
  ProgramMetadataInsert,
  ProgramMetadataRemove,
  ProgramUpdate,
  ProgramUpdateField,
} from './classes/Program'
import { THIS } from './consts'

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

export function buildUpdateInstruction({
  update,
}: {
  update: TokenOrProgramUpdate
}) {
  return new UpdateInstructionBuilder().addUpdate(update).build()
}

export function buildTokenDistributionInstruction({
  programId,
  initializedSupply,
  to,
  tokenUpdates,
}: {
  programId: string
  initializedSupply: string
  to: string
  tokenUpdates: TokenUpdateField[]
}) {
  return new TokenDistributionBuilder()
    .setProgramId(new AddressOrNamespace(new Address(programId)))
    .setAmount(bigIntToHexString(BigInt(initializedSupply)))
    .setReceiver(new AddressOrNamespace(new Address(to)))
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
  tokenIds,
}: {
  from: string
  to: string
  tokenAddress: string
  amount: BigInt
  tokenIds?: string[]
}) {
  const toAddressOrNamespace = new AddressOrNamespace(new Address(to))
  const fromAddressOrNamespace = new AddressOrNamespace(new Address(from))
  const tokenAddressOrNamespace = new Address(tokenAddress)
  if (tokenIds) {
    return new TransferInstructionBuilder()
      .setTransferFrom(fromAddressOrNamespace)
      .setTransferTo(toAddressOrNamespace)
      .setTokenAddress(tokenAddressOrNamespace)
      .addTokenIds(tokenIds)
      .build()
  }
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
  action: 'insert' | 'extend' | 'remove'
}): TokenUpdateField | Error {
  let tokenFieldAction: TokenUpdateValueTypes
  if (field === 'metadata') {
    if (action === 'extend') {
      tokenFieldAction = new TokenMetadataExtend(JSON.parse(value))
    } else if (action === 'insert') {
      const [key, insertValue] = JSON.parse(value).split(':')
      tokenFieldAction = new TokenMetadataInsert(key, insertValue)
    } else if (action === 'remove') {
      tokenFieldAction = new TokenMetadataRemove(value)
    } else {
      return new Error('Invalid action')
    }
  } else if (field === 'status') {
    tokenFieldAction = new StatusValue(value)
  } else {
    return new Error('Invalid field')
  }

  return new TokenUpdateField(
    new TokenField(field),
    new TokenFieldValue(field, tokenFieldAction)
  )
}

export function buildProgramUpdateField({
  field,
  value,
  action,
}: {
  field: ProgramFieldValues
  value: string
  action: 'insert' | 'extend' | 'remove'
}): ProgramUpdateField | Error {
  let programFieldAction: ProgramUpdateValueTypes
  if (field === 'metadata') {
    if (action === 'extend') {
      programFieldAction = new ProgramMetadataExtend(JSON.parse(value))
    } else if (action === 'insert') {
      const [key, insertValue] = JSON.parse(value).split(':')
      programFieldAction = new ProgramMetadataInsert(key, insertValue)
    } else if (action === 'remove') {
      programFieldAction = new ProgramMetadataRemove(value)
    } else {
      return new Error('Invalid metadata action')
    }
  } else if (field === 'data') {
    if (action === 'extend') {
      programFieldAction = new ProgramDataExtend(JSON.parse(value))
    } else if (action === 'insert') {
      const [key, insertValue] = JSON.parse(value).split(':')
      programFieldAction = new ProgramDataInsert(key, insertValue)
    } else if (action === 'remove') {
      programFieldAction = new ProgramDataRemove(value)
    } else {
      return new Error('Invalid data action')
    }
  } else if (field === 'status') {
    programFieldAction = new StatusValue(value)
  } else {
    return new Error('Invalid field')
  }

  return new ProgramUpdateField(
    new ProgramField(field),
    new ProgramFieldValue(field, programFieldAction)
  )
}

export function buildTokenMetadataUpdateInstruction({
  transactionInputs,
}: {
  transactionInputs: string
}) {
  const tokenUpdateField = buildTokenUpdateField({
    field: 'metadata',
    value: transactionInputs,
    action: 'extend',
  })
  if (tokenUpdateField instanceof Error) {
    throw tokenUpdateField
  }

  return [tokenUpdateField]
}

export function buildProgramMetadataUpdateInstruction({
  transactionInputs,
}: {
  transactionInputs: string
}) {
  const programUpdateField = buildProgramUpdateField({
    field: 'metadata',
    value: transactionInputs,
    action: 'extend',
  })

  if (programUpdateField instanceof Error) {
    throw programUpdateField
  }

  const programUpdates = [programUpdateField]

  return buildUpdateInstruction({
    update: new TokenOrProgramUpdate(
      'programUpdate',
      new ProgramUpdate(new AddressOrNamespace(THIS), programUpdates)
    ),
  })
}
