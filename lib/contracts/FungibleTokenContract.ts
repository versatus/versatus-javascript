import { Contract } from './Contract'
import { AccountInfo, ContractInput, Inputs } from '../types'

/**
 * Class representing a fungible token contract, extending the base `Contract` class.
 * It encapsulates the core functionality and properties of a fungible token.
 */
export class FungibleTokenContract extends Contract {
  /**
   * The name of the contract.
   * @type {string}
   */
  CONTRACT_NAME: string

  /**
   * The symbol of the contract.
   * @type {string}
   */
  CONTRACT_SYMBOL: string

  /**
   * The number of decimals for the token.
   * @type {number}
   */
  CONTRACT_DECIMALS: number

  /**
   * The total supply of the token.
   * @type {number}
   */
  CONTRACT_TOTAL_SUPPLY: number

  /**
   * Constructs a new instance of the FungibleTokenContract class.
   * @param {string} name - The name of the token.
   * @param {string} symbol - The symbol of the token.
   * @param {number} decimals - The number of decimals for the token.
   * @param {number} totalSupply - The total supply of the token.
   */
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

  /**
   * Retrieves the contract name.
   * @returns An object containing the contract name and a success flag.
   */
  name() {
    return { name: this.CONTRACT_NAME, success: true }
  }

  /**
   * Retrieves the contract symbol.
   * @returns An object containing the contract symbol and a success flag.
   */
  symbol() {
    return { symbol: this.CONTRACT_SYMBOL, success: true }
  }

  /**
   * Retrieves the number of decimals for the token.
   * @returns An object containing the number of decimals and a success flag.
   */
  decimals() {
    return { decimals: this.CONTRACT_DECIMALS, success: true }
  }

  /**
   * Retrieves the total supply of the token.
   * @returns An object containing the total supply and a success flag.
   */
  totalSupply() {
    return { totalSupply: this.CONTRACT_TOTAL_SUPPLY, success: true }
  }

  /**
   * Retrieves the balance of a given account.
   * @param {AccountInfo} _ - Account information (unused in this context).
   * @param {Inputs} input - The input parameters, including balance and owner ID.
   * @returns An object containing the balance and a success flag.
   */
  balanceOf(_: AccountInfo, input: Inputs) {
    const { balance, ownerId } = input
    return { address: ownerId, balance: balance ?? 0, success: true }
  }

  /**
   * Retrieves the allowance for a given spender.
   * @param {AccountInfo} _ - Account information (unused in this context).
   * @param {Inputs} input - The input parameters, including allowances and spender.
   * @returns An object containing the allowance and a success flag.
   */
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

  /**
   * Approves a spender to withdraw from an account up to a certain amount.
   * @param {AccountInfo} _ - Account information (unused in this context).
   * @param {Inputs} input - The input parameters, including spender, amount, and approvals.
   * @returns An object containing the updated approvals and a success flag.
   */
  approve(_: AccountInfo, input: Inputs) {
    const { spender, amount, approvals } = input
    if (!approvals) return { error: 'approvals not found', success: false }
    if (!spender) return { error: 'spender not found', success: false }
    if (!amount) return { error: 'amount not found', success: false }
    const currentApproval = approvals[spender] ?? 0
    approvals[spender] = String(BigInt(currentApproval) + BigInt(amount))

    return { approvals, success: true }
  }

  /**
   * Transfers a specified amount of tokens to a specified recipient.
   * @param {AccountInfo} _ - Account information (unused in this context).
   * @param {Inputs} input - The input parameters, including amount, owner address, balance, recipient address, and recipient balance.
   * @returns An object containing the updated balances and a success flag.
   */
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

    if (BigInt(balance) < BigInt(amount))
      return { error: 'insufficient funds', success: false }
    const balances = {
      [ownerAddress]: balance,
      [recipientAddress]: recipientBalance,
    }

    balances[ownerAddress] = BigInt(BigInt(balance) - BigInt(amount)).toString()
    balances[recipientAddress] = BigInt(
      BigInt(balances[recipientAddress] ?? '0') + BigInt(amount)
    ).toString()

    return { balances, success: true }
  }
}
