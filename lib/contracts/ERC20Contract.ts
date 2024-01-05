import { Contract } from './Contract'

export class ERC20Contract extends Contract {
  CONTRACT_NAME: string;
  CONTRACT_SYMBOL: string;
  CONTRACT_DECIMALS: number;
  CONTRACT_TOTAL_SUPPLY: number;

  constructor(name: string, symbol: string, decimals: number, totalSupply: number) {
    super()
    this.CONTRACT_NAME = name
    this.CONTRACT_SYMBOL = symbol
    this.CONTRACT_DECIMALS = decimals
    this.CONTRACT_TOTAL_SUPPLY = totalSupply

    // @ts-ignore
    this.balances = {
      '0x1': totalSupply,
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
    // @ts-ignore
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

  symbol(_test: any, _test2: any) {
    return { symbol: this.CONTRACT_SYMBOL, success: true }
  }

  decimals() {
    return { decimals: this.CONTRACT_DECIMALS, success: true }
  }

  totalSupply() {
    return { totalSupply: this.CONTRACT_TOTAL_SUPPLY, success: true }
  }

  balanceOf(accountInfo: any, contractInput: any) {
    const { value } = contractInput.functionInputs.erc20.balanceOf
    return { balance: value ?? 0, success: true }
  }

  allowance(accountInfo: any, contractInput: any) {
    const { owner, spender } = contractInput.functionInputs.erc20
    // @ts-ignore
    return { allowance: this.allowances[owner][spender] ?? 0, success: true }
  }

  approve(accountInfo: any, contractInput: any) {
    const { owner, spender, amount } = contractInput.functionInputs.erc20
    // @ts-ignore
    if (this.balances[owner] < amount) return { success: false }
    // @ts-ignore
    this.allowances[owner] = this.allowances[owner] || {}
    // @ts-ignore
    this.allowances[owner][spender] = amount
    return { success: true }
  }

  transfer(accountInfo: any, contractInput: any) {
    const { accountAddress, accountBalance } = accountInfo
    const { value, address } = contractInput.functionInputs.erc20.transfer

    let accountBalanceBigInt = BigInt(accountBalance)
    let valueBigInt = BigInt(value)
    if (accountBalanceBigInt < valueBigInt) return { success: false }

    accountBalanceBigInt -= valueBigInt
    // @ts-ignore
    this.balances[accountAddress] = accountBalanceBigInt.toString()
    // @ts-ignore
    this.balances[address] = (
      // @ts-ignore
      BigInt(this.balances[address] ?? '0') + valueBigInt
    ).toString()

    return { success: true }
  }
}
