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

  balanceOf(_: AccountInfo, input: Inputs) {
    const { balance, ownerId } = input
    return { address: ownerId, balance: balance ?? 0, success: true }
  }

  allowance(_: AccountInfo, input: Inputs) {
    const { allowances, spender } = input
    if (!allowances) return { error: 'allowances not found', success: false }
    if (!spender) return { error: 'spender not found', success: false }

    return {
      address: spender,
      allowance: allowances[spender] ?? 0,
      success: true,
    }
  }

  approve(_: AccountInfo, input: Inputs) {
    const { spender, amount, approvals } = input
    if (!approvals) return { error: 'approvals not found', success: false }
    if (!spender) return { error: 'spender not found', success: false }
    if (!amount) return { error: 'amount not found', success: false }

    const updatedApprovals = approvals
    const currentApproval = approvals[spender] ?? 0
    updatedApprovals[spender] = BigInt(currentApproval) + BigInt(amount)

    return { approvals: updatedApprovals, success: true }
  }

  transfer(_: AccountInfo, input: Inputs) {
    const {
      amount,
      ownerAddress,
      balance,
      recipientAddress,
      recipientBalance,
    } = input

    if (!balance) return { error: 'balance not found', success: false }
    if (!recipientBalance)
      return { error: 'recipient balance not found', success: false }
    if (!amount) return { error: 'amount not found', success: false }
    if (!ownerAddress)
      return { error: 'owner address not found', success: false }
    if (!recipientAddress)
      return { error: 'recipient address not found', success: false }

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
