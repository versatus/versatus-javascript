import { ComputeInputs } from '@versatus/versatus-javascript/lib/types'
import { THIS } from '@versatus/versatus-javascript/lib/consts'
import {
  Program,
  ProgramUpdate,
} from '@versatus/versatus-javascript/lib/programs/Program'
import {
  buildProgramUpdateField,
  buildUpdateInstruction,
} from '@versatus/versatus-javascript/lib/programs/instruction-builders/builder-helpers'
import { TokenOrProgramUpdate } from '@versatus/versatus-javascript/lib/programs/Token'
import { AddressOrNamespace } from '@versatus/versatus-javascript/lib/programs/Address-Namespace'
import { Outputs } from '@versatus/versatus-javascript/lib/programs/Outputs'

class HelloLasrProgram extends Program {
  constructor() {
    super()
    Object.assign(this.methodStrategies, {
      hello: this.hello.bind(this),
    })
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
