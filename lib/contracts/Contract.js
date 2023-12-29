export class Contract {
  constructor() {
    this.methodStrategies = {}
  }

  start(input) {
    const { accountInfo, contractInput } = input
    return this.executeMethod(accountInfo, contractInput)
  }

  executeMethod(accountInfo, contractInput) {
    const { contractFn } = contractInput
    const strategy = this.methodStrategies[contractFn]

    if (strategy) {
      return strategy(accountInfo, contractInput)
    }

    throw new Error(`Unknown method: ${contractFn}`)
  }

  addOrExtendMethodStrategy(methodName, newStrategyFn, extend = false) {
    if (extend && this.methodStrategies[methodName]) {
      const originalStrategy = this.methodStrategies[methodName]
      this.methodStrategies[methodName] = (accountInfo, contractInput) => {
        const originalResult = originalStrategy(accountInfo, contractInput)
        return newStrategyFn(accountInfo, contractInput, originalResult)
      }
    } else {
      this.methodStrategies[methodName] = newStrategyFn
    }
  }
}
