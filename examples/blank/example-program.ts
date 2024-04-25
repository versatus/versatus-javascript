import { Program } from '@versatus/versatus-javascript/lib/programs/Program'

class BlankLasrProgram extends Program {
  constructor() {
    super()
    Object.assign(this.methodStrategies, {})
  }
}

BlankLasrProgram.run()
