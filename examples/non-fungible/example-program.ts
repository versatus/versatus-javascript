import { ComputeInputs } from '@versatus/versatus-javascript/lib/types'

import {
  buildBurnInstruction,
  buildCreateInstruction,
  buildProgramUpdateField,
  buildTokenDistributionInstruction,
  buildTokenUpdateField,
  buildTransferInstruction,
  buildUpdateInstruction,
} from '@versatus/versatus-javascript/lib/programs/instruction-builders/builder-helpers'
import {
  ETH_PROGRAM_ADDRESS,
  THIS,
} from '@versatus/versatus-javascript/lib/consts'
import {
  Program,
  ProgramUpdate,
} from '@versatus/versatus-javascript/lib/programs/Program'
import {
  Address,
  AddressOrNamespace,
} from '@versatus/versatus-javascript/lib/programs/Address-Namespace'
import {
  ApprovalsExtend,
  ApprovalsValue,
  TokenField,
  TokenFieldValue,
  TokenOrProgramUpdate,
  TokenUpdate,
  TokenUpdateField,
} from '@versatus/versatus-javascript/lib/programs/Token'
import { TokenUpdateBuilder } from '@versatus/versatus-javascript/lib/programs/instruction-builders/builders'
import { Outputs } from '@versatus/versatus-javascript/lib/programs/Outputs'
import { parseVerse } from '@versatus/versatus-javascript/lib/utils'

class NonFungibleTokenProgram extends Program {
  constructor() {
    super()
    Object.assign(this.methodStrategies, {
      approve: this.approve.bind(this),
      burn: this.burn.bind(this),
      create: this.create.bind(this),
      mint: this.mint.bind(this),
    })
  }

  approve(computeInputs: ComputeInputs) {
    const { transaction } = computeInputs
    const { transactionInputs, programId } = transaction
    const tokenId = new AddressOrNamespace(new Address(programId))
    const caller = new Address(transaction.from)
    const update = new TokenUpdateField(
      new TokenField('approvals'),
      new TokenFieldValue(
        'insert',
        new ApprovalsValue(new ApprovalsExtend([JSON.parse(transactionInputs)]))
      )
    )

    const tokenUpdate = new TokenUpdate(
      new AddressOrNamespace(caller),
      tokenId,
      [update]
    )
    const tokenOrProgramUpdate = new TokenOrProgramUpdate(
      'tokenUpdate',
      tokenUpdate
    )
    const updateInstruction = new TokenUpdateBuilder()
      .addTokenAddress(tokenId)
      .addUpdateField(tokenOrProgramUpdate)
      .build()

    return new Outputs(computeInputs, [updateInstruction]).toJson()
  }

  burn(computeInputs: ComputeInputs) {
    const { transaction } = computeInputs
    const burnInstruction = buildBurnInstruction({
      from: transaction.from,
      caller: transaction.from,
      programId: THIS,
      tokenAddress: transaction.programId,
      amount: transaction.value,
    })

    return new Outputs(computeInputs, [burnInstruction]).toJson()
  }

  create(computeInputs: ComputeInputs) {
    const imgUrl =
      'https://pbs.twimg.com/profile_images/1765199894539583488/RUiZn7jT_400x400.jpg'

    const { transaction } = computeInputs
    const { transactionInputs, from } = transaction
    const parsedInputMetadata = JSON.parse(transactionInputs)

    const totalSupply = parsedInputMetadata?.totalSupply
    if (!totalSupply) {
      throw new Error('please specify a total supply')
    }

    const initializedSupply = parsedInputMetadata?.initializedSupply
    if (!initializedSupply) {
      throw new Error('please specify a initialized supply')
    }

    const symbol = parsedInputMetadata?.symbol
    if (!symbol) {
      throw new Error('please specify a symbol')
    }

    const name = parsedInputMetadata?.name
    if (!name) {
      throw new Error('please specify a name')
    }

    const nftMetadata = JSON.stringify({
      symbol,
      name,
      totalSupply,
      initializedSupply,
    })

    const updateProgramMetadata = buildProgramUpdateField({
      field: 'metadata',
      value: nftMetadata,
      action: 'extend',
    })

    if (updateProgramMetadata instanceof Error) {
      throw updateProgramMetadata
    }

    const addCommaChameleonImageUrlToProgram = buildProgramUpdateField({
      field: 'data',
      value: JSON.stringify({
        imgUrl,
        type: 'non-fungible',
      }),
      action: 'extend',
    })

    if (addCommaChameleonImageUrlToProgram instanceof Error) {
      throw addCommaChameleonImageUrlToProgram
    }

    const programMetadataUpdateInstruction = buildUpdateInstruction({
      update: new TokenOrProgramUpdate(
        'programUpdate',
        new ProgramUpdate(new AddressOrNamespace(THIS), [
          updateProgramMetadata,
          addCommaChameleonImageUrlToProgram,
        ])
      ),
    })

    const addCommaChameleonImageUrlToToken = buildTokenUpdateField({
      field: 'data',
      value: JSON.stringify({
        imgUrl,
      }),
      action: 'extend',
    })
    if (addCommaChameleonImageUrlToToken instanceof Error) {
      throw addCommaChameleonImageUrlToToken
    }

    const distributionInstruction = buildTokenDistributionInstruction({
      programId: THIS,
      initializedSupply,
      to: THIS,
      tokenUpdates: [addCommaChameleonImageUrlToToken],
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
      programMetadataUpdateInstruction,
    ]).toJson()
  }

  mint(computeInputs: ComputeInputs) {
    const { transaction } = computeInputs

    const price = 3
    const paymentProgramAddress = ETH_PROGRAM_ADDRESS

    const availableTokenIds =
      computeInputs.accountInfo?.programs[transaction.to]?.tokenIds

    const quantityAvailable = Number(availableTokenIds?.length)

    if (!availableTokenIds) {
      throw new Error('minted out...')
    }

    const { transactionInputs } = transaction
    const parsedInputMetadata = JSON.parse(transactionInputs)

    const quantity = parsedInputMetadata?.quantity
    if (!quantity) {
      throw new Error('please specify a quantity')
    }

    if (quantity > quantityAvailable) {
      throw new Error('not enough supply for quantity desired')
    }

    const tokenIds = []

    for (let i = 0; i < quantity; i++) {
      tokenIds.push(availableTokenIds[i])
    }

    const amountNeededToMint = parseVerse((price * quantity).toString())

    const transferToProgram = buildTransferInstruction({
      from: transaction.from,
      to: 'this',
      tokenAddress: paymentProgramAddress,
      amount: amountNeededToMint,
    })

    const transferToCaller = buildTransferInstruction({
      from: 'this',
      to: transaction.from,
      tokenAddress: transaction.to,
      tokenIds,
    })

    return new Outputs(computeInputs, [
      transferToProgram,
      transferToCaller,
    ]).toJson()
  }
}

const start = (input: ComputeInputs) => {
  const contract = new NonFungibleTokenProgram()
  return contract.start(input)
}

process.stdin.setEncoding('utf8')

let data = ''

process.stdin.on('readable', () => {
  let chunk
  while ((chunk = process.stdin.read()) !== null) {
    data += chunk
  }
})

process.stdin.on('end', () => {
  try {
    const parsedData = JSON.parse(data)
    const result = start(parsedData)
    process.stdout.write(JSON.stringify(result))
  } catch (err) {
    console.error('Failed to parse JSON input:', err)
  }
})
