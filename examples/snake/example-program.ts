import { Program } from '@/lib/classes/programs/Program'
import { ComputeInputs } from '@/lib/types'
import { AddressOrNamespace, TokenOrProgramUpdate } from '@/lib/classes/utils'
import { Outputs } from '@/lib/classes/Outputs'

import {
  buildBurnInstruction,
  buildCreateInstruction,
  buildMintInstructions,
  buildTokenUpdateField,
  buildTokenDistributionInstruction,
  buildProgramUpdateField,
  buildUpdateInstruction,
} from '@/lib/builders'
import { ETH_PROGRAM_ADDRESS, THIS } from '@/lib/consts'
import { ProgramUpdate } from '@/lib/classes/Program'

/**
 * Class representing a snake program, extending the base `Program` class.
 * It encapsulates the core functionality and properties of the write
 * functionality of a fungible token.
 */
class SnakeProgram extends Program {
  /**
   * Constructs a new instance of the FungibleTokenProgram class.
   */
  constructor() {
    super()
    Object.assign(this.methodStrategies, {
      burn: this.burn.bind(this),
      create: this.create.bind(this),
      createAndDistribute: this.createAndDistribute.bind(this),
      mint: this.mint.bind(this),
    })
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
    const { transactionInputs } = transaction
    const initializedSupply =
      JSON.parse(transactionInputs)?.initializedSupply ?? '0'
    const totalSupply = JSON.parse(transactionInputs)?.totalSupply

    const createInstruction = buildCreateInstruction({
      from: transaction.from,
      initializedSupply: initializedSupply,
      totalSupply: totalSupply,
      programId: THIS,
      programOwner: transaction.from,
      programNamespace: THIS,
    })

    return new Outputs(computeInputs, [createInstruction]).toJson()
  }

