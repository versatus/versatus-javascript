export class Address {
  private address: string

  constructor(addressInput: string) {
    this.address = addressInput
  }

  toJson(): string {
    return this.address
  }
}

export class Namespace {
  private namespace: string

  constructor(namespace: string) {
    this.namespace = namespace
  }

  toJson(): object {
    return { namespace: this.namespace }
  }
}

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
  private value: string

  constructor(value: string) {
    this.value = value
  }

  toJson(): object {
    return { credit: this.value }
  }
}

export class Debit {
  private value: string

  constructor(value: string) {
    this.value = value
  }

  toJson(): object {
    return { debit: this.value }
  }
}

export class BalanceValue {
  private value: AddressOrNamespace | string

  constructor(value: AddressOrNamespace | string) {
    this.value = value
  }

  toJson(): object {
    return { balance: this.value as string }
  }
}
