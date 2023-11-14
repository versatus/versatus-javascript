const start = input => {
    const { contractFn, amount, recipients } = input;
    const methods = {
        'splitEvenly': {
            transactions: recipients.map(recipient => ({ recipient, amount: Math.floor(amount / recipients.length) }))
        }
    }
    return methods[contractFn]
}

export default start;
