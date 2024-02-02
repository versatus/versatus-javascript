export function bigIntToHexString(bigintValue) {
    // Convert the BigInt to a hexadecimal string
    let hexString = bigintValue.toString(16);
    // Ensure the string is 64 characters long, padding with leading zeros if necessary
    hexString = hexString.padStart(64, '0');
    // Return the properly formatted hexadecimal string with '0x' prefix
    return '0x' + hexString;
}
export function buildInitTransaction(inputs, to, from, nonce, op, programId, value = 0) {
    return {
        inputs,
        to,
        from,
        nonce,
        op,
        programId,
        transactionType: {
            call: '0x0000000000000000000000000000000000000000000000000000000000000001',
        },
        value: bigIntToHexString(BigInt(value)),
    };
}
export function buildContractInput({ accountInfo, inputs, op, initTransaction, r, s, v, }) {
    return {
        accountInfo,
        inputs,
        op,
        transaction: { ...initTransaction, r, s, v },
        programId: initTransaction.programId,
        version: 0,
    };
}
