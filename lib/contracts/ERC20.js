import { Contract } from './Contract.js'

export class ERC20Contract extends Contract {
  constructor(name, symbol, decimals, totalSupply) {
    super()
    this.CONTRACT_NAME = name
    this.CONTRACT_SYMBOL = symbol
    this.CONTRACT_DECIMALS = decimals
    this.CONTRACT_TOTAL_SUPPLY = totalSupply

    this.balances = {
      '0x1': 4200000,
      '0x2': 0,
      '0x3': 0,
      '0x4': 0,
      '0x5': 0,
      '0x6': 0,
      '0x7': 0,
      '0x8': 0,
      '0x9': 0,
      '0xa': 0,
    }
    this.allowances = {
      '0x1': {
        '0x2': 2000,
        '0x3': 0,
        '0x4': 0,
        '0x5': 0,
        '0x6': 0,
        '0x7': 0,
        '0x8': 0,
        '0x9': 0,
        '0xa': 0,
      },
    }

    // Initialize method strategies
    this.methodStrategies = {
      name: this.name.bind(this),
      symbol: this.symbol.bind(this),
      decimals: this.decimals.bind(this),
      totalSupply: this.totalSupply.bind(this),
      balanceOf: this.balanceOf.bind(this),
      allowance: this.allowance.bind(this),
      approve: this.approve.bind(this),
      transfer: this.transfer.bind(this),
    }
  }

  // Method implementations
  name() {
    return { name: this.CONTRACT_NAME, success: true }
  }

  symbol(test, test2) {
    return { symbol: this.CONTRACT_SYMBOL, success: true }
  }

  decimals() {
    return { decimals: this.CONTRACT_DECIMALS, success: true }
  }

  totalSupply() {
    return { totalSupply: this.CONTRACT_TOTAL_SUPPLY, success: true }
  }

  balanceOf(accountInfo, contractInput) {
    const { value } = contractInput.functionInputs.erc20.balanceOf
    return { balance: value ?? 0, success: true }
  }

  allowance(accountInfo, contractInput) {
    const { owner, spender } = contractInput.functionInputs.erc20
    return { allowance: this.allowances[owner]?.[spender] ?? 0, success: true }
  }

  approve(accountInfo, contractInput) {
    const { owner, spender, amount } = contractInput.functionInputs.erc20
    if (this.balances[owner] < amount) return { success: false }
    this.allowances[owner] = this.allowances[owner] || {}
    this.allowances[owner][spender] = amount
    return { success: true }
  }

  transfer(accountInfo, contractInput) {
    const { accountAddress, accountBalance } = accountInfo
    const { value, address } = contractInput.functionInputs.erc20.transfer

    let accountBalanceBigInt = BigInt(accountBalance)
    let valueBigInt = BigInt(value)
    if (accountBalanceBigInt < valueBigInt) return { success: false }

    accountBalanceBigInt -= valueBigInt
    this.balances[accountAddress] = accountBalanceBigInt.toString()
    this.balances[address] = (
      BigInt(this.balances[address] ?? '0') + valueBigInt
    ).toString()

    return { success: true }
  }
}
