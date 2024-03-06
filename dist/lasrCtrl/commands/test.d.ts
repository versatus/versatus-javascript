import { Arguments, CommandBuilder } from 'yargs';
export interface TestCommandArgs {
    inputJson: string;
}
export declare const testCommandFlags: CommandBuilder<{}, TestCommandArgs>;
declare const test: (argv: Arguments<TestCommandArgs>) => Promise<void>;
export default test;
