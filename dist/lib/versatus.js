export function parseContractInput() {
    var chunkSize = 1024;
    var inputChunks = [];
    var totalBytes = 0;
    var stdInBuffer = new Uint8Array(chunkSize);
    var fdIn = 0;
    //@ts-ignore
    var bytesRead = Javy.IO.readSync(fdIn, stdInBuffer);
    totalBytes += bytesRead;
    inputChunks.push(stdInBuffer.subarray(0, bytesRead));
    var finalBuffer = inputChunks.reduce(function (context, chunk) {
        context.finalBuffer.set(chunk, context.bufferOffset);
        context.bufferOffset += chunk.length;
        return context;
    }, { bufferOffset: 0, finalBuffer: new Uint8Array(totalBytes) }).finalBuffer;
    return JSON.parse(new TextDecoder().decode(finalBuffer));
}
export function sendOutput(output) {
    var encodedOutput = new TextEncoder().encode(JSON.stringify(output));
    var stdOutBuffer = new Uint8Array(encodedOutput);
    var fd = 1;
    //@ts-ignore
    Javy.IO.writeSync(fd, stdOutBuffer);
}
