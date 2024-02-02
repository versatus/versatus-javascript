import { AddressOrNamespace, StatusValue, TokenOrProgramUpdate } from './utils'
import { Token, TokenFieldValues } from '../types'
import Address from './Address'
import { ApprovalsExtend, ApprovalsValue } from './Approvals'

export class TokenMetadataInsert {
  private key: string
  private value: string

  constructor(key: string, value: string) {
    this.key = key
    this.value = value
  }

  toJson(): object {
    return { insert: [this.key, this.value] }
  }
}

export class TokenMetadataExtend {
  private map: Record<string, string>

  constructor(map: Record<string, string>) {
    this.map = map
  }

  toJson(): object {
    return { extend: this.map }
  }
}

export class TokenMetadataRemove {
  private key: string

  constructor(key: string) {
    this.key = key
  }

  toJson(): object {
    return { remove: this.key }
  }
}

export class TokenMetadataValue {
  private value: TokenMetadataInsert | TokenMetadataExtend | TokenMetadataRemove

  constructor(
    value: TokenMetadataInsert | TokenMetadataExtend | TokenMetadataRemove
  ) {
    this.value = value
  }

  toJson(): object {
    return { metadata: this.value.toJson() }
  }
}

export class TokenIdPush {
  private value: BigInt

  constructor(value: BigInt) {
    this.value = value
  }

  toJson(): object {
    return { push: this.value.toString() }
  }
}

export class TokenIdExtend {
  private items: BigInt[]

  constructor(items: BigInt[]) {
    this.items = items
  }

  toJson(): object {
    return { extend: this.items.map((item) => item.toString()) }
  }
}

export class TokenIdInsert {
  private key: number
  private value: BigInt

  constructor(key: number, value: BigInt) {
    this.key = key
    this.value = value
  }

  toJson(): object {
    return { insert: [this.key, this.value.toString()] }
  }
}

export class TokenIdPop {
  toJson(): object {
    return { pop: {} }
  }
}

export class TokenIdRemove {
  private key: BigInt

  constructor(key: BigInt) {
    this.key = key
  }

  toJson(): object {
    return { remove: this.key.toString() }
  }
}

export class TokenIdValue {
  private value:
    | TokenIdPush
    | TokenIdExtend
    | TokenIdInsert
    | TokenIdPop
    | TokenIdRemove

  constructor(
    value:
      | TokenIdPush
      | TokenIdExtend
      | TokenIdInsert
      | TokenIdPop
      | TokenIdRemove
  ) {
    this.value = value
  }

  toJson(): object {
    return { tokenIds: this.value.toJson() }
  }
}

export class TokenDataInsert {
  private key: string
  private value: string

  constructor(key: string, value: string) {
    this.key = key
    this.value = value
  }

  toJson(): object {
    return { insert: [this.key, this.value] }
  }
}

export class TokenDataExtend {
  private map: Record<string, string>

  constructor(map: Record<string, string>) {
    this.map = map
  }

  toJson(): object {
    return { extend: this.map }
  }
}

export class TokenDataRemove {
  private key: string

  constructor(key: string) {
    this.key = key
  }

  toJson(): object {
    return { remove: this.key }
  }
}

export class TokenDataValue {
  private value: TokenDataInsert | TokenDataExtend | TokenDataRemove

  constructor(value: TokenDataInsert | TokenDataExtend | TokenDataRemove) {
    this.value = value
  }

  toJson(): object {
    return { data: this.value.toJson() }
  }
}

export class TokenFieldValue {
  private kind: string
  private value:
    | TokenDataValue
    | TokenMetadataExtend
    | StatusValue
    | ApprovalsValue
    | ApprovalsExtend

  constructor(
    kind: string,
    value:
      | TokenDataValue
      | TokenMetadataExtend
      | StatusValue
      | ApprovalsValue
      | ApprovalsExtend
  ) {
    this.kind = kind
    this.value = value
  }

  toJson(): object {
    return { [this.kind]: this.value.toJson() }
  }
}

export class TokenField {
  private value: TokenFieldValues

  constructor(value: TokenFieldValues) {
    this.value = value
  }

  toJson(): string {
    return this.value
  }
}

export class TokenUpdateField {
  private field: TokenField
  private value: TokenFieldValue

  constructor(field: TokenField, value: TokenFieldValue) {
    this.field = field
    this.value = value
  }

  toJson(): object {
    return {
      field: this.field.toJson(),
      value: this.value.toJson(),
    }
  }
}

export class TokenUpdate {
  private account: AddressOrNamespace | null
  private token: AddressOrNamespace | null
  private updates: TokenUpdateField[]

  constructor(
    account: AddressOrNamespace | null,
    token: AddressOrNamespace | null,
    updates: TokenUpdateField[]
  ) {
    this.account = account
    this.token = token
    this.updates = updates
  }

  toJson(): object {
    return {
      account: this.account?.toJson() ?? null,
      token: this.token?.toJson() ?? null,
      updates: this.updates.map((update) => update.toJson()),
    }
  }
}

export class TokenDistribution {
  private programId: AddressOrNamespace | null
  private to: AddressOrNamespace | null
  private amount: string | null
  private tokenIds: string[]
  private updateFields: TokenUpdateField[]

  constructor(
    programId: AddressOrNamespace | null,
    to: AddressOrNamespace | null,
    amount: string | null,
    tokenIds: string[],
    updateFields: TokenUpdateField[]
  ) {
    this.programId = programId
    this.to = to
    this.amount = amount
    this.tokenIds = tokenIds
    this.updateFields = updateFields
  }

  toJson(): object {
    return {
      programId: this.programId,
      to: this.to,
      amount: this.amount === null ? null : this.amount,
      tokenIds: this.tokenIds.map((item) => item),
      updateFields: this.updateFields.map((field) => field as TokenUpdateField),
    }
  }
}
