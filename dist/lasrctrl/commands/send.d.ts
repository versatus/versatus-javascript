import { Arguments, CommandBuilder } from 'yargs';
export interface SendCommandArgs {
    programAddress: string;
    recipientAddress: string;
    amount: string;
    network: string;
    keypairPath?: string;
    secretKey?: string;
}
export declare const sendCommandFlags: CommandBuilder<{}, SendCommandArgs>;
declare const send: (argv: Arguments<SendCommandArgs>) => Promise<void>;
export default send;
