# Programs
Programs in **LASR** take in JSON and return JSON. A programs sole job is to
take in the JSON passed to it by the protocol, execute whatever logic the
developer might want to execute, and then return an array of instructions for the 
protocol to act on.

The protocol has a limited but _POWERFUL_ set of actions it can act on that are
akin to the tried and true methods that power web2: **Create/Read/Update/Destroy**.

In LASR, we have: **CUTB**

* **Create**
* **Update**
* **Transfer**
* **Burn**

The returned instructions from your program will instruct the protocol to execute on
the instructions you're returning using your program.

## Getting Started With Writing a Program
A good place to start would be to use one of the example programs provided in the
`examples` directory.  These programs are written in TypeScript and are a good starting
point for understanding how to write a program.

You can also initialize a new project with the `lasrctl` command line tool.  This will
create an example program and input JSON files for testing at the root of the project.

```bash
npx lasrctl init # Choose blank, fungible, non-fungible or faucet
```
