import { Contract } from '../../lib/contracts/Contract.js'

const start = (input) => {
  const contract = new Contract()
  const splitEvenly = (accountInfo, { functionInputs }) => {
    const { amount, recipients } = functionInputs
    return {
      success: true,
      transactions: recipients.map((recipient) => ({
        recipient,
        amount: Math.floor(amount / recipients.length),
      })),
    }
  }

  contract.addOrExtendMethodStrategy('splitEvenly', splitEvenly)
  return contract.start(input)
}

export default start
