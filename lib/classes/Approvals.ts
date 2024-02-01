import Address from './Address'
import { U256 } from './U256'

export class ApprovalsInsert {
  private key: Address
  private value: U256[]

  constructor(key: Address, value: U256[]) {
    this.key = key
    this.value = value
  }

  toJson(): object {
    return {
      insert: [this.key.toJson(), this.value.map((inner) => inner.toJson())],
    }
  }
}

export class ApprovalsExtend {
  private items: Array<[Address, U256]>

  constructor(items: Array<[Address, U256]>) {
    this.items = items
  }

  toJson(): object {
    return {
      extend: this.items.map((item) => [item[0].toJson(), item[1].toJson()]),
    }
  }
}

export class ApprovalsRemove {
  private key: Address
  private items: U256[]

  constructor(key: Address, items: U256[]) {
    this.key = key
    this.items = items
  }

  toJson(): object {
    return {
      remove: [this.key.toJson(), this.items.map((inner) => inner.toJson())],
    }
  }
}

export class ApprovalsRevoke {
  private key: Address

  constructor(key: Address) {
    this.key = key
  }

  toJson(): object {
    return { revoke: this.key.toJson() }
  }
}

export class ApprovalsValue {
  private value:
    | ApprovalsInsert
    | ApprovalsExtend
    | ApprovalsRemove
    | ApprovalsRevoke

  constructor(
    value: ApprovalsInsert | ApprovalsExtend | ApprovalsRemove | ApprovalsRevoke
  ) {
    this.value = value
  }

  toJson(): object {
    return { approvals: this.value.toJson() }
  }
}
