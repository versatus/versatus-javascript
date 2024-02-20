import Address from './Address'
import { Namespace } from './Namespace'
import { U256 } from './U256'
import { TokenUpdate } from './Token'
import { ProgramUpdate } from './Program'

export class AddressOrNamespace {
  private static readonly THIS = 'this'
  private value: Address | Namespace | string

  constructor(value: Address | Namespace | 'this') {
    this.value = value
  }

  toJson(): object | string {
    if (
      (typeof this.value !== 'string' &&
        this.value.toJson() === AddressOrNamespace.THIS) ||
      this.value === AddressOrNamespace.THIS
    ) {
      return 'this'
    } else if (this.value instanceof Address) {
      return { address: (this.value as Address).toJson() }
    } else if (this.value instanceof Namespace) {
      return { namespace: (this.value as Namespace).toJson() }
    } else {
      return this.value
    }
  }
}

export class Credit {
  private value: U256

  constructor(value: U256) {
    this.value = value
  }

  toJson(): object {
    return { credit: this.value.toHex() }
  }
}

export class Debit {
  private value: U256

  constructor(value: U256) {
    this.value = value
  }

  toJson(): object {
    return { debit: this.value.toHex() }
  }
}

export class BalanceValue {
  private value: AddressOrNamespace | U256

  constructor(value: AddressOrNamespace | U256) {
    this.value = value
  }

  toJson(): object {
    return { balance: (this.value as AddressOrNamespace | U256).toJson() }
  }
}

export class StatusValue {
  private value: string // Assuming value is a string

  constructor(value: string) {
    this.value = value
  }

  toJson(): object {
    return { statusValue: this.value }
  }
}

export class TokenOrProgramUpdate {
  private kind: string
  private value: TokenUpdate | ProgramUpdate

  constructor(kind: string, value: TokenUpdate | ProgramUpdate) {
    this.kind = kind
    this.value = value
  }

  toJson(): object {
    return { [this.kind]: this.value.toJson() }
  }
}
