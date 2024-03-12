import { getSecretKey, sendTokens } from '../../lasrctrl/cli-helpers.js';
import { getIPFSForNetwork, getRPCForNetwork } from '../../lib/utils.js';
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
        .option('network', {
        describe: 'network to send on',
        type: 'string',
        default: 'stable',
        options: ['stable', 'test'],
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
        const network = argv.network;
        process.env.LASR_RPC_URL = getRPCForNetwork(network);
        process.env.VIPFS_ADDRESS = getIPFSForNetwork(network);
        const sendResponse = await sendTokens(String(argv.programAddress), String(argv.recipientAddress), String(argv.amount), secretKey, network);
        console.log('sendResponse', sendResponse);
    }
    catch (error) {
        console.error(`Deployment error: ${error}`);
    }
};
export default send;
