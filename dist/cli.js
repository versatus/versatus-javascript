#!/usr/bin/env node
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import yargs from 'yargs';
import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';
import { fileURLToPath } from 'url';
var __dirname = path.dirname(fileURLToPath(import.meta.url));
var argv = yargs(process.argv.slice(2))
    .command('init [example]', 'Initialize a project with an example contract', function (yargs) {
    return yargs.positional('example', {
        describe: 'The example contract to initialize',
        type: 'string',
        choices: ['basic', 'erc-20'], // Add more example types if you have them
        demandOption: true,
        demand: 'You must specify an example contract to initialize'
    });
}, function (argv) {
    console.log("\x1b[0;33mInitializing example contract...\x1b[0m");
    // Check if the package is installed in the current project's node_modules
    var isInstalledPackage = fs.existsSync(path.resolve(process.cwd(), 'node_modules', '@versatus', 'versatus-javascript'));
    // Path to the examples directory
    var exampleDir = isInstalledPackage
        ? path.resolve(process.cwd(), 'node_modules', '@versatus', 'versatus-javascript', 'dist', 'examples', argv.example || 'basic')
        : path.resolve(__dirname, 'examples', argv.example || 'basic');
    var targetDir = process.cwd();
    var targetFilePath = path.join(targetDir, 'example-contract.js');
    // Copy the example file to the target directory
    fs.copyFileSync(path.join(exampleDir, 'example-contract.js'), targetFilePath);
    var exampleContractContent = fs.readFileSync(targetFilePath, 'utf8');
    // Update the import path for any contract class based on the environment
    var regex = /^import \{ (.*) \} from '.*';$/gm;
    exampleContractContent = exampleContractContent.replace(regex, function (match, className) {
        var importPath = isInstalledPackage
            ? "'@versatus/versatus-javascript'"
            : "'./lib/contracts/index.js'";
        return "import { ".concat(className, " } from ").concat(importPath, ";");
    });
    // Write the updated content back to the example file
    fs.writeFileSync(targetFilePath, exampleContractContent, 'utf8');
    var inputsDir = path.join(process.cwd(), 'examples', argv.example || 'basic', 'inputs');
    var targetInputsDir = path.join(targetDir, 'inputs');
    if (fs.existsSync(inputsDir)) {
        if (!fs.existsSync(targetInputsDir)) {
            fs.mkdirSync(targetInputsDir);
        }
        fs.readdirSync(inputsDir).forEach(function (file) {
            var srcFile = path.join(inputsDir, file);
            var destFile = path.join(targetInputsDir, file);
            try {
                fs.copyFileSync(srcFile, destFile);
            }
            catch (error) {
                console.error("Error copying file ".concat(srcFile, " to ").concat(destFile, ":"), error);
            }
        });
    }
    console.log("\x1b[0;32mExample contract and inputs initialized successfully.\x1b[0m");
})
    .usage('Usage: $0 build [options]')
    .command('build [file]', 'Build the project with the specified contract', function (yargs) {
    return yargs.positional('file', {
        describe: 'Contract file to include in the build',
        type: 'string',
    });
}, function (argv) {
    var isInstalledPackage = fs.existsSync(path.resolve(process.cwd(), 'node_modules', '@versatus', 'versatus-javascript'));
    var scriptDir, sysCheckScriptPath;
    if (isInstalledPackage) {
        // In an installed package environment
        scriptDir = path.resolve(process.cwd(), 'node_modules', '@versatus', 'versatus-javascript');
        sysCheckScriptPath = path.resolve(scriptDir, 'lib', 'scripts', 'sys_check.sh');
    }
    else {
        // In the development environment
        scriptDir = path.resolve(__dirname, '../');
        sysCheckScriptPath = path.resolve(scriptDir, 'lib', 'scripts', 'sys_check.sh');
    }
    console.log("Build command executed."); // Debug log
    // const sysCheckScriptPath = path.resolve(__dirname, 'lib', 'scripts', 'sys_check.sh');
    console.log("Running system check script: ".concat(sysCheckScriptPath)); // Debug log
    exec("bash \"".concat(sysCheckScriptPath, "\""), function (sysCheckError, sysCheckStdout, sysCheckStderr) {
        if (sysCheckError) {
            console.error("Error during system check: ".concat(sysCheckError));
            return;
        }
        console.log(sysCheckStdout); // Output from sys_check.sh
        if (sysCheckError) {
            console.error("Error during system check: ".concat(sysCheckError));
            return;
        }
        console.log("System check passed. Proceeding with build...");
        // Proceed with build process if system check is successful
        if (argv.file) {
            console.log("\x1b[0;33mStarting build...\x1b[0m");
            var filePath = path.resolve(process.cwd(), argv.file);
            injectFileInWrapper(filePath).then(function () {
                runBuildProcess();
            }).catch(function (error) {
                console.error('Error during the build process:', error);
            });
        }
        else {
            console.error('You must specify a contract file to build.');
            process.exit(1);
        }
    });
})
    .command('test [inputJson]', 'Run the test suite for the project', function (yargs) {
    return yargs.positional('inputJson', {
        describe: 'Path to the JSON input file for testing',
        type: 'string',
        demandOption: true, // Make this argument required
        demand: 'You must specify a JSON input file for testing'
    });
}, function (argv) {
    if (argv.inputJson) {
        console.log("\x1b[0;33mChecking and preparing WASM file...\x1b[0m");
        var scriptDir = void 0;
        if (fs.existsSync(path.resolve(__dirname, '../../../node_modules'))) {
            // In an installed package environment
            scriptDir = path.resolve(__dirname, '../');
        }
        else {
            // In the development environment
            scriptDir = process.cwd();
        }
        var checkWasmScriptPath = path.resolve(scriptDir, "lib", 'scripts', 'check_wasm.sh');
        console.log({ checkWasmScriptPath: checkWasmScriptPath });
        var execOptions = { maxBuffer: 1024 * 1024 }; // Increase buffer size to 1MB
        exec("bash \"".concat(checkWasmScriptPath, "\""), execOptions, function (checkWasmError, checkWasmStdout, checkWasmStderr) {
            if (checkWasmError) {
                console.error("Error during WASM check: ".concat(checkWasmError));
                return;
            }
            if (checkWasmStderr) {
                console.error("WASM check stderr: ".concat(checkWasmStderr));
                return;
            }
            console.log("\x1b[0;33mStarting test...\x1b[0m");
            var filePath = path.resolve(process.cwd(), argv.inputJson);
            runTestProcess(filePath);
        });
    }
    else {
        console.error('You must specify an inputJson file to test with.');
        process.exit(1);
    }
})
    .help().argv;
