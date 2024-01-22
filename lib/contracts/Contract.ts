import { ContractInput } from '../../types'

export class Contract {
  methodStrategies: { [key: string]: Function }
  constructor() {
    this.methodStrategies = {}
  }

  start(input: ContractInput) {
    return this.executeMethod(input)
  }

  executeMethod(input: ContractInput) {
    const { accountInfo, function: fn, inputs } = input
    const strategy = this.methodStrategies[fn]

    if (strategy) {
      return strategy(accountInfo, inputs)
    }

    throw new Error(`Unknown method: ${fn}`)
  }

  addOrExtendMethodStrategy(
    methodName: string,
    newStrategyFn: Function,
    extend: boolean = false
  ) {
    if (extend && this.methodStrategies[methodName]) {
      const originalStrategy = this.methodStrategies[methodName]
      this.methodStrategies[methodName] = (
        accountInfo: ContractInput['accountInfo'],
        contractInput: ContractInput['inputs']
      ) => {
        const originalResult = originalStrategy(accountInfo, contractInput)
        return newStrategyFn(accountInfo, contractInput, originalResult)
      }
    } else {
      this.methodStrategies[methodName] = newStrategyFn
    }
  }
}
