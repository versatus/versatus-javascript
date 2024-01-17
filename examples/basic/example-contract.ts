import { Contract } from '../../lib/contracts/Contract'

const start = (input: any) => {
  const contract = new Contract()
  const splitEvenly = (accountInfo: any, { functionInputs }: { functionInputs: { amount: number, recipients: any[] } }) => {
    const { amount, recipients } = functionInputs
    return {
      success: true,
      transactions: recipients.map((recipient: any) => ({
        recipient,
        amount: Math.floor(amount / recipients.length),
      })),
    }
  }

  contract.addOrExtendMethodStrategy('splitEvenly', splitEvenly)
  return contract.start(input)
}

export default start
