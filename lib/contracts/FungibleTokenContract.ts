import { Contract } from './Contract'
import { AccountInfo, ContractInput, Inputs } from '../../types'

export class FungibleTokenContract extends Contract {
  CONTRACT_NAME: string
  CONTRACT_SYMBOL: string
  CONTRACT_DECIMALS: number
  CONTRACT_TOTAL_SUPPLY: number

  constructor(
    name: string,
    symbol: string,
    decimals: number,
    totalSupply: number
  ) {
    super()
    this.CONTRACT_NAME = name
    this.CONTRACT_SYMBOL = symbol
    this.CONTRACT_DECIMALS = decimals
    this.CONTRACT_TOTAL_SUPPLY = totalSupply

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

  balanceOf(input: Inputs) {
    const { balance, ownerId } = input
    return { address: ownerId, balance: balance ?? 0, success: true }
  }

  allowance(input: Inputs) {
    const { allowances, spender } = input
    return {
      allowance: allowances[spender] ?? 0,
      success: true,
    }
  }

  approve(input: Inputs) {
    const { spender, amount } = input
    input.allowances[spender] = amount
    return { allowances: input.allowances, success: true }
  }

  transfer(input: Inputs) {
    const {
      amount,
      ownerAddress,
      balance,
      recipientAddress,
      recipientBalance,
    } = input

    let accountBalanceBigInt = BigInt(balance)
    let valueBigInt = BigInt(amount)
    if (accountBalanceBigInt < valueBigInt)
      return { error: 'insufficient funds', success: false }
    const balances = {
      [ownerAddress]: balance,
      [recipientAddress]: recipientBalance,
    }

    accountBalanceBigInt -= valueBigInt
    balances[ownerAddress] = accountBalanceBigInt.toString()
    balances[recipientAddress] = (
      BigInt(balances[recipientAddress] ?? '0') + valueBigInt
    ).toString()

    return { balances, success: true }
  }
}
