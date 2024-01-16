import { Contract } from './Contract.js'

export class ERC20Contract extends Contract {
  CONTRACT_NAME: string;
  CONTRACT_SYMBOL: string;
  CONTRACT_DECIMALS: number;
  CONTRACT_TOTAL_SUPPLY: number

  constructor(name: string, symbol: string, decimals: number, totalSupply: number) {
    super()
    this.CONTRACT_NAME = name
    this.CONTRACT_SYMBOL = symbol
    this.CONTRACT_DECIMALS = decimals
    this.CONTRACT_TOTAL_SUPPLY = totalSupply

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

  symbol() {
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
    return { allowance: contractInput.allowances[owner]?.[spender] ?? 0, success: true }
  }

  approve(accountInfo: any, contractInput: any) {
    const { owner, spender, amount } = contractInput.functionInputs.erc20
    if (this.balanceOf(accountInfo, { functionInputs: { erc20: { balanceOf: { value: owner } } } }).balance < amount) return { success: false }
    contractInput.allowances[owner] = contractInput.allowances[owner] || {}
    contractInput.allowances[owner][spender] = amount
    return { success: true }
  }

  transfer(accountInfo: any, contractInput: any) {
    const { accountAddress, accountBalance } = accountInfo
    const { value, address } = contractInput.functionInputs.erc20.transfer

    let accountBalanceBigInt = BigInt(accountBalance)
    let valueBigInt = BigInt(value)
    if (accountBalanceBigInt < valueBigInt) return { success: false }

    accountBalanceBigInt -= valueBigInt
    contractInput.balances[accountAddress] = accountBalanceBigInt.toString()
    contractInput.balances[address] = (
      BigInt(contractInput.balances[address] ?? '0') + valueBigInt
    ).toString()

    return { success: true }
  }
}
