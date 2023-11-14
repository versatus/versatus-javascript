const start = input => {
    const applicationInput = input.applicationInput;
    const { contractFn, amount, recipients } = applicationInput;
    const methods = {
        'splitEvenly': {
            transactions: recipients.map(recipient => ({ recipient, amount: Math.floor(amount / recipients.length) }))
        }
    }
    return methods[contractFn]
}

export default start;
