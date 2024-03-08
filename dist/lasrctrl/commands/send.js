import { getSecretKey, sendTokens } from '../../lasrctrl/cli-helpers.js';
import { LASR_RPC_URL, VIPFS_ADDRESS } from '../../lib/consts.js';
export const sendCommandFlags = (yargs) => {
    return yargs
        .option('programAddress', {
        describe: 'Program address to be send',
        type: 'string',
        demandOption: true,
    })
        .option('amount', {
        describe: 'Amount to be send (in verse)',
        type: 'string',
        demandOption: true,
    })
        .option('recipientAddress', {
        describe: 'Address for the initialized supply',
        type: 'string',
        demandOption: true,
    })
        .option('keypairPath', {
        describe: 'Path to the keypair file',
        type: 'string',
    })
        .option('secretKey', {
        describe: 'Secret key for the wallet',
        type: 'string',
    });
};
const send = async (argv) => {
    try {
        const secretKey = await getSecretKey(argv.keypairPath, argv.secretKey);
        process.env.LASR_RPC_URL = LASR_RPC_URL;
        process.env.VIPFS_ADDRESS = VIPFS_ADDRESS;
        const sendResponse = await sendTokens(String(argv.programAddress), String(argv.recipientAddress), String(argv.amount), secretKey);
        console.log('sendResponse', sendResponse);
    }
    catch (error) {
        console.error(`Deployment error: ${error}`);
    }
};
export default send;
