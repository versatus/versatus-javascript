import { Contract } from './lib/contracts';
import { Input } from './types/Input';

const start = (input: Input) => {
  const contract = new Contract()
  const splitEvenly = (
    accountInfo: any,
    { functionInputs }: { functionInputs: any }
  ) => {
    const { amount, recipients } = functionInputs
    return {
      success: true,
      transactions: recipients.map((recipient: string) => ({
        recipient,
        amount: Math.floor(amount / recipients.length),
      })),
    }
  }

  contract.addOrExtendMethodStrategy('splitEvenly', splitEvenly)
  return contract.start(input)
}

export default start
