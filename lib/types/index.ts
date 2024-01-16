export interface Input {
    version: number
    accountInfo: {
      accountAddress: string
      accountBalance: string
    }
    protocolInput: {
      version: number
      blockHeight: number
      blockTime: number
    }
    contractInput: {
      contractFn: string
      functionInputs: any 
    }
  }