  createAndDistribute(computeInputs: ComputeInputs) {
    const { transaction } = computeInputs
    const { transactionInputs, from } = transaction
    const parsedInputMetadata = JSON.parse(transactionInputs)
    const totalSupply = parsedInputMetadata?.totalSupply ?? '0'
    const initializedSupply = parsedInputMetadata?.initializedSupply ?? '0'
    const to = parsedInputMetadata?.to ?? from

    const tokenUpdateField = buildTokenUpdateField({
      field: 'metadata',
      value: transactionInputs,
      action: 'extend',
    })
    if (tokenUpdateField instanceof Error) {
      throw tokenUpdateField
    }

    const tokenUpdates = [tokenUpdateField]

    const updateProgramMetadata = buildProgramUpdateField({
      field: 'metadata',
      value: transactionInputs,
      action: 'extend',
    })

    if (updateProgramMetadata instanceof Error) {
      throw updateProgramMetadata
    }

    const programSnakeHexUpdate = buildProgramUpdateField({
      field: 'data',
      value: JSON.stringify({
        snek: 'PGh0bWw+CjxzdHlsZT4jc25ha2UgewogICAgZm9udC1mYW1pbHk6ICJDb3VyaWVyIE5ldyIsIG1vbm9zcGFjZTsKICAgIGNvbG9yOiAjRjBEQjRGOwogICAgYmFja2dyb3VuZDogIzMyMzMzMDsKICAgIGRpc3BsYXk6IGlubGluZS1ibG9jazsKICAgIHdoaXRlLXNwYWNlOiBwcmU7CiAgICBsaW5lLWhlaWdodDogOXB4OwogICAgZm9udC1zaXplOiAxNXB4Owp9PC9zdHlsZT4KPGRpdiBpZD0ic25ha2UiPjwvZGl2Pgo8c2NyaXB0PgogICAgY29uc29sZS5sb2coIk1PVU5URUQgU05BS0UgR0FNRSIpCiAgICBsZXQgc25ha2UgPQogICAgICAgIGZ1bmN0aW9uKGEsYixjLGQsZSl7YS51bnNoaWZ0KGIpO2NeYVswXSYmYS5wb3AoKTtmb3IoYj1kKmQ7Yi0tOyllPVtlXSsi4pagICJbIX5hLmluZGV4T2YoYikmYiE9Y10rWyJcbiJbYiVkXV07cmV0dXJufmEuaW5kZXhPZihhWzBdLDEpfHxlfTsKICAgIChmdW5jdGlvbigpewogICAgICAgIGxldCBzaXplID0gNDA7CiAgICAgICAgbGV0IG9sZHN0ZXAsIHN0ZXAgPSAtMTsKICAgICAgICBkb2N1bWVudC5vbmtleWRvd24gPSBmdW5jdGlvbihlKSB7CiAgICAgICAgICAgIGxldCBrZXlDb2RlID0gKGUgfHwgd2luZG93LmV2ZW50KS5rZXlDb2RlLAogICAgICAgICAgICAgICAgbmV4dHN0ZXAgPSBbMSxzaXplLC0xLC1zaXplXVtrZXlDb2RlLTM3XTsKICAgICAgICAgICAgc3RlcCA9IChuZXh0c3RlcCA9PSAtb2xkc3RlcCkgPyBvbGRzdGVwIDogbmV4dHN0ZXA7CiAgICAgICAgfQogICAgICAgIGxldCBjZW50ZXIsIGFwcGxlID0gY2VudGVyID0gc2l6ZSooc2l6ZSouNSsuNSk7CiAgICAgICAgbGV0IGYsc25ha2llID0gKGY9ZnVuY3Rpb24oYyxpKXtyZXR1cm4gaT9mKGMsLS1pKS5jb25jYXQoYyk6W119KShjZW50ZXIsNSk7CiAgICAgICAgKGZ1bmN0aW9uKCkgewogICAgICAgICAgICBsZXQgb2xkbGVuZ3RoID0gc25ha2llLmxlbmd0aCwgbmV4dCA9IChzbmFraWVbMF0rKG9sZHN0ZXA9c3RlcCkrc2l6ZSpzaXplKSUoc2l6ZSpzaXplKSwKICAgICAgICAgICAgICAgIGdhbWUgPSBzbmFrZShzbmFraWUsIG5leHQsIGFwcGxlLCBzaXplKTsKICAgICAgICAgICAgaWYgKHR5cGVvZiBnYW1lID09PSAibnVtYmVyIikgewogICAgICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoICJzbmFrZSIgKS5pbm5lckhUTUwgKz0gKGY9ZnVuY3Rpb24oaSl7cmV0dXJuIGk/ZigtLWkpKyIgIjoiIn0pKHNpemUqLjUtNSkgKyAiR2FtZSBPdmVyIjsKICAgICAgICAgICAgfSBlbHNlIHsKICAgICAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCAic25ha2UiICkuaW5uZXJIVE1MID0gZ2FtZTsKICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoYXJndW1lbnRzLmNhbGxlZSwgMTAwKTsKICAgICAgICAgICAgfQogICAgICAgICAgICBpZiAoc25ha2llLmxlbmd0aCAhPT0gb2xkbGVuZ3RoKSB7CiAgICAgICAgICAgICAgICB3aGlsZSAofnNuYWtpZS5pbmRleE9mKGFwcGxlKSkgewogICAgICAgICAgICAgICAgICAgIGFwcGxlID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpKnNpemUqc2l6ZSk7CiAgICAgICAgICAgICAgICB9CiAgICAgICAgICAgIH0KICAgICAgICB9KSgpOwogICAgfSkoKTsKPC9zY3JpcHQ+CjwvaHRtbD4=',
      }),
      action: 'extend',
    })

    if (programSnakeHexUpdate instanceof Error) {
      throw programSnakeHexUpdate
    }

    const distributionInstruction = buildTokenDistributionInstruction({
      programId: THIS,
      initializedSupply,
      to,
      tokenUpdates,
    })

    const createAndDistributeInstruction = buildCreateInstruction({
      from,
      initializedSupply,
      totalSupply,
      programId: THIS,
      programOwner: from,
      programNamespace: THIS,
      distributionInstruction,
    })

    const programUpdates = [updateProgramMetadata, programSnakeHexUpdate]

    const programMetadataUpdateInstruction = buildUpdateInstruction({
      update: new TokenOrProgramUpdate(
        'programUpdate',
        new ProgramUpdate(new AddressOrNamespace(THIS), programUpdates)
      ),
    })

    return new Outputs(computeInputs, [
      createAndDistributeInstruction,
      programMetadataUpdateInstruction,
    ]).toJson()
  }

  mint(computeInputs: ComputeInputs) {
    const { transaction } = computeInputs
    const inputTokenAddress = ETH_PROGRAM_ADDRESS
    const paymentValue = BigInt(transaction?.value)
    const conversionRate = BigInt(2)
    const returnedValue = paymentValue / conversionRate

    const mintInstructions = buildMintInstructions({
      from: transaction.from,
      programId: transaction.programId,
      paymentTokenAddress: inputTokenAddress,
      paymentValue: paymentValue,
      returnedValue: returnedValue,
    })

    return new Outputs(computeInputs, mintInstructions).toJson()
  }
}

const start = (input: ComputeInputs) => {
  const contract = new SnakeProgram()
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
