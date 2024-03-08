# Programs
Programs in **LASR** take in JSON and return JSON. A programs sole job is to
take in the JSON passed to it by the protocol, execute whatever logic the
developer might want to execute, and then return an array of instructions.

The protocol has a limited but _POWERFUL_ set of actions it can act on that are
akin to the tried and true methods that power web2: **Create/Read/Update/Destroy**.

In LASR, we have: **CUTB**

* **Create**
* **Update**
* **Transfer**
* **Burn**

The returned instructions from your program will instruct the protocol to execute on
the instructions you're returning using your program.
