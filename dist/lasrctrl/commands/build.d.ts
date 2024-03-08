import { Arguments, CommandBuilder } from 'yargs';
export interface BuildCommandArgs {
    file: string;
    target: string;
}
export declare const buildCommandFlags: CommandBuilder<{}, BuildCommandArgs>;
declare const build: (argv: Arguments<BuildCommandArgs>) => void;
export default build;
