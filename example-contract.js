const start = (input) => {
  const { applicationInput } = input
  const { contractFn, amount, recipients } = applicationInput
  const methods = {
    splitEvenly: {
      success: true,
      transactions: recipients.map((recipient) => ({
        recipient,
        amount: Math.floor(amount / recipients.length),
      })),
    },
  }
  return methods[contractFn]
}

export default start
