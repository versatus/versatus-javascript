import {
  BurnInstructionBuilder,
  CreateInstructionBuilder,
  TokenDistributionBuilder,
  TransferInstructionBuilder,
  UpdateInstructionBuilder,
} from '@/lib/programs/instruction-builders/builders'
import {
  StatusValue,
  TokenDistribution,
  TokenField,
  TokenFieldValue,
  TokenMetadataExtend,
  TokenMetadataInsert,
  TokenMetadataRemove,
  TokenOrProgramUpdate,
  TokenUpdateField,
} from '@/lib/programs/Token'

import {
  ProgramFieldValues,
  ProgramUpdateValueTypes,
  TokenFieldValues,
  TokenUpdateValueTypes,
} from '@/lib/types'
import {
  ProgramDataExtend,
  ProgramDataInsert,
  ProgramDataRemove,
  ProgramFieldValue,
  ProgramMetadataExtend,
  ProgramMetadataInsert,
  ProgramMetadataRemove,
} from '@/lib/programs/Program'
import { THIS } from '@/lib/consts'
import { bigIntToHexString } from '@/lib/utils'
import {
  ProgramField,
  ProgramUpdate,
  ProgramUpdateField,
} from '@/lib/programs/Program'
import { Address, AddressOrNamespace } from '@/lib/programs/Address-Namespace'

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
  initializedSupply?: string
  totalSupply?: string
  programOwner: string
  programNamespace: string
  distributionInstruction?: TokenDistribution
}) {
  const instructionBuilder = new CreateInstructionBuilder()
    .setProgramId(new AddressOrNamespace(new Address(programId)))
    .setProgramOwner(new Address(programOwner))
    .setProgramNamespace(new AddressOrNamespace(new Address(programNamespace)))

  if (initializedSupply !== undefined) {
    instructionBuilder.setInitializedSupply(
      bigIntToHexString(BigInt(initializedSupply))
    )
  }

  if (totalSupply !== undefined) {
    instructionBuilder.setTotalSupply(bigIntToHexString(BigInt(totalSupply)))
  }

  if (distributionInstruction !== undefined) {
    instructionBuilder.addTokenDistribution(distributionInstruction)
  }

  return instructionBuilder.build()
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
  tokenUpdates?: TokenUpdateField[]
}) {
  const tokenDistributionBuilder = new TokenDistributionBuilder()
    .setProgramId(new AddressOrNamespace(new Address(programId)))
    .setAmount(bigIntToHexString(BigInt(initializedSupply)))
    .setReceiver(new AddressOrNamespace(new Address(to)))

  if (tokenUpdates) {
    tokenDistributionBuilder.extendUpdateFields(tokenUpdates)
  }

  return tokenDistributionBuilder.build()
}

export function buildMintInstructions({
  from,
  programId,
  paymentTokenAddress,
  inputValue,
  returnedValue,
}: {
  from: string
  programId: string
  paymentTokenAddress: string
  inputValue: BigInt
  returnedValue: BigInt
}) {
  const transferToProgram = buildTransferInstruction({
    from: from,
    to: 'this',
    tokenAddress: paymentTokenAddress,
    amount: inputValue,
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

  const instructionBuilder = new TransferInstructionBuilder()
    .setTransferFrom(fromAddressOrNamespace)
    .setTransferTo(toAddressOrNamespace)
    .setTokenAddress(tokenAddressOrNamespace)

  if (tokenIds) {
    instructionBuilder.addTokenIds(tokenIds)
  }

  if (amount) {
    instructionBuilder.setAmount(bigIntToHexString(amount))
  }
  return instructionBuilder.build()
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
