#!/usr/bin/env node
export declare const __dirname: string;
export declare function runBuildProcess(target?: string): Promise<void>;
export declare function injectFileInWrapper(filePath: string, target?: string): Promise<void>;
export declare function buildWasm(buildPath: string): Promise<void>;
