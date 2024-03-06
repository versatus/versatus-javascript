import { Arguments, CommandBuilder } from 'yargs';
export interface DeployCommandArgs {
    author: string;
    name: string;
    symbol: string;
    programName: string;
    initializedSupply: string;
    totalSupply: string;
    recipientAddress: string;
    inputs?: string;
    keypairPath?: string;
    secretKey?: string;
    target?: string;
}
export declare const deployCommandFlags: CommandBuilder<{}, DeployCommandArgs>;
declare const deploy: (argv: Arguments<DeployCommandArgs>) => Promise<void>;
export default deploy;
