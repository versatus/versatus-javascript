#!/usr/bin/env node

const yargs = require('yargs')
const fs = require('fs')
const path = require('path')
const { exec } = require('child_process')

const argv = yargs(process.argv.slice(2))
  .usage('Usage: $0 build [options]')
  .command(
    'build [file]',
    'Build the project with the specified contract',
    (yargs) => {
      return yargs.positional('file', {
        describe: 'Contract file to include in the build',
        type: 'string',
      })
    },
    (argv) => {
      if (argv.file) {
        const filePath = path.resolve(process.cwd(), argv.file)
        injectFileInWrapper(filePath)
          .then(() => {
            runBuildProcess()
          })
          .catch((error) => {
            console.error('Error during the build process:', error)
          })
      } else {
        console.error('You must specify a contract file to build.')
        process.exit(1)
      }
    }
  )
  .help().argv

function injectFileInWrapper(filePath) {
  const wrapperFilePath = path.resolve(
    __dirname,
    'lib',
    'wrapper.js'
  )
  let wrapperContent = fs.readFileSync(wrapperFilePath, 'utf8')

  // Here we assume you have an import line to replace, adjust the regex as needed
  wrapperContent = wrapperContent.replace(
    /import start from '.*';/g,
    `import start from '${filePath}';`
  )

  return fs.promises.writeFile(wrapperFilePath, wrapperContent, 'utf8')
}

function runBuildProcess() {
  exec('npm run build', (error, stdout, stderr) => {
    if (error) {
      console.error(`exec error: ${error}`)
      return
    }
    if (stderr) {
      console.error(`stderr: ${stderr}`)
      return
    }
    console.log(`stdout: ${stdout}`)
  })
}
