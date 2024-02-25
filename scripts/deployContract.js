import { Command } from 'commander'
import fs from 'fs'
import { exec, spawn } from 'child_process'
import util from 'util'

const program = new Command()
const execAsync = util.promisify(exec)

function runShellCommand(command) {
  return new Promise((resolve, reject) => {
    const [cmd, ...args] = command.split(/\s+/)
    const child = spawn(cmd, args, {
      shell: true,
      env: process.env,
    })

    let output = ''

    // Collect data from stdout
    child.stdout.on('data', (data) => {
      output += data.toString()
    })

    // Collect data from stderr (if you want to treat stderr as output)
    child.stderr.on('data', (data) => {
      output += data.toString()
    })

    child.on('close', (code) => {
      if (code === 0) {
        resolve(output)
      } else {
        reject(new Error(`Command failed with code ${code}\nOutput: ${output}`))
      }
    })

    child.on('error', (err) => {
      reject(err)
    })
  })
}

program
  .command('deploy')
  .description('Deploy a contract')
  .argument('<author>', 'Author of the contract')
  .argument('<name>', 'Name of the contract')
  .option('-k, --keypairPath <keypairPath>', 'Path to the keypair file')
  .option('-s, --secretKey <secretKey>', 'Secret key for deployment')
  .option('-t, --target <target>', 'Deployment target', 'node')
  .action(async (author, name, options) => {
    try {
      let secretKey = options.secretKey
      if (!secretKey) {
        console.log('NO SECRET KEY!')
        if (
          !options.keypairPath &&
          fs.existsSync('./lasr/wallet/keypair.json')
        ) {
          console.log('\x1b[0;33mInitializing wallet...\x1b[0m')
          // await initializeWallet();
        } else {
          console.log('\x1b[0;33mUsing existing keypair...\x1b[0m')
        }
        // Assuming getSecretKeyFromKeyPairFile is defined elsewhere
        const keypairPath = './.lasr/wallet/keypair.json'
        secretKey = 'your_secret_key_retrieval_logic_here' // Placeholder for actual secret key retrieval logic
      }

      console.log('\x1b[0;33mPublishing program...\x1b[0m')
      console.log('NAME NAME NAME NAME NAME')
      console.log(`NAME NAME ${name} NAME NAME`)
      console.log('NAME NAME NAME NAME NAME')

      const isWasm = options.target === 'wasm'
      process.env.LASR_RPC_URL = 'http://lasr-sharks.versatus.io:9292'
      process.env.VIPFS_ADDRESS = '167.99.20.121:5001'

      let command
      if (isWasm) {
        command = `build/versatus-wasm publish -a ${author} -n ${name} -v 0 -w build/build.wasm -r --is-srv true`
      } else {
        command = `build/lasr_cli publish --author ${author} --name ${name} --package-path build/${
          isWasm ? '' : 'lib'
        } --entrypoint build/lib/node-wrapper.js -r --remote ${
          process.env.VIPFS_ADDRESS
        } --runtime ${
          options.target
        } --content-type program --from-secret-key --secret-key "${secretKey}"`
      }

      console.log(command)

      const stdout = await runShellCommand(command)
      console.log(stdout)

      const ipfsHashMatch = stdout.match(/(bafy[a-zA-Z0-9]{44,59})/)
      if (!ipfsHashMatch)
        throw new Error('Failed to extract CID from publish output.')
      console.log(`Contract published with CID: ${ipfsHashMatch[1]}`)
      const cid = ipfsHashMatch[1]

      console.log({ cid })

      console.log('\x1b[0;33mRegistering program...\x1b[0m')
      // Assuming registerProgram is defined elsewhere
      const response = 'your_register_program_logic_here' // Placeholder for actual program registration logic
      console.log(response)
    } catch (error) {
      console.error(`Deployment error: ${error}`)
    }
  })

program.parse(process.argv)
