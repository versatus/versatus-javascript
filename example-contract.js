main();

function main() {
    const parsedInputJson = parseContractInput()
    return sendOutput(parsedInputJson)
}


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
    return JSON.parse(new TextDecoder().decode(finalBuffer))
}

function sendOutput(output){
    const encodedOutput = new TextEncoder().encode(JSON.stringify(output));
    const stdOutBuffer = new Uint8Array(encodedOutput);
    const fd = 1;
    Javy.IO.writeSync(fd, stdOutBuffer);
}
