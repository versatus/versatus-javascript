[@versatus/versatus-javascript](../README.md) / [Modules](../modules.md) / [lib](../modules/lib.md) / Contract

# Class: Contract

[lib](../modules/lib.md).Contract

Class representing a Contract with methods to manage and execute contract strategies.

## Hierarchy

- **`Contract`**

  ↳ [`FungibleTokenContract`](lib.FungibleTokenContract.md)

## Table of contents

### Constructors

- [constructor](lib.Contract.md#constructor)

### Properties

- [methodStrategies](lib.Contract.md#methodstrategies)

### Methods

- [addOrExtendMethodStrategy](lib.Contract.md#addorextendmethodstrategy)
- [executeMethod](lib.Contract.md#executemethod)
- [start](lib.Contract.md#start)

## Constructors

### constructor

• **new Contract**(): [`Contract`](lib.Contract.md)

Constructs a new Contract instance.

#### Returns

[`Contract`](lib.Contract.md)

#### Defined in

[lib/contracts/Contract.ts:16](https://github.com/versatus/versatus-javascript/blob/84f84d5/lib/contracts/Contract.ts#L16)

## Properties

### methodStrategies

• **methodStrategies**: `Object`

A dictionary mapping method names to their corresponding strategy functions.

#### Index signature

▪ [key: `string`]: `Function`

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

#### Defined in

[lib/contracts/Contract.ts:54](https://github.com/versatus/versatus-javascript/blob/84f84d5/lib/contracts/Contract.ts#L54)

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

#### Defined in

[lib/contracts/Contract.ts:35](https://github.com/versatus/versatus-javascript/blob/84f84d5/lib/contracts/Contract.ts#L35)

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

#### Defined in

[lib/contracts/Contract.ts:25](https://github.com/versatus/versatus-javascript/blob/84f84d5/lib/contracts/Contract.ts#L25)
