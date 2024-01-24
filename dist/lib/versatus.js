/**
 * Parses the input for a contract from the standard input stream.
 * @returns {any} The parsed input object from the standard input.
 * @description
 * This function reads from the standard input, collecting data in chunks, and then parses the accumulated data as JSON.
 * It assumes the data is in a format that can be directly parsed into a JSON object.
 * Note: This function uses Javy.IO for I/O operations, which is assumed to be a part of the environment.
 */
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
/**
 * Sends the provided output to the standard output stream.
 * @param {any} output - The output data to be sent.
 * @description
 * This function encodes the given output as a JSON string and writes it to the standard output.
 * It uses the TextEncoder to encode the string and Javy.IO for the I/O operation.
 * Note: This function assumes that Javy.IO is available in the environment for I/O operations.
 */
export function sendOutput(output) {
    var encodedOutput = new TextEncoder().encode(JSON.stringify(output));
    var stdOutBuffer = new Uint8Array(encodedOutput);
    var fd = 1;
    //@ts-ignore
    Javy.IO.writeSync(fd, stdOutBuffer);
}
