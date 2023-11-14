// Import necessary modules
const fs = require('fs');
const acorn = require('acorn');
const {generate} = require("escodegen");
const {traverse} = require("estraverse");

function createParseContractInputFunction() {
    const parseContractInputString = `
        function parseContractInput() {
            const chunkSize = 1024;
            const inputChunks = [];
            let totalBytes = 0;
            const stdInBuffer = new Uint8Array(chunkSize);
            const fdIn = 0;
            const bytesRead = Javy.IO.readSync(fdIn, stdInBuffer);
            totalBytes += bytesRead;
            inputChunks.push(stdInBuffer.subarray(0, bytesRead));
            const { finalBuffer } = inputChunks.reduce((context, chunk) => {
                context.finalBuffer.set(chunk, context.bufferOffset);
                context.bufferOffset += chunk.length;
                return context;
            }, { bufferOffset: 0, finalBuffer: new Uint8Array(totalBytes) });
            return JSON.parse(new TextDecoder().decode(finalBuffer));
        }
    `;

    return acorn.parse(parseContractInputString, {
        sourceType: 'script'
    }).body[0]; // Assuming parseContractInput is the first (and only) declaration in the string
}

function createSendOutputFunction() {
    const sendOutputString = `
        function sendOutput(output) {
            const encodedOutput = new TextEncoder().encode(JSON.stringify(output));
            const stdOutBuffer = new Uint8Array(encodedOutput);
            const fd = 1;
            Javy.IO.writeSync(fd, stdOutBuffer);
        }
    `;

    return acorn.parse(sendOutputString, {
        sourceType: 'script'
    }).body[0]; // Assuming sendOutput is the first (and only) declaration in the string
}



function wrapScriptWithFunction(ast, originalExport) {
    // Define the sendOutput function within the wrapped function
    const parseContractInputFunction = createParseContractInputFunction()
    const sendOutputFunction = createSendOutputFunction()

    const wrapperFunction = {
        type: 'FunctionDeclaration',
        id: {
            type: 'Identifier',
            name: 'wrappedFunction'
        },
        params: [],
        body: {
            type: 'BlockStatement',
            body: [
                parseContractInputFunction,
                sendOutputFunction,
                {
                    type: 'ReturnStatement',
                    argument: {
                        type: 'CallExpression',
                        callee: {
                            type: 'Identifier',
                            name: 'sendOutput'
                        },
                        arguments: [
                            {
                                type: 'CallExpression',
                                callee: originalExport,
                                arguments: [
                                    {
                                        type: 'CallExpression',
                                        callee: {
                                            type: 'Identifier',
                                            name: 'parseContractInput'
                                        },
                                        arguments: [] // Add arguments if necessary for parseContractInput
                                    }
                                ]
                            }
                        ]
                    }
                }
            ]
        }
    };

    ast.body = [wrapperFunction];
}


function parseJavaScriptFile(filePath) {
    // Read the file contents
    fs.readFile(filePath, 'utf8', (err, code) => {
        if (err) {
            console.error("Error reading the file:", err);
            return;
        }

        try {
            // Parse the code using Acorn
            const ast = acorn.parse(code, {
                // You can specify options here (e.g., sourceType: 'module')
                sourceType: 'module',
                ecmaVersion: 2020
            });

            // Inject custom functions into AST
            // injectFunctions(ast);

            // Find the default export in the original script
            let originalExport = null;
            let newBody = [];
            traverse(ast, {
                enter: (node, parent) => {
                    if (node.type === 'ExportDefaultDeclaration') {
                        originalExport = node.declaration;
                    } else {
                        // Keep all other nodes
                        if (parent) {
                            newBody.push(node);
                        }
                    }
                }
            });

            if (!originalExport) {
                console.error("No default export found in the script.");
                return;
            }

            ast.body = newBody;

            // Wrap the script with the new function
            wrapScriptWithFunction(ast, originalExport);

            // Generate the modified JavaScript code
            const modifiedCode = generate(ast);

            // Log or process the AST
            console.log(JSON.stringify(modifiedCode));
        } catch (parseErr) {
            console.error("Error parsing the file:", parseErr);
        }
    });
}

// Replace 'path/to/your/file.js' with the path to the JavaScript file you want to parse
parseJavaScriptFile('./example-contract.js');

