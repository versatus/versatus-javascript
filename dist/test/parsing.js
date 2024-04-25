import { formatAmountToHex, parseAmountToBigInt, } from '../index.js';
import { formatVerse } from '../lib/utils.js';
// console.log('PARSE VERSE')
// console.log()
// console.log('0')
// console.log(parseAmountToBigInt(0))
// console.log(parseAmountToBigInt('0'))
// console.log()
// console.log('0.000001')
// console.log(parseAmountToBigInt(0.000001))
// console.log(parseAmountToBigInt('0.000001'))
// console.log()
// console.log('1')
// console.log(parseAmountToBigInt(1))
// console.log(parseAmountToBigInt('1'))
// console.log()
// console.log('1.1234123')
// console.log(parseAmountToBigInt(1.1234123))
// console.log(parseAmountToBigInt('1.1234123'))
// console.log()
// console.log(
//   '0x0000000000000000000000000000000000000000000000000000000000000001'
// )
// console.log(
//   parseAmountToBigInt(
//     '0x0000000000000000000000000000000000000000000000000000000000000001'
//   )
// )
// const inputValue = formatHexToAmount(
//   '0x00000000000000000000000000000000000000000000cd67ce2c6fbd8a400000'
// )
console.log(formatVerse('0x00000000000000000000000000000000000000000000cd67ce2c6fbd8a400000'));
const inputValue = formatAmountToHex('1');
console.log({ inputValue });
const conversionRate = parseAmountToBigInt('1');
console.log(conversionRate);
console.log('returned', formatVerse(formatVerse(BigInt(inputValue.toString()) * BigInt(conversionRate.toString()))));
const returnedValue = BigInt(BigInt(inputValue.toString()) * BigInt(conversionRate.toString())).toString(10);
console.log(returnedValue);
