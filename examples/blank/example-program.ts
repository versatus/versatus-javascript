import { ComputeInputs } from '@versatus/versatus-javascript/lib/types'
import { Program } from '@versatus/versatus-javascript/lib/programs/Program'

class BlankLasrProgram extends Program {
  constructor() {
    super()
    Object.assign(this.methodStrategies, {})
  }
}

const start = (input: ComputeInputs) => {
  try {
    const contract = new BlankLasrProgram()
    return contract.start(input)
  } catch (e) {
    throw e
  }
}

process.stdin.setEncoding('utf8')
let data = ''

process.stdin.on('readable', () => {
  try {
    let chunk

    while ((chunk = process.stdin.read()) !== null) {
      data += chunk
    }
  } catch (e) {
    throw e
  }
})

process.stdin.on('end', () => {
  try {
    const parsedData = JSON.parse(data)
    const result = start(parsedData)
    process.stdout.write(JSON.stringify(result))
  } catch (err) {
    // @ts-ignore
    process.stdout.write(err.message)
  }
})
