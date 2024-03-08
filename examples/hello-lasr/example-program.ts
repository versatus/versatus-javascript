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

const start = (input: ComputeInputs) => {
  const contract = new HelloLasrProgram()
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
