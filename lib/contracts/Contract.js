export class Contract {
  constructor() {
    // Initialize method strategies
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

  // Method to add new strategies dynamically
  addOrExtendMethodStrategy(methodName, newStrategyFn, extend = false) {
    if (extend && this.methodStrategies[methodName]) {
      // If extending, wrap the original strategy
      const originalStrategy = this.methodStrategies[methodName]
      this.methodStrategies[methodName] = (accountInfo, contractInput) => {
        // Execute the original strategy
        const originalResult = originalStrategy(accountInfo, contractInput)

        // Pass the original result to the new strategy for potential extension
        return newStrategyFn(accountInfo, contractInput, originalResult)
      }
    } else {
      // If not extending, simply add or overwrite the strategy
      this.methodStrategies[methodName] = newStrategyFn
    }
  }
}
