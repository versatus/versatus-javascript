"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var example_contract_1 = __importDefault(require("../examples/basic/example-contract"));
var versatus_1 = require("./versatus");
function main() {
    var input = (0, versatus_1.parseContractInput)();
    var result = (0, example_contract_1.default)(input);
    (0, versatus_1.sendOutput)(result);
}
main();
