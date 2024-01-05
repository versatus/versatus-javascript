import { Input } from '../../types/Input';
export declare class Contract {
    methodStrategies: {
        [key: string]: Function;
    };
    constructor();
    start(input: Input): any;
    executeMethod(accountInfo: any, contractInput: Input['contractInput']): any;
    addOrExtendMethodStrategy(methodName: string, newStrategyFn: Function, extend?: boolean): void;
}
