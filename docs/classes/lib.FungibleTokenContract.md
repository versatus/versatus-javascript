[@versatus/versatus-javascript](../README.md) / [Modules](../modules.md) / [lib](../modules/lib.md) / FungibleTokenContract

# Class: FungibleTokenContract

[lib](../modules/lib.md).FungibleTokenContract

Class representing a fungible token contract, extending the base `Contract` class.
It encapsulates the core functionality and properties of a fungible token.

## Hierarchy

- [`Contract`](lib.Contract.md)

  ↳ **`FungibleTokenContract`**

## Table of contents

### Constructors

- [constructor](lib.FungibleTokenContract.md#constructor)

### Properties

- [CONTRACT\_DECIMALS](lib.FungibleTokenContract.md#contract_decimals)
- [CONTRACT\_NAME](lib.FungibleTokenContract.md#contract_name)
- [CONTRACT\_SYMBOL](lib.FungibleTokenContract.md#contract_symbol)
- [CONTRACT\_TOTAL\_SUPPLY](lib.FungibleTokenContract.md#contract_total_supply)
- [methodStrategies](lib.FungibleTokenContract.md#methodstrategies)

### Methods

- [addOrExtendMethodStrategy](lib.FungibleTokenContract.md#addorextendmethodstrategy)
- [allowance](lib.FungibleTokenContract.md#allowance)
- [approve](lib.FungibleTokenContract.md#approve)
- [balanceOf](lib.FungibleTokenContract.md#balanceof)
- [decimals](lib.FungibleTokenContract.md#decimals)
- [executeMethod](lib.FungibleTokenContract.md#executemethod)
- [name](lib.FungibleTokenContract.md#name)
- [start](lib.FungibleTokenContract.md#start)
- [symbol](lib.FungibleTokenContract.md#symbol)
- [totalSupply](lib.FungibleTokenContract.md#totalsupply)
- [transfer](lib.FungibleTokenContract.md#transfer)

## Constructors

### constructor

• **new FungibleTokenContract**(`name`, `symbol`, `decimals`, `totalSupply`): [`FungibleTokenContract`](lib.FungibleTokenContract.md)

Constructs a new instance of the FungibleTokenContract class.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `name` | `string` | The name of the token. |
| `symbol` | `string` | The symbol of the token. |
| `decimals` | `number` | The number of decimals for the token. |
| `totalSupply` | `number` | The total supply of the token. |

#### Returns

[`FungibleTokenContract`](lib.FungibleTokenContract.md)

#### Overrides

[Contract](lib.Contract.md).[constructor](lib.Contract.md#constructor)

#### Defined in

[lib/contracts/FungibleTokenContract.ts:40](https://github.com/versatus/versatus-javascript/blob/84f84d5/lib/contracts/FungibleTokenContract.ts#L40)

## Properties

### CONTRACT\_DECIMALS

• **CONTRACT\_DECIMALS**: `number`

The number of decimals for the token.

#### Defined in

[lib/contracts/FungibleTokenContract.ts:25](https://github.com/versatus/versatus-javascript/blob/84f84d5/lib/contracts/FungibleTokenContract.ts#L25)

___

### CONTRACT\_NAME

• **CONTRACT\_NAME**: `string`

The name of the contract.

#### Defined in

[lib/contracts/FungibleTokenContract.ts:13](https://github.com/versatus/versatus-javascript/blob/84f84d5/lib/contracts/FungibleTokenContract.ts#L13)

___

### CONTRACT\_SYMBOL

• **CONTRACT\_SYMBOL**: `string`

The symbol of the contract.

#### Defined in

[lib/contracts/FungibleTokenContract.ts:19](https://github.com/versatus/versatus-javascript/blob/84f84d5/lib/contracts/FungibleTokenContract.ts#L19)

___

### CONTRACT\_TOTAL\_SUPPLY

• **CONTRACT\_TOTAL\_SUPPLY**: `number`

The total supply of the token.

#### Defined in

[lib/contracts/FungibleTokenContract.ts:31](https://github.com/versatus/versatus-javascript/blob/84f84d5/lib/contracts/FungibleTokenContract.ts#L31)

___

### methodStrategies

• **methodStrategies**: `Object`

A dictionary mapping method names to their corresponding strategy functions.

#### Index signature

▪ [key: `string`]: `Function`

#### Inherited from

[Contract](lib.Contract.md).[methodStrategies](lib.Contract.md#methodstrategies)

#### Defined in

[lib/contracts/Contract.ts:11](https://github.com/versatus/versatus-javascript/blob/84f84d5/lib/contracts/Contract.ts#L11)

## Methods

### addOrExtendMethodStrategy

▸ **addOrExtendMethodStrategy**(`methodName`, `newStrategyFn`, `extend?`): `void`

Adds a new strategy function to `methodStrategies` or extends an existing one.

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `methodName` | `string` | `undefined` | The name of the method for which the strategy is defined. |
| `newStrategyFn` | `Function` | `undefined` | The new strategy function to be added or used for extending. |
| `extend?` | `boolean` | `false` | Indicates whether the new strategy should extend an existing strategy (if any). |

#### Returns

`void`

**`Description`**

If `extend` is true and a strategy exists for `methodName`, the existing strategy is called first,
             and its result is passed to `newStrategyFn` along with the original parameters.

#### Inherited from

[Contract](lib.Contract.md).[addOrExtendMethodStrategy](lib.Contract.md#addorextendmethodstrategy)

#### Defined in

[lib/contracts/Contract.ts:54](https://github.com/versatus/versatus-javascript/blob/84f84d5/lib/contracts/Contract.ts#L54)

___

### allowance

▸ **allowance**(`_`, `input`): \{ `address?`: `undefined` = spender; `allowance?`: `undefined` ; `error`: `string` = 'allowances not found'; `success`: `boolean` = false } \| \{ `address`: `any` = spender; `allowance`: `any` ; `error?`: `undefined` = 'allowances not found'; `success`: `boolean` = true }

Retrieves the allowance for a given spender.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `_` | [`AccountInfo`](../interfaces/types.AccountInfo.md) | Account information (unused in this context). |
| `input` | [`Inputs`](../modules/types.md#inputs) | The input parameters, including allowances and spender. |

#### Returns

\{ `address?`: `undefined` = spender; `allowance?`: `undefined` ; `error`: `string` = 'allowances not found'; `success`: `boolean` = false } \| \{ `address`: `any` = spender; `allowance`: `any` ; `error?`: `undefined` = 'allowances not found'; `success`: `boolean` = true }

An object containing the allowance and a success flag.

#### Defined in

[lib/contracts/FungibleTokenContract.ts:113](https://github.com/versatus/versatus-javascript/blob/84f84d5/lib/contracts/FungibleTokenContract.ts#L113)

___

### approve

▸ **approve**(`_`, `input`): \{ `approvals`: `undefined` ; `error`: `string` = 'approvals not found'; `success`: `boolean` = false } \| \{ `approvals`: `any` ; `error?`: `undefined` = 'allowances not found'; `success`: `boolean` = true }

Approves a spender to withdraw from an account up to a certain amount.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `_` | [`AccountInfo`](../interfaces/types.AccountInfo.md) | Account information (unused in this context). |
| `input` | [`Inputs`](../modules/types.md#inputs) | The input parameters, including spender, amount, and approvals. |

#### Returns

\{ `approvals`: `undefined` ; `error`: `string` = 'approvals not found'; `success`: `boolean` = false } \| \{ `approvals`: `any` ; `error?`: `undefined` = 'allowances not found'; `success`: `boolean` = true }

An object containing the updated approvals and a success flag.

#### Defined in

[lib/contracts/FungibleTokenContract.ts:131](https://github.com/versatus/versatus-javascript/blob/84f84d5/lib/contracts/FungibleTokenContract.ts#L131)

___

### balanceOf

▸ **balanceOf**(`_`, `input`): `Object`

Retrieves the balance of a given account.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `_` | [`AccountInfo`](../interfaces/types.AccountInfo.md) | Account information (unused in this context). |
| `input` | [`Inputs`](../modules/types.md#inputs) | The input parameters, including balance and owner ID. |

#### Returns

`Object`

An object containing the balance and a success flag.

| Name | Type |
| :------ | :------ |
| `address` | `any` |
| `balance` | `any` |
| `success` | `boolean` |

#### Defined in

[lib/contracts/FungibleTokenContract.ts:102](https://github.com/versatus/versatus-javascript/blob/84f84d5/lib/contracts/FungibleTokenContract.ts#L102)

___

### decimals

▸ **decimals**(): `Object`

Retrieves the number of decimals for the token.

#### Returns

`Object`

An object containing the number of decimals and a success flag.

| Name | Type |
| :------ | :------ |
| `decimals` | `number` |
| `success` | `boolean` |

#### Defined in

[lib/contracts/FungibleTokenContract.ts:84](https://github.com/versatus/versatus-javascript/blob/84f84d5/lib/contracts/FungibleTokenContract.ts#L84)

___

### executeMethod

▸ **executeMethod**(`input`): `any`

Executes a contract method strategy based on the given input.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `input` | [`ContractInput`](../interfaces/types.ContractInput.md) | The input data for the contract method, including account information and method-specific inputs. |

#### Returns

`any`

The result of the strategy execution.

**`Throws`**

Will throw an error if the method name specified in `input` is not found in `methodStrategies`.

#### Inherited from

[Contract](lib.Contract.md).[executeMethod](lib.Contract.md#executemethod)

#### Defined in

[lib/contracts/Contract.ts:35](https://github.com/versatus/versatus-javascript/blob/84f84d5/lib/contracts/Contract.ts#L35)

___

### name

▸ **name**(): `Object`

Retrieves the contract name.

#### Returns

`Object`

An object containing the contract name and a success flag.

| Name | Type |
| :------ | :------ |
| `name` | `string` |
| `success` | `boolean` |

#### Defined in

[lib/contracts/FungibleTokenContract.ts:68](https://github.com/versatus/versatus-javascript/blob/84f84d5/lib/contracts/FungibleTokenContract.ts#L68)

___

### start

▸ **start**(`input`): `any`

Initiates the execution of a contract method based on the provided input.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `input` | [`ContractInput`](../interfaces/types.ContractInput.md) | The input data required to execute a contract method. |

#### Returns

`any`

The result of executing the contract method.

#### Inherited from

[Contract](lib.Contract.md).[start](lib.Contract.md#start)

#### Defined in

[lib/contracts/Contract.ts:25](https://github.com/versatus/versatus-javascript/blob/84f84d5/lib/contracts/Contract.ts#L25)

___

### symbol

▸ **symbol**(): `Object`

Retrieves the contract symbol.

#### Returns

`Object`

An object containing the contract symbol and a success flag.

| Name | Type |
| :------ | :------ |
| `success` | `boolean` |
| `symbol` | `string` |

#### Defined in

[lib/contracts/FungibleTokenContract.ts:76](https://github.com/versatus/versatus-javascript/blob/84f84d5/lib/contracts/FungibleTokenContract.ts#L76)

___

### totalSupply

▸ **totalSupply**(): `Object`

Retrieves the total supply of the token.

#### Returns

`Object`

An object containing the total supply and a success flag.

| Name | Type |
| :------ | :------ |
| `success` | `boolean` |
| `totalSupply` | `number` |

#### Defined in

[lib/contracts/FungibleTokenContract.ts:92](https://github.com/versatus/versatus-javascript/blob/84f84d5/lib/contracts/FungibleTokenContract.ts#L92)

___

### transfer

▸ **transfer**(`_`, `input`): \{ `balances`: `undefined` ; `error`: `string` = 'balance not found'; `success`: `boolean` = false } \| \{ `balances`: {} ; `error?`: `undefined` = 'allowances not found'; `success`: `boolean` = true }

Transfers a specified amount of tokens to a specified recipient.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `_` | [`AccountInfo`](../interfaces/types.AccountInfo.md) | Account information (unused in this context). |
| `input` | [`Inputs`](../modules/types.md#inputs) | The input parameters, including amount, owner address, balance, recipient address, and recipient balance. |

#### Returns

\{ `balances`: `undefined` ; `error`: `string` = 'balance not found'; `success`: `boolean` = false } \| \{ `balances`: {} ; `error?`: `undefined` = 'allowances not found'; `success`: `boolean` = true }

An object containing the updated balances and a success flag.

#### Defined in

[lib/contracts/FungibleTokenContract.ts:148](https://github.com/versatus/versatus-javascript/blob/84f84d5/lib/contracts/FungibleTokenContract.ts#L148)
