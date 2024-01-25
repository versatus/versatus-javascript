[@versatus/versatus-javascript](../README.md) / [Modules](../modules.md) / [types](../modules/types.md) / AccountInfo

# Interface: AccountInfo

[types](../modules/types.md).AccountInfo

Contains detailed information about the account associated with a contract.

## Table of contents

### Properties

- [data](types.AccountInfo.md#data)
- [linkedPrograms](types.AccountInfo.md#linkedprograms)
- [programNamespace](types.AccountInfo.md#programnamespace)

## Properties

### data

• **data**: `string`

Additional data related to the account, potentially in a serialized format.

#### Defined in

[types/index.ts:26](https://github.com/versatus/versatus-javascript/blob/84f84d5/types/index.ts#L26)

___

### linkedPrograms

• **linkedPrograms**: [`LinkedPrograms`](types.LinkedPrograms.md)

A collection of programs linked to this account, indexed by a key.

#### Defined in

[types/index.ts:25](https://github.com/versatus/versatus-javascript/blob/84f84d5/types/index.ts#L25)

___

### programNamespace

• **programNamespace**: `string`

The namespace of the program associated with this account.

#### Defined in

[types/index.ts:24](https://github.com/versatus/versatus-javascript/blob/84f84d5/types/index.ts#L24)
