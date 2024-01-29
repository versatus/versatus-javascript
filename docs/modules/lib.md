[@versatus/versatus-javascript](../README.md) / [Modules](../modules.md) / lib

# Module: lib

## Table of contents

### Classes

- [Contract](../classes/lib.Contract.md)
- [FungibleTokenContract](../classes/lib.FungibleTokenContract.md)

### Functions

- [parseContractInput](lib.md#parsecontractinput)
- [sendOutput](lib.md#sendoutput)

## Functions

### parseContractInput

▸ **parseContractInput**(): `any`

Parses the input for a contract from the standard input stream.

#### Returns

`any`

The parsed input object from the standard input.

**`Description`**

This function reads from the standard input, collecting data in chunks, and then parses the accumulated data as JSON.
It assumes the data is in a format that can be directly parsed into a JSON object.
Note: This function uses Javy.IO for I/O operations, which is assumed to be a part of the environment.

#### Defined in

[lib/versatus.ts:9](https://github.com/versatus/versatus-javascript/blob/84f84d5/lib/versatus.ts#L9)

___

### sendOutput

▸ **sendOutput**(`output`): `void`

Sends the provided output to the standard output stream.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `output` | `any` | The output data to be sent. |

#### Returns

`void`

**`Description`**

This function encodes the given output as a JSON string and writes it to the standard output.
It uses the TextEncoder to encode the string and Javy.IO for the I/O operation.
Note: This function assumes that Javy.IO is available in the environment for I/O operations.

#### Defined in

[lib/versatus.ts:38](https://github.com/versatus/versatus-javascript/blob/84f84d5/lib/versatus.ts#L38)
