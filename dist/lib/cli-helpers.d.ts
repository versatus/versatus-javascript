export interface InitCommandArgs {
    example: string;
    target?: string;
}
export interface BuildCommandArgs {
    file?: string;
    target: string;
}
export interface TestCommandArgs {
    inputJson: string;
}
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
export interface SendCommandArgs {
    programAddress: string;
    recipientAddress: string;
    amount: string;
    keypairPath?: string;
    secretKey?: string;
}
export interface CallCommandArgs {
    programAddress: string;
    op: string;
    inputs: string;
    keypairPath?: string;
    secretKey?: string;
}
export declare const isInstalledPackage: boolean;
export declare const isTypeScriptProject: () => boolean;
export declare const installedPackagePath: string;
export declare function copyDirectory(src: string, dest: string): void;
export declare function buildNode(buildPath: string): Promise<void>;
export declare function getSecretKeyFromKeyPairFile(keypairFilePath: string): Promise<string>;
export declare function registerProgram(cid: string, secretKey: string): Promise<string>;
export declare const getSecretKey: (secretKeyPath?: string, secretKey?: string) => Promise<string>;
export declare function callCreate(programAddress: string, symbol: string, name: string, initializedSupply: string, totalSupply: string, recipientAddress: string, secretKey: string, inputs?: string): Promise<string>;
export declare function sendTokens(programAddress: string, recipientAddress: string, amount: string, secretKey: string): Promise<string>;
export declare function callProgram(programAddress: string, op: string, inputs: string, secretKey: string): Promise<string>;
export declare function publishProgram(author: string, name: string, target: string | undefined, secretKey: string): Promise<string>;
export declare function injectFileInWrapper(filePath: string, target?: string): Promise<void>;
export declare function runTestProcess(inputJsonPath: string, target?: string): Promise<unknown>;
export declare function initializeWallet(): Promise<void>;
export declare function checkWallet(keypairPath: string): Promise<void>;
