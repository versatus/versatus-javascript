import { callProgram, getSecretKey } from '../../lasrCtrl/cli-helpers.js';
import { LASR_RPC_URL, VIPFS_ADDRESS } from '../../lib/consts.js';
export const callCommandFlags = (yargs) => {
    return yargs
        .option('programAddress', {
        describe: 'Program address to be send',
        type: 'string',
        demandOption: true,
    })
        .option('op', {
        describe: 'Operation to be performed by the program',
        type: 'string',
        demandOption: true,
    })
        .option('inputs', {
        describe: 'Input json required by the operation',
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
const call = async (argv) => {
    try {
        const secretKey = await getSecretKey(argv.keypairPath, argv.secretKey);
        process.env.LASR_RPC_URL = LASR_RPC_URL;
        process.env.VIPFS_ADDRESS = VIPFS_ADDRESS;
        const sendResponse = await callProgram(String(argv.programAddress), String(argv.op), String(argv.inputs), secretKey);
        console.log('sendResponse', sendResponse);
    }
    catch (error) {
        console.error(`Deployment error: ${error}`);
    }
};
export default call;
