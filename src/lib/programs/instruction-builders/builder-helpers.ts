import {
  BurnInstructionBuilder,
  CreateInstructionBuilder,
  TokenDistributionBuilder,
  TransferInstructionBuilder,
  UpdateInstructionBuilder,
} from '@/lib/programs/instruction-builders/builders'
import {
  ApprovalsExtend,
  StatusValue,
  TokenDataExtend,
  TokenDataInsert,
  TokenDataRemove,
  TokenDistribution,
  TokenField,
  TokenFieldValue,
  TokenMetadataExtend,
  TokenMetadataInsert,
  TokenMetadataRemove,
  TokenOrProgramUpdate,
  TokenUpdate,
  TokenUpdateField,
} from '@/lib/programs/Token'

import {
  Account,
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
import { formatBigIntToHex, formatAmountToHex } from '@/lib/utils'
import {
  ProgramField,
  ProgramUpdate,
  ProgramUpdateField,
} from '@/lib/programs/Program'
import {
  Address,
  AddressOrNamespace,
  Namespace,
} from '@/lib/programs/Address-Namespace'

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
    .setAmount(formatBigIntToHex(BigInt(amount)))
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
  try {
    const instructionBuilder = new CreateInstructionBuilder()
      .setProgramId(new AddressOrNamespace(new Address(programId)))
      .setProgramOwner(new Address(programOwner))
      .setProgramNamespace(
        new AddressOrNamespace(new Address(programNamespace))
      )

    if (initializedSupply !== undefined) {
      instructionBuilder.setInitializedSupply(
        formatBigIntToHex(BigInt(initializedSupply))
      )
    }

    if (totalSupply !== undefined) {
      instructionBuilder.setTotalSupply(formatBigIntToHex(BigInt(totalSupply)))
    }

    if (distributionInstruction !== undefined) {
      instructionBuilder.addTokenDistribution(distributionInstruction)
    }

    return instructionBuilder.build()
  } catch (e) {
    throw e
  }
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
  nonFungible,
}: {
  programId: string
  initializedSupply: string
  to: string
  tokenUpdates?: TokenUpdateField[]
  nonFungible?: boolean
}) {
  const tokenDistributionBuilder = new TokenDistributionBuilder()
    .setProgramId(new AddressOrNamespace(new Address(programId)))
    .setReceiver(new AddressOrNamespace(new Address(to)))

  if (!nonFungible) {
    tokenDistributionBuilder.setAmount(
      formatBigIntToHex(BigInt(initializedSupply))
    )
  } else {
    const tokenIds = []
    for (let i = 1; i <= parseInt(initializedSupply); i++) {
      tokenIds.push(formatAmountToHex(i.toString()))
    }
    tokenDistributionBuilder.extendTokenIds(tokenIds)
  }

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
  returnedTokenIds,
  returnedValue,
}: {
  from: string
  programId: string
  paymentTokenAddress: string
  inputValue: BigInt
  returnedTokenIds?: string[]
  returnedValue?: BigInt
}) {
  try {
    const transferToProgram = buildTransferInstruction({
      from: from,
      to: 'this',
      tokenAddress: paymentTokenAddress,
      amount: inputValue,
    })

    const mintTransferArguments: {
      from: string
      to: string
      tokenAddress: string
      amount?: BigInt
      tokenIds?: string[]
    } = {
      from: 'this',
      to: from,
      tokenAddress: programId,
      amount: returnedValue,
    }

    if (returnedValue) {
      mintTransferArguments.amount = returnedValue
    } else if (returnedTokenIds) {
      mintTransferArguments.tokenIds = returnedTokenIds
    } else {
      throw new Error(
        'invalid mint builder arguments. missing amount or tokenIds'
      )
    }

    const transferToCaller = buildTransferInstruction(mintTransferArguments)

    return [transferToProgram, transferToCaller]
  } catch (e) {
    throw e
  }
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
  amount?: BigInt
  tokenIds?: string[]
}) {
  try {
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
      instructionBuilder.setAmount(formatBigIntToHex(amount))
    }

    return instructionBuilder.build()
  } catch (e) {
    throw e
  }
}

