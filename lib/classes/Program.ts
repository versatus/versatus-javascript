import Address from './Address'
import { AddressOrNamespace, StatusValue } from './utils'
import { ProgramUpdateValueTypes } from '../types'

export class LinkedProgramsInsert {
  private key: Address

  constructor(key: Address) {
    this.key = key
  }

  toJson(): object {
    return { insert: this.key.toJson() }
  }
}

export class LinkedProgramsExtend {
  private items: Address[]

  constructor(items: Address[]) {
    this.items = items
  }

  toJson(): object {
    return { extend: this.items.map((item) => item.toJson()) }
  }
}

export class LinkedProgramsRemove {
  private key: Address

  constructor(key: Address) {
    this.key = key
  }

  toJson(): object {
    return { remove: this.key.toJson() }
  }
}

export class LinkedProgramsValue {
  private value:
    | LinkedProgramsInsert
    | LinkedProgramsExtend
    | LinkedProgramsRemove

  constructor(
    value: LinkedProgramsInsert | LinkedProgramsExtend | LinkedProgramsRemove
  ) {
    this.value = value
  }

  toJson(): object {
    return { linkedPrograms: { linkedProgramValue: this.value.toJson() } }
  }
}

export class ProgramMetadataInsert {
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

export class ProgramMetadataExtend {
  private map: Record<string, string>

  constructor(map: Record<string, string>) {
    this.map = map
  }

  toJson(): object {
    return { extend: this.map }
  }
}

export class ProgramMetadataRemove {
  private key: string

  constructor(key: string) {
    this.key = key
  }

  toJson(): object {
    return { remove: this.key }
  }
}

export class ProgramMetadataValue {
  private value:
    | ProgramMetadataInsert
    | ProgramMetadataExtend
    | ProgramMetadataRemove

  constructor(
    value: ProgramMetadataInsert | ProgramMetadataExtend | ProgramMetadataRemove
  ) {
    this.value = value
  }

  toJson(): object {
    return { metadata: this.value.toJson() }
  }
}

export class ProgramDataInsert {
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

export class ProgramDataExtend {
  private map: Record<string, string>

  constructor(map: Record<string, string>) {
    this.map = map
  }

  toJson(): object {
    return { extend: this.map }
  }
}

export class ProgramDataRemove {
  private key: string

  constructor(key: string) {
    this.key = key
  }

  toJson(): object {
    return { remove: this.key }
  }
}

export class ProgramDataValue {
  private value: ProgramDataInsert | ProgramDataExtend | ProgramDataRemove

  constructor(
    value: ProgramDataInsert | ProgramDataExtend | ProgramDataRemove
  ) {
    this.value = value
  }

  toJson(): object {
    return { data: this.value.toJson() }
  }
}

export class ProgramFieldValue {
  private kind: string
  private value: ProgramUpdateValueTypes

  constructor(
    kind: string,
    value:
      | ProgramDataValue
      | ProgramMetadataValue
      | ProgramMetadataInsert
      | ProgramMetadataExtend
      | ProgramMetadataRemove
      | StatusValue
  ) {
    this.kind = kind
    this.value = value
  }

  toJson(): object {
    return { [this.kind]: this.value.toJson() }
  }
}

export class ProgramField {
  private value: string

  constructor(value: string) {
    this.value = value
  }

  toJson(): string {
    return this.value
  }
}

export class ProgramUpdateField {
  private field: ProgramField
  private value: ProgramFieldValue

  constructor(field: ProgramField, value: ProgramFieldValue) {
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

export class ProgramUpdate {
  private account: AddressOrNamespace
  private updates: ProgramUpdateField[]

  constructor(account: AddressOrNamespace, updates: ProgramUpdateField[]) {
    this.account = account
    this.updates = updates
  }

  toJson(): object {
    return {
      account: this.account.toJson(),
      updates: this.updates.map((update) => update.toJson()),
    }
  }
}
