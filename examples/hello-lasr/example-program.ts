import { ComputeInputs } from '@versatus/versatus-javascript/lib/types'
import { THIS } from '@versatus/versatus-javascript/lib/consts'
import {
  Program,
  ProgramUpdate,
} from '@versatus/versatus-javascript/lib/programs/Program'
import {
  buildCreateInstruction,
  buildProgramUpdateField,
  buildTokenDistributionInstruction,
  buildUpdateInstruction,
} from '@versatus/versatus-javascript/lib/programs/instruction-builders/builder-helpers'
import { TokenOrProgramUpdate } from '@versatus/versatus-javascript/lib/programs/Token'
import { AddressOrNamespace } from '@versatus/versatus-javascript/lib/programs/Address-Namespace'
import { Outputs } from '@versatus/versatus-javascript/lib/programs/Outputs'
import {
  getCurrentSupply,
  parseMetadata,
  parseTxInputs,
  validate,
  validateAndCreateJsonString,
} from '../../src'

class HelloLasrProgram extends Program {
  constructor() {
    super()
    this.registerContractMethod('create', this.create)
    this.registerContractMethod('hello', this.hello)
  }

  create(computeInputs: ComputeInputs) {
    try {
      const { transaction } = computeInputs
      const { from } = transaction
      const txInputs = parseTxInputs(computeInputs)
      let currSupply = getCurrentSupply(computeInputs)

      // metadata
      const metadata = parseMetadata(computeInputs)
      const { initializedSupply, totalSupply } = metadata
      const recipientAddress = txInputs?.to ?? transaction.to

      // data
      const imgUrl =
        'https://pbs.twimg.com/profile_images/1765199894539583488/RUiZn7jT_400x400.jpg'
      const currentSupply = (
        currSupply + parseInt(initializedSupply)
      ).toString()

      const methods = 'create,hello'
      const metadataStr = validateAndCreateJsonString(metadata)

      const addProgramMetadata = buildProgramUpdateField({
        field: 'metadata',
        value: metadataStr,
        action: 'extend',
      })

      const dataValues = {
        type: 'hello-lasr',
        imgUrl,
        currentSupply,
        methods,
      } as Record<string, string>

      const dataStr = validateAndCreateJsonString(dataValues)

      const addProgramData = buildProgramUpdateField({
        field: 'data',
        value: dataStr,
        action: 'extend',
      })

      const programUpdateInstructions = buildUpdateInstruction({
        update: new TokenOrProgramUpdate(
          'programUpdate',
          new ProgramUpdate(new AddressOrNamespace(THIS), [
            addProgramMetadata,
            addProgramData,
          ])
        ),
      })

      const distributionInstruction = buildTokenDistributionInstruction({
        programId: THIS,
        initializedSupply,
        currentSupply,
        to: recipientAddress,
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
    } catch (e) {
      throw e
    }
  }

  hello(computeInputs: ComputeInputs) {
    const { transaction } = computeInputs
    const { transactionInputs: txInputStr } = transaction
    const txInputs = JSON.parse(txInputStr)
    const name = txInputs?.name ?? 'World'

    const currentTime = new Date().getTime()
    const helloWorldUpdate = buildProgramUpdateField({
      field: 'data',
      value: JSON.stringify({
        hello: `Hello, ${name}! The time is ${currentTime}!`,
      }),
      action: 'extend',
    })

    if (helloWorldUpdate instanceof Error) {
      throw helloWorldUpdate
    }

    const programUpdates = [helloWorldUpdate]

    const helloWorldUpdateInstruction = buildUpdateInstruction({
      update: new TokenOrProgramUpdate(
        'programUpdate',
        new ProgramUpdate(new AddressOrNamespace(THIS), programUpdates)
      ),
    })

    return new Outputs(computeInputs, [helloWorldUpdateInstruction]).toJson()
  }
}

HelloLasrProgram.run()