function injectFileInWrapper(filePath) {
    return __awaiter(this, void 0, void 0, function () {
        var projectRoot, buildPath, buildLibPath, wrapperFilePath, versatusHelpersFilepath, isInstalledPackage, wrapperModule, versatusHelpersModule, error_1, distWrapperFilePath, wrapperContent;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    projectRoot = process.cwd();
                    buildPath = path.join(projectRoot, 'build');
                    buildLibPath = path.join(projectRoot, "build", "lib");
                    // Ensure the dist directory exists
                    if (!fs.existsSync(buildPath) || !fs.existsSync(buildLibPath)) {
                        fs.mkdirSync(buildPath, { recursive: true });
                        fs.mkdirSync(buildLibPath, { recursive: true });
                    }
                    versatusHelpersFilepath = path.resolve(process.cwd(), "./lib/versatus");
                    isInstalledPackage = fs.existsSync(path.resolve(process.cwd(), 'node_modules', '@versatus', 'versatus-javascript'));
                    if (!isInstalledPackage) return [3 /*break*/, 6];
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, , 5]);
                    return [4 /*yield*/, import('@versatus/versatus-javascript/dist/lib/wrapper.js')];
                case 2:
                    wrapperModule = _a.sent();
                    return [4 /*yield*/, import('@versatus/versatus-javascript/dist/lib/versatus.js')];
                case 3:
                    versatusHelpersModule = _a.sent();
                    wrapperFilePath = wrapperModule.default;
                    versatusHelpersFilepath = versatusHelpersModule.default;
                    return [3 /*break*/, 5];
                case 4:
                    error_1 = _a.sent();
                    console.error('Error locating wrapper.js in node_modules:', error_1);
                    throw error_1;
                case 5: return [3 /*break*/, 7];
                case 6:
                    // In the development environment
                    wrapperFilePath = path.resolve(__dirname, './lib/wrapper.js');
                    versatusHelpersFilepath = path.resolve(__dirname, './lib/versatus');
                    _a.label = 7;
                case 7:
                    distWrapperFilePath = path.join(buildPath, 'lib', 'wrapper.js');
                    fs.copyFileSync(wrapperFilePath, distWrapperFilePath);
                    try {
                        wrapperContent = fs.readFileSync(distWrapperFilePath, 'utf8');
                        wrapperContent = wrapperContent.replace(/^import start from '.*';?$/m, "import start from '".concat(filePath, "';"));
                        wrapperContent = wrapperContent.replace(/from '.*versatus';?$/m, "from '".concat(versatusHelpersFilepath, ".js'"));
                        return [2 /*return*/, fs.promises.writeFile(distWrapperFilePath, wrapperContent, 'utf8')];
                    }
                    catch (error) {
                        console.error('Error updating wrapper.js in dist:', error);
                        throw error;
                    }
                    return [2 /*return*/];
            }
        });
    });
}
function runBuildProcess() {
    var projectRoot = process.cwd();
    var distPath = path.join(projectRoot, 'dist');
    var buildPath = path.join(projectRoot, 'build');
    if (!fs.existsSync(distPath)) {
        console.log("Creating the 'dist' directory...");
        fs.mkdirSync(distPath, { recursive: true });
    }
    if (!fs.existsSync(buildPath)) {
        console.log("Creating the 'dist' directory...");
        fs.mkdirSync(buildPath, { recursive: true });
    }
    var webpackConfigPath;
    if (fs.existsSync(path.resolve(__dirname, '../../../../node_modules'))) {
        // In an installed package environment
        webpackConfigPath = path.resolve(projectRoot, 'node_modules', '@versatus', 'versatus-javascript', 'lib', 'webpack.config.cjs');
    }
    else {
        // In the development environment
        webpackConfigPath = path.resolve(__dirname, '../', 'lib', 'webpack.config.cjs');
    }
    var webpackCommand = "npx webpack --config ".concat(webpackConfigPath);
    exec(webpackCommand, function (webpackError, webpackStdout, webpackStderr) {
        if (webpackError) {
            console.error("Webpack exec error: ".concat(webpackError));
            return;
        }
        console.log("Webpack stdout: ".concat(webpackStdout));
        if (webpackStderr) {
            console.error("Webpack stderr: ".concat(webpackStderr));
        }
        // Now run Javy
        var javyCommand = "javy compile ".concat(path.join(buildPath, 'bundle.js'), " -o ").concat(path.join(buildPath, 'build.wasm'));
        exec(javyCommand, function (javyError, javyStdout, javyStderr) {
            if (javyError) {
                console.error("Javy exec error: ".concat(javyError));
                return;
            }
            if (javyStderr) {
                console.error("Javy stderr: ".concat(javyStderr));
            }
        });
    });
}
function runTestProcess(inputJsonPath) {
    var scriptDir;
    if (fs.existsSync(path.resolve(__dirname, '../../../node_modules'))) {
        // In an installed package environment
        scriptDir = path.resolve(__dirname, '../');
    }
    else {
        // In the development environment
        scriptDir = process.cwd();
    }
    var checkWasmScriptPath = path.resolve(scriptDir, "lib", 'scripts', 'check_wasm.sh');
    // Execute the check-wasm.sh script
    exec("bash \"".concat(checkWasmScriptPath, "\""), function (checkWasmError, checkWasmStdout, checkWasmStderr) {
        if (checkWasmError) {
            console.error("check_wasm.sh exec error: ".concat(checkWasmError));
            return;
        }
        console.log("check-wasm.sh stdout: ".concat(checkWasmStdout));
        console.log("check-wasm.sh stderr: ".concat(checkWasmStderr));
        console.log("check-wasm.sh script executed successfully. Proceeding with test...");
        // Continue with the rest of the test process after checking WASM
        // Define the path to the test.sh script
        var testScriptPath = path.resolve(scriptDir, "lib", 'scripts', 'test.sh');
        // Execute the test.sh script with the input JSON file path as an argument
        exec("bash \"".concat(testScriptPath, "\" \"").concat(inputJsonPath, "\""), function (testError, testStdout, testStderr) {
            if (testError) {
                console.error("exec error: ".concat(testError));
                return;
            }
            if (testStdout) {
                console.log("stdout: ".concat(testStdout));
            }
            if (testStderr) {
                console.error("stderr: ".concat(testStderr));
            }
        });
    });
}
