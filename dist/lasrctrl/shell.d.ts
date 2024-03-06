export declare function runSpawn(command: string, args: readonly string[] | undefined, options: {
    stdio: string;
}): Promise<unknown>;
export declare function runCommand(command: string): Promise<string>;
