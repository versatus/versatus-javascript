/**
 * Parses the input for a contract from the standard input stream.
 * @returns {any} The parsed input object from the standard input.
 * @description
 * This function reads from the standard input, collecting data in chunks, and then parses the accumulated data as JSON.
 * It assumes the data is in a format that can be directly parsed into a JSON object.
 * Note: This function uses Javy.IO for I/O operations, which is assumed to be a part of the environment.
 */
export function parseContractInput() {
  const chunkSize = 1024
  const inputChunks = []
  let totalBytes = 0
  const stdInBuffer = new Uint8Array(chunkSize)
  const fdIn = 0
  //@ts-ignore
  const bytesRead = Javy.IO.readSync(fdIn, stdInBuffer)
  totalBytes += bytesRead
  inputChunks.push(stdInBuffer.subarray(0, bytesRead))
  const { finalBuffer } = inputChunks.reduce(
    (context, chunk) => {
      context.finalBuffer.set(chunk, context.bufferOffset)
      context.bufferOffset += chunk.length
      return context
    },
    { bufferOffset: 0, finalBuffer: new Uint8Array(totalBytes) }
  )
  return JSON.parse(new TextDecoder().decode(finalBuffer))
}

/**
 * Sends the provided output to the standard output stream.
 * @param {any} output - The output data to be sent.
 * @description
 * This function encodes the given output as a JSON string and writes it to the standard output.
 * It uses the TextEncoder to encode the string and Javy.IO for the I/O operation.
 * Note: This function assumes that Javy.IO is available in the environment for I/O operations.
 */
export function sendOutput(output: any) {
  const encodedOutput = new TextEncoder().encode(JSON.stringify(output))
  const stdOutBuffer = new Uint8Array(encodedOutput)
  const fd = 1
  //@ts-ignore
  Javy.IO.writeSync(fd, stdOutBuffer)
}
