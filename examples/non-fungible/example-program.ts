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
    const { transaction } = computeInputs
    const { transactionInputs, from } = transaction
    const tokenInputDatas = JSON.parse(transactionInputs)

    if (!tokenInputDatas) {
      throw new Error('missing token input datas')
    }

    const imgUrl = tokenInputDatas?.imgUrl
    if (!imgUrl) {
      throw new Error('missing imgUrl')
    }

    const paymentProgramAddress = tokenInputDatas?.paymentProgramAddress
    if (!paymentProgramAddress) {
      throw new Error('missing paymentProgramAddress')
    }

    const price = tokenInputDatas?.price
    if (!price) {
      throw new Error('missing price')
    }

    const totalSupply = tokenInputDatas?.totalSupply
    if (!totalSupply) {
      throw new Error('missing totalSupply')
    }

    const initializedSupply = tokenInputDatas?.initializedSupply
    if (!initializedSupply) {
      throw new Error('missing initializedSupply')
    }

    const symbol = tokenInputDatas?.symbol
    if (!symbol) {
      throw new Error('missing symbol')
    }

    const name = tokenInputDatas?.name
    if (!name) {
      throw new Error('missing name')
    }

    const metadataStr = JSON.stringify({
      symbol,
      name,
      totalSupply,
      initializedSupply,
    })

    const updateProgramMetadata = buildProgramUpdateField({
      field: 'metadata',
      value: metadataStr,
      action: 'extend',
    })

    if (updateProgramMetadata instanceof Error) {
      throw updateProgramMetadata
    }

    const dataStr = JSON.stringify({
      type: 'non-fungible',
      imgUrl,
      paymentProgramAddress,
      price,
    })

    const updateProgramData = buildProgramUpdateField({
      field: 'data',
      value: dataStr,
      action: 'extend',
    })

    if (updateProgramData instanceof Error) {
      throw updateProgramData
    }

    const programUpdateInstructions = buildUpdateInstruction({
      update: new TokenOrProgramUpdate(
        'programUpdate',
        new ProgramUpdate(new AddressOrNamespace(THIS), [
          updateProgramMetadata,
          updateProgramData,
        ])
      ),
    })

    const addDataToTokenData = buildTokenUpdateField({
      field: 'data',
      value: dataStr,
      action: 'extend',
    })
    if (addDataToTokenData instanceof Error) {
      throw addDataToTokenData
    }

    const distributionInstruction = buildTokenDistributionInstruction({
      programId: THIS,
      initializedSupply,
      to: THIS,
      tokenUpdates: [addDataToTokenData],
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
  }

  mint(computeInputs: ComputeInputs) {
    const { transaction } = computeInputs
    const currProgramInfo = computeInputs.accountInfo?.programs[transaction.to]

    if (!currProgramInfo) {
      throw new Error('token missing from self...')
    }

    const tokenData = currProgramInfo.data
    if (!tokenData) {
      throw new Error('token missing required data to mint...')
    }

    const price = parseInt(tokenData.price)
    const paymentProgramAddress = tokenData.paymentProgramAddress

    const availableTokenIds = currProgramInfo?.tokenIds
    if (!availableTokenIds) {
      throw new Error('missing nfts to mint...')
    }

    const quantityAvailable = Number(availableTokenIds?.length)
    if (!quantityAvailable) {
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