export function buildTokenUpdateField({
  field,
  value,
  action,
}: {
  field: TokenFieldValues
  value: string | Array<[Address, string]>
  action: 'insert' | 'extend' | 'remove'
}): TokenUpdateField {
  try {
    let tokenFieldAction: TokenUpdateValueTypes
    if (value instanceof Array) {
      if (field === 'approvals') {
        tokenFieldAction = new ApprovalsExtend(value)
      } else {
        throw new Error(`Invalid field: ${field}`)
      }
    } else {
      if (field === 'metadata') {
        if (action === 'extend') {
          tokenFieldAction = new TokenMetadataExtend(JSON.parse(value))
        } else if (action === 'insert') {
          const [key, insertValue] = JSON.parse(value).split(':')
          tokenFieldAction = new TokenMetadataInsert(key, insertValue)
        } else if (action === 'remove') {
          tokenFieldAction = new TokenMetadataRemove(value)
        } else {
          throw new Error('Invalid action')
        }
      } else if (field === 'data') {
        if (action === 'extend') {
          tokenFieldAction = new TokenDataExtend(JSON.parse(value))
        } else if (action === 'insert') {
          const [key, insertValue] = JSON.parse(value).split(':')
          tokenFieldAction = new TokenDataInsert(key, insertValue)
        } else if (action === 'remove') {
          tokenFieldAction = new TokenDataRemove(value)
        } else {
          throw new Error(`Invalid data action: ${action}`)
        }
      } else if (field === 'status') {
        tokenFieldAction = new StatusValue(value)
      } else {
        throw new Error(`Invalid field: ${field}`)
      }
    }

    return new TokenUpdateField(
      new TokenField(field),
      new TokenFieldValue(field, tokenFieldAction)
    )
  } catch (e) {
    throw e
  }
}

export function buildProgramUpdateField({
  field,
  value,
  action,
}: {
  field: ProgramFieldValues
  value: string
  action: 'insert' | 'extend' | 'remove'
}): ProgramUpdateField {
  try {
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
        throw new Error(`Invalid metadata action: ${action}`)
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
        throw new Error(`Invalid data action: ${action}`)
      }
    } else if (field === 'status') {
      programFieldAction = new StatusValue(value)
    } else {
      throw new Error(`Invalid field: ${field}`)
    }

    return new ProgramUpdateField(
      new ProgramField(field),
      new ProgramFieldValue(field, programFieldAction)
    )
  } catch (e) {
    throw e
  }
}

export function buildTokenMetadataUpdateInstruction({
  accountAddress,
  tokenAddress,
  transactionInputs,
}: {
  accountAddress: Address | Namespace | 'this'
  tokenAddress: Address | Namespace | 'this'
  transactionInputs: string
}) {
  try {
    const tokenUpdateField = buildTokenUpdateField({
      field: 'metadata',
      value: transactionInputs,
      action: 'extend',
    })
    return buildUpdateInstruction({
      update: new TokenOrProgramUpdate(
        'tokenUpdate',
        new TokenUpdate(
          new AddressOrNamespace(accountAddress),
          new AddressOrNamespace(tokenAddress),
          [tokenUpdateField]
        )
      ),
    })
  } catch (e) {
    throw e
  }
}

export function buildProgramMetadataUpdateInstruction({
  transactionInputs,
}: {
  transactionInputs: string
}) {
  try {
    const programUpdateField = buildProgramUpdateField({
      field: 'metadata',
      value: transactionInputs,
      action: 'extend',
    })

    return buildUpdateInstruction({
      update: new TokenOrProgramUpdate(
        'programUpdate',
        new ProgramUpdate(new AddressOrNamespace(THIS), [programUpdateField])
      ),
    })
  } catch (e) {
    throw e
  }
}

export function buildProgramDataUpdateInstruction({
  transactionInputs,
}: {
  transactionInputs: string
}) {
  try {
    const programUpdateField = buildProgramUpdateField({
      field: 'metadata',
      value: transactionInputs,
      action: 'extend',
    })

    return buildUpdateInstruction({
      update: new TokenOrProgramUpdate(
        'programUpdate',
        new ProgramUpdate(new AddressOrNamespace(THIS), [programUpdateField])
      ),
    })
  } catch (e) {
    throw e
  }
}
